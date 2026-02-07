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

// 楽天レシピAPIのカテゴリID（例）を意識したデータ構造
const INGREDIENT_CATEGORIES = [
  {
    id: 'meat',
    label: '肉類',
    children: [
      { name: '牛肉', categoryId: '10' },
      { name: '豚肉', categoryId: '11' },
      { name: '鶏肉', categoryId: '12' },
      { name: 'ひき肉', categoryId: '39' },
      { name: 'ハム・ソーセージ', categoryId: '13' },
    ],
  },
  {
    id: 'vegetable',
    label: '野菜',
    children: [
      { name: '根菜類', categoryId: '100' }, // 大根・人参など
      { name: '葉物野菜', categoryId: '101' }, // キャベツなど
      { name: 'トマト・ナス', categoryId: '102' },
      { name: 'きのこ類', categoryId: '103' },
      { name: '香味野菜', categoryId: '104' },
    ],
  },
  {
    id: 'fish',
    label: '魚介・海藻',
    children: [
      { name: '鮭・サーモン', categoryId: '20' },
      { name: '青魚（アジ・サバ）', categoryId: '21' },
      { name: 'エビ・カニ', categoryId: '22' },
      { name: '貝類', categoryId: '23' },
    ],
  },
  {
    id: 'other',
    label: '卵・豆・乳製品',
    children: [
      { name: '卵', categoryId: '30' },
      { name: '豆腐', categoryId: '31' },
      { name: '納豆', categoryId: '32' },
      { name: '牛乳・チーズ', categoryId: '33' },
    ],
  },
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
  const [favoritesOnly, setFavoritesOnly] = useState(initialFilters.favoritesOnly ?? false);


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
      
          <div className="flex flex-col gap-6">
            <details className="group border-b border-gray-100 pb-4" open>
              <summary className="flex cursor-pointer items-center justify-between list-none py-2 select-none group-hover:text-[#4A7C59] transition-colors">
                <span className="text-sm font-bold text-[#2D2D2D] group-hover:text-[#4A7C59]">
                  カテゴリー
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
              </summary>

              <div className="pt-3 animate-in slide-in-from-top-1 duration-200">

                {INGREDIENT_CATEGORIES.map((parentCategory) => (
                  <div key={parentCategory.id} className="mb-2 last:mb-0">

                    {/* 内側の details (group/inner をユニークにする必要はないため、そのまま使用) */}
                    <details className="group/inner pb-2" open>

                      <summary className="flex cursor-pointer items-center justify-between gap-5 mb-2 list-none py-2 select-none border-b border-dashed border-gray-100 group-hover/inner:text-[#4A7C59] transition-colors">
                        <span className="text-sm font-bold text-[#2D2D2D] group-hover/inner:text-[#4A7C59]">
                          {parentCategory.label}
                        </span>

                        <ChevronDown
                          // group-open/inner で、この内側のdetailsの状態を監視
                          className="w-4 h-4 text-gray-400 transition-transform duration-200 transform group-open/inner:rotate-180"
                        />
                      </summary>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {parentCategory.children.map((child) => {
                          const active = selectedCategory === child.name;

                          return (
                            <button
                              key={child.categoryId}
                              onClick={() => {
                                // 選択状態の更新ロジック
                                setSelectedCategory(child.name);
                                // API検索用に配列へ入れる（必要に応じて変更してください）
                                setIngredients([child.name]);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${active
                                  ? "bg-[#4A7C59] text-white border-[#4A7C59] shadow-sm"
                                  : "bg-[#F5F5F5] text-gray-600 border-transparent hover:bg-gray-200"
                                }`}
                            >
                              {child.name}
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                ))}
                {/* --- 修正部分終了 --- */}

              </div>
            </details>
          </div>

          {/* 調理時間 */}
          <details className="group border-b border-gray-100 pb-4" open >
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
                    className={`text-sm font-medium transition-colors ${cookingTime === time
                      ? "text-[#4A7C59] font-bold"
                      : "text-gray-600"
                      }`}
                  >
                    {time}
                  </span>
                </label>
              ))}
            </div>
          </details >

          {/* お気に入りトグル */}
          <div className="flex items-center justify-between px-1 pb-6" >
            <span className="text-sm font-bold text-[#2D2D2D]">お気に入りのみ</span>
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${favoritesOnly ? "bg-[#4A7C59]" : "bg-gray-200"
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 `}
                style={{
                  transform: favoritesOnly ? "translateX(20px)" : "translateX(0)",
                }}
              />
            </button>
          </div>

          {/* アクションボタン */}
          <div className="mt-auto pt-2 space-y-3" >
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
        </div >
      </aside >
    </>
  );
};

export default Sidebar;


