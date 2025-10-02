import React, { useState } from "react";
import { FoodTableProps, FoodItem, FoodStatus } from "../types";

const FoodTable: React.FC<FoodTableProps> = ({ items, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Omit<FoodItem, 'id'> | null>(null);

  const tableHeaders = ['食材', '数量', '賞味期限', '状態', '操作'];

  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      quantity: item.quantity,
      expiryDate: item.expiryDate,
      category: item.category,
      status: item.status
    });
  };

  const handleSave = async (id: number) => {
    if (!editData || !editData.name || !editData.quantity || !editData.expiryDate) return;

    // 賞味期限に基づいて状態を再計算
    const today = new Date();
    const expiry = new Date(editData.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    let status: FoodStatus;
    if (diffDays < 0) status = '期限切れ';
    else if (diffDays <= 3) status = 'まもなく期限切れ';
    else status = '新鮮';

    onEdit(id, { ...editData, status });
    setEditingId(null);
    setEditData(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const getStatusColor = (status: FoodStatus) => {
    switch (status) {
      case '新鮮':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'まもなく期限切れ':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case '期限切れ':
        return { bg: 'bg-red-100', text: 'text-red-800' };
    }
  };

  const getRowBgColor = (status: FoodStatus) => {
    switch (status) {
      case 'まもなく期限切れ':
        return 'bg-yellow-50';
      case '期限切れ':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="rounded-lg text-center overflow-hidden border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            {tableHeaders.map(header => (
              <th
                key={header}
                className="px-6 py-4 text-slate-600 text-lg font-semibold tracking-wider text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map(item => (
            <tr key={item.id} className={getRowBgColor(item.status)}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editData?.name || ''}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="px-2 py-1 border border-slate-300 rounded text-base max-w-[140px] max-h-[40px]"
                  />
                ) : (
                  <span className="text-slate-800 text-xl font-medium pl-5">{item.name}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editData?.quantity || ''}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, quantity: e.target.value } : null)}
                    className="px-2 py-1 border border-slate-300 rounded text-base max-w-[85px] max-h-[40px]"
                  />
                ) : (
                  <span className="text-slate-800 text-xl font-medium">{item.quantity}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="date"
                    value={editData?.expiryDate || ''}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, expiryDate: e.target.value } : null)}
                    className="px-2 py-1 border border-slate-300 rounded text-base max-w-[182px] max-h-[40px]"
                  />
                ) : (
                  <span
                    className={
                      item.status === '期限切れ'
                        ? 'text-red-600 font-semibold text-base'
                        : item.status === 'まもなく期限切れ'
                        ? 'text-orange-600 font-semibold text-base'
                        : 'text-slate-500 text-xl'
                    }
                  >
                    {item.expiryDate}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-8 py-3 rounded-full text-sm font-medium ${getStatusColor(item.status).bg} ${getStatusColor(item.status).text}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleSave(item.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-2 py-1 bg-slate-500 text-white rounded-md hover:bg-slate-600 font-semibold text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold text-sm"
                    >
                      削除
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;