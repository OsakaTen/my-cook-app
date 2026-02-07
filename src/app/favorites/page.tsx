"use client";

import Header from "@/components/Header";
import React, { useState } from "react";
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  Users, 
  ChefHat, 
  X, 
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Check,
  Eye,
  Edit3
} from "lucide-react";
import Image from "next/image";

// --- Components ---

const Section = ({ title, children, className = "", description = "" }: { title: string; children: React.ReactNode; className?: string; description?: string }) => (
  <section className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">{title}</h3>
        {description && <p className="text-xs text-gray-400 font-bold mt-1">{description}</p>}
      </div>
    </div>
    <div className="p-8 space-y-8">
      {children}
    </div>
  </section>
);

// --- Main Page ---

export default function RecipePostPage() {
  // --- State ---
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  
  // Meta Info
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("2");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState("主菜");

  // Ingredients
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }, { name: "", quantity: "" }]);

  // Steps
  const [steps, setSteps] = useState([""]);

  // --- Handlers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ingredient Handlers
  const updateIngredient = (index: number, field: "name" | "quantity", value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };
  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "" }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

  // Step Handlers
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const moveStep = (index: number, direction: -1 | 1) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === steps.length - 1)) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + direction];
    newSteps[index + direction] = temp;
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("レシピを投稿しました！");
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#2D2D2D] selection:bg-[#4A7C59] selection:text-white font-sans">
      <Header />

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#2D2D2D]">Create Recipe</h1>
            <p className="text-sm font-medium text-gray-400">あなたの自慢のレシピを共有しましょう</p>
          </div>
          
          <div className="flex gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
             <button 
               onClick={() => setIsPreview(false)}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${!isPreview ? 'bg-[#2D2D2D] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
             >
               <Edit3 className="w-4 h-4" /> 編集
             </button>
             <button 
               onClick={() => setIsPreview(true)}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isPreview ? 'bg-[#4A7C59] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
             >
               <Eye className="w-4 h-4" /> プレビュー
             </button>
          </div>
        </div>

        {isPreview ? (
          /* --- Preview Mode --- */
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
             <div className="relative h-80 md:h-96 bg-gray-100">
                {image ? (
                    <Image src={image} fill alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon className="w-16 h-16 mb-4" />
                        <p className="font-bold text-lg">No Image</p>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 pt-24">
                    <span className="inline-block px-3 py-1 bg-[#4A7C59] text-white text-xs font-bold rounded-full mb-3">
                        {category || 'カテゴリーなし'}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">{title || "レシピタイトル"}</h2>
                </div>
             </div>

             <div className="p-8 md:p-12">
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">{description || "ここに説明文が入ります。"}</p>

                <div className="flex flex-wrap gap-6 mb-10 p-6 bg-gray-50 rounded-3xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm text-[#4A7C59]"><Clock className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">調理時間</p>
                            <p className="font-bold text-[#2D2D2D]">{time || "--"}分</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm text-orange-500"><Flame className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">カロリー</p>
                            <p className="font-bold text-[#2D2D2D]">{calories || "--"}kcal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm text-blue-500"><Users className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">分量</p>
                            <p className="font-bold text-[#2D2D2D]">{servings}人前</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#4A7C59] rounded-full"></span> 材料
                        </h3>
                        <ul className="space-y-4">
                            {ingredients.map((ing, i) => (
                                ing.name && (
                                    <li key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="font-medium">{ing.name}</span>
                                        <span className="font-bold text-gray-500">{ing.quantity}</span>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#4A7C59] rounded-full"></span> 作り方
                        </h3>
                        <div className="space-y-6">
                            {steps.map((step, i) => (
                                step && (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <p className="mt-1 leading-relaxed text-gray-700">{step}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
             </div>
          </div>
        ) : (
          /* --- Edit Mode (Form) --- */
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Basic Info Section */}
            <Section title="基本情報" description="レシピの顔となる情報を入力します">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Image Upload Area */}
                    <div className="md:col-span-1">
                        <label className="block relative aspect-square w-full rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#4A7C59] hover:bg-[#4A7C59]/5 transition-all cursor-pointer overflow-hidden bg-gray-50 group">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            {image ? (
                                <>
                                    <Image src={image} fill alt="Upload" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold text-sm flex items-center gap-2"><UploadCloud className="w-4 h-4" /> 変更する</p>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8 text-[#4A7C59]" />
                                    </div>
                                    <p className="font-bold text-sm">写真をアップロード</p>
                                    <p className="text-[10px] mt-1">ドラッグ＆ドロップ または クリック</p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Text Inputs */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">レシピタイトル</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例: 鶏とキャベツのガーリック炒め"
                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-lg font-bold focus:bg-white focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all placeholder:text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">レシピの説明</label>
                            <textarea 
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="レシピの魅力やポイントを書きましょう..."
                                className="w-full p-5 bg-gray-50 border-transparent rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all placeholder:text-gray-300 resize-none"
                            />
                        </div>
                        
                        {/* Meta Data Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">調理時間(分)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#4A7C59] outline-none" placeholder="15" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">カロリー(kcal)</label>
                                <div className="relative">
                                    <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#4A7C59] outline-none" placeholder="300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">分量(人前)</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#4A7C59] outline-none" placeholder="2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">カテゴリー</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#4A7C59] outline-none cursor-pointer">
                                    <option>主菜</option>
                                    <option>副菜</option>
                                    <option>汁物</option>
                                    <option>ご飯もの</option>
                                    <option>デザート</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Ingredients Section */}
            <Section title="材料" description="必要な食材と分量を入力します">
                <div className="space-y-3">
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex gap-3 items-center group">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 text-xs font-bold flex-shrink-0">
                                {index + 1}
                            </div>
                            <input 
                                type="text" 
                                value={ing.name} 
                                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                placeholder="材料名 (例: 鶏もも肉)"
                                className="flex-grow px-4 py-3 bg-gray-50 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59] outline-none transition-all"
                            />
                            <input 
                                type="text" 
                                value={ing.quantity} 
                                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                                placeholder="分量 (例: 300g)"
                                className="w-32 px-4 py-3 bg-gray-50 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59] outline-none transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeIngredient(index)}
                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    type="button"
                    onClick={addIngredient}
                    className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:border-[#4A7C59] hover:text-[#4A7C59] hover:bg-[#4A7C59]/5 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> 材料を追加
                </button>
            </Section>

            {/* Steps Section */}
            <Section title="作り方" description="調理手順をわかりやすく入力します">
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-4 group">
                             <div className="flex flex-col gap-1 pt-2 items-center">
                                <div className="w-8 h-8 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10">
                                    {index + 1}
                                </div>
                                {index !== steps.length - 1 && <div className="w-0.5 h-full bg-gray-100 rounded-full" />}
                             </div>
                             <div className="flex-grow space-y-2 pb-6">
                                <textarea 
                                    rows={3}
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder={`作り方の手順 ${index + 1}`}
                                    className="w-full p-4 bg-gray-50 rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59] outline-none transition-all resize-none"
                                />
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => moveStep(index, -1)} disabled={index === 0} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30"><ArrowUp className="w-4 h-4 text-gray-600" /></button>
                                    <button type="button" onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30"><ArrowDown className="w-4 h-4 text-gray-600" /></button>
                                    <div className="flex-grow" />
                                    <button type="button" onClick={() => removeStep(index)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100">削除</button>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                <button 
                    type="button"
                    onClick={addStep}
                    className="mt-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:border-[#4A7C59] hover:text-[#4A7C59] hover:bg-[#4A7C59]/5 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> 手順を追加
                </button>
            </Section>

            {/* Submit Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100 z-20 flex items-center justify-center md:static md:bg-transparent md:border-none md:p-0 md:pt-10">
                <div className="w-full max-w-5xl flex gap-4">
                    <button 
                        type="button"
                        className="flex-1 py-4 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold shadow-sm hover:bg-gray-50 transition-all"
                    >
                        下書き保存
                    </button>
                    <button 
                        type="submit"
                        className="flex-[2] py-4 rounded-2xl bg-[#2D2D2D] text-white font-bold shadow-xl hover:bg-[#4A7C59] hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                        <ChefHat className="w-6 h-6" />
                        レシピを公開する
                    </button>
                </div>
            </div>
            {/* Spacing for fixed bottom button on mobile */}
            <div className="h-20 md:hidden" />

          </form>
        )}
      </main>
    </div>
  );
}