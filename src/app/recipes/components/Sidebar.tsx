"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

export type Filters = {
  ingredients: string[];   // カテゴリ名などを1つだけ入れる想定
  cookingTime: string;
  favoritesOnly: boolean;
};

type SidebarProps = {
  initialFilters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
};

const SIDEBAR_CATEGORIES = [
  { id: "10", name: "ご飯もの" },
  { id: "11", name: "パン" },
  { id: "12", name: "麺" },
  { id: "13", name: "魚介" },
  { id: "14", name: "肉" },
  { id: "15", name: "野菜" },
  { id: "16", name: "卵" },
  { id: "17", name: "スープ・汁物" },
  { id: "18", name: "サラダ" },
  { id: "19", name: "お菓子" },
  { id: "20", name: "パーティ料理" },
  { id: "21", name: "飲み物" },
  { id: "22", name: "その他" },
];

const COOKING_TIMES = [
  "～5分",
  "5分～15分",
  "15分～30分",
  "30分～45分",
  "45分～60分",
  "それ以上",
];

const Sidebar: React.FC<SidebarProps> = ({
  initialFilters,
  onApply,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false); // モバイル用サイドバー開閉

  const [ingredients, setIngredients] = useState<string[]>(
    initialFilters.ingredients ?? []
  );
  const [cookingTime, setCookingTime] = useState(
    initialFilters.cookingTime ?? ""
  );
  const [favoritesOnly, setFavoritesOnly] = useState(
    initialFilters.favoritesOnly ?? false
  );

  // ボタンの選択状態表示用（カテゴリ名で管理）
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialFilters.ingredients?.[0] ?? null
  );

  useEffect(() => {
    if (initialFilters) {
      setIngredients(initialFilters.ingredients ?? []);
      setCookingTime(initialFilters.cookingTime ?? "");
      setFavoritesOnly(initialFilters.favoritesOnly ?? false);
      setSelectedCategory(initialFilters.ingredients?.[0] ?? null);
    }
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      ingredients,
      cookingTime,
      favoritesOnly,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setIngredients([]);
    setCookingTime("");
    setFavoritesOnly(false);
    setSelectedCategory(null);
    onReset();
    setIsOpen(false);
  };

  return (
    <>
      {/* モバイル用 トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 left-6 z-40 bg-[#2D2D2D] text-white p-4 rounded-full shadow-xl hover:bg-[#4A7C59] transition-colors flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span className="text-xs font-bold pr-1">絞り込み</span>
      </button>

      {/* サイドバー本体 */}
      <aside
        className={`
        hide-scrollbar fixed md:sticky top-0 left-0 h-screen w-80 bg-white border-r border-gray-100 
        z-40 transform transition-transform duration-300 ease-in-out pt-12 pb-10 px-6 overflow-y-auto flex-shrink-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0 md:shadow-none"}
      `}
      >
        {/* モバイル時のヘッダー */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="font-serif text-xl font-bold text-[#2D2D2D]">
            絞り込み検索
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* カテゴリー */}
          <details className="group border-b border-gray-100 pb-4" open>
            <summary className="flex cursor-pointer items-center justify-between list-none py-2 select-none group-hover:text-[#4A7C59] transition-colors">
              <span className="text-sm font-bold text-[#2D2D2D] group-hover:text-[#4A7C59]">
                カテゴリー
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="pt-3 animate-in slide-in-from-top-1 duration-200">
              <div className="flex flex-wrap gap-2">
                {SIDEBAR_CATEGORIES.map((c) => {
                  const active = selectedCategory === c.name;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        // name ベースで 1 つだけ選択
                        setSelectedCategory(c.name);
                        setIngredients([c.name]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                        active
                          ? "bg-[#4A7C59] text-white border-[#4A7C59] shadow-sm"
                          : "bg-[#F5F5F5] text-gray-600 border-transparent hover:bg-gray-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </details>

          {/* 調理時間 */}
          <details className="group border-b border-gray-100 pb-4" open>
            <summary className="flex cursor-pointer items-center justify-between list-none py-2 select-none group-hover:text-[#4A7C59] transition-colors">
              <span className="text-sm font-bold text-[#2D2D2D] group-hover:text-[#4A7C59]">
                調理時間
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="pt-3 space-y-1 animate-in slide-in-from-top-1 duration-200">
              {COOKING_TIMES.map((time) => (
                <label
                  key={time}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group/label"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="cooking_time"
                      checked={cookingTime === time}
                      onChange={() => setCookingTime(time)}
                      className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-[#4A7C59] checked:bg-[#4A7C59] transition-all"
                    />
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      cookingTime === time
                        ? "text-[#4A7C59] font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {time}
                  </span>
                </label>
              ))}
            </div>
          </details>

          {/* お気に入りトグル */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 pb-6">
            <span className="text-sm font-bold text-[#2D2D2D]">
              お気に入りのみ
            </span>
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${
                favoritesOnly ? "bg-[#4A7C59]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
                  favoritesOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* アクションボタン */}
          <div className="mt-auto pt-2 space-y-3">
            <button
              onClick={handleApply}
              className="w-full py-3 rounded-xl bg-[#2D2D2D] text-white text-sm font-bold shadow-lg hover:bg-[#4A7C59] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              条件で絞り込む
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:text-[#2D2D2D] transition-all duration-300"
            >
              リセット
            </button>
          </div>
        </div>
      </aside>

      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;


