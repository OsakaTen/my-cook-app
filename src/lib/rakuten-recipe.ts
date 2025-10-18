// 楽天レシピAPIのレスポンス型
export interface RakutenRecipe {
  recipeId: string
  recipeTitle: string
  recipeUrl: string
  foodImageUrl: string
  recipeMaterial: string[]
  recipeIndication: string // 調理時間
  recipeCost: string
  recipeDescription: string
}

export interface RakutenRecipeResponse {
  result: RakutenRecipe[]
}

// 楽天レシピAPI検索
export async function searchRakutenRecipes(keyword: string): Promise<RakutenRecipe[]> {
  const appId = process.env.RAKUTEN_APP_ID
  
  if (!appId) {
    throw new Error('RAKUTEN_APP_ID is not set')
  }

  try {
    const url = new URL('https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426')
    url.searchParams.append('applicationId', appId)
    url.searchParams.append('keyword', keyword)
    url.searchParams.append('format', 'json')

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes from Rakuten API')
    }

    const data: RakutenRecipeResponse = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Rakuten API error:', error)
    return []
  }
}

// 複数キーワードで検索
export async function searchRecipesByIngredients(
  ingredients: string[]
): Promise<RakutenRecipe[]> {
  const keyword = ingredients.join(' ')
  return searchRakutenRecipes(keyword)
}