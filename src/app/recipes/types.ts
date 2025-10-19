export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageUrl: string;
  recipeUrl?: string;
  matchRate?: number;
  matchedIngredients?: string[];
  missingIngredientsCount?: number;
}

// DBから取得するレシピの型
export interface DbRecipe {
  id: number;
  rakutenRecipeId: string | null;
  title: string;
  cookingTime: number;
  imageUrl: string | null;
  rakutenRecipeUrl: string | null;
}

export interface ApiRecipe {
  recipeId: string;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeIndication: string;
  matchedIngredients: string[];
  matchRate: number;
  missingIngredientsCount: number;
}

export type TabOption = {
  id: string;
  label: string;
};