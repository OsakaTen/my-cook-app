"use client"; // Client Componentとして明示

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AddFoodForm from "./components/AddForm";
import FoodTable from "./components/FoodTable";
import Footer from "@/components/Footer";
import { FoodCategory, FoodItem } from "./types"



export default function InventoryPage() {
  const userId = 1; // ★ 認証未導入なので仮置き。ログイン導入したら差し替え

  const [items, setItems] = useState<FoodItem[]>([]);//食材冷蔵庫
  const [showAddForm, setShowAddForm] = useState(false);//食材追加画面がでるかどうか
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('すべて');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: FoodCategory[] = ['すべて', '野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他'];

  const fetchItems = async () => {
    const res = await fetch(`/api/ingredients/${userId}`);
    if (res.ok) {
      const data = await res.json();
      const formattedData = data.map((item: FoodItem & { expiryDate: string | Date }) => ({
        ...item,
        expiryDate: new Date(item.expiryDate).toISOString().split('T')[0]
      }));
      setItems(formattedData);
    } else {
      console.error("一覧取得に失敗しました");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [userId]);

const handleAddItem = () => {
    fetchItems(); // 一覧を再取得
    setShowAddForm(false);
  };

const handleEditItem = async (id: number, updatedItem: Omit<FoodItem, 'id'>) => {
    const res = await fetch(`/api/ingredients/${userId}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (res.ok) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...updatedItem, id } : item))
      );
    } else {
      console.error("更新に失敗しました");
    }
  };

  const handleDeleteItem = async (id: number) => {
    const res = await fetch(`/api/ingredients/${userId}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("削除に失敗しました");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">読み込み中...</p>
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
                <span>+</span>
                <span className="truncate">食材を追加</span>
              </button>
            </div>
          </div>

          {showAddForm && (
            <AddFoodForm
              userId={userId}
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
                className={`px-4 py-2 rounded-md text-sm border border-slate-200 transition-colors ${
                  selectedCategory === category
                    ? 'text-white bg-[#29C77C]'
                    : 'bg-white text-slate-600 hover:bg-green-100 hover:text-green-700 hover:border-green-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Table */}
          <FoodTable
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </div>
      </main>
      <Footer />
    </div>
  );


}

