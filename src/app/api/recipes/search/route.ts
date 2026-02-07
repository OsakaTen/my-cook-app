import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from "@prisma/client";

// 時間ラベルを Prisma 用のフィルタに変換
function getCookingTimeRange(label?: string): Prisma.IntFilter | null {
  switch (label) {
    case "～5分": return { lte: 5 };
    case "5分～15分": return { gte: 5, lte: 15 };
    case "15分～30分": return { gte: 15, lte: 30 };
    case "30分～45分": return { gte: 30, lte: 45 };
    case "45分～60分": return { gte: 45, lte: 60 };
    case "それ以上": return { gte: 60 };
    default: return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    // バリデーション
    if (!body || !Array.isArray(body.ingredients)) {
      return NextResponse.json({ success: false, message: 'ingredientsが必要です', recipes: [] }, { status: 400 })
    }

    const ingredients: string[] = body.ingredients
      .map((ing: unknown) => (typeof ing === 'string' ? ing.trim() : ''))
      .filter((ing: string) => ing.length > 0)

    if (ingredients.length === 0) {
      return NextResponse.json({ success: false, message: '食材を1つ以上選択してください', recipes: [] }, { status: 400 })
    }

    // ▼▼▼ 修正1：調理時間フィルタの適用準備 ▼▼▼
    const cookingTimeLabel = typeof body.cookingTime === "string" ? body.cookingTime : undefined;
    const cookingTimeFilter = getCookingTimeRange(cookingTimeLabel);

    // --- Prisma 検索条件の構築 ---
    const where: Prisma.RecipeWhereInput = {
      // ▼▼▼ 修正1：ここに調理時間フィルタを追加 ▼▼▼
      // もしフィルタがあれば AND 条件として追加されます
      ...(cookingTimeFilter ? { cookingTime: cookingTimeFilter } : {}),

      // OR検索：どれか1つの食材が含まれていればヒット候補にする
      OR: [
        ...ingredients.map((ing) => ({
          ingredients: {
            some: {
              name: { contains: ing, mode: 'insensitive' as const },
            },
          },
        })),
        ...ingredients.map((ing) => ({
          title: { contains: ing, mode: 'insensitive' as const },
        })),
      ],
    };

    // --- Prisma クエリ実行 ---
    const rawRecipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
      },
      // ▼▼▼ 修正2：検索母数を増やす ▼▼▼
      // OR検索でノイズも多く含まれるため、広めに取ってからJS側でスコアリングして絞り込むのが定石です。
      take: 200, 
    })

    if (rawRecipes.length === 0) {
      return NextResponse.json({ success: true, message: '条件に合うレシピが見つかりませんでした', recipes: [] })
    }

    // --- マッチスコア計算（ロジックはそのまま） ---
    const calcMatchScore = (recipe: (typeof rawRecipes)[number], ingredients: string[]) => {
      const haystack = [
        recipe.title,
        recipe.description ?? '',
        // recipe.instructions ?? '', // DBのカラム名要確認（instructionsがない場合もあるため）
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

    // --- 整形とソート ---
    const mapped = rawRecipes
      .map((recipe) => {
        const matchScore = calcMatchScore(recipe, ingredients)
        return {
          recipeId: String(recipe.id),
          recipeTitle: recipe.title,
          recipeUrl: recipe.externalUrl ?? '#', // 楽天のURLが入っている想定
          // ▼▼▼ 修正3：画像のフォールバック ▼▼▼
          foodImageUrl: recipe.imageUrl ? recipe.imageUrl : '/images/no-image.png', 
          recipeMaterial: recipe.ingredients.length > 0
            ? recipe.ingredients.map((ing) => ing.quantity ? `${ing.name} ${ing.quantity}` : ing.name)
            : [],
          recipeDescription: recipe.description ?? '',
          matchScore,
        }
      })
      // スコアが高い順（同じなら新しい順）
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return (b.matchScore ?? 0) - (a.matchScore ?? 0);
        }
        return Number(b.recipeId) - Number(a.recipeId);
      })
      // 最終的にユーザーに見せるのは上位50件でOK
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      message: `${mapped.length}件のレシピが見つかりました`,
      recipes: mapped,
    })

  } catch (error) {
    console.error('❌ /api/recipes/search error:', error)
    return NextResponse.json({ success: false, message: 'サーバーエラーが発生しました', recipes: [] }, { status: 500 })
  }
}