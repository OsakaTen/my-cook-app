"use client"; // Client Componentとして明示

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AddFoodForm from "./components/AddForm";
import FoodTable from "./components/FoodTable";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { FoodCategory, FoodItem } from "./types"
import {
  Plus, Leaf, Facebook, Instagram, Linkedin, Youtube, Refrigerator,
  ChefHat,
  Trash2,
  Edit2,
  Search,
  X,
  ShoppingBasket,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Minus
} from 'lucide-react';
import { Konkhmer_Sleokchher } from "next/font/google";



// export default function InventoryPage() {
//   const [items, setItems] = useState<FoodItem[]>([]);//食材冷蔵庫
//   const [showAddForm, setShowAddForm] = useState(false);//食材追加画面がでるかどうか
//   const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('すべて');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const categories: FoodCategory[] = ['すべて', '野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他'];

//   // fetchItemsをuseCallbackでメモ化
//   // 食材一覧を取得（認証はサーバー側で自動的に行われる）
//   const fetchItems = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // userIdを指定せず、サーバー側で認証ユーザーを識別
//       const res = await fetch(`/api/ingredients`);

//       if (res.status === 401) {
//         // 未認証の場合はログインページへ
//         router.push('/login');
//         return;
//       }

//       if (!res.ok) {
//         throw new Error('データの取得に失敗しました');
//       }

//       const data = await res.json();
//       const formattedData = data.map((item: FoodItem & { expiryDate: string | Date }) => ({
//         ...item,
//         expiryDate: new Date(item.expiryDate).toISOString().split('T')[0]
//       }));
//       setItems(formattedData);
//     } catch (err) {
//       console.error("一覧取得に失敗しました:", err);
//       setError(err instanceof Error ? err.message : '一覧取得に失敗しました');
//     } finally {
//       setLoading(false);
//     }
//   }, [router]); // routerを依存配列に追加

//   useEffect(() => {
//     fetchItems();
//   }, [fetchItems]);// fetchItemsを依存配列に追加

//   const handleAddItem = () => {
//     fetchItems(); // 一覧を再取得
//     setShowAddForm(false);
//   };

//   const handleEditItem = async (id: number, updatedItem: Omit<FoodItem, 'id'>) => {
//     try {
//       // userIdを指定せず、サーバー側で認証ユーザーを識別
//       const res = await fetch(`/api/ingredients/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedItem),
//       });

//       if (res.status === 401) {
//         router.push('/login');
//         return;
//       }

//       if (!res.ok) {
//         throw new Error('更新に失敗しました');
//       }

//       const saved = await res.json(); // ← サーバー側で status 計算済みの最新データ

//       const normalized = {
//         ...saved,
//         expiryDate: new Date(saved.expiryDate).toISOString().split("T")[0],
//       };

//       setItems((prev) =>
//         prev.map((item) => (item.id === id ? normalized : item))
//       );

//     } catch (err) {
//       console.error("更新に失敗しました:", err);
//       alert('更新に失敗しました');
//     }
//   };

//   const handleDeleteItem = async (id: number) => {
//     if (!confirm('この食材を削除しますか？')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/ingredients/${id}`, {
//         method: "DELETE",
//       });

//       if (res.status === 401) {
//         router.push('/login');
//         return;
//       }

//       if (!res.ok) {
//         throw new Error('削除に失敗しました');
//       }

//       setItems((prev) => prev.filter((item) => item.id !== id));
//     } catch (err) {
//       console.error("削除に失敗しました:", err);
//       alert('削除に失敗しました');
//     }
//   };

//   const filteredItems = items.filter(item => {
//     const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // if (loading) return <Loading />;

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <p className="text-lg text-red-600 mb-4">{error}</p>
//           <button
//             onClick={fetchItems}
//             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//           >
//             再試行
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <main className="flex-1 px-4 md:px-8 lg:px-10 pt-12 py-50">
//         <div className="max-w-6xl mx-auto space-y-8">
//           {/* タイトル */}
//           <header className="flex flex-col gap-2">
//             <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
//               冷蔵庫の在庫
//             </h1>
//             <p className="text-sm text-slate-500">
//               いま冷蔵庫にある食材を見える化して、ムダなく使い切りましょう。
//             </p>
//           </header>

//           {/* 検索＋追加カード */}
//           <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:px-6 md:py-5 space-y-4">
//             {/* Search Box */}
//             <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//               <div className="relative flex-1">
//                 <input
//                   className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29C77C]/60 focus:border-[#29C77C] bg-slate-50"
//                   placeholder="食材名やカテゴリで検索"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={() => setShowAddForm(!showAddForm)}
//                 className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#29C77C] hover:bg-[#24B36F] transition-colors shadow-sm"
//               >
//                 <Plus size={18} />
//                 食材を追加
//               </button>
//             </div>

