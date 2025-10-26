import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

//閲覧履歴保存API
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rakutenRecipeId, title, imageUrl, cookingTime, recipeUrl } = await request.json()

    // 楽天レシピIDからRecipeを探す、なければ作成
    let recipe = await prisma.recipe.findUnique({
      where: { rakutenRecipeId },
    })

    if (!recipe) {
      // レシピが存在しない場合、新規作成
      recipe = await prisma.recipe.create({
        data: {
          rakutenRecipeId,
          title,
          description: title,
          imageUrl,
          rakutenRecipeUrl: recipeUrl,
          cookingTime: parseInt(cookingTime) || 30,
          difficulty: '普通',
          servings: 2,
          instructions: '',
        },
      })
    }

    // 閲覧履歴を追加（同じレシピを複数回見た場合も記録）
    await prisma.recipeView.create({
      data: {
        userId: user.id,
        recipeId: recipe.id,
      },
    })

    return NextResponse.json({ success: true, recipe })
  } catch (error) {
    console.error('Error adding view history:', error)
    return NextResponse.json(
      { error: 'Failed to add view history' },
      { status: 500 }
    )
  }
}