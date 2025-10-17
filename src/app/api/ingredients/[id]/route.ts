import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FoodCategory, FoodStatus } from "@prisma/client";

// 食材更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

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

    const foodItem  = await prisma.foodItem.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category as FoodCategory,
        status: body.status as FoodStatus,
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