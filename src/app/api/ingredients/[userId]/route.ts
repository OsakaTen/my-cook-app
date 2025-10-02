import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FoodCategory, FoodStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const foodItems = await prisma.foodItem.findMany({
      where: { userId: Number(params.userId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(foodItems);
  } catch (error) {
    console.error("GET /foodItem error:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();

    console.log("受信データ:", body); // デバッグ

    const foodItem = await prisma.foodItem.create({
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category as FoodCategory,
        status: body.status as FoodStatus,
        userId: Number(params.userId),
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error("POST /foodItem error:", error);
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
