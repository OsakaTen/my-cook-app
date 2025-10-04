"use client";

import Header from "@/components/Header";
import { DivideCircleIcon } from "lucide-react";
import { useState } from "react";


interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageUrl: string;
}

interface FilterOption {
  id: string;
  label: string;
  isActive: boolean;
}

type TabOption = {
  id: string;
  label: string;
};


// interface TabOption {
//   id: string;
//   label: string;
//   isActive: boolean;
// }

const FreshPlateRecipes: React.FC = () => {
  const [filters, setFilters] = useState<FilterOption[]>([
    { id: 'ingredients', label: '材料', isActive: false },
    { id: 'dietary', label: '系統', isActive: false },
    { id: 'difficulty', label: '難易度', isActive: false },
    { id: 'time', label: '調理時間', isActive: false },
  ]);

  const [activeTab, setActiveTab] = useState("partial");

  const tabOptions: TabOption[] = [
    { id: "exact", label: "完全一致" },
    { id: "partial", label: "部分一致" },
    { id: "best-before", label: "賞味期限が近い" },
  ];

  const [searchTerm, setSearchTerm] = useState<string>('');

  const recommendedRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Classic Tomato Pasta',
      cookingTime: '30 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD52_17pvcARjuqLuQGDP1QjkUkTKbvX9zPOQp81LfvxDATSBZsTLWj6NDIpoujmxefrdvBNYBgM4TmfwlqDNfMY39N9_raggmG6hKVxSGH4I229oz00EZ5pA2pePb5QihVKN7DJWt4FPpybLTSUSIbcUZr9jxBNJY3PLE7uyAgkC10S5HhDaLhLfejEJkIL8--WvRi1ja9UwAz_3sg9RWwo7lyvZO2yU6PMhxsZiNVbDVfYF6tppbLQSlufuIKGg_-rW0y5cpVVK_Y'
    },
    {
      id: '2',
      title: 'Quick Chicken Stir Fry',
      cookingTime: '20 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4vHPlCElih_4f-mMxuPdYLTi2IFXVmQcul1FZBJIiOauYd89Y07AsHI2EmXL10jSU9HmoTIthpZeuCgMNNypxIrv9xSzwpvo0WjxAbIFrWSZLXatMO-4xLc91h-e3XGoHdUMjIH-wdMn-Ojcw7N_rsIl9GqDkN13qwWkUcWWUpDN9UsV--XFG8zE7XARKLWg-6wx_ulXHctazV_ci1zgmKX1wPJ-Jol1W8WjsSWGT3_0oKPDboCgjyCYvXZY3zvIPxfPN1t9YumB'
    },
    {
      id: '3',
      title: 'Vegetable Curry',
      cookingTime: '45 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSJ1nMn3o-oYVWIfdQsSriRmpQ7JMTL973B--VZSFBgUIS2-wH-rgLOGkwvf1K4xvMGvYurcBPMDGKDcDi1uDHNUktsfmBu1tEw0_NBHLmBrmRXtiFNJarX6HiEGdOvw7MDnFjZ3gndywc7LQZYWkRk-GLsZqNot6BbSgmCxoIQRS1YjCJRLMQrsgACAhwDJIoiPRLXsjQzyroxSMmV42WGLJQ4YugLDQVS7c50gHGF25iUFO6axOaqR1t-4MdIsDVFgQ20sv-Iz5j'
    },
    {
      id: '4',
      title: 'Salmon with Roasted Veggies',
      cookingTime: '35 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB01qlROpvzHnXHUXECR-pF16GzOGURHTauB6z6zTO0OwOcrN1Rf_clK8bUaaEgDV0YSFMTr2wKw2wXczyYo0jri25-RDNe-UhWxafA4A3AIEY-VuGEUKKAWPANVnUs6VKf9MEkrTbEY0K2L5hfb5IgqNP0pEY6AaxMEGUSA5rgMpCyBH6-9TQrDoTC0jWY0JNM7lfBVhYT7J4Mx2I2V_aihHi3zzvRKDl6d2jEbh-C4SCmaSIast4xoihmUiIxKtex6l87oBUHl7lM'
    }
  ];

  const recentlyViewedRecipes: Recipe[] = [
    {
      id: '5',
      title: 'Hearty Beef Stew',
      cookingTime: '60 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5fLvh8lHLFeQOEwPuk6Hltbe7D7ksBTioQ7GPwOsuDRpSJxhqtZry8ArQHMd29GcF5j0-3qIRPw7_pJfS9xx0upuLCl1Fad0plfm4mOEeUuOWd45I_3EdJPP7uafocYGmTlQoACgmOYYgeZhYhntaVQj7uPFdS8JJ_49RoF3eUCBqfCCDecWdXuzqsGaslwpxX3kCCusndtcyofztspGgsw6ju6FDnKORj3feNfJm-uUop2F1u1LzS7XHQXS7lhbDNiHti9faCTZc'
    },
    {
      id: '6',
      title: 'Creamy Mushroom Risotto',
      cookingTime: '40 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh6367VOpEqfBi4nxqg8aTylQGkjMIb4q6KQyaD4Gpm5tpGZpbzvBRxERzh297hBXu_KmZ3r1MYcDI0YhbQHl5_xQxFwVaFW2dOoPCE8Iez9EYlFs73oZIQzu9CNv4iiryEGHaKjNi2On_7n8AQmZFGRSgl7iBXaJVibH6ngsR9--LlbGG4K_gDLde1tB2AelJGIDeUCCq26G4sOS2yTRCcf_z9eCDK5Qt1L3-W44YmOOr912o4rrF9-j0tpHD6ccOqwMwzdhLiR-M'
    },
    {
      id: '7',
      title: 'Spicy Tacos',
      cookingTime: '25 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbNYe42uX34D84BjtBamFrBLD_iiJz4qtU_ofVvgEkrkSZpdvoRUWchpVe0YCAOTsVeZlEjSvyOB3i3Un3ysvUJ3gndQkQucbpZ8yVadX2mksKgkIf3ieIldOLwF15zN-bd6FP1NO7abPiw5xF9gCri2cH4e8jQv6REW843LfnukrbHHbK-LZTVxLGg4IIFKfmJNJDk-yolJDO91crF89rRPuroXpWYKsTnwjV47DBgOv_OVWrEel3TPwafBVYQmRkuUFA9YHxH9Og'
    }
  ];

  const favoriteRecipes: Recipe[] = [
    {
      id: '8',
      title: 'Comforting Chicken Soup',
      cookingTime: '45 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpumo5frsAnJdFg7eO89S-0X4LyoJWPRN-j8X46EiC7se7rNwVUo8Aj_tDi0eDZDTLzshh1O4oXfC6P64O4AxIgD9AOxXl8-AFDQOHAE8APfLnNiXDLke-oRRUza9IxSwYkK1w5HzqpGTF17zPHm3x0Xc8DJ9hLnKN8ZG49eHAp7LBsxSG5DJhHVoSF2RMA2Nhw4w5LnyUv2qDe6yfMjr5pCXcoNuqAE6YRqjHZYdLa0YJZflEBbpvh6WSt--qeBP-IGUMA9iQQqml'
    },
    {
      id: '9',
      title: 'Fresh Garden Salad',
      cookingTime: '15 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsF9xIxvTvJOIHPbClg_0OdMycQIx7IHY5V4530haGLvCUvdDz4jJySZ0iirpgDjJp8pjvPF7R0st8fJddBXsp3xdUiP26GCi1Daec1CdyT_I6xeKp8ElV959CmRpmTvjHrJx8Lcq4U6bSCHl4UZfISssMi9H90YZhLCnBXUqCMYAkR2SAMXF7dS3M4jZYB9LaKCReEfeTdLReIMpwsZ6XUsLIgCL70KgcHV3FdI8_bQkfbtDLLvKaWFEeLaFesh89NwgrhizCBr4'
    },
    {
      id: '10',
      title: 'Refreshing Fruit Smoothie',
      cookingTime: '10 min',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqgI81wODKTvCW-q-z1nUnm7h6h6ttBFxn-O99MP7UFDrOEQoaCebO50fTVss_bCDmqidZmNEZCEKfizVH7vARsMxMO-0b3nQJzOfw-KQVTwqIaheAhyiQvGTDCxkPpCgc2o4VkPQEEYDNAHNpjRhL2dbKw_2JjZ0uDcIXydm1kPiZL2shrPSR5SnQcPwz5P3XM7zPUco4pdjsUtceMACh19n3i5MzK654RnWKttqmHEYXLkiDxg6pa1vNUw21OQfA2dwiR6x5ZzIf'
    }
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
                  className={`py-4 px-1 inline-flex items-center gap-2 text-sm font-medium border-b-2 ${activeTab === tab.id
                      ? 'text-green-500 border-green-500'
                      : 'text-gray-500 hover:text-green-500 border-transparent'
                    }`}
                  onClick={() => setActiveTab(tab.id)} // ←クリックで state 更新
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filter</h3>
            <div className="flex flex-wrap gap-3">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter.isActive
                      ? 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-800/5 dark:bg-gray-100/5 text-gray-700 dark:text-gray-300 hover:bg-green-500/20 dark:hover:bg-green-500/30'
                    }`}
                >
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Sections */}
          <div className="space-y-12">
            <RecipeSection title="冷蔵庫から作れる料理" recipes={recommendedRecipes} />
            <RecipeSection title="最近確認した料理" recipes={recentlyViewedRecipes} />
            <RecipeSection title="お気に入り" recipes={favoriteRecipes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreshPlateRecipes;