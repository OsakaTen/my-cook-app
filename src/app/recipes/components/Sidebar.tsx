"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type CuisineType = "japanese" | "western" | "chinese" | "other";

export type Filters = {
  ingredients: string[];      // 系統ボタン等（ここでは食カテゴリ）
  cuisines: CuisineType[];    // 和食/洋食/中華/その他
  difficulty: string;
  cookingTime: string;
  favoritesOnly: boolean;
};

type Props = {
  selectedId?: string | null; // カテゴリID（ランキング用）
  onSelect: (categoryId: string | null) => void;
  initialFilters?: Filters;
  onApply: (filters: Filters) => void;
  onReset?: () => void;
};

const categories = [
  { id: "10", name: "ご飯もの" },
  { id: "11", name: "パン" },
  { id: "12", name: "麺" },
  { id: "13", name: "魚介" },
  { id: "14", name: "肉" },
  { id: "15", name: "野菜" },
  { id: "16", name: "卵・大豆" },
  { id: "17", name: "スープ・汁物" },
  { id: "18", name: "サラダ" },
  { id: "19", name: "お菓子" },
  { id: "20", name: "パーティ料理" },
  { id: "21", name: "飲み物" },
  { id: "22", name: "その他" },
];

export default function Sidebar({
  selectedId = null,
  onSelect,
  initialFilters,
  onApply,
  onReset,
}: Props) {
  const [ingredients, setIngredients] = useState<string[]>(
    initialFilters?.ingredients ?? [],
  );
  const [cuisines, setCuisines] = useState<CuisineType[]>(
    initialFilters?.cuisines ?? [],
  );
  const [difficulty, setDifficulty] = useState(
    initialFilters?.difficulty ?? "",
  );
  const [cookingTime, setCookingTime] = useState(
    initialFilters?.cookingTime ?? "",
  );
  const [favoritesOnly, setFavoritesOnly] = useState(
    initialFilters?.favoritesOnly ?? false,
  );

  // cuisine checkbox toggle
  const toggleCuisine = (key: CuisineType) => {
    setCuisines((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key],
    );
  };

  const handleApply = () => {
    onApply({
      ingredients,
      cuisines,
      difficulty,
      cookingTime,
      favoritesOnly,
    });
  };

  const handleReset = () => {
    setIngredients([]);
    setCuisines([]);
    setDifficulty("");
    setCookingTime("");
    setFavoritesOnly(false);
    if (onReset) onReset();
  };

  useEffect(() => {
    // 初期フィルタが渡される可能性があるので反映
    if (initialFilters) {
      setIngredients(initialFilters.ingredients ?? []);
      setCuisines(initialFilters.cuisines ?? []);
      setDifficulty(initialFilters.difficulty ?? "");
      setCookingTime(initialFilters.cookingTime ?? "");
      setFavoritesOnly(initialFilters.favoritesOnly ?? false);
    }
  }, [initialFilters]);

  return (
    <aside className="hide-scrollbar sticky top-[65px] h-[calc(100vh-65px)] w-72 flex-shrink-0 border-r border-[#d1e6d9] overflow-y-auto bg-white p-6 hidden lg:flex flex-col gap-6">
      {/* 材料 / 系列ボタン群（ここにカテゴリ選択機能を統合） */}
      <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
          <p className="text-sm font-medium">カテゴリー</p>
          <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
        </summary>

        <div className="pl-2 pt-2 space-y-4">
          {/* カテゴリ選択 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {/* 総合ボタン */}
              <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedId === null
                    ? "bg-green-200 text-green-800 font-semibold"
                    : "bg-[#f6f8f7] hover:bg-green-50 border border-[#d1e6d9]"
                  }`}
              >
                総合
              </button>

              {/* カテゴリボタン */}
              {categories.map((c) => {
                const active = selectedId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active
                        ? "bg-green-200 text-green-800 font-semibold"
                        : "bg-[#f6f8f7] hover:bg-green-50 border border-[#d1e6d9]"
                      }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </details>

      {/* 料理系統チェックボックス */}
      <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
          <p className="text-sm font-medium">調理時間</p>
          <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="pl-2 pt-2">
          {["～5分", "5分～15分", "15分～30分","30分～45分","45分～60分","それ以上"].map((time) => (
            <label
              key={time}
              className="flex gap-x-3 py-2 items-center cursor-pointer"
            >
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

      {/* 難易度 */}
      <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
          <p className="text-sm font-medium">費用</p>
          <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="pl-2 pt-2">
          {["簡単", "普通", "難しい"].map((level) => (
            <label
              key={level}
              className="flex gap-x-3 py-2 items-center cursor-pointer"
            >
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

      {/* お気に入りトグル */}
      <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
          <p className="text-sm font-medium">お気に入り</p>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setFavoritesOnly((s) => !s);
            }}
            className={`toggle ${favoritesOnly ? "on" : ""}`}
          >
            <span className="circle" />
          </div>
        </summary>
      </details>

      {/* 自分の冷蔵庫から（今は favoritesOnly と同じ state を使用） */}
      <details className="flex flex-col border-t border-[#d1e6d9] py-2 group" open>
        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
          <p className="text-sm font-medium">自分の冷蔵庫から</p>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setFavoritesOnly((s) => !s);
            }}
            className={`toggle ${favoritesOnly ? "on" : ""}`}
          >
            <span className="circle" />
          </div>
        </summary>
      </details>

      {/* ボタン群 */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={handleApply}
          className="w-full h-11 px-6 rounded-lg bg-[#4CAF50] text-white text-sm font-bold hover:bg-[#45a049] transition-colors"
        >
          絞り込み
        </button>
        <button
          onClick={handleReset}
          className="w-full h-11 px-6 rounded-lg bg-transparent border border-[#d1e6d9] hover:bg-[#f6f8f7] text-sm font-medium transition-colors"
        >
          リセット
        </button>
      </div>
    </aside>
  );
}
