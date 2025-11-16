// /* eslint-disable @next/next/no-img-element */
// 'use client';

// import React, { useState, useEffect } from "react";
// import SearchBar from '../components/SearchBar';
// import Header from "@/components/Header";
// import Loading from "@/components/Loading";
// import Footer from "@/components/Footer";
// import './globals.css'
// import Image from 'next/image'
// import Link from "next/link";
// import { createClient } from '@/lib/supabase/client';
// import type { User } from '@supabase/supabase-js';

// export interface Item {
//   id: number;
//   name: string;
// }

// interface StepCardProps {
//   icon: string;
//   title: string;
//   description: string;
//   buttonText: string;
//   href: string;
// };

// const StepCard: React.FC<StepCardProps> = ({ icon, title, description, buttonText, href }) => {
//     return (
//       <div className="step-card">
//         <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//           <span className=" text-red-400">{icon}</span>
//         </div>
//         <h3 className="font-bold text-lg mb-2">{title}</h3>
//         <p className="text-gray-600 text-sm mb-4">{description} </p>
//         <Link
//           href={href}
//           className="bg-red-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-500 transition-colors text-lg"
//         >
//           {buttonText}
//         </Link>
//       </div>
//     );
//   };

// const App: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<User | null>(null);
//   const supabase = createClient();

//   useEffect(() => {
//     // 認証状態の確認
//     const checkUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     checkUser();

//     // 認証状態の変更を監視
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase.auth]);

//   if (loading) return <Loading />;

//   return (
//     <div className="app">
//       <Header />
//       <section className="relative w-full min-h-screen">
//         <Image
//           src="/brooke-lark-4J059aGa5s4-unsplash.jpg"
//           alt="背景画像"
//           fill
//           style={{ objectFit: 'cover' }}
//           className="z-0"
//           quality={100}
//         />
//         {/* 文字部分 */}
//         <div className="absolute top-[18.75rem] left-[9.375rem] text-amber-50 z-10">
//           <h1 className="text-3xl">余り物が、アイデアに変わる</h1>
//           <p className="pt-4 text-amber-50 text-xl">
//             「今日も何を作ろう...」そんな悩みを抱えていませんか？<br />
//             余り物から生まれる新しいレシピで料理の楽しさを再発見しよう
//           </p>
//           <div className="mt-5">
//             {user ? (
//               // ログイン済みの場合
//               <>
//                 <h2 className="text-3xl mb-8">まずは食材管理に食材を入れてみよう</h2>
//                 <Link
//                   href="/inventory"
//                   className="ml-35 px-4 py-2 cursor-pointer text-2xl rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500 transition-colors"
//                 >
//                   在庫を追加
//                 </Link>
//               </>
//             ) : (
//               // 未ログインの場合
//               <>
//                 <h2 className="text-3xl mb-8">まずは無料で始めてみよう</h2>
//                 <div className="flex gap-4">
//                   <Link
//                     href="/auth/signup"
//                     className="px-6 py-3 cursor-pointer text-2xl rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500 transition-colors"
//                   >
//                     新規登録
//                   </Link>
//                   <Link
//                     href="/auth/login"
//                     className="px-6 py-3 cursor-pointer text-2xl rounded-lg bg-white text-red-400 font-semibold hover:bg-gray-100 transition-colors"
//                   >
//                     ログイン
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </section>
//       <main className="mx-auto p-8 py-16">
//         <SearchBar />
//         <section className="text-center mb-12 mt-30">
//           <h2 className="text-2xl font-bold text-gray-800 mb-8">まずは3ステップで始めよう</h2>
//           <div className="grid md:grid-cols-3 gap-8 px-4">
//             <StepCard
//               icon="#"
//               title="1. 食材管理"
//               description="手動入力で在庫を簡単登録。食材の賞味期限も管理できます。"
//               buttonText="在庫を追加"
//               href={user ? "/inventory" : "/auth/signup"}
//             />
//             <StepCard
//               icon="#"
//               title="2. レシピを提案"
//               description="冷蔵庫の中にある食材や、気分で作れるレシピを提案します。"
//               buttonText="レシピを探す"
//               href={user ? "/recipes" : "/auth/signup"}
//             />
//             <StepCard
//               icon="#"
//               title="3. お気に入りに追加"
//               description="よく作るレシピはすぐ見れるようにコレクションに登録。"
//               buttonText="お気に入りを見る"
//               href={user ? "/favorites" : "/auth/signup"}
//             />
//           </div>
//           {!user && (
//             <p className="mt-8 text-gray-600">
//               ※これらの機能を使うには
//               <Link href="/auth/signup" className="text-red-400 font-semibold hover:underline">
//                 無料登録
//               </Link>
//               が必要です
//             </p>
//           )}
//         </section>
//         <section className="bg-gray-50 py-16 px-4 rounded-lg my-30">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">みんなでごはんを決めよう</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto mb-8">
//               新しいグループ機能で、家族や友人、パートナーと今日の晩ごはんを簡単に決められます。グループで足りない食材を共有し、買い物リストを作成して、毎日の料理をもっと楽しく、もっと便利に。
//             </p>
//             <div className="flex justify-center items-center space-x-8 mb-10">
//               <div className="flex flex-col items-center">
//                 <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
//                   <span className="text-red-400 text-4xl">#</span>
//                 </div>
//                 <span className="font-semibold text-gray-700">グループ作成</span>
//               </div>
//               <div className="text-gray-300 text-4xl">→</div>
//               <div className="flex flex-col items-center">
//                 <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
//                   <span className="text-red-400 text-4xl">#</span>
//                 </div>
//                 <span className="font-semibold text-gray-700">晩ごはんの決定</span>
//               </div>
//               <div className="text-gray-300 text-4xl">→</div>
//               <div className="flex flex-col items-center">
//                 <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md mb-3">
//                   <span className="text-red-400 text-4xl">#</span>
//                 </div>
//                 <span className="font-semibold text-gray-700">買い物リスト</span>
//               </div>
//             </div>
//             <Link
//               href={user ? "/groups" : "/auth/signup"}
//               className="bg-red-400 text-white px-8 py-3 rounded-full font-bold hover:bg-red-500 transition-colors text-lg inline-block"
//             >
//               {user ? "グループ機能を試す" : "無料登録してグループ機能を試す"}
//             </Link>
//           </div>
//         </section>

