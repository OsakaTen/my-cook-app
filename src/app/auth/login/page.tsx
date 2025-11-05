// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [message, setMessage] = useState<string | null>(null)
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const supabase = createClient()


//   // useEffect(() => {
//   //   const msg = searchParams.get('message')
//   //   if (msg) {
//   //     setMessage(msg)
//   //   }
//   // }, [searchParams])

//   // const handleLogin = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setLoading(true)
//   //   setError(null)
//   //   setMessage(null)

//   //   try {
//   //     const response = await fetch('/api/auth/login', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ email, password }),
//   //     })

//   //     const data = await response.json()

//   //     if (!response.ok) {
//   //       throw new Error(data.error)
//   //     }

//   //     router.push('/')
//   //     router.refresh()
//   //   } catch (err: unknown) {
//   //     if (err instanceof Error) {
//   //       setError(err.message)
//   //     } else {
//   //       setError('予期せぬエラーが発生しました。')
//   //     }
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }


//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) {
//       setError(error.message)
//       setLoading(false)
//     } else {
//       const redirectTo = searchParams.get('redirectedFrom') || '/'
//       router.push(redirectTo)
//       router.refresh()
//     }
//   }

//   return (
//     <div className="flex justify-center items-center mt-20">
//       <div className="w-full max-w-sm bg-white p-8 rounded-md border shadow">
//         <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>

//         {message && (
//           <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm mb-4">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="flex flex-col space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               メールアドレス
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="example@email.com"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               パスワード
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="パスワードを入力"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'ログイン中...' : 'ログイン'}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           アカウントをお持ちでないですか？{' '}
//           <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
//             新規登録
//           </Link>

//         </p>
//       </div>
//     </div>
//   )
// }

// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // デバッグ: Supabase接続確認
  const checkConnection = async () => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase.auth.getSession()
    console.log('Session check:', { data, error })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('Attempting login with:', { email })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error })

      if (error) {
        setError(`${error.message} (${error.status})`)
        console.error('Login error details:', error)
        setLoading(false)
      } else {
        console.log('Login successful!')
        const redirectTo = searchParams.get('redirectedFrom') || '/'
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('予期しないエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold">ログイン</h2>
          <button 
            onClick={checkConnection}
            className="mt-2 text-sm text-blue-600 underline"
          >
            接続テスト（コンソールを確認）
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          <div className="text-center text-sm">
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
              アカウントをお持ちでない方はこちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}