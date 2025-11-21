/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Leaf, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import Loading from "@/components/Loading";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import "./globals.css";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
}

type FaqItem = {
  question: string;
  answer: string;
};

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

  const FAQ_ITEMS: FaqItem[] = [
    {
      question: "アプリは無料で使えますか？",
      answer:
        "はい、基本機能はすべて無料でご利用いただけます。有料プランではレシピ保存数の上限アップや、詳細な栄養分析機能が利用できます。",
    },
    {
      question: "会員登録に必要なものは何ですか？",
      answer:
        "メールアドレスのみで登録可能です。登録後はスマートフォンやPCなど、複数の端末から同じアカウントでご利用いただけます。",
    },
    {
      question: "家族とレシピを共有することはできますか？",
      answer:
        "共有リンクを発行することで、アプリを使っていない家族ともレシピを共有できます。共同で買い物リストを管理することも可能です。",
    },
    {
      question: "写真のデータは安全に保管されますか？",
      answer:
        "アップロードされた写真は暗号化して保存され、レシピ提案の目的以外には利用しません。詳しくはプライバシーポリシーをご確認ください。",
    },
  ];

  const faqContainerVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
        staggerChildren: 0.12,
      },
    },
  };

  const faqItemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" as const },
    },
  };



  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  // if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white text-black select-none">
      {/* ===== ナビゲーション & ヒーロー ===== */}
      <header className=" flex items-center justify-between border-b border-[#d1e6d9] bg-white backdrop-blur-sm px-6 md:px-10 py-4">
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
                      className="text-md font-medium hover:text-[#58a359] transition-colors"
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

      <section className="py-20 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-800">
                <img
                  src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="料理を考える人たち"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h1
                className="text-slate-900 text-3xl md:text-4xl lg:text-4xl leading-tight tracking-tight"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                毎日の料理に新しい発見を
              </motion.h1>

              <motion.p
                className="text-sm md:text-base text-black leading-relaxed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                冷蔵庫にある食材や自分の好きな食材からぴったりのレシピを提案。<br />
                毎日の「何作ろう？」を、もっと簡単で、もっと楽しい時間に変えます。
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {user ? (
                  <>
                    <Link
                      href="/inventory"
                      className="inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.02]"
                    >
                      在庫を管理する
                    </Link>
                    <Link
                      href="/recipes"
                      className="inline-flex items-center rounded-xl border border-black px-5 py-2.5 text-sm font-semibold text-black bg-white transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.02]"
                    >
                      レシピを探す
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.02]"
                    >
                      無料で始める
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== サービス特徴 ===== */}
      <motion.section
        id="features"
        className="bg-[#f5fbf7] text-slate-900 py-16"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              料理をもっと簡単に、楽しく
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              レシピ検索から食材管理まで、面倒なことはすべてアプリにおまかせ。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.article
              className="rounded-2xl bg-white border border-[#d1e6d9] p-5 flex flex-col gap-3 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            >
              <p className="inline-flex w-fit rounded-full bg-[#e6f4ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4CAF50]">
                FEATURE 01
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                冷蔵庫の中身からレシピ提案
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                撮影した食材をAIが自動認識。冷蔵庫にあるもので今日の献立を提案します。
              </p>
            </motion.article>

            <motion.article
              className="rounded-2xl bg-white border border-[#d1e6d9] p-5 flex flex-col gap-3 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            >
              <p className="inline-flex w-fit rounded-full bg-[#e6f4ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4CAF50]">
                FEATURE 02
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                レシピの難易度・時間で絞り込み
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                「10分以内」「初心者向け」など、気分や時間に合わせてレシピをフィルタリング。
              </p>
            </motion.article>

            <motion.article
              className="rounded-2xl bg-white border border-[#d1e6d9] p-5 flex flex-col gap-3 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
            >
              <p className="inline-flex w-fit rounded-full bg-[#e6f4ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4CAF50]">
                FEATURE 03
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                買い物リストを自動生成
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                足りない食材だけを自動でリスト化。スーパーでの買い忘れを防ぎます。
              </p>
            </motion.article>
          </div>
        </div>
      </motion.section>

      {/* ===== 記事カード ===== */}
      <motion.section
        id="articles"
        className="bg-slate-50 text-slate-900 py-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              料理を、もっと賢く、もっと楽しく
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              料理のコツや食材管理のアイデアを、編集部がお届けします。
            </p>
          </div>

          {/* 上段カード */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.article
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
            >
              <img
                src="https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  食材の賞味期限を味方にするコツ
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  冷蔵庫に眠りがちな食材を、上手に使い切るためのヒントを紹介します。
                </p>
              </div>
            </motion.article>

            <motion.article
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
            >
              <img
                src="https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  献立づくりのストレスを減らす5つの習慣
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  少しの工夫で、毎日の「何を作るか」を楽にする方法をまとめました。
                </p>
              </div>
            </motion.article>

            <motion.article
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
            >
              <img
                src="https://images.pexels.com/photos/3296287/pexels-photo-3296287.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  料理を楽しむコミュニティづくり
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  家族や友人と、レシピや料理の写真を共有する楽しみ方をご紹介。
                </p>
              </div>
            </motion.article>
          </div>

          {/* 下段カード */}
          <div>
            <h3 className="text-center text-lg font-semibold mb-6">
              料理の世界
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "1週間まとめて作り置き",
                "忙しい日の10分レシピ",
                "節約しながら栄養バランス",
                "子どもと楽しむクッキング",
              ].map((title, index) => (
                <motion.article
                  key={title}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.05 * index,
                  }}
                >
                  <img
                    src={
                      [
                        "https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        "https://images.pexels.com/photos/4109991/pexels-photo-4109991.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        "https://images.pexels.com/photos/3298186/pexels-photo-3298186.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        "https://images.pexels.com/photos/3739918/pexels-photo-3739918.jpeg?auto=compress&cs=tinysrgb&w=1200",
                      ][index]
                    }
                    className="h-32 w-full object-cover"
                    alt=""
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold">{title}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== レビュー・未来 ===== */}
      <motion.section
        className="bg-slate-50 text-slate-900 pb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-0 grid md:grid-cols-2 gap-8">
          {/* 動画レビューカード */}
          <motion.article
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/4109997/pexels-photo-4109997.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                className="h-52 w-full object-cover"
              />
              <button className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/90 flex items-center justify-center text-slate-900 text-lg font-bold shadow-md">
                ▶
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                「このアプリのおかげで、冷蔵庫のムダ買いがぐっと減りました。毎日の料理が楽しみになりました。」
              </p>
              <p className="text-xs text-slate-500">
                30代・会社員 / ユーザーインタビューより
              </p>
            </div>
          </motion.article>

          {/* テキスト＋CTA */}
          <motion.article
            className="flex flex-col justify-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          >
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
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                今すぐ無料で試す
              </Link>
              <button className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors">
                導入事例を見る
              </button>
            </div>
          </motion.article>
        </div>
      </motion.section>


      {/* ===== FAQ ===== */}
      <motion.section
        id="faq"
        className="text-slate-900 py-16"
        variants={faqContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-3xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">よくある質問</h2>
            <p className="text-sm text-slate-600">
              初めての方からよくいただく質問をまとめました。
            </p>
          </div>
          <motion.div
            className="space-y-4"
            variants={faqContainerVariants}
          >
            {FAQ_ITEMS.map((item) => (
              <motion.div key={item.question} variants={faqItemVariants}>
                <details className="group border border-slate-200 rounded-2xl bg-white">
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-sm font-medium text-slate-900">
                    {item.question}
                    <ChevronDown className="ml-4 w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 py-4 border-t border-slate-200 text-sm text-slate-600">
                    {item.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 text-center text-xs text-slate-500">
            ここで解決しない場合は、
            <a href="#" className="text-blue-600 underline">
              お問い合わせフォーム
            </a>
            からご相談ください。
          </div>
        </div>
      </motion.section>

      {/* ===== フッター ===== */}
      <footer className="border-t  border-[#d1e6d9]  bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          {/* 上段 */}
          <div className="px-6 grid grid-cols-1  md:grid-cols-4">
            {/* Logo */}
            <div className="flex gap-2">
              <Leaf className="text-[#4CAF50] w-7 h-7" />
              <h2 className="text-xl text-slate-800">i-Stock</h2>
            </div>

            {/* カラム1：料理アプリ */}
            <div className="space-y-3 text-sm">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                料理アプリ
              </h3>
              <ul className="space-y-2 text-slate-800">
                <li><a href="#" className="hover:underline">ホーム</a></li>
                <li><a href="#" className="hover:underline">食材管理</a></li>
                <li><a href="#" className="hover:underline">レシピ</a></li>
                <li><a href="#" className="hover:underline">グループ共有</a></li>
                <li><a href="#" className="hover:underline">レシピ投稿</a></li>
                <li><a href="#" className="hover:underline">設定</a></li>
              </ul>
            </div>

            {/* カラム2：会社情報 */}
            <div className="space-y-3 text-sm">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                開発者
              </h3>
              <ul className="space-y-2 text-slate-800">
                <li><a href="#" className="hover:underline">このアプリについて</a></li>
                <li><a href="#" className="hover:underline">コンセプト</a></li>
                <li><a href="#" className="hover:underline">アップデート情報</a></li>
                <li><a href="#" className="hover:underline">開発者プロフィール</a></li>
                <li><a href="https://github.com/OsakaTen" className="hover:underline">Github</a></li>
              </ul>
            </div>

            {/* カラム3：リソース */}
            <div className="space-y-6 text-sm">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                  サポート
                </h3>
                <ul className="space-y-2 text-slate-800">
                  <li><a href="#" className="hover:underline">FAQ</a></li>
                  <li><a href="#" className="hover:underline">お問い合わせ</a></li>
                  <li><a href="#" className="hover:underline">利用規約</a></li>
                  <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
                  <li><a href="#" className="hover:underline">Cookie設定</a></li>
                </ul>
              </div>
            </div>
          </div>


          {/* 下段 */}
          <div className="mt-5 border-t  border-[#d1e6d9] pt-4 text-xs text-slate-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p>© 2024 料理アプリ, すべての権利を保留。</p>
                <div className="flex flex-wrap gap-4">
                  <button className="hover:underline">プライバシーポリシー</button>
                  <button className="hover:underline">利用規約</button>
                  <button className="hover:underline">Cookie設定</button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a href="#" aria-label="Instagram" className="hover:opacity-70">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Facebook" className="hover:opacity-70">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:opacity-70">
                  <Linkedin size={18} />
                </a>
                <a href="#" aria-label="YouTube" className="hover:opacity-70">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
