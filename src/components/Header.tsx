"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Leaf } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
interface NavItem {
  title: string;
  href: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の確認
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navItems: NavItem[] = [
    { title: 'ホーム', href: '/' },
    { title: '食材管理', href: '/inventory' },
    { title: 'レシピ', href: '/recipes' },
    { title: 'グループ共有', href: '/groups' },
    { title: 'レシピ投稿', href: '/favorites' },
    { title: '設定', href: '/settings' },
  ];

  // ✅ ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d1e6d9] bg-white/80 backdrop-blur-sm px-6 md:px-10 py-3">
      <div className="flex items-center gap-4">
        <Leaf className="text-[#4CAF50] w-8 h-8" />
        <h2 className="text-lg font-bold">i-Stock</h2>
      </div>
      <div className="hidden md:flex items-center gap-9">
        <ul className="flex list-none gap-9">
          {user ? (
            <>
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-md font-medium hover:text-[#4CAF50] transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/auth/signup"
                  className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                >
                  新規登録
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                >
                  ログイン
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="relative flex items-center gap-4">
        {/* プロフィールアイコン（クリックでメニュー表示） */}
        <div className="relative">
          <button 
            className="w-10 h-10"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* ↓ ドロップダウンメニュー部分 */}
          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md">
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    編集
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100">
                    ログアウト
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header >
  );
}

export default Header;

