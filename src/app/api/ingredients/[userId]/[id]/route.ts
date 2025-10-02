import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FoodCategory, FoodStatus } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string; id: string }> }
) {
  try {
    const body = await request.json();
    const { userId } = await params; // ← paramsをawaitで取得

    const updated = await prisma.foodItem.updateMany({
      where: { id: Number(params.id), userId: Number(params.userId) },
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category as FoodCategory,
        status: body.status as FoodStatus,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "更新対象がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "更新しました" });
  } catch (error) {
    console.error("PUT /foodItem error:", error);
    return NextResponse.json(
      { error: "更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; id: string }> }
) {
  try {
    const { userId, id } = await params; // ← paramsをawaitで取得

    const deleted = await prisma.foodItem.deleteMany({
      where: { id: Number(id), userId: Number(userId) },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "削除対象がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error("DELETE /foodItem error:", error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}