// app/api/dev/sync-rakuten-all/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RecipeSource } from '@prisma/client'

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!

// --- 楽天APIレスポンス型 ---
type RakutenRecipe = {
  recipeId: number
  recipeTitle: string
  recipeUrl: string
  foodImageUrl: string
  recipeDescription: string
  recipeIndication: string // 例: "約30分"
  recipeCost: string
  recipeMaterial: string[]
}

type RakutenRankingResponse = {
  result?: RakutenRecipe[]
}

// 「約30分」みたいな文字列から数字だけ取り出す
function parseCookingTime(indication: string): number | null {
  const match = indication.match(/(\d+)\s*分/)
  return match ? Number(match[1]) : null
}

// --- 楽天API 1カテゴリ分取得 ---
async function fetchRanking(categoryId: string): Promise<RakutenRecipe[]> {
  const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${RAKUTEN_APP_ID}&categoryId=${categoryId}&format=json`

  const res = await fetch(url)

  // 無効カテゴリは 400 → スキップ
  if (res.status === 400) {
    console.warn(`⚠ 無効カテゴリ: ${categoryId}`)
    return []
  }

  // レート制限は 429 → 特別扱い
  if (res.status === 429) {
    throw new Error('RATE_LIMIT_429')
  }

  if (!res.ok) {
    throw new Error(`楽天APIエラー: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as RakutenRankingResponse
  return data.result ?? []
}

// --- DB: RecipeCategory を基に「楽天カテゴリパス」を全部作る ---
async function getAllCategoryPaths(): Promise<string[]> {
  const categories = await prisma.recipeCategory.findMany({
    include: {
      children: true,
      parent: {
        include: { parent: true },
      },
    },
  })

  const paths = new Set<string>()

  for (const cat of categories) {
    // 大カテゴリ
    if (!cat.parentCategoryId) {
      if (cat.children.length === 0) {
        paths.add(cat.categoryId)
      }
      continue
    }

    const parent = cat.parent
    const grandParent = parent?.parent

    // 中カテゴリ
    if (parent && !parent.parentCategoryId) {
      if (cat.children.length === 0) {
        paths.add(`${parent.categoryId}-${cat.categoryId}`)
      }
      continue
    }

    // 小カテゴリ
    if (parent && grandParent) {
      paths.add(
        `${grandParent.categoryId}-${parent.categoryId}-${cat.categoryId}`
      )
    }
  }

  return Array.from(paths)
}

// ================================
// メインAPI
// ================================
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const maxParam = url.searchParams.get('max')
    const max = maxParam ? Number(maxParam) : 0

    const allPaths = await getAllCategoryPaths()
    const targetPaths = max > 0 ? allPaths.slice(0, max) : allPaths

    console.log(
      `📂 同期対象カテゴリ数: ${targetPaths.length} / 全体: ${allPaths.length}`
    )

    let totalApiRecipes = 0
    let created = 0
    let updated = 0
    const errors: { categoryId: string; message: string }[] = []

    // ---- カテゴリごとに同期 ----
    for (const categoryId of targetPaths) {
      console.log(`📡 楽天レシピ同期中: categoryId=${categoryId}`)

      try {
        const recipes = await fetchRanking(categoryId)
        totalApiRecipes += recipes.length

        for (const r of recipes) {
          const externalId = String(r.recipeId)
          const cookingTime = parseCookingTime(r.recipeIndication)

          const existing = await prisma.recipe.findUnique({
            where: { externalId },
            include: { ingredients: true },
          })

          if (!existing) {
            // 新規登録
            await prisma.recipe.create({
              data: {
                title: r.recipeTitle,
                description: r.recipeDescription,
                imageUrl: r.foodImageUrl,
                cookingTime,
                difficulty: null,
                servings: null,
                instructions: null,
                source: RecipeSource.RAKUTEN,
                externalId,
                externalUrl: r.recipeUrl,
                cost: r.recipeCost,
                categoryId,
                categoryName: '',

                ingredients: {
                  create: r.recipeMaterial.map((name) => ({
                    name,
                    quantity: '',
                    isOptional: false,
                  })),
                },
              },
            })
            created++
          } else {
            // 更新
            await prisma.recipe.update({
              where: { id: existing.id },
              data: {
                title: r.recipeTitle,
                description: r.recipeDescription,
                imageUrl: r.foodImageUrl,
                cookingTime,
                externalUrl: r.recipeUrl,
                cost: r.recipeCost,
                categoryId,
                source: RecipeSource.RAKUTEN,
              },
            })
            updated++
          }
        }

        // ---- レート制限対策 ----
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)

        // 429 なら即中断
        if (message === 'RATE_LIMIT_429') {
          console.error('❌ レート制限に達したため処理を停止')
          errors.push({ categoryId, message })
          break
        }

        console.error(`❌ categoryId=${categoryId} でエラー:`, err)
        errors.push({ categoryId, message })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      totalCategoryPaths: allPaths.length,
      processedCategoryPaths: targetPaths.length,
      totalApiRecipes,
      created,
      updated,
      errorCount: errors.length,
      errors,
    })
  } catch (error) {
    console.error('❌ /api/dev/sync-rakuten-all error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '全カテゴリ同期中にサーバーエラーが発生しました',
      },
      { status: 500 },
    )
  }


}



