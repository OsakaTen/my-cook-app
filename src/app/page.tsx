/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useState, useEffect } from "react";
import SearchBar from '../components/SearchBar';
import Header from "@/components/Header";
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


  interface StepCardProps {
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    href: string;
  }

  const StepCard: React.FC<StepCardProps> = ({ icon, title, description, buttonText, href }) => {
    return (
      <div className="step-card">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <span className=" text-red-400">{icon}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description} </p>
        <Link
          href={href}
          className="bg-red-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-500 transition-colors text-lg"
        >
          {buttonText}
        </Link>
      </div>
    );
  };

  return (
    <div className="app">
      <Header />
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
        <div className="absolute top-[18.75rem] left-[9.375rem] text-amber-50 z-10 ">
          <h1 className="text-3xl">余り物が、アイデアに変わる</h1>
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
      <main className=" mx-auto p-8 py-16">
        <SearchBar />
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">まずは3ステップで始めよう</h2>
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <StepCard
              icon="#"
              title="1. 食材管理"
              description="手動入力で在庫を簡単登録。食材の賞味期限も管理できます。"
              buttonText="在庫を追加"
              href="/inventory"
            />
            <StepCard
              icon="#"
              title="2. レシピを提案"
              description="冷蔵庫の中にある食材や、気分で作れるレシピを提案します。"
              buttonText="レシピを探す"
              href="/recipes"
            />
            <StepCard
              icon="#"
              title="3. お気に入りに追加"
              description="よく作るレシピはすぐ見れるようにコレクションに登録。"
              buttonText="お気に入りを見る"
              href="/favorites"
            />
          </div>
        </section>
        <section className="bg-gray-50 py-16 px-4 rounded-lg my-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">みんなでごはんを決めよう</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              新しいグループ機能で、家族や友人、パートナーと今日の晩ごはんを簡単に決められます。グループで足りない食材を共有し、買い物リストを作成して、毎日の料理をもっと楽しく、もっと便利に。
            </p>
            <div className="flex justify-center items-center space-x-8 mb-10">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="material-icons text-red-400 text-4xl">groups</span>
                </div>
                <span className="font-semibold text-gray-700">グループ作成</span>
              </div>
              <div className="text-gray-300 text-4xl">→</div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="material-icons text-red-400 text-4xl">restaurant_menu</span>
                </div>
                <span className="font-semibold text-gray-700">晩ごはんの決定</span>
              </div>
              <div className="text-gray-300 text-4xl">→</div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="material-icons text-red-400 text-4xl">checklist</span>
                </div>
                <span className="font-semibold text-gray-700">買い物リスト</span>
              </div>
            </div>
            <a className="bg-red-400 text-white px-8 py-3 rounded-full font-bold hover:bg-red-500 transition-colors text-lg"
              href="#">グループ機能を試す</a>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">今日のピックアップレシピ</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img alt="彩り野菜のラタトゥイユ" className="w-full h-40 object-cover bg-yellow-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0blcGcygs7cfDXAYMIeYC-1qYReRF1enP03_BIltQ9KDLjNsK8EWTwP-2qztwRf5jUfHbxpsSJO0O6FgZjFuPhi69e_YpWwhBLr_STSIMIj7TYxwFZwPQZ24by_-keb66naTXfFJ6-x-HV4tjiIE9tlHGY0qK04cfWwbx7ifXYDqgMAhCM7wbm_OksyZjDEsaxO3QTEb3pmPq3tYRyVwMDDPS6pv7p-T1-ODw7vLYJchrnT7YMfn_ikkV9EfpPn21kM4Yv1SXMf4" />
              <div className="p-4">
                <h3 className="font-bold">彩り野菜のラタトゥイユ</h3>
                <p className="text-sm text-gray-600 mt-1">夏野菜をたっぷり使った、栄養満点の一品。</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img alt="鶏肉のハーブグリル" className="w-full h-40 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuI6GbQ0IldU2OTQo-9Rmi7WHM2eI3z6Ofvlc4b_bJJTBOdzNlIY2oQsqBbXqgxkkGQHqNzztBdcoJOLXle5NDDgLdxdBR4bSpK7Mtvsl9s_yaVPta72VmQrfCzUtVLwrFPkotDnVYDtLCy0MVsJIElWmducDGRYmx0fiAwj-hKSvI4PlWq1BWu3IKJFVPDEr84zSpGazYZH1jW1vqYGQsOW3fJUiiTptr4x5d6VwUL235zSsYWEiRbesg5kuxq1QiS60NtwvdxDs" />
              <div className="p-4">
                <h3 className="font-bold">鶏肉のハーブグリル</h3>
                <p className="text-sm text-gray-600 mt-1">シンプルながら風味豊かな、ジューシーなグリルチキン。</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img alt="シーフードパエリア" className="w-full h-40 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtuWMw75suYqfFceSRSRjSpJW09SjDLDjbLAXBz8bb7GkD4uDblUZx7jhVB5gPKgp3v3EbQgA82MsRRPauGo7yJNmB0ULSdIKMeWIsPVceR2x7Z6gy8UdfOIkf_MuB-cpMtrzZknwkq3PuS_UiTqCYpWV7iFA-khD_xCnChX26z0uSMiAj4Xj3hu1JT8MQJ1nhmBG9yHlNHTa_qKRM5Hdijzl5QKO_QaiUxSzjPKHoT9HAr7O4zhUYwhBcQeyctolePQCAJptoHbc" />
              <div className="p-4">
                <h3 className="font-bold">シーフードパエリア</h3>
                <p className="text-sm text-gray-600 mt-1">魚介の旨味が凝縮された、華やかな一皿。</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img alt="濃厚カルボナーラ" className="w-full h-40 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDXIFTmZcFy9Q8tdrUHuQoKN023GbHJuc_FzSxgaesVfvt87f6xBMu0nw4niMZioLuAin1KtqBlcFlPanNBAjVMSGitBxTYA2JVIw_Wp7zCObCVPq1uzJwxOlbfgMdxRnh-wg70rKJilEuL5sWMmUVaIE5CdRwJU95Rf7Tbu-KAOXfERGiQYvYciTdEH_v1ORIFXLCRU9XN-2IhGm_e0W99935w0OGuzX8QdmnX8qoGBUX_eNsM6bl8hrdynzG4XttiGGwLot67pw" />
              <div className="p-4">
                <h3 className="font-bold">濃厚カルボナーラ</h3>
                <p className="text-sm text-gray-600 mt-1">卵とチーズだけで作る、本格的な味わい。</p>
              </div>
            </div>
          </div>
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