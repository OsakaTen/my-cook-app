"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Refrigerator } from 'lucide-react';
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
    <header className="fixed w-full top-0 flex items-center justify-between bg-[#FCFCFC]/90 backdrop-blur-md z-20 transition-all duration-300 border-b border-gray-100 px-6 md:px-10 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#2D2D2D] text-white p-2 rounded-xl">
            <Refrigerator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#2D2D2D]">Pantry Note</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-9 font-serif">
          <ul className="flex list-none gap-9">
            {user ? (
              <>
                {navItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-md  hover:text-[#4A7C59] transition-colors"
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
                    className="text-md  hover:text-[#4A7C59] transition-colors"
                  >
                    新規登録
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-md  hover:text-[#4A7C59] transition-colors"
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
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg">
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
      </header>
  );
}

export default Header;

