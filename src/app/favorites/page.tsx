"use client";

import React, { useState } from 'react';
import Image from 'next/image'
import Header from "@/components/Header";
import { Search,  Heart, Clock, Flame, ChevronDown} from 'lucide-react';

const RecipeApp = () => {
  const [favorites, setFavorites] = useState([1, 5]);
  const [selectedIngredient, setSelectedIngredient] = useState('鶏肉');
  const [cuisineTypes, setCuisineTypes] = useState({
    japanese: false,
    western: false,
    chinese: false,
    other: false
  });
  const [difficulty, setDifficulty] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [open, setOpen] = useState(false);

  const recipes = [
    {
      id: 0,
      title: '15分で完成！鶏むね肉のさっぱりレモンソテー',
      description: 'ヘルシーで美味しい、平日夜にぴったりの簡単メインディッシュです。',
      time: '15分',
      calories: '250 kcal',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop'
    },
    {
      id: 1,
      title: '週末に作りたい！本格マルゲリータピザ',
      description: '生地から作る、もちもち食感がたまらない本格ピザ。家族みんなで楽しめます。',
      time: '60分',
      calories: '480 kcal',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: '栄養満点！アボカドとポーチドエッグのトースト',
      description: '忙しい朝でも簡単におしゃれなカフェ風朝ごはんが楽しめます。',
      time: '10分',
      calories: '350 kcal',
      image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: '濃厚トマトとバジルのパスタ',
      description: '定番の組み合わせ。新鮮なバジルの香りが食欲をそそります。',
      time: '20分',
      calories: '420 kcal',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: '旨味たっぷり！自家製チャーシュー豚骨ラーメン',
      description: 'お店の味をお家で再現。じっくり煮込んだチャーシューが絶品です。',
      time: '90分',
      calories: '650 kcal',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: '材料3つ！濃厚チョコレートアイスクリーム',
      description: 'アイスクリームメーカー不要。お家で簡単に作れる本格派デザート。',
      time: '15分 +冷凍',
      calories: '300 kcal',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop'
    }
  ];

  const ingredients = ['鶏肉', '豚肉', '牛肉', 'トマト', '卵'];

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedIngredient('鶏肉');
    setCuisineTypes({ japanese: false, western: false, chinese: false, other: false });
    setDifficulty('');
    setCookingTime('');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] text-[#333333]">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hide-scrollbar sticky top-[65px] h-[calc(100vh-65px)] w-72 flex-shrink-0 border-r border-[#d1e6d9] overflow-y-auto bg-white p-6 hidden lg:flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="flex items-center rounded-lg h-12 bg-[#f6f8f7] w-full">
              <div className="flex items-center justify-center pl-4">
                <Search className="w-5 h-5 text-[#333333]/70" />
              </div>
              <input
                type="text"
                placeholder="キーワードで検索..."
                className="w-full min-w-0 bg-transparent border-none outline-none focus:ring-0 focus:outline-none px-4 text-sm placeholder:text-sm placeholder:text-[#333333]/50 truncate"
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col">
              {/* Ingredients */}
              <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-medium">材料</p>
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-2 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map(ingredient => (
                      <button
                        key={ingredient}
                        onClick={() => setSelectedIngredient(ingredient)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedIngredient === ingredient
                          ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                          : 'bg-[#f6f8f7] hover:bg-[#4CAF50]/10 border border-[#d1e6d9]'
                          }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>
              </details>

              {/* Cuisine Type */}
              <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-medium">系統</p>
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-2 pt-2">
                  {[
                    { key: 'japanese', label: '和食' },
                    { key: 'western', label: '洋食' },
                    { key: 'chinese', label: '中華' },
                    { key: 'other', label: 'その他' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex gap-x-3 py-2 items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cuisineTypes[key]}
                        onChange={(e) => setCuisineTypes(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="h-5 w-5 rounded border-2 border-[#d1e6d9] text-[#4CAF50] focus:ring-0 focus:ring-offset-0"
                      />
                      <p className="text-sm">{label}</p>
                    </label>
                  ))}
                </div>
              </details>

              {/* Difficulty */}
              <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-medium">難易度</p>
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-2 pt-2">
                  {['簡単', '普通', '難しい'].map(level => (
                    <label key={level} className="flex gap-x-3 py-2 items-center cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={difficulty === level}
                        onChange={() => setDifficulty(level)}
                        className="h-5 w-5 border-2 border-[#d1e6d9] text-[#4CAF50] focus:ring-0 focus:ring-offset-0"
                      />
                      <p className="text-sm">{level}</p>
                    </label>
                  ))}
                </div>
              </details>

              {/* Cooking Time */}
              <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-medium">調理時間</p>
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-2 pt-2">
                  {['15分以内', '30分以内', '60分以内'].map(time => (
                    <label key={time} className="flex gap-x-3 py-2 items-center cursor-pointer">
                      <input
                        type="radio"
                        name="cooking_time"
                        checked={cookingTime === time}
                        onChange={() => setCookingTime(time)}
                        className="h-5 w-5 border-2 border-[#d1e6d9] text-[#4CAF50] focus:ring-0 focus:ring-offset-0"
                      />
                      <p className="text-sm">{time}</p>
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-auto flex flex-col gap-2">
            <button className="w-full h-11 px-6 rounded-lg bg-[#4CAF50] text-white text-sm font-bold hover:bg-[#45a049] transition-colors">
              絞り込み
            </button>
            <button
              onClick={resetFilters}
              className="w-full h-11 px-6 rounded-lg bg-transparent border border-[#d1e6d9] hover:bg-[#f6f8f7] text-sm font-medium transition-colors"
            >
              リセット
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">ピックアップレシピ</h1>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <div key={recipe.id} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={recipe.image}
                      fill
                      alt={recipe.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${favorites.includes(recipe.id) ? 'fill-[#FF9800] text-[#FF9800]' : 'text-[#FF9800]'}`}
                    />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2">{recipe.title}</h3>
                  <p className="text-sm text-[#333333]/70 flex-grow">{recipe.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-[#333333]/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      <span>{recipe.calories}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 flex justify-center">
            <button className="flex items-center justify-center h-11 px-8 rounded-lg border border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-colors text-sm font-bold">
              もっと見る
            </button>
          </div>
        </main>
      </div>
    </div >
  );
};

export default RecipeApp;