//             {/* 追加フォーム */}
//             {showAddForm && (
//               <div className="pt-3 border-t border-slate-100">
//                 <AddFoodForm
//                   onAdd={handleAddItem}
//                   onCancel={() => setShowAddForm(false)}
//                 />
//               </div>
//             )}
//           </section>

//           {/* フィルタボタン */}
//           <section className="flex flex-wrap gap-3">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-4 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${selectedCategory === category
//                   ? "border-transparent bg-[#29C77C] text-white shadow-sm"
//                   : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:border-slate-300"
//                   }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </section>

//           {/* テーブル or 空状態 */}
//           <section>
//             {filteredItems.length === 0 ? (
//               <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-10 px-4 text-center space-y-3">
//                 <p className="text-slate-600 text-sm md:text-base">
//                   {searchTerm || selectedCategory !== "すべて"
//                     ? "該当する食材が見つかりません。条件を変えて再度お試しください。"
//                     : "まだ食材が登録されていません。"}
//                 </p>
//                 {!showAddForm && (
//                   <button
//                     onClick={() => setShowAddForm(true)}
//                     className="inline-flex items-center justify-center gap-2 mt-1 rounded-full px-5 py-2 text-sm font-semibold text-white bg-[#29C77C] hover:bg-[#24B36F] transition-colors"
//                   >
//                     <Plus size={16} />
//                     最初の食材を追加する
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 md:p-4">
//                 <FoodTable
//                   items={filteredItems}
//                   onEdit={handleEditItem}
//                   onDelete={handleDeleteItem}
//                 />
//               </div>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* <Footer /> */}
//       <footer className="border-t  border-[#d1e6d9]  bg-white">
//         <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
//           {/* 上段 */}
//           <div className="px-6 grid grid-cols-1  md:grid-cols-4">
//             {/* Logo */}
//             <div className="flex gap-2">
//               <Leaf className="text-[#4CAF50] w-7 h-7" />
//               <h2 className="text-xl text-slate-800">i-Stock</h2>
//             </div>

//             {/* カラム1：料理アプリ */}
//             <div className="space-y-3 text-sm">
//               <h3 className="text-xs font-semibold tracking-wide text-slate-500">
//                 料理アプリ
//               </h3>
//               <ul className="space-y-2 text-slate-800">
//                 <li><a href="#" className="hover:underline">ホーム</a></li>
//                 <li><a href="#" className="hover:underline">食材管理</a></li>
//                 <li><a href="#" className="hover:underline">レシピ</a></li>
//                 <li><a href="#" className="hover:underline">グループ共有</a></li>
//                 <li><a href="#" className="hover:underline">レシピ投稿</a></li>
//                 <li><a href="#" className="hover:underline">設定</a></li>
//               </ul>
//             </div>

//             {/* カラム2：会社情報 */}
//             <div className="space-y-3 text-sm">
//               <h3 className="text-xs font-semibold tracking-wide text-slate-500">
//                 開発者
//               </h3>
//               <ul className="space-y-2 text-slate-800">
//                 <li><a href="#" className="hover:underline">このアプリについて</a></li>
//                 <li><a href="#" className="hover:underline">コンセプト</a></li>
//                 <li><a href="#" className="hover:underline">アップデート情報</a></li>
//                 <li><a href="#" className="hover:underline">開発者プロフィール</a></li>
//                 <li><a href="https://github.com/OsakaTen" className="hover:underline">Github</a></li>
//               </ul>
//             </div>

//             {/* カラム3：リソース */}
//             <div className="space-y-6 text-sm">
//               <div className="space-y-3">
//                 <h3 className="text-xs font-semibold tracking-wide text-slate-500">
//                   サポート
//                 </h3>
//                 <ul className="space-y-2 text-slate-800">
//                   <li><a href="#" className="hover:underline">FAQ</a></li>
//                   <li><a href="#" className="hover:underline">お問い合わせ</a></li>
//                   <li><a href="#" className="hover:underline">利用規約</a></li>
//                   <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
//                   <li><a href="#" className="hover:underline">Cookie設定</a></li>
//                 </ul>
//               </div>
//             </div>
//           </div>


