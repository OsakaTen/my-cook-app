"use client"; // Client Componentとして明示

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AddFoodForm from "./components/AddForm";
import FoodTable from "./components/FoodTable";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { FoodCategory, FoodItem } from "./types"
import { Plus } from 'lucide-react';



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

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...updatedItem, id } : item))
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

  if (loading) return <Loading />;

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
      <main className="flex-1 px-10 py-8 my-22">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">冷蔵庫の在庫</h1>
          </div>

          {/* Search Box */}
          <div className="mb-6">
            <div className="flex items-center gap-7 mb-8">
              <input
                className="min-w-[700px] rounded-md pl-12 pr-4 py-3 text-slate-800 focus:outline-none placeholder:text-slate-400"
                placeholder="食材を検索"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 rounded-md h-13 px-6 text-white text-base font-semibold bg-[#29C77C] hover:bg-[#24B36F] transition-colors"
              >
                <Plus size={20} />
                食材を追加
              </button>
            </div>
          </div>

          {showAddForm && (
            <AddFoodForm
              onAdd={handleAddItem}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm border border-slate-200 transition-colors ${selectedCategory === category
                  ? 'text-white bg-[#29C77C]'
                  : 'bg-white text-slate-600 hover:bg-green-100 hover:text-green-700 hover:border-green-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-500 text-lg">
                {searchTerm || selectedCategory !== 'すべて'
                  ? '該当する食材が見つかりません'
                  : '食材がまだ登録されていません'}
              </p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 px-6 py-2 bg-[#29C77C] text-white rounded-md hover:bg-[#24B36F]"
                >
                  最初の食材を追加
                </button>
              )}
            </div>
          ) : (
            <FoodTable
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}
          {/* <FoodTable
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          /> */}
        </div>
      </main>
      <Footer />
    </div>
  );


}

