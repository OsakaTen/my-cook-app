"use client";

import Header from "@/components/Header";
import Filter from "./components/FilterSection";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";



interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageUrl: string;
  recipeUrl?: string;
  matchRate?: number;
  matchedIngredients?: string[];
  missingIngredientsCount?: number;
}

interface ApiRecipe {
  recipeId: string;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeIndication: string;
  matchedIngredients: string[];
  matchRate: number;
  missingIngredientsCount: number;
}

type TabOption = {
  id: string;
  label: string;
};


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

  const tabOptions: TabOption[] = [
    { id: "exact", label: "完全一致" },
    { id: "partial", label: "部分一致" },
    { id: "best-before", label: "賞味期限が近い" },
  ];

  useEffect(() => {
    fetchRecipes();
  }, [activeTab]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recipes/suggestions');

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('レシピの取得に失敗しました');
      }

      const data = await response.json();

      if (data.recipes && data.recipes.length > 0) {
        // 楽天APIのレシピを変換
        const convertedRecipes: Recipe[] = data.recipes.map((recipe: ApiRecipe) => ({
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
          filteredRecipes = convertedRecipes.filter(r => (r.matchRate || 0) >= 90);
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
  };

  const toggleLike = async (id: string) => {
    const newLikedState = !likedRecipes[id];

    setLikedRecipes((prev) => ({
      ...prev,
      [id]: newLikedState, // 押されたIDだけ反転
    }));

    try {
      if (newLikedState) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: id }),
        });
      } else {
        await fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const isLiked = likedRecipes[recipe.id] || false;

    const handleCardClick = () => {
      if (recipe.recipeUrl) {
        window.open(recipe.recipeUrl, '_blank');
      }
    };

    return (
      <div className="recip-card group rounded-lg cursor-pointer overflow-hidden" onClick={handleCardClick}>
        <div className="relative">
          <Image
            alt="料理名"
            width={500}
            height={160}
            className="w-full h-40 object-cover"
            src={recipe.imageUrl}
          />
          {recipe.matchRate !== undefined && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {recipe.matchRate}% マッチ
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-800 group-hover:text-green-500">
            {recipe.title}
          </h4>

          {recipe.matchedIngredients && recipe.matchedIngredients.length > 0 && (
            <div className="mt-2 mb-2">
              <p className="text-xs font-semibold text-green-600 mb-1">
                使える食材:
              </p>
              <div className="flex flex-wrap gap-1">
                {recipe.matchedIngredients.slice(0, 3).map((ingredient, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                  >
                    {ingredient}
                  </span>
                ))}
                {recipe.matchedIngredients.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{recipe.matchedIngredients.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 mt-1">{recipe.cookingTime}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(recipe.id);
              }}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Heart
                size={22}
                className={`${isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                  } transition-colors duration-200`}
              />
            </button>
          </div>
          {recipe.missingIngredientsCount !== undefined && recipe.missingIngredientsCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              不足している材料: {recipe.missingIngredientsCount}個
            </p>
          )}
        </div>
      </div>
    );
  };

  const RecipeSection: React.FC<{ title: string; recipes: Recipe[] }> = ({ title, recipes }) => (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div> */}
      {recipes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">レシピが見つかりませんでした</p>
          <p className="text-sm text-gray-500 mt-2">
            フィルターを変更するか、冷蔵庫に食材を追加してください
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div>
        <Header />
        <main className="px-10 mt-20 sm:px-16 md:px-24 lg:px-40 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">レシピを検索中...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      {/* Main Content */}
      <main className="px-10 mt-20 sm:px-16 md:px-24 lg:px-40 py-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            おすすめ
          </h2>
          {userIngredients.length > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              あなたの冷蔵庫: {userIngredients.join(', ')}
            </p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-green-500/20 mb-6">
            <nav className="flex gap-8">
              {tabOptions.map(tab => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 inline-flex items-center gap-2 text-sm font-medium border-b-2 ${activeTab.id === tab.id
                    ? 'text-green-500 border-green-500'
                    : 'text-gray-500 hover:text-green-500 border-transparent'
                    }`}
                  onClick={() => setActiveTab(tab)} // ←クリックで state 更新
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <Filter />

          {/* Recipe Sections */}
          <div className="space-y-12">
            <RecipeSection title={`冷蔵庫から作れる料理 (${activeTab.label})`} recipes={recommendedRecipes} />
            <RecipeSection title="最近確認した料理" recipes={recentlyViewedRecipes} />
            <RecipeSection title="お気に入り" recipes={favoriteRecipes} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreshPlateRecipes;