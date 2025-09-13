'use client';
import React, { useState, useEffect } from "react";
import SearchBar from '../components/SearchBar';
import './globals.css'
import Image from 'next/image'
import Link from "next/link";


export interface Item {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  // 起動時に localStorage から復元
  useEffect((): void => {
    const saved = localStorage.getItem("items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // items が変わるたびに保存
  useEffect((): void => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = (name: string): void => {
    setItems([...items, { id: Date.now(), name }]);
  };

  const deleteItem = (id: number): void => {
    setItems(items.filter((item) => item.id !== id));
  };

  type StepCardProps = {
    title: string;
    desc: string;
    ctaText?: string;
    onClick?: () => void;
  };

  const StepCard: React.FC<StepCardProps> = ({ title, desc, ctaText, onClick }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md flex flex-col items-start gap-4">
      <div className="text-3xl"></div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-700">{desc}</p>
      {ctaText && (
        <button
          onClick={onClick}
          className="mt-2 px-4 py-2 rounded-md border hover:bg-gray-100 transition"
        >
          {ctaText}
        </button>
      )}
    </div>
  );

  return (
    <div className="app">
      <header className="flex justify-around  py-6 px-8  fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <h1 className="font-bold text-gray-800 text-3xl">My Fridge</h1>
        <ul className="flex flex-row gap-8 text-xl">
          <li><Link
            href="/inventory"
            className="inline-block text-gray-700 hover:text-blue-500 transition">
            食材管理
          </Link></li>
          <li><Link
            href="/recipes"
            className="inline-block text-gray-700 hover:text-blue-500 transition">
            レシピ提案
          </Link></li>
          <li><Link
            href="/groups"
            className="inline-block text-gray-700 hover:text-blue-500 transition">
            グループ共有
          </Link></li>
          <li><Link
            href="/favorites"
            className="inline-block text-gray-700 hover:text-blue-500 transition">
            お気に入り
          </Link></li>
          <li><Link
            href="/settings"
            className="inline-block text-gray-700 hover:text-blue-500 transition">
            設定
          </Link></li>
        </ul>
      </header>
      <section className="relative w-full min-h-screen">
        <Image
          src="/brooke-lark-4J059aGa5s4-unsplash.jpg" // 
          alt="背景画像"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          quality={100}
        />

        {/* 文字部分 */}
        <div className="absolute top-[18.75rem] left-[9.375rem] text-amber-50 z-10">
          <h1>余り物が、アイデアに変わる</h1>
          <p className="pt-4 text-amber-50 text-xl">
            「今日も何を作ろう...」そんな悩みを抱えていませんか？<br />
            余り物から生まれる新しいレシピで料理の楽しさを再発見しよう
          </p>
          <div className="mt-5">
            <h2>まずは食材管理に食材を入れてみよう</h2>
            <Link href="/inventory" className="ml-45  px-4 py-2 cursor-pointer text-2xl rounded-lg bg-gradient-to-r from-[#e7a7ab] to-[#f8788b]">在庫を追加</Link>
          </div>
        </div>
      </section>
      <main className="my-12">
        <div className="flex items-center flex-col">
          <h2>どんな料理をお探しですか</h2>
          <input type="text" className="mt-5 min-w-[700px]" placeholder="食材を入れてみよう"></input>
        </div>
        <section className="step-card mt-10 bg- py-30">
          <h2 className="text-3xl font-bold mb-6">まずは3ステップで始めよう</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              title="1. 在庫を登録"
              desc="手動入力・バーコード読み取り・写真で素早く登録。冷蔵/冷凍/常温を分けて管理できます。"
              ctaText="在庫を追加"
            />
            <StepCard
              title="2. レシピを検索"
              desc="持っている食材だけで作れるレシピや、あと1つで作れるレシピを表示します。"
              ctaText="レシピを探す"
            />
            <StepCard
              title="3. お気に入りに保存"
              desc="よく作るレシピはコレクションで整理。必要材料はワンクリックで買い物リストへ移行。"
              ctaText="お気に入りを見る"
            />
          </div>
        </section>
        <section className="py-30">
          <h3>人気</h3>
          <SearchBar />
        </section>
      </main>
      <footer className="bg-gray-800 text-gray-200 py-10 mt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サービス紹介 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">My Fridge</h4>
            <p className="text-sm">
              冷蔵庫の中身をスマートに管理して、余り物から新しいアイデアを見つけよう。
            </p>
          </div>

          {/* ナビゲーション */}
          <div>
            <h4 className="text-lg font-semibold mb-4">メニュー</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">在庫リスト</a></li>
              <li><a href="#" className="hover:underline">レシピ検索</a></li>
              <li><a href="#" className="hover:underline">お気に入り</a></li>
              <li><a href="#" className="hover:underline">グループ</a></li>
            </ul>
          </div>

          {/* サポート & 法的情報 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">お問い合わせ</a></li>
              <li><a href="#" className="hover:underline">利用規約</a></li>
              <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-10 border-t border-gray-600 pt-4 text-center text-xs text-gray-400">
          © 2025 My Fridge. All rights reserved.
        </div>
      </footer>
      {/* <main>
        <h2 className="text-center">まずは食材をいれてみよう</h2>
        <AddItemForm onAdd={addItem} />
        <ItemList items={items} onDelete={deleteItem} />
      </main>  */}
    </div>
  );
}

export default App;