//           {/* 下段 */}
//           <div className="mt-5 border-t  border-[#d1e6d9] pt-4 text-xs text-slate-500">
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div className="space-y-1">
//                 <p>© 2024 料理アプリ, すべての権利を保留。</p>
//                 <div className="flex flex-wrap gap-4">
//                   <button className="hover:underline">プライバシーポリシー</button>
//                   <button className="hover:underline">利用規約</button>
//                   <button className="hover:underline">Cookie設定</button>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <a href="#" aria-label="Instagram" className="hover:opacity-70">
//                   <Instagram size={18} />
//                 </a>
//                 <a href="#" aria-label="Facebook" className="hover:opacity-70">
//                   <Facebook size={18} />
//                 </a>
//                 <a href="#" aria-label="LinkedIn" className="hover:opacity-70">
//                   <Linkedin size={18} />
//                 </a>
//                 <a href="#" aria-label="YouTube" className="hover:opacity-70">
//                   <Youtube size={18} />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// --- Types ---
import Link from "next/link";
import { Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
interface NavItem {
  title: string;
  href: string;
}

type Category = '野菜' | '果物' | '肉' | '魚' | '乳製品' | '調味料' | 'その他';
type FilterCategory = Category | 'すべて';

interface FridgeItem {
  id: number;
  name: string;
  enName?: string;
  quantity: string;
  category: Category;
  expiry: string;
}

interface Recipe {
  id: number;
  name: string;
  enName: string;
  time: string;
  calories: string;
  ingredients: string[];
  imageColor: string;
}

interface FormData {
  name: string;
  quantity: string;
  category: Category;
  expiry: string;
}

// --- Mock Data ---
const INITIAL_ITEMS: FridgeItem[] = [
  { id: 1, name: 'キャベツ', enName: 'Cabbage', quantity: '1玉', category: '野菜', expiry: '2023-11-25' },
  { id: 2, name: '鶏もも肉', enName: 'Chicken Thigh', quantity: '300g', category: '肉', expiry: '2023-11-22' },
  { id: 3, name: '牛乳', enName: 'Milk', quantity: '2本', category: '乳製品', expiry: '2023-11-28' },
  { id: 4, name: '卵', enName: 'Eggs', quantity: '8個', category: '乳製品', expiry: '2023-11-30' },
  { id: 5, name: 'トマト', enName: 'Tomatoes', quantity: '3個', category: '野菜', expiry: '2023-11-24' },
];

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    name: '鶏とキャベツのガーリック炒め',
    enName: 'Garlic Chicken & Cabbage',
    time: '15分',
    calories: '320kcal',
    ingredients: ['鶏もも肉', 'キャベツ', 'ニンニク'],
    imageColor: 'bg-[#F3EFE0]'
  },
  {
    id: 2,
    name: '基本のオムレツ',
    enName: 'Classic Omelette',
    time: '10分',
    calories: '250kcal',
    ingredients: ['卵', '牛乳', 'バター'],
    imageColor: 'bg-[#E0F3E5]'
  },
  {
    id: 3,
    name: 'ゴロゴロ野菜のクリームシチュー',
    enName: 'Cream Stew',
    time: '40分',
    calories: '580kcal',
    ingredients: ['鶏もも肉', '牛乳', '人参', '玉ねぎ'],
    imageColor: 'bg-[#FAE0E0]'
  },
];

// ユーザー指定のカテゴリ + フィルタ用の「すべて」
const FORM_CATEGORIES: Category[] = ['野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他'];
const CATEGORIES: FilterCategory[] = ['すべて', ...FORM_CATEGORIES];

