import RecipeCard from "./RecipeCard";
import { Recipe } from "../types";

interface Props {
  title: string;
  recipes: Recipe[];
  likedRecipes?: { [id: string]: boolean };
  setLikedRecipes?: React.Dispatch<React.SetStateAction<{ [id: string]: boolean }>>;
  fetchFavorites?: () => Promise<void>;
}

const RecipeSection: React.FC<Props> = ({
  title,
  recipes,
  likedRecipes = {},
  setLikedRecipes,
  fetchFavorites,
}) => {
  const toggleLike = async (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!setLikedRecipes || !fetchFavorites) return;
    const newLiked = !likedRecipes[recipe.id];
    setLikedRecipes((prev) => ({ ...prev, [recipe.id]: newLiked }));

    try {
      const method = newLiked ? "POST" : "DELETE";
      const url = newLiked ? "/api/favorites" : `/api/favorites/${recipe.id}`;
      const body = newLiked
        ? JSON.stringify({
            rakutenRecipeId: String(recipe.id),
            title: recipe.title,
            imageUrl: recipe.imageUrl,
            cookingTime: recipe.cookingTime.replace(/[^\d]/g, ""),
            recipeUrl: recipe.recipeUrl,
          })
        : undefined;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      await fetchFavorites();
    } catch (err) {
      console.error("Failed to update favorite:", err);
      setLikedRecipes((prev) => ({ ...prev, [recipe.id]: !newLiked }));
    }
  };

  return (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {recipes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">レシピが見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isLiked={likedRecipes[recipe.id] || false}
              toggleLike={toggleLike}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipeSection;
