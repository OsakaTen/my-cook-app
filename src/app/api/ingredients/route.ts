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

function calcFoodStatus(expiryDate: string | Date): FoodStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry =
    typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "期限切れ";
  if (diffDays <= 3) return "まもなく期限切れ";
  return "新鮮";
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  Prisma 側 User を必ず保証
    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, // すでにあれば何もしない
      create: {
        id: user.id,
        email: user.email ?? "",
      },
    });

    const body = await request.json();
    console.log("受信データ:", body);

    const { name, quantity, expiryDate, category } = body;

    // 簡単なサーバー側バリデーション（あった方が安全）
    if (!name?.trim()) {
      return NextResponse.json(
        { message: "食材名は必須です" },
        { status: 400 }
      );
    }
    if (!quantity) {
      return NextResponse.json(
        { message: "数量は必須です" },
        { status: 400 }
      );
    }
    if (!expiryDate) {
      return NextResponse.json(
        { message: "賞味期限は必須です" },
        { status: 400 }
      );
    }

    const status = calcFoodStatus(expiryDate);

    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        quantity,                     // Int 型なら Number(quantity)
        expiryDate: new Date(expiryDate),
        category: category as FoodCategory,
        status,                       // ← body.status ではなくサーバーで決めた値
        userId: user.id,
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error("POST /api/food-items error:", error);
    return NextResponse.json(
      {
        error: "食材の作成に失敗しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

