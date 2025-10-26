"use client";

import Header from "@/components/Header";
import Filter from "./components/FilterSection";
import Tabs from "./components/Tabs";
import RecipeSection from "./components/RecipeSection";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { Recipe, DbRecipe, ApiRecipe, TabOption } from "./types"
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const FreshPlateRecipes: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState({ id: "partial", label: "部分一致" });
  const [likedRecipes, setLikedRecipes] = useState<{ [id: string]: boolean }>({});
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);

  const sections = [
    {
      title: `冷蔵庫から作れる料理 (${activeTab.label})`,
      recipes: recommendedRecipes,
    },
    {
      title: "最近確認した料理",
      recipes: recentlyViewedRecipes,
    },
    {
      title: "お気に入り",
      recipes: favoriteRecipes,
    },
  ];

  const tabOptions: TabOption[] = [
    { id: "exact", label: "完全一致" },
    { id: "partial", label: "部分一致" },
    { id: "best-before", label: "賞味期限が近い" },
  ];

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/recipes/suggestions?mode=${activeTab.id}`);

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('レシピの取得に失敗しました');

      const data: { recipes: ApiRecipe[]; userIngredients: string[]; } = await res.json();

      if (data.recipes && data.recipes.length > 0) {
        // 楽天APIのレシピを変換
        const convertedRecipes = data.recipes.map((recipe) => ({
          id: recipe.recipeId,
          title: recipe.recipeTitle,
          cookingTime: recipe.recipeIndication,
          imageUrl: recipe.foodImageUrl || '/placeholder-recipe.jpg',
          recipeUrl: recipe.recipeUrl,
          matchRate: recipe.matchRate,
          matchedIngredients: recipe.matchedIngredients,
          missingIngredientsCount: recipe.missingIngredientsCount,
        }));

        // タブに応じてフィルタリング
        let filteredRecipes = convertedRecipes;
        if (activeTab.id === 'exact') {
          // 完全一致: マッチ率90%以上
          filteredRecipes = convertedRecipes.filter(r => (r.matchRate || 0) >= 80);
        } else if (activeTab.id === 'partial') {
          // 部分一致: マッチ率30%以上
          filteredRecipes = convertedRecipes.filter(r => (r.matchRate || 0) >= 30);
        } else if (activeTab.id === 'best-before') {
          // 賞味期限が近い食材を使うレシピ（今回は全て表示）
          filteredRecipes = convertedRecipes;
        }

        setRecommendedRecipes(filteredRecipes);
        setUserIngredients(data.userIngredients || []);
      } else {
        setRecommendedRecipes([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [activeTab.id, router]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/recipes/history');
      if (res.ok) {
        const data: DbRecipe[] = await res.json();
        const converted = data.map((recipe) => ({
          id: recipe.rakutenRecipeId || recipe.id.toString(),
          title: recipe.title,
          cookingTime: `${recipe.cookingTime} min`,
          imageUrl: recipe.imageUrl || '/placeholder-recipe.jpg',
          recipeUrl: recipe.rakutenRecipeUrl || undefined,
        }));
        setRecentlyViewedRecipes(converted);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data: DbRecipe[] = await res.json();
        const converted = data.map((recipe) => ({
          id: recipe.rakutenRecipeId || recipe.id.toString(),
          title: recipe.title,
          cookingTime: `${recipe.cookingTime} min`,
          imageUrl: recipe.imageUrl || '/placeholder-recipe.jpg',
          recipeUrl: recipe.rakutenRecipeUrl || undefined,
        }));
        setFavoriteRecipes(converted);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
    fetchHistory();
    fetchFavorites();
  }, [fetchRecipes, fetchHistory, fetchFavorites]);

  if (loading) return <Loading />;

  return (
    <div>
      <Header />
      {/* Main Content */}
      <main className="px-10 mt-20 sm:px-16 md:px-24 lg:px-40 py-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            おすすめ
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <Tabs
            tabOptions={tabOptions}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <Filter />

          {/* Recipe Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <RecipeSection
                key={index}
                title={section.title}
                recipes={section.recipes}
                likedRecipes={likedRecipes}
                setLikedRecipes={setLikedRecipes}
                fetchFavorites={fetchFavorites}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreshPlateRecipes;