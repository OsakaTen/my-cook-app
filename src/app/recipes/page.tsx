'use client'

import Header from "@/components/Header";
import { useState, useTransition } from 'react'
import Image from 'next/image'

interface Recipe {
  recipeId: string
  recipeTitle: string
  recipeUrl: string
  foodImageUrl: string
  recipeMaterial: string[]
  recipeDescription: string
  matchScore?: number
}

interface SearchResult {
  success: boolean
  message: string
  recipes: Recipe[]
  categoriesSearched?: number
}


export default function SettingsPage() {
   const [ingredients, setIngredients] = useState<string[]>(['エビ'])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSearch = () => {
    const validIngredients = ingredients.filter(ing => ing.trim() !== '')
    
    if (validIngredients.length === 0) {
      setMessage('食材を入力してください')
      return
    }

   startTransition(async () => {
      try {
        const response = await fetch('/api/recipes/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: validIngredients
          })
        })

        const result: SearchResult = await response.json()

        if (result.success) {
          console.log(result)
          setRecipes(result.recipes)
          setMessage(result.message)
        } else {
          setMessage(result.message)
          setRecipes([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setMessage('エラーが発生しました。もう一度お試しください。')
        setRecipes([])
      }
    })
  }


  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold">recipesページ</h1>
      <p>ここにフォームを作る</p>

      <button
            onClick={handleSearch}
            disabled={isPending}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? '検索中...' : '検索'}
          </button>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image
                src={recipe.foodImageUrl}
                alt={recipe.recipeTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {recipe.recipeTitle}
                </h3>
                {recipe.matchScore && recipe.matchScore > 1 && (
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mb-2">
                    {recipe.matchScore}個の食材マッチ
                  </span>
                )}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {recipe.recipeDescription}
                </p>
                <a
                  href={recipe.recipeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  レシピを見る
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



