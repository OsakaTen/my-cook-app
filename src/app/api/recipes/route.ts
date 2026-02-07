// import { NextResponse } from 'next/server';

// type Recipe = {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   time: string;
//   calories: string;
// };

// // 楽天APIから返ってくる可能性のあるフィールドを定義
// interface RakutenApiItem {
//   recipeId?: number | string;
//   recipe_id?: number | string;
//   contentId?: string;
//   id?: string;
//   recipe?: {
//     recipeId?: number | string;
//     recipeTitle?: string;
//     foodImageUrl?: string;
//     cookingTime?: string;
//     calorie?: string;
//   };
//   recipeTitle?: string;
//   recipe_title?: string;
//   title?: string;
//   recipeMaterial?: string;
//   description?: string;
//   recipe_description?: string;
//   summary?: string;
//   foodImageUrl?: string;
//   imageUrl?: string;
//   photo?: string;
//   recipeIndicationTime?: string;
//   cookingTime?: string;
//   time?: string;
//   recipeCalorie?: string;
//   calories?: string;
//   calorie?: string;
// }

// const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || '';
// const RAKUTEN_RANKING_ENDPOINT =
//   process.env.RAKUTEN_RANKING_ENDPOINT ||
//   'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426';
// const RAKUTEN_SEARCH_ENDPOINT =
//   process.env.RAKUTEN_SEARCH_ENDPOINT ||
//   'https://app.rakuten.co.jp/services/api/Recipe/CategorySearch/20170426';

// // ✅ any を RakutenApiItem に置き換え
// function mapRakutenItemToRecipe(item: RakutenApiItem): Recipe {
//   const id =
//     item.recipeId ||
//     item.recipe_id ||
//     item.contentId ||
//     item.id ||
//     item.recipe?.recipeId ||
//     String(Math.random());

//   const title =
//     item.recipeTitle ||
//     item.recipe_title ||
//     item.title ||
//     item.recipe?.recipeTitle ||
//     '';

//   const description =
//     item.recipeMaterial ||
//     item.description ||
//     item.recipe_description ||
//     item.summary ||
//     '';

//   const image =
//     item.foodImageUrl ||
//     item.recipe?.foodImageUrl ||
//     item.imageUrl ||
//     item.photo ||
//     '';

//   const time =
//     item.recipeIndicationTime ||
//     item.cookingTime ||
//     item.time ||
//     item.recipe?.cookingTime ||
//     '';

//   const calories =
//     item.recipeCalorie ||
//     item.calories ||
//     item.calorie ||
//     item.recipe?.calorie ||
//     '';

//   return {
//     id: String(id),
//     title,
//     description,
//     image,
//     time,
//     calories,
//   };
// }

// export async function GET(request: Request) {
//   const url = new URL(request.url);
//   const page = url.searchParams.get('page') || '1';
//   const hits = url.searchParams.get('hits') || '8';
//   const ingredients = url.searchParams.get('ingredients');
//   const cuisines = url.searchParams.get('cuisines');
//   const difficulty = url.searchParams.get('difficulty');
//   const cooking_time = url.searchParams.get('cooking_time');
//   const hasFilters = url.searchParams.get('hasFilters') === '1';

//   try {
//     if (!RAKUTEN_APP_ID) {
//       console.warn('RAKUTEN_APP_ID is not set. Returning empty array.');
//       return NextResponse.json([], { status: 200 });
//     }

//     if (!hasFilters) {
//       const rankingUrl = new URL(RAKUTEN_RANKING_ENDPOINT);
//       rankingUrl.searchParams.set('applicationId', RAKUTEN_APP_ID);
//       rankingUrl.searchParams.set('format', 'json');
//       rankingUrl.searchParams.set('categoryId', '10-276');
//       rankingUrl.searchParams.set('hits', String(hits));

//       const r = await fetch(rankingUrl.toString());
//       if (!r.ok) {
//         console.error('Rakuten ranking fetch failed:', r.status);
//         return NextResponse.json([], { status: 500 });
//       }

//       const data = await r.json();

//       // ✅ any[] を RakutenApiItem[] に置き換え
//       let items: RakutenApiItem[] = [];
//       if (Array.isArray(data.result)) items = data.result;
//       else if (Array.isArray(data.recipes)) items = data.recipes;
//       else if (Array.isArray(data.result?.recipes)) items = data.result.recipes;
//       else if (Array.isArray(data.items)) items = data.items;
//       else if (Array.isArray(data.ranking)) items = data.ranking;
//       else items = [];

//       const mapped = items.map(mapRakutenItemToRecipe);
//       return NextResponse.json(mapped);
//     } else {
//       const searchUrl = new URL(RAKUTEN_SEARCH_ENDPOINT);
//       searchUrl.searchParams.set('applicationId', RAKUTEN_APP_ID);
//       searchUrl.searchParams.set('format', 'json');
//       searchUrl.searchParams.set('page', String(page));
//       searchUrl.searchParams.set('hits', String(hits));

//       if (ingredients) searchUrl.searchParams.set('keyword', ingredients);
//       if (cuisines) searchUrl.searchParams.set('genre', cuisines);
//       if (difficulty) searchUrl.searchParams.set('difficulty', difficulty);
//       if (cooking_time) searchUrl.searchParams.set('cooking_time', cooking_time);

//       const r = await fetch(searchUrl.toString());
//       if (!r.ok) {
//         console.error('Rakuten search fetch failed:', r.status);
//         return NextResponse.json([], { status: 500 });
//       }

