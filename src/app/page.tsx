'use client';
import React, { useState, useEffect } from "react";
import AddItemForm from './components/AddItemForm';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import './globals.css'
import Image from 'next/image'

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

  return (
    <div className="app">
      <header className="flex justify-around  py-6 px-8  fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <h1 className="font-bold text-gray-800 text-3xl">My Fridge</h1>
        <ul className="flex flex-row gap-8 text-xl">
          <li><a href="#" className="inline-block text-gray-700 hover:text-blue-500 transition">プロフィール</a></li>
          <li><a href="#" className="inline-block text-gray-700 hover:text-blue-500 transition">在庫リスト</a></li>
          <li><a href="#" className="inline-block text-gray-700 hover:text-blue-500 transition">グループ</a></li>
          <li><a href="#" className="inline-block text-gray-700 hover:text-blue-500 transition">履歴</a></li>
          <li><a href="#" className="inline-block text-gray-700 hover:text-blue-500 transition">設定</a></li>
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
          <h2>まずは在庫リストに食材を入れてみよう</h2>
          <button className="mt-5 ml-45">在庫リスト</button>
        </div>
      </div>
    </section>
      <main >
        <div className="flex items-center flex-col">
          <h2>まずは何かを入れてみよう</h2>
          <input type="text" className="mt-5" placeholder="食材を入れてみよう"></input>
        </div>
        <div>
          <h3>人気</h3>
          <SearchBar />
        </div>

      </main>
       {/* <main>
        <h2 className="text-center">まずは食材をいれてみよう</h2>
        <AddItemForm onAdd={addItem} />
        <ItemList items={items} onDelete={deleteItem} />
      </main>  */}
    </div>
  );
}

export default App;