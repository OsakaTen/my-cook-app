import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const foodItems= await prisma.foodItem.findMany({
      where: { userId: Number(params.userId) }, // 個人の冷蔵庫だけ
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("GET /foodItem error:", error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
  ) {
  try {
    const body = await request.json()

    const foodItem = await prisma.foodItem.create({
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category,
        status: body.status,
        userId: Number(params.userId), 
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error("POST /foodItem error:", error);
    return NextResponse.json(
      { error: "食材の作成に失敗しました" },
      { status: 500 }
    );
  }
}


