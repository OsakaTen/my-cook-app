"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Sidebar, { Filters } from "./components/Sidebar";
import { Heart, Clock, Flame } from "lucide-react";
import Header from "@/components/Header";

import {
  Search,
  ArrowRight,
  Sparkles,
  ChefHat,
} from "lucide-react";


interface Recipe {
  recipeId: string;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeMaterial: string[];
  recipeDescription: string;
  matchScore?: number;
  cookingTime?: string;
}

interface SearchResult {
  success: boolean;
  message: string;
  recipes: Recipe[];
  categoriesSearched?: number;
}

const RecipePage: React.FC = () => {
  // -------- 検索条件・フィルタ状態 --------
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // -------- 結果・UI状態 --------
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // -----------------------------
  // 共通の検索ロジック
  // -----------------------------
  const performSearch = (options?: {
    overrideIngredients?: string[];
    overrideFilters?: Partial<Filters>;
  }) => {
    const nextIngredients =
      options?.overrideIngredients ?? ingredients ?? [];

    const baseFilters: Filters = {
      ingredients: nextIngredients,
      cookingTime,
      favoritesOnly,
    };

    const mergedFilters: Filters = {
      ...baseFilters,
      ...options?.overrideFilters,
    };

    const validIngredients = (mergedFilters.ingredients ?? [])
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    // ✅ 1つでも条件があれば検索OK
    const hasAnyCondition =
      validIngredients.length > 0 ||
      !!mergedFilters.cookingTime ||
      mergedFilters.favoritesOnly;

    if (!hasAnyCondition) {
      setMessage("検索条件を1つ以上指定してください");
      setRecipes([]);
      return;
    }

    // state に反映
    setIngredients(validIngredients);
    setCookingTime(mergedFilters.cookingTime);
    setFavoritesOnly(mergedFilters.favoritesOnly);

    startTransition(async () => {
      try {
        const response = await fetch("/api/recipes/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: validIngredients, // カテゴリ名 or 食材名
            cookingTime: mergedFilters.cookingTime,
            favoritesOnly: mergedFilters.favoritesOnly,
          }),
        });

        const result: SearchResult = await response.json();

        if (result.success) {
          setRecipes(result.recipes);
          // メッセージ組み立て（簡易）
          const msgParts: string[] = [];
          if (validIngredients.length > 0) {
            msgParts.push(`「${validIngredients.join(", ")}」`);
          }
          if (mergedFilters.cookingTime) {
            msgParts.push(mergedFilters.cookingTime);
          }
          if (mergedFilters.favoritesOnly) {
            msgParts.push("お気に入り");
          }
          const prefix = msgParts.length
            ? `${msgParts.join("・")} の検索結果`
            : "検索結果";
          setMessage(`${prefix}: ${result.recipes.length}件`);
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

  // 上部検索フォーム
  const handleSearchClick = () => {
    const ingArray =
      inputValue.trim().length > 0
        ? [inputValue.trim()]
        : ingredients;
    performSearch({ overrideIngredients: ingArray });
  };

  // Sidebar の「絞り込み」
  const handleApplyFilters = (filters: Filters) => {
    performSearch({
      overrideIngredients: filters.ingredients,
      overrideFilters: filters,
    });
  };

  // Sidebar の「リセット」
  const handleResetFilters = () => {
    setIngredients([]);
    setInputValue("");
    setCookingTime("");
    setFavoritesOnly(false);
    setRecipes([]);
    setMessage("条件をリセットしました");
  };

  // お気に入りトグル
  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const visibleRecipes = favoritesOnly
    ? recipes.filter((r) => favorites.includes(r.recipeId))
    : recipes;

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#2D2D2D] selection:bg-[#4A7C59] selection:text-white font-sans">
      <Header />
      <div className="flex pt-20 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          initialFilters={{
            ingredients,
            cookingTime,
            favoritesOnly,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 w-full">
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#2D2D2D]">
                  Pick Up Recipes
                </h1>
                <p className="text-sm font-medium text-gray-400">
                  冷蔵庫の食材やカテゴリから、
                  <br className="md:hidden" />
                  あなたにぴったりのレシピを提案します。
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-4 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4A7C59] transition-colors" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="食材を入力 (例: 鶏肉, キャベツ)"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all font-medium placeholder:text-gray-300"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearchClick()
                    }
                  />
                </div>
                <button
                  onClick={handleSearchClick}
                  disabled={isPending}
                  className="px-6 py-3 rounded-2xl bg-[#2D2D2D] text-white font-bold shadow-lg hover:bg-[#4A7C59] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isPending ? "検索中..." : "検索"}
                </button>
              </div>
            </div>

            {message && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F7F2] text-[#4A7C59] rounded-xl text-sm font-bold mb-6 animate-in fade-in">
                <Sparkles className="w-4 h-4" />
                {message}
              </div>
            )}

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {visibleRecipes.map((recipe) => (
                <div
                  key={recipe.recipeId}
                  className="group flex flex-col bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#4A7C59]/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    {/* Image */}
                    {/* Next/Image でも良いが、デザインコードに合わせて img にしている */}
                    <Image
                      src={recipe.foodImageUrl || "/placeholder.png"}
                      alt={recipe.recipeTitle}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(recipe.recipeId);
                      }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur shadow-md hover:scale-110 transition-all active:scale-95 z-10"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(recipe.recipeId)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                    </button>

                    {recipe.matchScore && recipe.matchScore > 0 && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-[#4A7C59]/90 backdrop-blur text-white text-xs font-bold shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {recipe.matchScore} 食材マッチ
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative">
                    <h3 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2 line-clamp-2 group-hover:text-[#4A7C59] transition-colors">
                      {recipe.recipeTitle}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow font-medium">
                      {recipe.recipeDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6 uppercase tracking-wider">
                      {recipe.cookingTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#4A7C59]" />
                          <span>{recipe.cookingTime}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>人気</span>
                      </div>
                    </div>

                    <a
                      href={recipe.recipeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full py-3 rounded-xl bg-gray-50 text-[#2D2D2D] text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#2D2D2D] group-hover:text-white transition-colors"
                    >
                      レシピを見る
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {!isPending && visibleRecipes.length === 0 && (
              <div className="mt-12 text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-serif text-xl text-gray-800 mb-2">
                  レシピが見つかりません
                </p>
                <p className="text-sm text-gray-400">
                  検索条件を変更して、もう一度お試しください。
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 text-[#4A7C59] font-bold hover:underline"
                >
                  条件をクリアする
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecipePage;


// interface Recipe {
//   recipeId: string;
//   recipeTitle: string;
//   recipeUrl: string;
//   foodImageUrl: string;
//   recipeMaterial: string[];
//   recipeDescription: string;
//   matchScore?: number;
// }

// interface SearchResult {
//   success: boolean;
//   message: string;
//   recipes: Recipe[];
//   categoriesSearched?: number;
// }

// const RecipePage: React.FC = () => {
//   // -------- 検索条件・フィルタ状態 --------
//   const [ingredients, setIngredients] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [cookingTime, setCookingTime] = useState("");
//   const [favoritesOnly, setFavoritesOnly] = useState(false);

//   // -------- 結果・UI状態 --------
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [message, setMessage] = useState("");
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [isPending, startTransition] = useTransition();

//   // -----------------------------
//   // 共通の検索ロジック
//   // -----------------------------
//   const performSearch = (options?: {
//     overrideIngredients?: string[];
//     overrideFilters?: Partial<Filters>;
//   }) => {
//     // 現在の state をベースに上書き
//     const nextIngredients =
//       options?.overrideIngredients ?? ingredients ?? [];

//     const baseFilters: Filters = {
//       ingredients: nextIngredients,
//       cookingTime,
//       favoritesOnly,
//     };

//     const mergedFilters: Filters = {
//       ...baseFilters,
//       ...options?.overrideFilters,
//     };

//     const validIngredients = (mergedFilters.ingredients ?? [])
//       .map((i) => i.trim())
//       .filter((i) => i.length > 0);

//     // ✅ 「1つでも条件があれば検索OK」
//     const hasAnyCondition =
//       validIngredients.length > 0 ||
//       !!mergedFilters.cookingTime ||
//       mergedFilters.favoritesOnly;

//     if (!hasAnyCondition) {
//       setMessage("検索条件を1つ以上指定してください");
//       setRecipes([]);
//       return;
//     }

//     // state にも反映
//     setIngredients(validIngredients);
//     setCookingTime(mergedFilters.cookingTime);
//     setFavoritesOnly(mergedFilters.favoritesOnly);

//     startTransition(async () => {
//       try {
//         const response = await fetch("/api/recipes/search", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ingredients: validIngredients,              // カテゴリ名 or 食材名の配列
//             cookingTime: mergedFilters.cookingTime,
//             favoritesOnly: mergedFilters.favoritesOnly,
//           }),
//         });

//         const result: SearchResult = await response.json();

//         if (result.success) {
//           setRecipes(result.recipes);
//           setMessage(result.message);
//         } else {
//           setMessage(result.message);
//           setRecipes([]);
//         }
//       } catch (error) {
//         console.error("Search error:", error);
//         setMessage("エラーが発生しました。もう一度お試しください。");
//         setRecipes([]);
//       }
//     });
//   };

//   // 上部検索フォームの「検索」ボタン
//   const handleSearchClick = () => {
//     const ingArray =
//       inputValue.trim().length > 0
//         ? [inputValue.trim()]
//         : ingredients;
//     performSearch({ overrideIngredients: ingArray });
//   };

//   // Sidebar の「絞り込み」ボタン
//   const handleApplyFilters = (filters: Filters) => {
//     performSearch({
//       overrideIngredients: filters.ingredients,
//       overrideFilters: filters,
//     });
//   };

//   // Sidebar の「リセット」ボタン
//   const handleResetFilters = () => {
//     setIngredients([]);
//     setInputValue("");
//     setCookingTime("");
//     setFavoritesOnly(false);
//     setRecipes([]);
//     setMessage("条件をリセットしました");
//   };

//   // お気に入りトグル（ローカル保持）
//   const toggleFavorite = (recipeId: string) => {
//     setFavorites((prev) =>
//       prev.includes(recipeId)
//         ? prev.filter((id) => id !== recipeId)
//         : [...prev, recipeId],
//     );
//   };

//   const visibleRecipes = favoritesOnly
//     ? recipes.filter((r) => favorites.includes(r.recipeId))
//     : recipes;

//   return (
//     <div className="relative flex min-h-screen w-full flex-col bg-[#f6f8f7] text-[#333333]">
//       <Header />

//       <div className="flex flex-1">
//         {/* ---- Sidebar ---- */}
//         <Sidebar
//           initialFilters={{
//             ingredients,
//             cookingTime,
//             favoritesOnly,
//           }}
//           onApply={handleApplyFilters}
//           onReset={handleResetFilters}
//         />

//         {/* ---- Main ---- */}
//         <main className="hide-scrollbar flex-1 p-6 md:p-10">
//           {/* タイトル & 検索フォーム */}
//           <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">
//                 ピックアップレシピ
//               </h1>
//               <p className="text-sm text-[#666]">
//                 冷蔵庫の食材やカテゴリからレシピを提案します
//               </p>
//             </div>

//             {message && (
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg md:max-w-md">
//                 <p className="text-blue-800 text-sm">{message}</p>
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="例）鶏肉, キャベツ など"
//                 className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//               />
//               <button
//                 onClick={handleSearchClick}
//                 disabled={isPending}
//                 className="flex items-center justify-center px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {isPending ? "検索中…" : "検索"}
//               </button>
//             </div>
//           </div>

//           {/* レシピカードグリッド */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
//             {visibleRecipes.map((recipe) => (
//               <div
//                 key={recipe.recipeId}
//                 className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
//               >
//                 <div className="relative">
//                   <div className="aspect-[4/3] overflow-hidden relative">
//                     <Image
//                       src={recipe.foodImageUrl || "/placeholder.png"}
//                       fill
//                       alt={recipe.recipeTitle}
//                       sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
//                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => toggleFavorite(recipe.recipeId)}
//                     className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:text-red-500 transition-colors"
//                   >
//                     <Heart
//                       className={`w-6 h-6 ${
//                         favorites.includes(recipe.recipeId)
//                           ? "fill-[#FF9800] text-[#FF9800]"
//                           : "text-[#FF9800]"
//                       }`}
//                     />
//                   </button>
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2">
//                     {recipe.recipeTitle}
//                   </h3>

//                   {recipe.matchScore && recipe.matchScore > 0 && (
//                     <span className="mb-2 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
//                       {recipe.matchScore}個の食材マッチ
//                     </span>
//                   )}

//                   <p className="text-sm text-[#333333]/70 flex-grow line-clamp-3">
//                     {recipe.recipeDescription}
//                   </p>

//                   <div className="mt-4 flex items-center gap-4 text-xs sm:text-sm text-[#333333]/80">
//                     <div className="flex items-center gap-1.5">
//                       <Clock className="w-4 h-4" />
//                       <span>おすすめ</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Flame className="w-4 h-4" />
//                       <span>人気レシピ</span>
//                     </div>
//                   </div>

//                   <a
//                     href={recipe.recipeUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-3 inline-block w-full text-center px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
//                   >
//                     レシピを見る
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {!isPending && recipes.length === 0 && (
//             <p className="mt-8 text-center text-sm text-gray-500">
//               検索結果がまだありません。食材やカテゴリを指定して「検索」または「絞り込み」を押してください。
//             </p>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default RecipePage;