//         <section className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">今日のピックアップレシピ</h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             {Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="recip-card rounded-lg">
//                 <div className="w-full h-40 bg-gray-200 rounded-t-lg" />
//                 <div className="p-4">
//                   <h3 className="font-bold">料理名</h3>
//                   <p className="text-sm text-gray-600 mt-1">おいしい</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;

/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Leaf } from 'lucide-react';
import Loading from "@/components/Loading";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import "./globals.css";
import { useRouter } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // 認証状態の確認
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navItems: NavItem[] = [
    { title: 'ホーム', href: '/' },
    { title: '食材管理', href: '/inventory' },
    { title: 'レシピ', href: '/recipes' },
    { title: 'グループ共有', href: '/groups' },
    { title: 'レシピ投稿', href: '/favorites' },
    { title: '設定', href: '/settings' },
  ];

   const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  // if (loading) return <Loading />;

  return (
    <div className="min-h-screen  bg-white/80 text-black">
      {/* ===== ナビゲーション & ヒーロー ===== */}
      <header className=" flex items-center justify-between border-b border-[#d1e6d9] bg-[#f6f8f7] backdrop-blur-sm px-6 md:px-10 py-3">
        <div className="flex items-center gap-4">
          <Leaf className="text-[#4CAF50] w-8 h-8" />
          <h2 className="text-lg font-bold">i-Stock</h2>
        </div>
        <div className="hidden md:flex items-center gap-9">
          <ul className="flex list-none gap-9">
            {user ? (
              <>
                {navItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-md font-medium hover:text-[#4CAF50] transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/signup"
                    className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                  >
                    新規登録
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                  >
                    ログイン
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="relative flex items-center gap-4">
          {/* プロフィールアイコン（クリックでメニュー表示） */}
          <div className="relative">
            <button
              className="w-10 h-10"
              onClick={() => setOpen(!open)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ↓ ドロップダウンメニュー部分 */}
            {open && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      編集
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100">
                      ログアウト
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* 左画像 */}
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-800">
                  <img
                    src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="料理を考える人たち"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* 右テキスト */}
              <div className="space-y-5">
                <h1 className="text-black text-3xl md:text-4xl lg:text-4xl leading-tight tracking-tight">
                  毎日の料理に新しい発見を
                </h1>

                <p className="text-sm md:text-base text-black leading-relaxed">
                  冷蔵庫にある食材や自分の好きな食材からぴったりのレシピを提案。<br />
                  毎日の「何作ろう？」を、もっと簡単で、もっと楽しい時間に変えます。
                </p>

                <div className="flex flex-wrap gap-3">
                  {user ? (
                    <>
                      <Link
                        href="/inventory"
                        className="inline-flex items-center rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                      >
                        在庫を管理する
                      </Link>
                      <Link
                        href="/recipes"
                        className="inline-flex items-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 bg-slate-800"
                      >
                        レシピを探す
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signup"
                        className="inline-flex items-center rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                      >
                        無料で始める
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* ===== ダークセクション：サービス特徴 ===== */}
      <section id="features" className="bg-blue-950 pb-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              料理をもっと簡単に、楽しく
            </h2>
            <p className="text-sm md:text-base text-slate-300">
              レシピ検索から食材管理まで、面倒なことはすべてアプリにおまかせ。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <article className="rounded-2xl bg-slate-800/70 p-5 flex flex-col gap-3">
              <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide">
                FEATURE 01
              </p>
              <h3 className="text-base font-semibold">
                冷蔵庫の中身からレシピ提案
              </h3>
              <p className="text-sm text-slate-300">
                撮影した食材をAIが自動認識。冷蔵庫にあるもので今日の献立を提案します。
              </p>
            </article>
            <article className="rounded-2xl bg-slate-800/70 p-5 flex flex-col gap-3">
              <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide">
                FEATURE 02
              </p>
              <h3 className="text-base font-semibold">
                レシピの難易度・時間で絞り込み
              </h3>
              <p className="text-sm text-slate-300">
                「10分以内」「初心者向け」など、気分や時間に合わせてレシピをフィルタリング。
              </p>
            </article>
            <article className="rounded-2xl bg-slate-800/70 p-5 flex flex-col gap-3">
              <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide">
                FEATURE 03
              </p>
              <h3 className="text-base font-semibold">買い物リストを自動生成</h3>
              <p className="text-sm text-slate-300">
                足りない食材だけを自動でリスト化。スーパーでの買い忘れを防ぎます。
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== ホワイトセクション：記事カード ===== */}
      <section id="articles" className="bg-slate-50 text-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              料理を、もっと賢く、もっと楽しく
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              料理のコツや食材管理のアイデアを、編集部がお届けします。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 上段カード */}
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
              <img
                src="https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  食材の賞味期限を味方にするコツ
                </h3>
                <p className="text-xs text-slate-500">
                  冷蔵庫に眠りがちな食材を、上手に使い切るためのヒントを紹介します。
                </p>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
              <img
                src="https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  献立づくりのストレスを減らす5つの習慣
                </h3>
                <p className="text-xs text-slate-500">
                  少しの工夫で、毎日の「何を作るか」を楽にする方法をまとめました。
                </p>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
              <img
                src="https://images.pexels.com/photos/3296287/pexels-photo-3296287.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  料理を楽しむコミュニティづくり
                </h3>
                <p className="text-xs text-slate-500">
                  家族や友人と、レシピや料理の写真を共有する楽しみ方をご紹介。
                </p>
              </div>
            </article>
          </div>

          {/* 下段カード */}
          <div>
            <h3 className="text-center text-lg font-semibold mb-6">料理の世界</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="h-32 w-full object-cover"
                  alt=""
                />
                <div className="p-3">
                  <p className="text-xs font-semibold">1週間まとめて作り置き</p>
                </div>
              </article>
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/4109991/pexels-photo-4109991.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="h-32 w-full object-cover"
                  alt=""
                />
                <div className="p-3">
                  <p className="text-xs font-semibold">忙しい日の10分レシピ</p>
                </div>
              </article>
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/3298186/pexels-photo-3298186.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="h-32 w-full object-cover"
                  alt=""
                />
                <div className="p-3">
                  <p className="text-xs font-semibold">
                    節約しながら栄養バランス
                  </p>
                </div>
              </article>
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/3739918/pexels-photo-3739918.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  className="h-32 w-full object-cover"
                  alt=""
                />
                <div className="p-3">
                  <p className="text-xs font-semibold">
                    子どもと楽しむクッキング
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ホワイトセクション：レビュー・未来 ===== */}
      <section className="bg-slate-50 text-slate-900 pb-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 grid md:grid-cols-2 gap-8">
          {/* 動画レビューカード */}
          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/4109997/pexels-photo-4109997.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-52 w-full object-cover"
              />
              <button className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/90 flex items-center justify-center text-slate-900 text-lg font-bold">
                ▶
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-sm text-slate-700">
                「このアプリのおかげで、冷蔵庫のムダ買いがぐっと減りました。毎日の料理が楽しみになりました。」
              </p>
              <p className="text-xs text-slate-500">
                30代・会社員 / ユーザーインタビューより
              </p>
            </div>
          </article>

          {/* テキスト＋CTA */}
          <article className="flex flex-col justify-center gap-5">
            <h2 className="text-2xl md:text-3xl font-semibold">
              料理の未来を、あなたの手に。
            </h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              ただレシピを探すだけでなく、生活リズムや好みに合わせて「続けられる料理習慣」をつくること。
              それが、このアプリが目指している姿です。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/inventory" : "/auth/signup"}
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                今すぐ無料で試す
              </Link>
              <button className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                導入事例を見る
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="bg-slate-50 text-slate-900 pb-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">よくある質問</h2>
            <p className="text-sm text-slate-600">
              初めての方からよくいただく質問をまとめました。
            </p>
          </div>

          <div className="space-y-4">
            <details className="group border border-slate-200 rounded-2xl bg-white">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-slate-900">
                アプリは無料で使えますか？
                <span className="ml-4 text-xl leading-none text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600">
                はい、基本機能はすべて無料でご利用いただけます。有料プランではレシピ保存数の上限アップや、詳細な栄養分析機能が利用できます。
              </div>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-slate-900">
                会員登録に必要なものは何ですか？
                <span className="ml-4 text-xl leading-none text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600">
                メールアドレスのみで登録可能です。登録後はスマートフォンやPCなど、複数の端末から同じアカウントでご利用いただけます。
              </div>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-slate-900">
                家族とレシピを共有することはできますか？
                <span className="ml-4 text-xl leading-none text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600">
                共有リンクを発行することで、アプリを使っていない家族ともレシピを共有できます。共同で買い物リストを管理することも可能です。
              </div>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-slate-900">
                写真のデータは安全に保管されますか？
                <span className="ml-4 text-xl leading-none text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600">
                アップロードされた写真は暗号化して保存され、レシピ提案の目的以外には利用しません。詳しくはプライバシーポリシーをご確認ください。
              </div>
            </details>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            ここで解決しない場合は、
            <a href="#" className="text-blue-600 underline">
              お問い合わせフォーム
            </a>
            からご相談ください。
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                  Zap
                </div>
                <span className="font-semibold tracking-tight">冷蔵庫レシピ</span>
              </div>
              <p className="text-xs text-slate-400">
                「何作ろう？」から解放される、毎日の料理アシスタントアプリ。
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-100 text-xs uppercase tracking-wide">
                サービス
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-100">
                    機能一覧
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    料金プラン
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    導入事例
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-100 text-xs uppercase tracking-wide">
                サポート
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <a href="#faq" className="hover:text-slate-100">
                    よくある質問
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    お問い合わせ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    ヘルプセンター
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-100 text-xs uppercase tracking-wide">
                ポリシー
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-100">
                    利用規約
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    プライバシーポリシー
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-100">
                    クッキーポリシー
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2025 Reizouko Recipe, Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300">
                X
              </a>
              <a href="#" className="hover:text-slate-300">
                Instagram
              </a>
              <a href="#" className="hover:text-slate-300">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
