import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

 //閲覧履歴取得API
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 最近見たレシピを取得（重複を除く）
    const recentViews = await prisma.recipeView.findMany({
      where: { userId: user.id },
      include: {
        recipe: true,
      },
      orderBy: { viewedAt: 'desc' },
      take: 20,
    })

    // 重複を除去（最新のもののみ残す）
    const uniqueRecipes = Array.from(
      new Map(
        recentViews.map(view => [view.recipe.id, view.recipe])
      ).values()
    ).slice(0, 10)

    return NextResponse.json(uniqueRecipes)
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}