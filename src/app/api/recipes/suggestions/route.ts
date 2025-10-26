import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { searchRecipesByIngredients } from '@/lib/rakuten-recipe'

// Supabase から「今ログインしてるユーザー」を確認
// Prisma で「ユーザーの冷蔵庫の食材」を取得
// 楽天レシピAPIを呼び出して関連レシピを検索
// 食材との一致率（マッチ率）を計算
// ソートして返す

export async function GET(request: Request) {
  try {
    //Supabase（認証サービス）で「今ログインしているユーザー」を取得。
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    //ユーザーがいなければ 401 Unauthorized（認証エラー）を返して処理を終了。
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'partial' // exact, partial, best-before

    // ユーザーの冷蔵庫の食材を取得
    const foodItems = await prisma.foodItem.findMany({
      where: { 
        userId: user.id,
        status: { not: '期限切れ' }, // 期限切れ以外
      },
      orderBy: { expiryDate: 'asc' },
    })

    if (foodItems.length === 0) {
      return NextResponse.json({ 
        recipes: [],
        message: '冷蔵庫に食材がありません' ,
        userIngredients: [],
      })
    }

        // モードに応じて食材を選択
    let selectedFoodItems = foodItems
    if (mode === 'best-before') {
      // 賞味期限が近い順（7日以内）
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      
      selectedFoodItems = foodItems.filter(
        item => new Date(item.expiryDate) <= sevenDaysFromNow
      ).slice(0, 10)

      if (selectedFoodItems.length === 0) {
        selectedFoodItems = foodItems.slice(0, 10)
      }
    } else {
      selectedFoodItems = foodItems.slice(0, 10)
    }


    // 食材名のリストを作成
    const ingredientNames = selectedFoodItems.map(item => item.name)

    // 楽天レシピAPIで検索
    const recipes = await searchRecipesByIngredients(ingredientNames)

    // マッチング率を計算
    const recipesWithMatch = recipes.map(recipe => {
      // レシピの材料リスト
      const recipeMaterials = recipe.recipeMaterial.map(m => 
        m.toLowerCase().trim()
      )

      // マッチする食材を見つける
      const matchedIngredients = foodItems.filter(item => {
        const itemName = item.name.toLowerCase().trim()
        return recipeMaterials.some(material => 
          material.includes(itemName) || itemName.includes(material)
        )
      })

       // 期限が近い食材を使っているか
      const usesExpiringIngredients = matchedIngredients.some(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysUntilExpiry <= 3
      })

      const matchRate = recipeMaterials.length > 0
        ? Math.round((matchedIngredients.length / recipeMaterials.length) * 100)
        : 0

      return {
        ...recipe,
        matchedIngredients: matchedIngredients.map(i => ({
          name: i.name,
          expiryDate: i.expiryDate,
          daysUntilExpiry: Math.ceil(
            (new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
        })),
        matchRate,
        missingIngredientsCount: recipeMaterials.length - matchedIngredients.length,
        usesExpiringIngredients,
        priorityScore: usesExpiringIngredients ? matchRate + 20 : matchRate,
      }
    })

    // モードに応じてフィルタリング・ソート
    let filteredRecipes = recipesWithMatch
    
    if (mode === 'exact') {
      filteredRecipes = recipesWithMatch.filter(r => r.matchRate >= 90)
    } else if (mode === 'partial') {
      filteredRecipes = recipesWithMatch.filter(r => r.matchRate >= 30)
    } else if (mode === 'best-before') {
      // 期限が近い食材を使うレシピを優先
      filteredRecipes = recipesWithMatch.sort((a, b) => b.priorityScore - a.priorityScore)
    }

    // マッチ率でソート
    const sortedRecipes = filteredRecipes.sort((a, b) => b.priorityScore - a.priorityScore)

    return NextResponse.json({
      recipes: sortedRecipes,
      userIngredients: ingredientNames,
    })
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe suggestions' },
      { status: 500 }
    )
  }
}