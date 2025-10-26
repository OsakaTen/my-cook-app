import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1️⃣ ホーム・認証系ページは常にアクセス許可
  if (
    pathname === '/' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/')
  ) {
    // ✅ ログイン済みユーザーが /auth/login や /auth/signup に来たら /dashboard にリダイレクト
    if (
      user &&
      (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // === 2️⃣ 認証が必要なページ ===
  if (
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/groups') ||
    pathname.startsWith('/favorites') ||
    pathname.startsWith('/setting')
  ) {
    // 未ログインの場合は /auth/login にリダイレクト
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  // === 3️⃣ それ以外のページは通常通り ===
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}