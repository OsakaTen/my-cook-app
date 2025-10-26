"use client";

import { useState } from "react";

interface FilterOption {
  id: string;
  label: string;
}

const filters: FilterOption[] = [
  { id: "ingredients", label: "材料" },
  { id: "dietary", label: "系統" },
  { id: "difficulty", label: "難易度" },
  { id: "time", label: "調理時間" },
];

const dropdownOptions: Record<string, string[]> = {
  ingredients: ["肉", "魚", "野菜", "その他"],
  dietary: ["和食", "中華", "洋食", "その他"],
  difficulty: ["簡単", "普通", "難しい"],
  time: ["15分", "30分", "45分", "60分", "その他"],
}

export default function FilterBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const handleSelect = (filterId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [filterId]: value }));
    setActiveDropdown(null); // 選択したら閉じる
  };

  // 🔹 リセット機能
  const handleReset = () => {
    setSelectedOptions({}); // 選択状態をリセット
    setActiveDropdown(null); // 開いているドロップダウンも閉じる
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h3 className="text-2xl font-bold mr-43 text-gray-900">Filter</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100 transition"
        >
          リセット
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {
          filters.map(filter => (
            <div key={filter.id} className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(prev => (prev === filter.id ? null : filter.id))
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeDropdown === filter.id
                    ? "bg-green-500/20 text-green-700"
                    : "bg-gray-800/5 text-gray-700 hover:bg-green-500/20"
                  }`}
              >
                {filter.label}
                {selectedOptions[filter.id] && (
                  <span className="text-xs text-green-600 ml-1">
                    ({selectedOptions[filter.id]})
                  </span>
                )}
              </button>

              {/* ▼ 調理時間専用のドロップダウン */}
              {activeDropdown === filter.id && dropdownOptions[filter.id] && (
                <ul
                  className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg z-10"
                >
                  {dropdownOptions[filter.id].map(option => (
                    <li
                      key={option}
                      onClick={() => handleSelect(filter.id, option)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        }
      </div>
    </div >
  );
}
