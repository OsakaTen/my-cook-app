import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!;

// 楽天レシピAPIからカテゴリを取得
async function fetchCategories() {
  const response = await fetch(
    `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${RAKUTEN_APP_ID}`
  );

  if (!response.ok) {
    throw new Error(`楽天APIリクエストに失敗しました: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    result?: {
      large?: any[];
      medium?: any[];
      small?: any[];
    };
  };

  if (!data.result) {
    throw new Error('APIレスポンスに result が存在しません');
  }

  // 3階層すべてを1つの配列にまとめる
  const categories = [
    ...(data.result.large || []),
    ...(data.result.medium || []),
    ...(data.result.small || []),
  ];

  return categories;
}

// Prismaに保存
async function main() {
  console.log('📥 楽天APIからカテゴリ取得中...');
  const categories = await fetchCategories();
  console.log(`📊 ${categories.length}件のカテゴリを処理しました`);

  console.log('💾 Supabaseに保存中...');

  for (const c of categories) {
    try {
      // null/undefinedを除去して整形
      const cleanData = {
        categoryId: c.categoryId?.toString() ?? '', // Prismaがstringなら統一
        categoryName: c.categoryName ?? '不明カテゴリ',
        categoryUrl: c.categoryUrl ?? '',
        parentCategoryId: c.parentCategoryId
          ? c.parentCategoryId.toString()
          : null,
      };

      // categoryId が空ならスキップ
      if (!cleanData.categoryId) {
        console.warn('⚠️ categoryIdが空のためスキップ:', c);
        continue;
      }

      await prisma.recipeCategory.upsert({
        where: { categoryId: cleanData.categoryId },
        update: cleanData,
        create: cleanData,
      });
    } catch (err) {
      console.error('❌ 個別エラー発生:', err);
      console.error('問題のデータ:', c);
    }
  }

  console.log('✅ カテゴリ同期が完了しました！');
}

// 実行
main()
  .catch((err) => {
    console.error('❌ 全体エラーが発生しました:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
