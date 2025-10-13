import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabase = await createClient()

    // Supabaseでユーザー登録
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      // Prismaにもユーザー登録
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: '登録が完了しました'
    })
  } catch (error: unknown) {
    console.error('Signup error:', error)
    // return NextResponse.json(
    //   { error: error.message || 'サインアップに失敗しました' },
    //   { status: 500 }
    // )
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'サインアップに失敗しました' },
      { status: 500 }
    )
  }
}