// --- Components ---

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 tracking-wide text-sm relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#2D2D2D] text-white hover:bg-[#4A7C59] shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-white text-[#2D2D2D] border border-[#E5E5E5] hover:border-[#2D2D2D] hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-gray-400 hover:text-[#2D2D2D] hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function FridgeApp() {
  const [activeTab, setActiveTab] = useState<'fridge' | 'recipes'>('fridge');
  const [items, setItems] = useState<FridgeItem[]>(INITIAL_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FridgeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('すべて');

  // Form State & Logic
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity: '',
    category: '野菜',
    expiry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // --- Logic ---

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.enName && item.enName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const availableRecipeCount = useMemo(() => {
    const inventoryNames = items.map(i => i.name);
    return MOCK_RECIPES.filter(recipe =>
      recipe.ingredients.some(ing => inventoryNames.includes(ing))
    ).length;
  }, [items]);

  const handleOpenModal = (item: FridgeItem | null = null) => {
    setError(""); // リセット
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        expiry: item.expiry
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', quantity: '', category: '野菜', expiry: '' });
    }
    setIsModalOpen(true);
  };

  // --- 統合された handleSubmit ---
  const handleSubmit = async () => {
    // バリデーション
    if (!formData.name.trim()) {
      setError("食材名を入力してください");
      return;
    }
    if (!formData.quantity) {
      setError("数量を入力してください");
      return;
    }
    if (!formData.expiry) {
      setError("賞味期限を選択してください");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // APIコールのシミュレーション
      const dataToSend = {
        name: formData.name,
        quantity: formData.quantity,
        expiryDate: formData.expiry,
        category: formData.category,
      };
      console.log("送信するデータ:", dataToSend);

      // ネットワーク遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 800));

      // 成功時の処理 (ローカルState更新)
      if (editingItem) {
        setItems(prevItems => prevItems.map(i =>
          i.id === editingItem.id ? { ...i, ...formData } : i
        ));
      } else {
        const newItem: FridgeItem = {
          id: Date.now(),
          ...formData,
          // 新規追加時は英語名は空にするか、API等で取得する想定
          enName: ''
        };
        setItems(prevItems => [...prevItems, newItem]);
      }
      console.log("追加成功");

      // フォームリセットと閉じる
      setFormData({ name: '', quantity: '', category: '野菜', expiry: '' });
      setIsModalOpen(false);

    } catch (err) {
      setError("通信エラーが発生しました");
      console.error("追加エラー:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const getDaysUntilExpiry = (dateString: string): number | null => {
    if (!dateString) return null;
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Konkhmer_Sleokchher
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の確認
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navItems: NavItem[] = [
    { title: 'ホーム', href: '/' },
    { title: '食材管理', href: '/inventory' },
    { title: 'レシピ', href: '/recipes' },
    { title: 'グループ共有', href: '/groups' },
    { title: 'レシピ投稿', href: '/favorites' },
    { title: '設定', href: '/settings' },
  ];

  // ✅ ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="bg-[#FCFCFC] text-[#2D2D2D] selection:bg-[#4A7C59] selection:text-white font-sans">
      {/* Header */}
      <header className="fixed w-full top-0 flex items-center justify-between bg-[#FCFCFC]/90 backdrop-blur-md z-20 transition-all duration-300 border-b border-gray-100 px-6 md:px-10 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#2D2D2D] text-white p-2 rounded-xl">
            <Refrigerator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#2D2D2D]">Pantry Note</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-9 font-serif">
          <ul className="flex list-none gap-9">
            {user ? (
              <>
                {navItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-md  hover:text-[#58a359] transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/signup"
                    className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                  >
                    新規登録
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors"
                  >
                    ログイン
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="relative flex items-center gap-4">
          {/* プロフィールアイコン（クリックでメニュー表示） */}
          <div className="relative">
            <button
              className="w-10 h-10"
              onClick={() => setOpen(!open)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ↓ ドロップダウンメニュー部分 */}
            {open && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      編集
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100">
                      ログアウト
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32 max-w-5xl mx-auto px-6">
        {/* Status Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="font-serif text-3xl mb-2">こんにちは、<br />今日はお料理日和ですね。</h2>

          <div className="flex justify-between">
            <div className="flex gap-4 mt-4 overflow-x-auto hide-scrollbar pb-2">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-[160px] flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBasket className="w-4 h-4" />
                  在庫数
                </div>
                <span className="text-2xl font-serif font-bold">{items.length} <span className="text-sm font-sans font-normal text-gray-400">アイテム</span></span>
              </div>

              <div className="bg-[#F0F7F2] border border-[#E0F0E4] rounded-2xl p-4 min-w-[160px] shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#4A7C59] text-xs font-bold uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  ロス削減貢献
                </div>
                <span className="text-2xl font-serif font-bold text-[#2D2D2D]">Good <span className="text-sm font-sans font-normal text-gray-400">状態</span></span>
              </div>
            </div>

            {/* <div className="inline-flex bg-gray-100/80 rounded-2xl p-0.5 gap-0.5">
              <button
                onClick={() => setActiveTab('fridge')}
                className={`flex-1 px-4 py-1 text-xs md:text-sm font-bold rounded-xl leading-none transition-all duration-300
    ${activeTab === 'fridge'
                    ? 'bg-white text-[#2D2D2D]'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                冷蔵庫
              </button>

              <button
                onClick={() => setActiveTab('recipes')}
                className={`flex-1 px-4 py-1 text-xs md:text-sm font-bold rounded-xl leading-none transition-all duration-300 flex items-center justify-center gap-1
    ${activeTab === 'recipes'
                    ? 'bg-white text-[#2D2D2D]'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                レシピ
                {availableRecipeCount > 0 && (
                  <span className="w-1 h-1 rounded-full bg-[#4A7C59]" />
                )}
              </button>
            </div> */}
          </div>
        </div>

        {activeTab === 'fridge' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters */}
            <div className="sticky top-24 z-10 bg-[#FCFCFC]/95 backdrop-blur py-2 -mx-2 px-2">
              <div className="relative group mb-4">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4A7C59] transition-colors" />
                <input type="text" placeholder="食材を探す..." className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#4A7C59]/20 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300 ${selectedCategory === cat ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]' : 'bg-white text-gray-500 border-transparent hover:bg-gray-100'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Items List */}
            <div className="grid gap-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                  <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                  <p className="font-serif text-lg text-gray-800 mb-2">食材が見つかりません</p>
                  <Button variant="ghost" onClick={() => handleOpenModal()} className="text-[#4A7C59]">食材を追加する</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredItems.map(item => {
                    const daysLeft = getDaysUntilExpiry(item.expiry);
                    const isExpiring = daysLeft !== null && daysLeft <= 3;
                    const isExpired = daysLeft !== null && daysLeft < 0;

                    return (
                      <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md hover:border-[#4A7C59]/30 transition-all">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${item.category === '野菜' ? 'bg-[#F0F7F2] text-[#4A7C59]' : item.category === '肉' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-gray-50 text-gray-500'}`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {item.expiry && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isExpired ? 'bg-red-100 text-red-600' : isExpiring ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {isExpired ? '期限切れ' : `あと${daysLeft}日`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">{item.quantity}</span>
                          <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-300 hover:text-[#4A7C59] transition-colors"><Edit2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#2D2D2D] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span className="text-xs font-bold tracking-widest uppercase">Today Pick</span>
                </div>
                <h3 className="font-serif text-3xl font-bold leading-relaxed mb-3">今ある食材で、<br />最高の一皿を。</h3>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {MOCK_RECIPES.map(recipe => {
                const missingIngredients = recipe.ingredients.filter(ing => !items.some(i => i.name.includes(ing)));
                const isCookable = missingIngredients.length === 0;
                return (
                  <div key={recipe.id} className="group cursor-pointer bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className={`h-48 ${recipe.imageColor} rounded-[1.5rem] mb-4 relative overflow-hidden flex items-center justify-center`}>
                      <span className="font-serif text-6xl opacity-20 text-[#2D2D2D] mix-blend-multiply">{recipe.name.charAt(0)}</span>
                    </div>
                    <div className="px-3 pb-4">
                      <h3 className="font-serif text-xl font-bold text-[#2D2D2D] mb-1">{recipe.name}</h3>
                      <Button variant={isCookable ? 'primary' : 'secondary'} className={`w-full rounded-xl mt-4 ${isCookable ? 'bg-[#4A7C59]' : ''}`}>
                        {isCookable ? <>調理をはじめる <ArrowRight className="w-4 h-4" /></> : <span className="text-gray-400 text-xs">材料が足りません</span>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {activeTab === 'fridge' && (
        <button onClick={() => handleOpenModal()} className="fixed bottom-8 right-8 w-16 h-16 bg-[#2D2D2D] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#4A7C59] hover:rotate-90 z-30 group">
          <Plus className="w-7 h-7 group-hover:stroke-[3px]" />
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2D2D2D]/40 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && setIsModalOpen(false)} />

          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative z-10">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-serif text-xl font-bold text-[#2D2D2D]">
                {editingItem ? '食材を編集' : '食材を追加'}
              </h2>
              <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">食材名</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent font-bold text-lg placeholder:text-gray-300 transition-all"
                    placeholder="例: にんじん"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">数量</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent font-medium transition-all"
                    placeholder="例: 2個、500g"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">カテゴリー</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent font-medium appearance-none bg-white transition-all cursor-pointer"
                    >
                      {FORM_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">賞味期限</label>
                  <input
                    type="date"
                    value={formData.expiry}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent font-medium text-gray-600 transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  variant="primary"
                  className="flex-1 bg-[#2D2D2D] hover:bg-[#4A7C59]"
                >
                  {isSubmitting ? '追加中...' : (editingItem ? '保存する' : '追加する')}
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="flex-1"
                >
                  キャンセル
                </Button>
              </div>

              {editingItem && (
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-center">
                  <button
                    onClick={() => { handleDeleteItem(editingItem.id); setIsModalOpen(false); }}
                    disabled={isSubmitting}
                    className="text-sm text-red-400 hover:text-red-600 font-bold flex items-center gap-2 py-2"
                  >
                    <Trash2 className="w-4 h-4" /> この食材を削除
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}