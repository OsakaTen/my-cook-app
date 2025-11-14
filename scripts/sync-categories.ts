// scripts/sync-categories.ts
import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'

const prisma = new PrismaClient()
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!

// --- 楽天APIレスポンス型定義 ---

type RakutenCategoryBase = {
  categoryId: number
  categoryName: string
  categoryUrl: string
}

type LargeCategory = RakutenCategoryBase & {
  // large には parentCategoryId は基本的に存在しない
}

type MediumCategory = RakutenCategoryBase & {
  parentCategoryId: number // 親 large の categoryId
}

type SmallCategory = RakutenCategoryBase & {
  parentCategoryId: number // 親 medium の categoryId
}

type CategoryListResponse = {
  result?: {
    large?: LargeCategory[]
    medium?: MediumCategory[]
    small?: SmallCategory[]
  }
}

// 楽天レシピAPIからカテゴリを取得
async function fetchCategories() {
  console.log('📡 楽天レシピ CategoryList API にアクセス中...')

  const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${RAKUTEN_APP_ID}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`楽天APIリクエストに失敗しました: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as CategoryListResponse

  if (!data.result) {
    throw new Error('APIレスポンスに result が存在しません')
  }

  const large = data.result.large ?? []
  const medium = data.result.medium ?? []
  const small = data.result.small ?? []

  console.log(
    `✅ 取得完了: large=${large.length}, medium=${medium.length}, small=${small.length}, total=${
      large.length + medium.length + small.length
    }`
  )

  return { large, medium, small }
}

async function main() {
  console.log('📥 楽天APIからカテゴリ取得中...')
  const { large, medium, small } = await fetchCategories()

  console.log('💾 Supabase(PostgreSQL) にカテゴリを保存します...')

  // 1️⃣ large（大カテゴリ）を先に保存（親なし）
  console.log('➡️ large カテゴリを保存中...')
  for (const c of large) {
    const categoryId = String(c.categoryId)

    await prisma.recipeCategory.upsert({
      where: { categoryId },
      update: {
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        // large は親を持たない
        parentCategoryId: null,
      },
      create: {
        categoryId,
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        parentCategoryId: null,
      },
    })
  }
  console.log('✅ large カテゴリ保存完了')

  // 2️⃣ medium（中カテゴリ）を保存（親 = large.categoryId）
  console.log('➡️ medium カテゴリを保存中...')
  for (const c of medium) {
    const categoryId = String(c.categoryId)
    const parentCategoryId = String(c.parentCategoryId)

    await prisma.recipeCategory.upsert({
      where: { categoryId },
      update: {
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        parentCategoryId, // 親の categoryId
      },
      create: {
        categoryId,
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        parentCategoryId,
      },
    })
  }
  console.log('✅ medium カテゴリ保存完了')

  // 3️⃣ small（小カテゴリ）を保存（親 = medium.categoryId）
  console.log('➡️ small カテゴリを保存中...')
  for (const c of small) {
    const categoryId = String(c.categoryId)
    const parentCategoryId = String(c.parentCategoryId)

    await prisma.recipeCategory.upsert({
      where: { categoryId },
      update: {
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        parentCategoryId,
      },
      create: {
        categoryId,
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? null,
        parentCategoryId,
      },
    })
  }
  console.log('✅ small カテゴリ保存完了')

  console.log('🎉 すべてのカテゴリ同期が完了しました！')
}

// 実行
main()
  .catch((err) => {
    console.error('❌ 全体エラーが発生しました:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
