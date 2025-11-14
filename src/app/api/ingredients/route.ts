import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FoodCategory, FoodStatus } from "@prisma/client";

export async function getUserFoodItems(userId: string) {
  return await prisma.foodItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}


// 食材一覧取得（ログインユーザーのみ）
export async function GET() {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const foodItems = await getUserFoodItems(user.id);

    return NextResponse.json(foodItems);
  } catch (error) {
    console.error("GET /api/foodItems error:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 食材追加
export async function POST(request: Request) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("受信データ:", body); // デバッグ

    const foodItem = await prisma.foodItem.create({
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category as FoodCategory,
        status: body.status as FoodStatus,
        userId: user.id,
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error("POST /api/food-items error:", error);
    console.error("エラー詳細:", error);
    return NextResponse.json(
      {
        error: "食材の作成に失敗しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
