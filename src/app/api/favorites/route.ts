import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// お気に入り一覧取得
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.favoriteRecipe.findMany({
      where: { userId: user.id },
      include: { recipe: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites.map(f => f.recipe))
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// お気に入り追加
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rakutenRecipeId, title, imageUrl, cookingTime, recipeUrl } = await request.json()

    // レシピを探す、なければ作成
    let recipe = await prisma.recipe.findUnique({
      where: { rakutenRecipeId },
    })

    if (!recipe) {
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

    // 既にお気に入りか確認
    const existing = await prisma.favoriteRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId: recipe.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ message: 'Already in favorites', recipe })
    }

    // お気に入り追加
    await prisma.favoriteRecipe.create({
      data: {
        userId: user.id,
        recipeId: recipe.id,
      },
    })

    return NextResponse.json({ success: true, recipe })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}