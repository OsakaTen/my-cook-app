import React, { useState } from "react";
import { FoodCategory, FoodStatus, AddFoodFormProps } from "../types";

const AddForm: React.FC<AddFoodFormProps> = ({ userId, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
    category: "果物" as FoodCategory
  });
  
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
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">新しい食材を追加</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="食材名"
          value={formData.name}
          className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="数量（例: 2個,500g）"
          value={formData.quantity}
          className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          disabled={isSubmitting}
        />
        <input
          type="date"
          value={formData.expiryDate}
          className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          disabled={isSubmitting}
        />
        <select
          className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
          disabled={isSubmitting}
        >
          <option value="果物">果物</option>
          <option value="野菜">野菜</option>
          <option value="肉">肉</option>
          <option value="魚">魚</option>
          <option value="乳製品">乳製品</option>
          <option value="調味料">調味料</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#29C77C] text-white rounded-md hover:bg-[#24B36F] font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "追加中..." : "追加"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-400 text-white rounded-md hover:bg-slate-500 font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default AddForm;