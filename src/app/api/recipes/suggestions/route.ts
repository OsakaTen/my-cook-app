import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { searchRecipesByIngredients } from '@/lib/rakuten-recipe'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザーの冷蔵庫の食材を取得
    const foodItems = await prisma.foodItem.findMany({
      where: { 
        userId: user.id,
        status: { not: '期限切れ' }, // 期限切れ以外
      },
      orderBy: { expiryDate: 'asc' },
      take: 10, // 最大10個の食材
    })

    if (foodItems.length === 0) {
      return NextResponse.json({ 
        recipes: [],
        message: '冷蔵庫に食材がありません' 
      })
    }

    // 食材名のリストを作成
    const ingredientNames = foodItems.map(item => item.name)

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

      // マッチ率を計算（0-100%）
      const matchRate = recipeMaterials.length > 0
        ? Math.round((matchedIngredients.length / recipeMaterials.length) * 100)
        : 0

      return {
        ...recipe,
        matchedIngredients: matchedIngredients.map(i => i.name),
        matchRate,
        missingIngredientsCount: recipeMaterials.length - matchedIngredients.length,
      }
    })

    // マッチ率でソート
    const sortedRecipes = recipesWithMatch.sort((a, b) => b.matchRate - a.matchRate)

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