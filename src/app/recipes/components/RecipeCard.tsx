import Image from "next/image";
import { Heart } from "lucide-react";
import { Recipe } from "../types";

interface Props {
  recipe: Recipe;
  isLiked: boolean;
  toggleLike: (recipe: Recipe, e: React.MouseEvent) => void;
}

const RecipeCard: React.FC<Props> = ({ recipe, isLiked, toggleLike }) => {
  const handleClick = async () => {
    try {
      const cookingTime = recipe.cookingTime.replace(/[^\d]/g, "");
      await fetch("/api/recipes/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rakutenRecipeId: String(recipe.id),
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          cookingTime: cookingTime || "30",
          recipeUrl: recipe.recipeUrl,
        }),
      });
    } catch (e) {
      console.error("Failed to save view history:", e);
    }

    if (recipe.recipeUrl) window.open(recipe.recipeUrl, "_blank");
  };

  return (
    <div
      className="recip-card group rounded-lg cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
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

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">{recipe.cookingTime}</p>
          <button
            onClick={(e) => toggleLike(recipe, e)}
            className="transition-transform duration-200 hover:scale-110"
          >
            <Heart
              size={22}
              className={`${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                } transition-colors duration-200`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
