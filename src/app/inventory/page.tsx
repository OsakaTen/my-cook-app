"use client"; // Client Componentとして明示

import { useState } from "react";
import Header from "@/components/Header";

export default function InventoryPage() {
  // フォームの入力状態を管理（デモ用）
  const [formData, setFormData] = useState({
    ingredient: "",
    quantity: 0,
    category: "野菜",
    expiry: "",
  });

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("フォーム送信データ:", formData);
    // ここでバックエンドAPI（例: Node.js/Express）にデータを送信する処理を追加可能
    // 例: fetch('/api/ingredients', { method: 'POST', body: JSON.stringify(formData) })
  };

  // 入力変更ハンドラ
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };



  return (
    <div>
      <Header />
      <main className="p-10 space-y-8">
        {/* 入力セクション */}
        <section className="bg-white/80 p-8 rounded-xl border border-gray-100/50 shadow-sm">
          <h2 className="text-4xl font-normal mb-10 text-center">
            📝 新しい食材を追加
          </h2>
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="form-group">
                <label
                  htmlFor="ingredient"
                  className="text-gray-600 font-medium text-sm mb-2"
                >
                  食材名
                </label>
                <input
                  id="ingredient"
                  type="text"
                  placeholder="例: トマト"
                  required
                  value={formData.ingredient}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="quantity"
                  className="text-gray-600 font-medium text-sm mb-2"
                >
                  数量
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="例: 2"
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="category"
                  className="text-gray-600 font-medium text-sm mb-2"
                >
                  カテゴリー
                </label>
                <select
                  id="category"
                  className="p-4 border border-gray-200 "
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="野菜">🥕 野菜</option>
                  <option value="肉">🍖 肉</option>
                  <option value="魚">🐟 魚</option>
                  <option value="乳製品">🧀 乳製品</option>
                  <option value="その他">📦 その他</option>
                </select>
              </div>
              <div className="form-group">
                <label
                  htmlFor="expiry"
                  className="text-gray-600 font-medium text-sm mb-2"
                >
                  賞味期限
                </label>
                <input
                  id="expiry"
                  type="date"
                  required
                  value={formData.expiry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-5 mb-6">
              <div className="form-group">
                <label htmlFor="description" className="text-gray-600 font-medium text-sm mb-2">説明</label>
                <input type="text" id="description" placeholder="例: スーパーでの買い物" />
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button
                  type="submit"
                  className="">
                  食材を追加
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* フィルターセクション */}
        <section className="flex gap-3 flex-wrap">
          <button className="bg-white/90 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:border-red-500 hover:-translate-y-0.5 hover:shadow-md transition duration-300">
            📊 すべて
          </button>
          <button className="bg-white/90 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:border-red-500 hover:-translate-y-0.5 hover:shadow-md transition duration-300">
            🥕 野菜
          </button>
          <button className="bg-white/90 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:border-red-500 hover:-translate-y-0.5 hover:shadow-md transition duration-300">
            🍖 肉
          </button>
          <select className="">
            <option value="all">すべての月</option>
          </select>
        </section>

        {/* 集計セクション */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="summary-card bg-white/90 p-8 rounded-xl border border-gray-100/50 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300">
            <h3 className="text-gray-600 text-base font-medium mb-4">食材数</h3>
            <div className="text-3xl font-light text-green-500">0</div>
          </div>
          <div className="summary-card bg-white/90 p-8 rounded-xl border border-gray-100/50 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300">
            <h3 className="text-gray-600 text-base font-medium mb-4">
              期限切れ間近
            </h3>
            <div className="text-3xl font-light text-red-500">0</div>
          </div>
          <div className="summary-card bg-white/90 p-8 rounded-xl border border-gray-100/50 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300">
            <h3 className="text-gray-600 text-base font-medium mb-4">
              レシピ提案
            </h3>
            <div className="text-3xl font-light text-blue-500">0</div>
          </div>
        </section>

        {/* 記録一覧セクション */}
        <section className="bg-white/90 p-8 rounded-xl border border-gray-100/50 shadow-sm">
          <h2 className="text-2xl font-normal mb-6 tracking-tight">
            📋 食材一覧
          </h2>
          <div className="records-list max-h-[500px] overflow-y-auto text-gray-500">
            まだ食材が登録されていません。
          </div>
        </section>
      </main>
    </div>
  );
}