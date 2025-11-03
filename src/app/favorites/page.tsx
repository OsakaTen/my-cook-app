"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar, { Filters } from "./components/Sidebar";
import { Search, Heart, Clock, Flame, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type CuisineType = "japanese" | "western" | "chinese" | "other";

type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  calories: string;
};

const PAGE_SIZE = 8;

const RecipeApp: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams?.get("categoryId") ?? null;
  const [categoryId, setCategoryId] = useState<string | null>(initialCategory);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOn, setIsOn] = useState(false); // favorites only (UI保持はSidebarに移譲しているが念のため)
  const [selectedIngredient, setSelectedIngredient] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<Record<CuisineType, boolean>>({
    japanese: false,
    western: false,
    chinese: false,
    other: false,
  });
  const [difficulty, setDifficulty] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 初回 favorites と最初のレシピ取得
  useEffect(() => {
    loadFavorites();
    // 初回は categoryId に基づいて取得（effect below handles recipes）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // categoryId が変われば page リセットして再取得
  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    loadRecipes(1, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // page が変われば追加取得（page=1 は上で取得）
  useEffect(() => {
    if (page !== 1) loadRecipes(page, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const anyFilterSelected = useCallback(() => {
    if (selectedIngredient.length > 0) return true;
    if (Object.values(cuisineTypes).some(Boolean)) return true;
    if (difficulty) return true;
    if (cookingTime) return true;
    if (isOn) return true;
    return false;
  }, [selectedIngredient, cuisineTypes, difficulty, cookingTime, isOn]);

  const buildFetchUrl = (pageToLoad: number, catId: string | null) => {
    const params = new URLSearchParams();
    params.set("page", String(pageToLoad));
    params.set("hits", String(PAGE_SIZE));
    if (catId) params.set("categoryId", catId);
    if (selectedIngredient.length > 0) params.set("ingredients", selectedIngredient.join(","));
    const selectedCuisines = (Object.keys(cuisineTypes) as CuisineType[]).filter((k) => cuisineTypes[k]);
    if (selectedCuisines.length > 0) params.set("cuisines", selectedCuisines.join(","));
    if (difficulty) params.set("difficulty", difficulty);
    if (cookingTime) params.set("cooking_time", cookingTime);
    params.set("hasFilters", anyFilterSelected() ? "1" : "0");
    return `/api/recipes?${params.toString()}`;
  };

  const loadRecipes = async (pageToLoad = page, catId = categoryId) => {
    setLoading(true);
    try {
      const url = buildFetchUrl(pageToLoad, catId);
      const res = await fetch(url);
      if (!res.ok) throw new Error("recipes api error");
      const data = await res.json();

      const items: Recipe[] = Array.isArray(data) ? data : data.recipes || [];

      if (pageToLoad === 1) {
        setRecipes(items);
      } else {
        setRecipes((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          const filtered = items.filter((r) => !ids.has(r.id));
          return [...prev, ...filtered];
        });
      }

      if (!Array.isArray(items) || items.length < PAGE_SIZE) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error("Failed to load recipes", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (!res.ok) return;
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data.map((f: any) => f.recipeId) : []);
    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
    // 永続化が必要なら API 呼び出しをここに追加
  };

  // Sidebar からカテゴリ選択されたとき
  const handleSelectCategory = (id: string | null) => {
    setCategoryId(id);
    const basePath = "/recipes";
    const newUrl = id ? `${basePath}?categoryId=${id}` : basePath;
    router.push(newUrl);
  };

  // Sidebar の絞り込みボタンから受け取る
  const handleApplyFilters = (filters: Filters) => {
    setSelectedIngredient(filters.ingredients || []);
    // cuisine 配列をレコードに変換
    setCuisineTypes({
      japanese: filters.cuisines.includes("japanese"),
      western: filters.cuisines.includes("western"),
      chinese: filters.cuisines.includes("chinese"),
      other: filters.cuisines.includes("other"),
    });
    setDifficulty(filters.difficulty || "");
    setCookingTime(filters.cookingTime || "");
    setIsOn(filters.favoritesOnly || false);

    // フィルタ変更があったら page リセットして取得
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    loadRecipes(1, categoryId);
  };

  const handleResetFilters = () => {
    setSelectedIngredient([]);
    setCuisineTypes({ japanese: false, western: false, chinese: false, other: false });
    setDifficulty("");
    setCookingTime("");
    setIsOn(false);
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    loadRecipes(1, categoryId);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] text-[#333333]">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar: UI は aside で見た目、UX はコールバックで親に伝える */}
        <Sidebar
          selectedId={categoryId}
          onSelect={handleSelectCategory}
          initialFilters={{
            ingredients: selectedIngredient,
            cuisines: (Object.keys(cuisineTypes) as CuisineType[]).filter((k) => cuisineTypes[k]),
            difficulty,
            cookingTime,
            favoritesOnly: isOn,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Main Content */}
        <main className="hide-scrollbar flex-1 p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">ピックアップレシピ</h1>
            <p className="text-sm text-[#666]">{categoryId ? `カテゴリ ${categoryId} のランキング` : "総合ランキング"}</p>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {(isOn ? recipes.filter((recipe) => favorites.includes(recipe.id)) : recipes).map((recipe, index) => (
              <div
                key={`${recipe.id}-${index}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={recipe.image || "/placeholder.png"}
                      fill
                      alt={recipe.title}
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <button onClick={() => toggleFavorite(recipe.id)} className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:text-red-500 transition-colors">
                    <Heart className={`w-6 h-6 ${favorites.includes(recipe.id) ? "fill-[#FF9800] text-[#FF9800]" : "text-[#FF9800]"}`} />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2">{recipe.title}</h3>
                  <p className="text-sm text-[#333333]/70 flex-grow line-clamp-3">{recipe.description}</p>

                  <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm text-[#333333]/80">
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
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading || !hasMore}
              className="flex items-center justify-center h-11 px-8 rounded-lg border border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-colors text-sm font-bold disabled:opacity-50"
            >
              {loading ? "読み込み中..." : hasMore ? "もっと見る" : "これ以上ありません"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecipeApp;