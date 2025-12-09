"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { 
  User, 
  Bell, 
  Moon, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Mail, 
  Camera,
  Trash2,
  Check,
  Globe
} from "lucide-react";
import Image from "next/image";


// Toggle Switch Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${
      checked ? "bg-[#4A7C59]" : "bg-gray-200"
    }`}
  >
    <span
      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// Setting Section Wrapper
const Section = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
      <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </section>
);

export default function SettingsPage() {
  // --- State ---
  const [profile, setProfile] = useState({
    name: "Taro Yamada",
    email: "taro.kitchen@example.com",
    bio: "料理初心者です。週末に作り置きをしています。"
  });

  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailDigest: false,
    darkMode: false,
    dataSharing: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  // --- Handlers ---
  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#2D2D2D] selection:bg-[#4A7C59] selection:text-white font-sans">
      <Header />
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-6">
        
        {/* Page Title */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#2D2D2D]">Settings</h1>
          <p className="text-sm font-medium text-gray-400">アカウントとアプリの設定を管理します</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden group">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden">
                   <Image
                     src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" 
                     alt="Profile" 
                     fill
                     className="w-full h-full object-cover"
                   />
                </div>
                <button className="absolute bottom-0 right-0 bg-[#2D2D2D] text-white p-2 rounded-full shadow-lg hover:bg-[#4A7C59] transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-1">{profile.name}</h2>
              <p className="text-xs text-gray-400 font-bold tracking-wide mb-6">FREE PLAN</p>
              
              <div className="flex justify-center gap-2">
                <div className="text-center px-4 py-2 bg-gray-50 rounded-2xl">
                  <p className="text-lg font-serif font-bold text-[#4A7C59]">124</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Recipes</p>
                </div>
                <div className="text-center px-4 py-2 bg-gray-50 rounded-2xl">
                  <p className="text-lg font-serif font-bold text-[#2D2D2D]">85</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Items</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu (Quick Links) */}
            <nav className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              {[
                { icon: User, label: "アカウント情報", active: true },
                { icon: Shield, label: "セキュリティ" },
                { icon: Globe, label: "言語設定" },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-colors ${
                    item.active 
                      ? "bg-[#4A7C59]/10 text-[#4A7C59] border-l-4 border-[#4A7C59]" 
                      : "text-gray-500 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
              ))}
            </nav>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Edit Section */}
            <Section title="プロフィール設定">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">表示名</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">メールアドレス</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">自己紹介</label>
                  <textarea 
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 border-transparent rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] disabled:opacity-60 disabled:cursor-not-allowed transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                      >
                        キャンセル
                      </button>
                      <button 
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#4A7C59] text-white font-bold text-sm hover:bg-[#3A6346] shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        保存する
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-xl bg-[#2D2D2D] text-white font-bold text-sm hover:bg-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      編集する
                    </button>
                  )}
                </div>
              </form>
            </Section>

            {/* Preferences Section */}
            <Section title="アプリ設定">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full text-[#4A7C59]">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2D2D]">プッシュ通知</p>
                      <p className="text-xs text-gray-400 font-medium">賞味期限やレシピ提案のお知らせ</p>
                    </div>
                  </div>
                  <Toggle 
                    checked={preferences.pushNotifications} 
                    onChange={() => togglePreference("pushNotifications")} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2D2D]">メールマガジン</p>
                      <p className="text-xs text-gray-400 font-medium">週に一度のまとめレポート</p>
                    </div>
                  </div>
                  <Toggle 
                    checked={preferences.emailDigest} 
                    onChange={() => togglePreference("emailDigest")} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2D2D]">ダークモード</p>
                      <p className="text-xs text-gray-400 font-medium">アプリの外観を暗くします</p>
                    </div>
                  </div>
                  <Toggle 
                    checked={preferences.darkMode} 
                    onChange={() => togglePreference("darkMode")} 
                  />
                </div>
              </div>
            </Section>

            {/* Danger Zone */}
            <Section title="その他" className="!border-red-100">
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="font-bold text-gray-600 group-hover:text-[#2D2D2D]">ログアウト</span>
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-[#2D2D2D]" />
                 </button>
                 
                 <div className="h-px bg-gray-100 w-full" />
                 
                 <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-colors group">
                    <div className="text-left">
                        <span className="font-bold text-red-600">アカウント削除</span>
                        <p className="text-xs text-red-400 mt-0.5">すべてのデータが完全に削除されます</p>
                    </div>
                    <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                 </button>
              </div>
            </Section>

          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Icon for edit mode
function Edit2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
}