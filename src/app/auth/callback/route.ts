// import { type EmailOtpType } from '@supabase/supabase-js'
// import { type NextRequest } from 'next/server'
// import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation'

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const token_hash = searchParams.get('token_hash')
//   const type = searchParams.get('type') as EmailOtpType | null
//   const next = searchParams.get('next') ?? '/'

//   if (token_hash && type) {
//     const supabase = await createClient()
//     const { error } = await supabase.auth.verifyOtp({ token_hash, type })
//     if (!error) return redirect(next)
//   }

//   // エラー時はリダイレクト
//   redirect('/auth/error')
// }

// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  // ログイン後はホームページへ
  return NextResponse.redirect(new URL('/', request.url))
}