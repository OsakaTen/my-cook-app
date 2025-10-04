import React, { useState } from "react";
import { FoodCategory, FoodStatus, AddFoodFormProps } from "../types";
import { X } from 'lucide-react';

const AddForm: React.FC<AddFoodFormProps> = ({ userId, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
    category: "すべて" as FoodCategory
  });

  const categories = ['すべて','野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他'];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    // バリデーション
    if (!formData.name.trim()) {
      setError("食材名を入力してください");
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError("数量を入力してください");
      return;
    }
    if (!formData.expiryDate) {
      setError("賞味期限を選択してください");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // 賞味期限に基づいてstatusを計算
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

      let status: FoodStatus;
      if (diffDays < 0) {
        status = '期限切れ';
      } else if (diffDays <= 3) {
        status = 'まもなく期限切れ';
      } else {
        status = '新鮮';
      }

      const dataToSend = {
        ...formData,
        status
      };

      console.log("送信するデータ:", dataToSend); // デバッグ用

      const res = await fetch(`/api/ingredients/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      console.log("レスポンスステータス:", res.status); // デバッグ用

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.details || errorData.message || "追加に失敗しました");
        return;
      }

      if (res.ok) {
        setFormData({ name: "", quantity: "", expiryDate: "", category: "果物" });
        onAdd(); // 親コンポーネントで再取得させる
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "追加に失敗しました");
      }
    } catch (err) {
      setError("通信エラーが発生しました");
      console.error("追加エラー:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">食材を追加</h2>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              食材名
            </label>
            <input
              type="text"
              value={formData.name}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="例: にんじん"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数量
            </label>
            <input
              type="text"
              value={formData.quantity}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="例: 2個、500g"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={formData.category}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              賞味期限
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? '追加中...' : '追加'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddForm;