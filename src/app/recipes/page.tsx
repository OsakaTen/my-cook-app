"use client";

import Header from "@/components/Header";
import Filter from "./components/FilterSection";
import Footer from "@/components/Footer";
import { DivideCircleIcon } from "lucide-react";
import { useState } from "react";


interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageUrl: string;
}

type TabOption = {
  id: string;
  label: string;
};


const FreshPlateRecipes: React.FC = () => {
  const [activeTab, setActiveTab] = useState({ id: "partial", label: "部分一致" });
  const tabOptions: TabOption[] = [
    { id: "exact", label: "完全一致" },
    { id: "partial", label: "部分一致" },
    { id: "best-before", label: "賞味期限が近い" },
  ];

  const recommendedRecipes: Recipe[] = [
    {
      id: '1',
      title: 'トマトスパゲッティ',
      cookingTime: '30 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD52_17pvcARjuqLuQGDP1QjkUkTKbvX9zPOQp81LfvxDATSBZsTLWj6NDIpoujmxefrdvBNYBgM4TmfwlqDNfMY39N9_raggmG6hKVxSGH4I229oz00EZ5pA2pePb5QihVKN7DJWt4FPpybLTSUSIbcUZr9jxBNJY3PLE7uyAgkC10S5HhDaLhLfejEJkIL8--WvRi1ja9UwAz_3sg9RWwo7lyvZO2yU6PMhxsZiNVbDVfYF6tppbLQSlufuIKGg_-rW0y5cpVVK_Y'
    },
  ];

  const recentlyViewedRecipes: Recipe[] = [
    {
      id: '5',
      title: 'ビーフシチュー',
      cookingTime: '60 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5fLvh8lHLFeQOEwPuk6Hltbe7D7ksBTioQ7GPwOsuDRpSJxhqtZry8ArQHMd29GcF5j0-3qIRPw7_pJfS9xx0upuLCl1Fad0plfm4mOEeUuOWd45I_3EdJPP7uafocYGmTlQoACgmOYYgeZhYhntaVQj7uPFdS8JJ_49RoF3eUCBqfCCDecWdXuzqsGaslwpxX3kCCusndtcyofztspGgsw6ju6FDnKORj3feNfJm-uUop2F1u1LzS7XHQXS7lhbDNiHti9faCTZc'
    },
  ];

  const favoriteRecipes: Recipe[] = [
    {
      id: '8',
      title: '鶏ガラスープ',
      cookingTime: '45 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpumo5frsAnJdFg7eO89S-0X4LyoJWPRN-j8X46EiC7se7rNwVUo8Aj_tDi0eDZDTLzshh1O4oXfC6P64O4AxIgD9AOxXl8-AFDQOHAE8APfLnNiXDLke-oRRUza9IxSwYkK1w5HzqpGTF17zPHm3x0Xc8DJ9hLnKN8ZG49eHAp7LBsxSG5DJhHVoSF2RMA2Nhw4w5LnyUv2qDe6yfMjr5pCXcoNuqAE6YRqjHZYdLa0YJZflEBbpvh6WSt--qeBP-IGUMA9iQQqml'
    },
  ];

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <div className="group cursor-pointer">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url("${recipe.imageUrl}")` }}
      />
      <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-500">
        {recipe.title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {recipe.cookingTime}
      </p>
    </div>
  );

  const RecipeSection: React.FC<{ title: string; recipes: Recipe[] }> = ({ title, recipes }) => (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );

  return (
    <div>
      <Header />
      {/* Main Content */}
      <main className="px-10 mt-20 sm:px-16 md:px-24 lg:px-40 py-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            おすすめ
          </h2>

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