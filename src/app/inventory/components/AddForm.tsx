import React, { useState } from "react";
import { FoodCategory, AddFoodFormProps, FoodItem } from "../types"

const AddForm: React.FC<AddFoodFormProps> = ({ onAdd, onCancel }) => {

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
    category: "果物" as FoodCategory
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.quantity || !formData.expiryDate) return;

    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    let status: FoodItem['status'];
    if (diffDays < 0) {
      status = '期限切れ';
    } else if (diffDays < 3) {
      status = 'まもなく期限切れ';
    } else {
      status = '新鮮';
    }

    onAdd({
      ...formData,
      status
    });

    setFormData({ name: "", quantity: "", expiryDate: "", category: "果物"});
  }


  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">新しい食材を追加</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="食材名"
          className="border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="数量"
          className="border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
        <input
          type="date"
          value={formData.expiryDate}
          className="border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
        <select className="border border-slate-300 rounded-md"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
        >
          <option value="果物">果物</option>
          <option value="野菜">野菜</option>
          <option value="乳製品">乳製品</option>
          <option value="肉類">肉類</option>
        </select>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#29C77C] text-white rounded-md hover:bg-[#24B36F] font-semibold"
        >
          追加
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-400 text-white rounded-md hover:bg-slate-500 font-semibold"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}



export default AddForm;

