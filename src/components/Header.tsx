"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Leaf } from 'lucide-react';
interface NavItem {
  title: string;
  href: string;
}

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // ✅ APIルート経由でログイン状態をチェック
    const checkSession = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

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
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    window.location.href = "/"; // ホームページにリダイレクト
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d1e6d9] bg-white/80 backdrop-blur-sm px-6 md:px-10 py-3">
      <div className="flex items-center gap-4">
        <Leaf className="text-[#4CAF50] w-8 h-8" />
        <h2 className="text-lg font-bold">RecipeApp</h2>
      </div>
      <div className="hidden md:flex items-center gap-9">
        <ul className="flex list-none gap-9">
          {isLoggedIn ? (
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
        {/* スマホメニュー用ボタン */}
        <button className="flex md:hidden items-center justify-center rounded-lg h-10 bg-[#4CAF50]/20 text-[#4CAF50] px-2.5">
          <Menu className="w-5 h-5" />
        </button>

        {/* プロフィールアイコン（クリックでメニュー表示） */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 focus:outline-none"
          />

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
                  <button className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100">
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

