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
  // const checkConnection = async () => {
  //   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  //   console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  //   const { data, error } = await supabase.auth.getSession()
  //   console.log('Session check:', { data, error })
  // }

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
    <div className="flex justify-center items-center mt-20">
      <div className="w-full max-w-sm bg-white p-8 rounded-md border shadow">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm mb-4">
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
              required
              placeholder="example@email.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              placeholder="パスワードを入力"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            アカウントをお持ちでないですか？{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}