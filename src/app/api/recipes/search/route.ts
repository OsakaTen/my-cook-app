// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient, RecipeSource } from '@prisma/client';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { getUserFoodItems } from "@/app/api/ingredients/route";

// const prisma = new PrismaClient();
// const RAKUTEN_API_ENDPOINT = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426';
// const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!;

// function parseCookingTime(indication: string): number | null {
//   const match = indication.match(/(\d+)分/);
//   return match ? parseInt(match[1]) : null;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const supabase = createRouteHandlerClient({ cookies });
//     const { data: { session } } = await supabase.auth.getSession()

//     if (!session) {
//       return NextResponse.json(
//         { error: '認証が必要です' },
//         { status: 401 }
//       )
//     }
//   }catch{

//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Category {
  id: string; 
  createdAt: Date; 
  updatedAt: Date; 
  categoryId: string; 
  categoryName: string; 
  categoryUrl: string | null; 
  parentCategoryId: string | null; 
  category1: string | null; 
  category2: string | null; 
  category3: string | null;
}

interface RakutenRecipe {
  recipeId: string
  recipeTitle: string
  recipeUrl: string
  foodImageUrl: string
  recipeMaterial: string[]
  recipeDescription: string
  categoryId: string
  recipeCost?: string
  recipeIndication?: string
}

// カテゴリー検索（Prisma使用）
async function searchCategoriesByIngredient(ingredient: string): Promise<Category[]> {
  try {
    const categories = await prisma.recipeCategory.findMany({
      where: {
        categoryName: {
          contains: ingredient,
          mode: 'insensitive', // 大文字小文字を区別しない
        }
      },
      take: 10,
      orderBy: {
        categoryName: 'asc'
      }
    })
    
    return categories
  } catch (error) {
    console.error('Prisma category search error:', error)
    return []
  }
}

// 楽天レシピAPI呼び出し
async function fetchRecipesFromRakuten(
  categoryId: string,
  keyword?: string
): Promise<RakutenRecipe[]> {
  const appId = process.env.RAKUTEN_APP_ID
  
  if (!appId) {
    console.error('RAKUTEN_APP_ID is not configured')
    return []
  }

  const params = new URLSearchParams({
    applicationId: appId,
    categoryId: categoryId,
    hits: '4',
    format: 'json',
  })

  if (keyword) {
    params.append('keyword', keyword)
  }

  try {
    const response = await fetch(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?${params}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    if (!response.ok) {
      console.error(`Rakuten API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Rakuten API fetch error:', error)
    return []
  }
}

// POST /api/recipes/search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients } = body

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { 
          success: false, 
          message: '食材を指定してください',
          recipes: []
        },
        { status: 400 }
      )
    }

    const validIngredients = ingredients.filter((ing: string) => ing.trim() !== '')

    if (validIngredients.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: '有効な食材を入力してください',
          recipes: []
        },
        { status: 400 }
      )
    }

    console.log(`Searching for: ${validIngredients.join(', ')}`)

    // 全食材からカテゴリーを検索
    const categoryPromises = validIngredients.map((ing: string) => 
      searchCategoriesByIngredient(ing)
    )
    const categoryArrays = await Promise.all(categoryPromises)
    const allCategories = categoryArrays.flat()

    if (allCategories.length === 0) {
      return NextResponse.json({
        success: false,
        message: '該当するカテゴリーが見つかりませんでした',
        recipes: []
      })
    }

    // 重複カテゴリーを除去
    const uniqueCategories = Array.from(
      new Map(allCategories.map(cat => [cat.categoryId, cat])).values()
    )

    console.log(`Found ${uniqueCategories.length} unique categories`)

    // 各カテゴリーからレシピを取得
    const recipePromises = uniqueCategories.map(cat =>
      fetchRecipesFromRakuten(cat.categoryId, validIngredients[0])
    )

    const recipeArrays = await Promise.allSettled(recipePromises)
    
    const allRecipes = recipeArrays
      .filter((result): result is PromiseFulfilledResult<RakutenRecipe[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value)

    // 重複レシピ除去
    const uniqueRecipes = Array.from(
      new Map(allRecipes.map(recipe => [recipe.recipeId, recipe])).values()
    )

    // マッチスコア計算
    const scoredRecipes = uniqueRecipes.map(recipe => {
      const matchCount = validIngredients.filter((ing: string) =>
        recipe.recipeTitle.toLowerCase().includes(ing.toLowerCase()) ||
        recipe.recipeMaterial.some(mat => mat.toLowerCase().includes(ing.toLowerCase())) ||
        recipe.recipeDescription?.toLowerCase().includes(ing.toLowerCase())
      ).length

      return { ...recipe, matchScore: matchCount }
    })

    // スコアでソート
    scoredRecipes.sort((a, b) => b.matchScore - a.matchScore)

    console.log(`Returning ${scoredRecipes.length} recipes`)

    return NextResponse.json({
      success: true,
      message: `${scoredRecipes.length}件のレシピが見つかりました（${uniqueCategories.length}カテゴリーから検索）`,
      recipes: scoredRecipes,
      categoriesSearched: uniqueCategories.length
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
        recipes: []
      },
      { status: 500 }
    )
  }
}