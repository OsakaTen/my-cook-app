import { createClient } from "@supabase/supabase-js";//supabase、createClientインポート

//環境変数の読み込み
//.env.local.よりSUPABASE_URLをstringとして読み込み、supabaseUrlに格納
const supabaseUrl = process.env.SUPABASE_URL as string;
//.env.local.よりSUPABASE_ANON_KEYをstringとして読み込み、supabaseAnonKeyに格納
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

//supabaseUrl, supabaseAnonKeyを引数にsupabaseクライアントを生成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type FoodCategory = 
  | '野菜'
  | '果物'
  | '肉'
  | '魚'
  | '乳製品'
  | '飲料'
  | '調味料'
  | 'その他';

// 食材の状態
export type FoodStatus =
  | '新鮮'
  | 'まもなく期限切れ'
  | '期限切れ'

  // 型定義: ユーザー
export type User = {
  id: number            // ユーザーID
  name: string          // ユーザー名
  email: string         // メールアドレス
  foodItems?: FoodItem[] // ユーザーが登録した食材一覧
  createdAt?: string    // 登録日時
  updatedAt?: string    // 更新日時
}

// 型定義: 冷蔵庫
export type Fridge = {
  id: number            // 冷蔵庫ID
  name: string          // 冷蔵庫の名前（例: "自宅用", "研究室用"）
  foodItems?: FoodItem[] // 冷蔵庫に入っている食材一覧
  createdAt?: string    // 登録日時
  updatedAt?: string    // 更新日時
}

// 型定義
export type FoodItem = {
  id: number;  // 食材ID
  name: string;  // 食材名
  quantity: string;  // 数量（例: "2個", "500g"）
  expiryDate: string;  // 賞味期限 (ISO文字列)
  category: FoodCategory;  // カテゴリ
  status: '新鮮' | 'まもなく期限切れ' | '期限切れ'; // 状態
  fridgeId?: number | null; // 冷蔵庫ID（拡張用）
  userId?: number | null;   // ユーザーID（拡張用）
  createdAt?: string;  // 登録日時
  updatedAt?: string;  // 更新日時
};
