// app/api/recipes/search/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || !Array.isArray(body.ingredients)) {
      return NextResponse.json(
        { success: false, message: 'ingredients（食材配列）が必要です', recipes: [] },
        { status: 400 }
      )
    }

    // 入力された食材を整形
    const ingredients: string[] = body.ingredients
      .map((ing: unknown) => (typeof ing === 'string' ? ing.trim() : ''))
      .filter((ing: string) => ing.length > 0)

    if (ingredients.length === 0) {
      return NextResponse.json(
        { success: false, message: '食材を1つ以上入力してください', recipes: [] },
        { status: 400 }
      )
    }

    // --- Prisma でレシピ検索 ---
    // 材料名 or タイトルに、どれか1つでも食材が含まれているレシピを拾う
    const where = {
      OR: [
        // 材料名から検索
        ...ingredients.map((ing) => ({
          ingredients: {
            some: {
              name: {
                contains: ing,
                mode: 'insensitive' as const,
              },
            },
          },
        })),
        // タイトルから検索
        ...ingredients.map((ing) => ({
          title: {
            contains: ing,
            mode: 'insensitive' as const,
          },
        })),
      ],
    }

    const rawRecipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
      },
      take: 50, // 一旦多くても 50 件まで
    })

    if (rawRecipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: '条件に一致するレシピが見つかりませんでした',
        recipes: [],
      })
    }

    // --- マッチスコア計算 & 整形 ---

    // 検索した食材が、タイトル or 説明 or 材料名に何個含まれているか
    const calcMatchScore = (recipe: (typeof rawRecipes)[number], ingredients: string[]) => {
      const haystack =
        [
          recipe.title,
          recipe.description ?? '',
          recipe.instructions ?? '',
          ...recipe.ingredients.map((ing) => ing.name ?? ''),
        ].join(' ') || ''

      let count = 0
      for (const ing of ingredients) {
        if (haystack.includes(ing)) {
          count++
        }
      }
      return count
    }

    const mapped = rawRecipes
      .map((recipe) => {
        const matchScore = calcMatchScore(recipe, ingredients)

        return {
          recipeId: String(recipe.id),
          recipeTitle: recipe.title,
          recipeUrl: recipe.externalUrl ?? '#',
          foodImageUrl: recipe.imageUrl || '/no-image.png', // 画像がない場合のフォールバック（必要に応じて変更）
          recipeMaterial:
            recipe.ingredients.length > 0
              ? recipe.ingredients.map((ing) =>
                  ing.quantity ? `${ing.name}（${ing.quantity}）` : ing.name
                )
              : [],
          recipeDescription: recipe.description ?? '',
          matchScore,
        }
      })
      // マッチ数が多い順にソート
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

    const hitCount = mapped.length

    return NextResponse.json({
      success: true,
      message: `${hitCount}件のレシピが見つかりました`,
      recipes: mapped,
    })
  } catch (error) {
    console.error('❌ /api/recipes/search error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'サーバー側でエラーが発生しました',
        recipes: [],
      },
      { status: 500 }
    )
  }
}
