import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, RecipeSource } from '@prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!;

function parseCookingTime(indication: string): number | null {
  const match = indication.match(/(\d+)分/);
  return match ? parseInt(match[1]) : null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
  }
}