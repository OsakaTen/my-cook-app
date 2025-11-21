"use client"; // Client Componentとして明示

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AddFoodForm from "./components/AddForm";
import FoodTable from "./components/FoodTable";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { FoodCategory, FoodItem } from "./types"
import { Plus, Leaf, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';



export default function InventoryPage() {
  const [items, setItems] = useState<FoodItem[]>([]);//食材冷蔵庫
  const [showAddForm, setShowAddForm] = useState(false);//食材追加画面がでるかどうか
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('すべて');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories: FoodCategory[] = ['すべて', '野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他'];

  // fetchItemsをuseCallbackでメモ化
  // 食材一覧を取得（認証はサーバー側で自動的に行われる）
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // userIdを指定せず、サーバー側で認証ユーザーを識別
      const res = await fetch(`/api/ingredients`);

      if (res.status === 401) {
        // 未認証の場合はログインページへ
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const data = await res.json();
      const formattedData = data.map((item: FoodItem & { expiryDate: string | Date }) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split('T')[0]
      }));
      setItems(formattedData);
    } catch (err) {
      console.error("一覧取得に失敗しました:", err);
      setError(err instanceof Error ? err.message : '一覧取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [router]); // routerを依存配列に追加

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);// fetchItemsを依存配列に追加

  const handleAddItem = () => {
    fetchItems(); // 一覧を再取得
    setShowAddForm(false);
  };

  const handleEditItem = async (id: number, updatedItem: Omit<FoodItem, 'id'>) => {
    try {
      // userIdを指定せず、サーバー側で認証ユーザーを識別
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('更新に失敗しました');
      }

      const saved = await res.json(); // ← サーバー側で status 計算済みの最新データ

      const normalized = {
        ...saved,
        expiryDate: new Date(saved.expiryDate).toISOString().split("T")[0],
      };

      setItems((prev) =>
        prev.map((item) => (item.id === id ? normalized : item))
      );

    } catch (err) {
      console.error("更新に失敗しました:", err);
      alert('更新に失敗しました');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('この食材を削除しますか？')) {
      return;
    }

    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('削除に失敗しました');
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("削除に失敗しました:", err);
      alert('削除に失敗しました');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchItems}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="flex-1 px-4 md:px-8 lg:px-10 pt-12 py-50">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* タイトル */}
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              冷蔵庫の在庫
            </h1>
            <p className="text-sm text-slate-500">
              いま冷蔵庫にある食材を見える化して、ムダなく使い切りましょう。
            </p>
          </header>

          {/* 検索＋追加カード */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:px-6 md:py-5 space-y-4">
            {/* Search Box */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1">
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29C77C]/60 focus:border-[#29C77C] bg-slate-50"
                  placeholder="食材名やカテゴリで検索"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#29C77C] hover:bg-[#24B36F] transition-colors shadow-sm"
              >
                <Plus size={18} />
                食材を追加
              </button>
            </div>

            {/* 追加フォーム */}
            {showAddForm && (
              <div className="pt-3 border-t border-slate-100">
                <AddFoodForm
                  onAdd={handleAddItem}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}
          </section>

          {/* フィルタボタン */}
          <section className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${selectedCategory === category
                  ? "border-transparent bg-[#29C77C] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                  }`}
              >
                {category}
              </button>
            ))}
          </section>

          {/* テーブル or 空状態 */}
          <section>
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-10 px-4 text-center space-y-3">
                <p className="text-slate-600 text-sm md:text-base">
                  {searchTerm || selectedCategory !== "すべて"
                    ? "該当する食材が見つかりません。条件を変えて再度お試しください。"
                    : "まだ食材が登録されていません。"}
                </p>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center justify-center gap-2 mt-1 rounded-full px-5 py-2 text-sm font-semibold text-white bg-[#29C77C] hover:bg-[#24B36F] transition-colors"
                  >
                    <Plus size={16} />
                    最初の食材を追加する
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 md:p-4">
                <FoodTable
                  items={filteredItems}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* <Footer /> */}
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


}

