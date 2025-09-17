"use client"; // Client Componentとして明示

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddFoodForm from "./components/AddForm";
import FoodTable from "./components/FoodTable";
import { FoodCategory, FoodItem } from "./types"



export default function InventoryPage() {

  const [items, setItems] = useState<FoodItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('すべて');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: FoodCategory[] = ['すべて', '果物', '野菜', '乳製品', '肉類'];

  const handleAddItem = (newItem: Omit<FoodItem, 'id'>) => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id: newId }]);
    setShowAddForm(false);
  }

  const handleEditItem = (id: number, updatedItem: Omit<FoodItem, 'id'>) => {
    setItems(items.map(item => item.id === id ? { ...updatedItem, id } : item));
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                className=" min-w-[700px] rounded-md pl-12 pr-4 py-3 text-slate-800 focus:outline-none  placeholder:text-slate-400"
                placeholder="食材を検索"
                type="text"
              />
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2  rounded-md h-13 px-6 text-white text-base font-semibold bg-[#29C77C] hover:bg-[#24B36F] transition-colors" >
                <span>+</span>
                <span className="truncate">食材を追加</span>
              </button>
            </div>
          </div>

          {showAddForm &&
            (<AddFoodForm
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
                className={`px-4 py-2 rounded-md text-sm border border-slate-200 transition-colors
                ${selectedCategory === category
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

