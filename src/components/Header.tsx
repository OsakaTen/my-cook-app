"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
interface NavItem {
  title: string;
  href: string;
}

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    { title: '食材管理', href: '/inventory' },
    { title: 'レシピ提案', href: '/recipes' },
    { title: 'グループ共有', href: '/groups' },
    { title: 'お気に入り', href: '/favorites' },
    { title: '設定', href: '/settings' },
  ];

  // ✅ ログアウト処理
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    window.location.href = "/"; // ホームページにリダイレクト
  };

  return (
    <header className="flex justify-around  py-6 px-8  mb-30 fixed top-0 left-0 w-full z-50 bg-[#FAFAFA] shadow-md font-sans">
      <Link href="/" className="font-bold text-gray-800 text-3xl">
        My Fridge
      </Link>

      <ul className="flex flex-row gap-8 text-xl">
        {isLoggedIn ? (
          <>
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="inline-block text-gray-700 hover:text-red-500 hover:underline transition-colors"
              >
                ログアウト
              </button>
            </li>
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
    </header>
  );
}

export default Header;

