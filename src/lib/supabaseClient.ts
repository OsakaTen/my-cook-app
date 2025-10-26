// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// .env.local に設定している環境変数を読み込み
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントを生成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);



