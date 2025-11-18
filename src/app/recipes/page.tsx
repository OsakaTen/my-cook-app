"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar, { Filters } from "./components/Sidebar";
import { Heart, Clock, Flame } from "lucide-react";

type CuisineType = "japanese" | "western" | "chinese" | "other";

interface Recipe {
  recipeId: string;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeMaterial: string[];
  recipeDescription: string;
  matchScore?: number;
}

interface SearchResult {
  success: boolean;
  message: string;
  recipes: Recipe[];
  categoriesSearched?: number;
}

const RecipePage: React.FC = () => {
  // -------- 検索条件・フィルタ状態 --------
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [ingredients, setIngredients] = useState<string[]>(["鶏肉"]);
  const [inputValue, setInputValue] = useState("鶏肉");

  const [cuisines, setCuisines] = useState<CuisineType[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // -------- 結果・UI状態 --------
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refrigerator, setRefrigerator] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // -----------------------------
  // 共通の検索ロジック
  // -----------------------------
  const performSearch = (options?: {
    overrideIngredients?: string[];
    overrideCategoryId?: string | null;
    overrideFilters?: Partial<Filters>;
  }) => {
    // 現在の state をベースに上書き
    const nextIngredients =
      options?.overrideIngredients ?? ingredients ?? [];
    const nextCategoryId =
      options?.overrideCategoryId !== undefined
        ? options.overrideCategoryId
        : categoryId;

    const baseFilters: Filters = {
      ingredients: nextIngredients,
      cuisines,
      difficulty,
      cookingTime,
      favoritesOnly,
    };

    const mergedFilters: Filters = {
      ...baseFilters,
      ...options?.overrideFilters,
      // nested の場合は必要に応じてもう少し厳密にマージしてもOK
    };

    const validIngredients = mergedFilters.ingredients
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (validIngredients.length === 0) {
      setMessage("食材を入力してください");
      setRecipes([]);
      return;
    }

    // state にも反映
    setIngredients(validIngredients);
    setCuisines(mergedFilters.cuisines);
    setDifficulty(mergedFilters.difficulty);
    setCookingTime(mergedFilters.cookingTime);
    setFavoritesOnly(mergedFilters.favoritesOnly);
    setCategoryId(nextCategoryId ?? null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/recipes/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // API側はとりあえず ingredients だけ使っていてもOK
          body: JSON.stringify({
            ingredients: validIngredients,
            categoryId: nextCategoryId,
            cuisines: mergedFilters.cuisines,
            difficulty: mergedFilters.difficulty,
            cookingTime: mergedFilters.cookingTime,
            favoritesOnly: mergedFilters.favoritesOnly,
          }),
        });

        const result: SearchResult = await response.json();

        if (result.success) {
          setRecipes(result.recipes);
          setMessage(result.message);
        } else {
          setMessage(result.message);
          setRecipes([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setMessage("エラーが発生しました。もう一度お試しください。");
        setRecipes([]);
      }
    });
  };

  // 上部検索フォームのボタン
  const handleSearchClick = () => {
    const ingArray =
      inputValue.trim().length > 0
        ? [inputValue.trim()]
        : ingredients;
    performSearch({ overrideIngredients: ingArray });
  };

  // Sidebar からカテゴリ選択
  const handleSelectCategory = (id: string | null) => {
    setCategoryId(id);
    // すでに食材が入っている場合はその条件で再検索しても良いし、
    // 何もしないで「カテゴリだけ変えられる UI」にしてもOK
    if (ingredients.length > 0) {
      performSearch({ overrideCategoryId: id });
    }
  };

  // Sidebar の「絞り込み」ボタン
  const handleApplyFilters = (filters: Filters) => {
    performSearch({
      overrideIngredients: filters.ingredients,
      overrideCategoryId: categoryId,
      overrideFilters: filters,
    });
  };

  // Sidebar の「リセット」ボタン
  const handleResetFilters = () => {
    setIngredients([]);
    setInputValue("");
    setCuisines([]);
    setDifficulty("");
    setCookingTime("");
    setFavoritesOnly(false);
    setCategoryId(null);
    setRecipes([]);
    setMessage("条件をリセットしました");
  };

  // お気に入りトグル（ローカル保持）
  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
    // 将来的に DB 永続化したくなったらここで /api/favorites を叩く
  };

  const visibleRecipes = favoritesOnly
    ? recipes.filter((r) => favorites.includes(r.recipeId))
    : recipes;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] text-[#333333]">
      <Header />

      <div className="flex flex-1">
        {/* ---- Sidebar ---- */}
        <Sidebar
          selectedId={categoryId}
          onSelect={handleSelectCategory}
          initialFilters={{
            ingredients,
            cuisines,
            difficulty,
            cookingTime,
            favoritesOnly,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* ---- Main ---- */}
        <main className="hide-scrollbar flex-1 p-6 md:p-10">
          {/* タイトル & 検索フォーム */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                ピックアップレシピ
              </h1>
              <p className="text-sm text-[#666]">
                冷蔵庫の食材やカテゴリからレシピを提案します
              </p>
            </div>

            {message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="例）鶏肉, キャベツ など"
                className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button
                onClick={handleSearchClick}
                disabled={isPending}
                className="flex items-center justify-center px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isPending ? "検索中…" : "検索"}
              </button>
            </div>
          </div>

          {/* メッセージ */}


          {/* レシピカードグリッド（デザインは前のまま） */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {visibleRecipes.map((recipe) => (
              <div
                key={recipe.recipeId}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={recipe.foodImageUrl || "/placeholder.png"}
                      fill
                      alt={recipe.recipeTitle}
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(recipe.recipeId)}
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${favorites.includes(recipe.recipeId)
                          ? "fill-[#FF9800] text-[#FF9800]"
                          : "text-[#FF9800]"
                        }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2">
                    {recipe.recipeTitle}
                  </h3>

                  {recipe.matchScore && recipe.matchScore > 0 && (
                    <span className="mb-2 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                      {recipe.matchScore}個の食材マッチ
                    </span>
                  )}

                  <p className="text-sm text-[#333333]/70 flex-grow line-clamp-3">
                    {recipe.recipeDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs sm:text-sm text-[#333333]/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>おすすめ</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      <span>人気レシピ</span>
                    </div>
                  </div>

                  <a
                    href={recipe.recipeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block w-full text-center px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                  >
                    レシピを見る
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!isPending && recipes.length === 0 && (
            <p className="mt-8 text-center text-sm text-gray-500">
              検索結果がまだありません。食材やカテゴリを指定して「検索」または「絞り込み」を押してください。
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecipePage;