//       const data = await r.json();

//       let items: RakutenApiItem[] = [];
//       if (Array.isArray(data.result?.recipes)) items = data.result.recipes;
//       else if (Array.isArray(data.recipes)) items = data.recipes;
//       else if (Array.isArray(data.items)) items = data.items;
//       else if (Array.isArray(data.ResultSet?.Result)) items = data.ResultSet.Result;
//       else items = [];

//       const mapped = items.map(mapRakutenItemToRecipe);
//       return NextResponse.json(mapped);
//     }
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'server error' }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  calories: string;
};

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "";
const RAKUTEN_RANKING_ENDPOINT =
  process.env.RAKUTEN_RANKING_ENDPOINT ||
  "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426";
const RAKUTEN_SEARCH_ENDPOINT =
  process.env.RAKUTEN_SEARCH_ENDPOINT ||
  "https://app.rakuten.co.jp/services/api/Recipe/CategorySearch/20170426";

function mapRakutenItemToRecipe(item: any): Recipe {
  const id =
    item.recipeId ||
    item.recipe_id ||
    item.contentId ||
    item.id ||
    (item.recipe && item.recipe.recipeId) ||
    String(Math.random());

  const title =
    item.recipeTitle ||
    item.recipe_title ||
    item.title ||
    (item.recipe && item.recipe.recipeTitle) ||
    "";

  const description =
    item.recipeMaterial ||
    item.description ||
    item.recipe_description ||
    item.summary ||
    "";

  const image =
    (item.foodImageUrl && item.foodImageUrl) ||
    (item.recipe && item.recipe.foodImageUrl) ||
    item.imageUrl ||
    item.photo ||
    "";

  const time =
    item.recipeIndicationTime ||
    item.cookingTime ||
    item.time ||
    (item.recipe && item.recipe.cookingTime) ||
    "";

  const calories =
    item.recipeCalorie ||
    item.calories ||
    item.calorie ||
    (item.recipe && item.recipe.calorie) ||
    "";

  return {
    id: String(id),
    title,
    description,
    image,
    time,
    calories,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const hits = url.searchParams.get("hits") || "8";
  const categoryId = url.searchParams.get("categoryId"); // カテゴリ指定（ランキングAPIで使用）
  const ingredients = url.searchParams.get("ingredients");
  const cuisines = url.searchParams.get("cuisines");
  const difficulty = url.searchParams.get("difficulty");
  const cooking_time = url.searchParams.get("cooking_time");
  const hasFilters = url.searchParams.get("hasFilters") === "1";

  try {
    if (!RAKUTEN_APP_ID) {
      console.warn("RAKUTEN_APP_ID is not set. Returning empty array.");
      return NextResponse.json([], { status: 200 });
    }

    // カテゴリ指定またはフィルタ無しはランキングAPIを使う（カテゴリがあればそのカテゴリのランキング）
    if (!hasFilters) {
      const rankingUrl = new URL(RAKUTEN_RANKING_ENDPOINT);
      rankingUrl.searchParams.set("applicationId", RAKUTEN_APP_ID);
      rankingUrl.searchParams.set("format", "json");
      rankingUrl.searchParams.set("hits", String(hits));
      if (categoryId) rankingUrl.searchParams.set("categoryId", categoryId);

      const r = await fetch(rankingUrl.toString());
      if (!r.ok) {
        console.error("Rakuten ranking fetch failed:", r.status);
        return NextResponse.json([], { status: 500 });
      }
      const data = await r.json();

      // 楽天のレスポンス構造は API によるので複数候補を試す
      let items: any[] = [];
      if (Array.isArray(data.result)) items = data.result;
      else if (Array.isArray(data.recipes)) items = data.recipes;
      else if (Array.isArray(data.result?.recipes)) items = data.result.recipes;
      else if (Array.isArray(data.items)) items = data.items;
      else if (Array.isArray(data.ranking)) items = data.ranking;
      else items = [];

      const mapped = items.map(mapRakutenItemToRecipe);
      // 必要なら slice(0, hits) で件数制限
      return NextResponse.json(mapped.slice(0, Number(hits)));
    } else {
      // フィルタあり → 検索 API を利用（page/hits を渡す）
      const searchUrl = new URL(RAKUTEN_SEARCH_ENDPOINT);
      searchUrl.searchParams.set("applicationId", RAKUTEN_APP_ID);
      searchUrl.searchParams.set("format", "json");
      searchUrl.searchParams.set("page", String(page));
      searchUrl.searchParams.set("hits", String(hits));

      if (ingredients) searchUrl.searchParams.set("keyword", String(ingredients));
      if (cuisines) searchUrl.searchParams.set("genre", String(cuisines));
      if (difficulty) searchUrl.searchParams.set("difficulty", String(difficulty));
      if (cooking_time) searchUrl.searchParams.set("cooking_time", String(cooking_time));

      const r = await fetch(searchUrl.toString());
      if (!r.ok) {
        console.error("Rakuten search fetch failed:", r.status);
        return NextResponse.json([], { status: 500 });
      }
      const data = await r.json();

      let items: any[] = [];
      if (Array.isArray(data.result?.recipes)) items = data.result.recipes;
      else if (Array.isArray(data.recipes)) items = data.recipes;
      else if (Array.isArray(data.items)) items = data.items;
      else if (Array.isArray(data.ResultSet?.Result)) items = data.ResultSet.Result;
      else items = [];

      const mapped = items.map(mapRakutenItemToRecipe);
      return NextResponse.json(mapped);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}