import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  // どのボタンが選択されているかを管理
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  // 検索欄に表示されている文字列
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ingredients: string[] = [
    '牛肉', '豚肉', '鶏肉', '玉ねぎ', 'じゃがいも',
    'にんじん', 'トマト', '卵', '牛乳'
  ]

  const handleIngredientClick = (ingredient: string) => {
    const currentItems = searchQuery
      .split(" ")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    let newItems: string[];

    if (currentItems.includes(ingredient)) {
      newItems = currentItems.filter(item => item !== ingredient);
    } else {
      newItems = [...currentItems, ingredient];
    }

    const newSelectedIngredients = ingredients.filter(ing => newItems.includes(ing));
    setSelectedIngredients(newSelectedIngredients);

    setSearchQuery(newItems.join(" "));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    const currentItems = newValue
      .split(' ')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const newSelectedIngredients = ingredients.filter(ing => currentItems.includes(ing));
    setSelectedIngredients(newSelectedIngredients);
  }

  return (
    <div className="flex items-center flex-col mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">どんな料理をお探しですか</h2>
      <section>
        <div className="flex flex-wrap justify-center gap-4">
          {ingredients.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => handleIngredientClick(ingredient)}
              className={`px-5 py-2 rounded-full border 
                ${selectedIngredients.includes(ingredient)
                  ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </section>
      < input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        className="mt-5 min-w-[700px] focus:outline-none"
        placeholder="食材を入れてみよう"
      />
    </div>
  );
}

export default SearchBar;

