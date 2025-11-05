/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from "react";
import SearchBar from '../components/SearchBar';
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import './globals.css'
import Image from 'next/image'
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface Item {
  id: number;
  name: string;
}

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, buttonText, href }) => {
    return (
      <div className="step-card">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <span className=" text-red-400">{icon}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description} </p>
        <Link
          href={href}
          className="bg-red-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-500 transition-colors text-lg"
        >
          {buttonText}
        </Link>
      </div>
    );
  };

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 認証状態の確認
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) return <Loading />;

  return (
    <div className="app">
      <Header />
      <section className="relative w-full min-h-screen">
        <Image
          src="/brooke-lark-4J059aGa5s4-unsplash.jpg"
          alt="背景画像"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          quality={100}
        />
        {/* 文字部分 */}
        <div className="absolute top-[18.75rem] left-[9.375rem] text-amber-50 z-10">
          <h1 className="text-3xl">余り物が、アイデアに変わる</h1>
          <p className="pt-4 text-amber-50 text-xl">
            「今日も何を作ろう...」そんな悩みを抱えていませんか？<br />
            余り物から生まれる新しいレシピで料理の楽しさを再発見しよう
          </p>
          <div className="mt-5">
            {user ? (
              // ログイン済みの場合
              <>
                <h2 className="text-3xl mb-8">まずは食材管理に食材を入れてみよう</h2>
                <Link
                  href="/inventory"
                  className="ml-35 px-4 py-2 cursor-pointer text-2xl rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500 transition-colors"
                >
                  在庫を追加
                </Link>
              </>
            ) : (
              // 未ログインの場合
              <>
                <h2 className="text-3xl mb-8">まずは無料で始めてみよう</h2>
                <div className="flex gap-4">
                  <Link
                    href="/auth/signup"
                    className="px-6 py-3 cursor-pointer text-2xl rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500 transition-colors"
                  >
                    新規登録
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-6 py-3 cursor-pointer text-2xl rounded-lg bg-white text-red-400 font-semibold hover:bg-gray-100 transition-colors"
                  >
                    ログイン
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <main className="mx-auto p-8 py-16">
        <SearchBar />
        <section className="text-center mb-12 mt-30">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">まずは3ステップで始めよう</h2>
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <StepCard
              icon="#"
              title="1. 食材管理"
              description="手動入力で在庫を簡単登録。食材の賞味期限も管理できます。"
              buttonText="在庫を追加"
              href={user ? "/inventory" : "/auth/signup"}
            />
            <StepCard
              icon="#"
              title="2. レシピを提案"
              description="冷蔵庫の中にある食材や、気分で作れるレシピを提案します。"
              buttonText="レシピを探す"
              href={user ? "/recipes" : "/auth/signup"}
            />
            <StepCard
              icon="#"
              title="3. お気に入りに追加"
              description="よく作るレシピはすぐ見れるようにコレクションに登録。"
              buttonText="お気に入りを見る"
              href={user ? "/favorites" : "/auth/signup"}
            />
          </div>
          {!user && (
            <p className="mt-8 text-gray-600">
              ※これらの機能を使うには
              <Link href="/auth/signup" className="text-red-400 font-semibold hover:underline">
                無料登録
              </Link>
              が必要です
            </p>
          )}
        </section>
        <section className="bg-gray-50 py-16 px-4 rounded-lg my-30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">みんなでごはんを決めよう</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              新しいグループ機能で、家族や友人、パートナーと今日の晩ごはんを簡単に決められます。グループで足りない食材を共有し、買い物リストを作成して、毎日の料理をもっと楽しく、もっと便利に。
            </p>
            <div className="flex justify-center items-center space-x-8 mb-10">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="text-red-400 text-4xl">#</span>
                </div>
                <span className="font-semibold text-gray-700">グループ作成</span>
              </div>
              <div className="text-gray-300 text-4xl">→</div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="text-red-400 text-4xl">#</span>
                </div>
                <span className="font-semibold text-gray-700">晩ごはんの決定</span>
              </div>
              <div className="text-gray-300 text-4xl">→</div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
                  <span className="text-red-400 text-4xl">#</span>
                </div>
                <span className="font-semibold text-gray-700">買い物リスト</span>
              </div>
            </div>
            <Link
              href={user ? "/groups" : "/auth/signup"}
              className="bg-red-400 text-white px-8 py-3 rounded-full font-bold hover:bg-red-500 transition-colors text-lg inline-block"
            >
              {user ? "グループ機能を試す" : "無料登録してグループ機能を試す"}
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">今日のピックアップレシピ</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="recip-card rounded-lg">
                <div className="w-full h-40 bg-gray-200 rounded-t-lg" />
                <div className="p-4">
                  <h3 className="font-bold">料理名</h3>
                  <p className="text-sm text-gray-600 mt-1">おいしい</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;