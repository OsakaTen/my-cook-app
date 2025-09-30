import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT (
  request: Request,
  { params }: { params: { userId: string; id: string } }
){
  try{
    const body = await request.json();

    const updated = await prisma.foodItem.updateMany({
      where: { id: Number(params.id), userId: Number(params.userId) },
      data: {
        name: body.name,
        quantity: body.quantity,
        expiryDate: new Date(body.expiryDate),
        category: body.category,
        status: body.status,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "更新対象がありません" }, { status: 404 });
    }

    return NextResponse.json({ message: "更新しました" });
  } catch (error) {
    console.error("PUT /foodItem error:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE (
  request: Request,
  { params }: { params: { userId: string; id: string } }
){
  try{
    const deleted = await prisma.foodItem.deleteMany({
      where: { id: Number(params.id), userId: Number(params.userId) },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "削除対象がありません" }, { status: 404 });
    }

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error("DELETE /foodItem error:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}