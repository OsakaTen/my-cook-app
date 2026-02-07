import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FoodCategory, FoodStatus } from "@prisma/client";

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

// 食材更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { name, quantity, expiryDate, category } = body;

    // サーバー側バリデーション（任意だけどやっておくと安全）
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

    // 自分の食材かチェック
    const existing = await prisma.foodItem.findFirst({
      where: {
        id: parseInt(id, 10),
        userId: user.id
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const status = calcFoodStatus(expiryDate);

    const foodItem = await prisma.foodItem.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        quantity,
        expiryDate: new Date(expiryDate),
        category: category as FoodCategory,
        status, // ← サーバー計算した値
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error("PUT /api/food-items error:", error);
    return NextResponse.json(
      { error: "更新に失敗しました" },
      { status: 500 }
    );
  }
}

// 食材削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ← paramsをawaitで取得

    // 自分の食材かチェック
    const existing = await prisma.foodItem.findFirst({
      where: {
        id: parseInt(id),
        userId: user.id
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.foodItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/food-items error:", error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}