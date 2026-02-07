"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { 
  Search, 
  Users, 
  Lock, 
  Globe, 
  Plus, 
  MessageCircle, 
  MoreHorizontal, 
  X,
  Check,
  Send,
  Hash,
  Info,
  ChevronRight,
  ChevronLeft,
  Clock,
  Heart
} from "lucide-react";

// --- Types ---

type GroupType = "public" | "private";

interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  memberCount: number;
  tags: string[];
  imageColor: string; // 背景色のクラス名（モック用）
  isJoined: boolean;
  isPending?: boolean; // 承認待ち
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

// --- Mock Data ---

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "週末作り置き部",
    description: "週末にまとめて料理をする人のための情報交換コミュニティです。レシピや保存テクニックをシェアしましょう！",
    type: "public",
    memberCount: 1240,
    tags: ["作り置き", "時短", "レシピ共有"],
    imageColor: "bg-[#F0F7F2]",
    isJoined: true,
  },
  {
    id: "2",
    name: "激辛愛好会",
    description: "辛いものが好きな人限定。本当に辛いレシピやお店の情報を共有します。※参加には承認が必要です。",
    type: "private",
    memberCount: 85,
    tags: ["激辛", "マニアック", "外食"],
    imageColor: "bg-red-50",
    isJoined: false,
  },
  {
    id: "3",
    name: "低糖質ダイエット",
    description: "美味しく食べて痩せたい！糖質制限レシピを教え合うグループ。",
    type: "public",
    memberCount: 560,
    tags: ["ダイエット", "健康", "糖質制限"],
    imageColor: "bg-blue-50",
    isJoined: false,
  },
  {
    id: "4",
    name: "プロの技を盗む会",
    description: "本格的な調理技術を学びたい人のための、少しレベルの高い議論をする場。",
    type: "private",
    memberCount: 42,
    tags: ["プロ向け", "技術", "本格派"],
    imageColor: "bg-gray-100",
    isJoined: false,
    isPending: true, // 承認待ち状態
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    user: "Hanako",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "今週の作り置きです！鶏ハムがうまくできました✨",
    timestamp: "10:30",
    likes: 12
  },
  {
    id: "m2",
    user: "Taro",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    text: "美味しそう！鶏ハムの温度管理どうしてますか？",
    timestamp: "10:35",
    likes: 2
  },
  {
    id: "m3",
    user: "Sato",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    text: "私は炊飯器の保温機能を使ってますよ〜。放置でできるので楽です！",
    timestamp: "10:42",
    likes: 5
  }
];

// --- Components ---


const Badge = ({ type }: { type: GroupType }) => {
  if (type === "public") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-[#4A7C59] text-xs font-bold uppercase tracking-wider border border-green-100">
        <Globe className="w-3.5 h-3.5" /> Public
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider border border-gray-200">
      <Lock className="w-3.5 h-3.5" /> Private
    </span>
  );
};

export default function GroupPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "my_groups">("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null); // For detail view
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Filter logic
  const filteredGroups = MOCK_GROUPS.filter(group => {
    if (activeTab === "my_groups") return group.isJoined;
    return group.name.includes(searchQuery) || group.tags.some(t => t.includes(searchQuery));
  });

  // Handlers
  const handleJoinRequest = (group: Group) => {
    if (group.type === "public") {
      alert(`${group.name} に参加しました！`);
      // In real app: update state/API
    } else {
      alert(`${group.name} に参加リクエストを送りました。承認をお待ちください。`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    alert(`メッセージ送信: ${newMessage}`);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#2D2D2D] selection:bg-[#4A7C59] selection:text-white font-sans">
      <Header />

      <main className="pt-24 pb-10 max-w-7xl mx-auto px-4 md:px-6 h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-8">
        
        {/* Left Panel: Group List & Discovery */}
        <div className={`flex-1 flex flex-col gap-6 h-full ${selectedGroup ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Page Title & Tabs */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif font-bold text-[#2D2D2D]">Community</h1>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-3 bg-[#2D2D2D] text-white rounded-full hover:bg-[#4A7C59] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Plus className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-gray-100 p-1.5 rounded-2xl flex font-bold text-sm">
                <button
                    onClick={() => { setActiveTab("discover"); setSelectedGroup(null); }}
                    className={`flex-1 py-2.5 rounded-xl transition-all ${activeTab === "discover" ? "bg-white text-[#2D2D2D] shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                    見つける
                </button>
                <button
                    onClick={() => { setActiveTab("my_groups"); setSelectedGroup(null); }}
                    className={`flex-1 py-2.5 rounded-xl transition-all ${activeTab === "my_groups" ? "bg-white text-[#2D2D2D] shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                    参加中
                </button>
            </div>

            {activeTab === "discover" && (
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4A7C59] transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="キーワードで検索..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all font-medium placeholder:text-gray-300 shadow-sm"
                    />
                </div>
            )}
          </div>

          {/* Group List Area - Increased Item Size */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-20">
            {filteredGroups.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-base font-bold">グループが見つかりません</p>
                </div>
            ) : (
                filteredGroups.map(group => (
                    <div 
                        key={group.id}
                        onClick={() => setSelectedGroup(group)}
                        className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-3 ${
                            selectedGroup?.id === group.id 
                            ? "bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-2xl scale-[1.02]" 
                            : "bg-white border-gray-100 hover:border-[#4A7C59]/30 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <Badge type={group.type} />
                            {group.isJoined && (
                                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                                    selectedGroup?.id === group.id ? "bg-white/20 text-white" : "bg-[#4A7C59]/10 text-[#4A7C59]"
                                }`}>
                                    <Check className="w-3.5 h-3.5" /> 参加中
                                </span>
                            )}
                             {group.isPending && (
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-600 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> 承認待ち
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="font-serif text-xl font-bold mb-2 tracking-tight">{group.name}</h3>
                            <p className={`text-sm leading-relaxed line-clamp-2 ${
                                selectedGroup?.id === group.id ? "text-gray-300" : "text-gray-500"
                            }`}>
                                {group.description}
                            </p>
                        </div>

                        <div className={`h-px w-full ${selectedGroup?.id === group.id ? "bg-white/10" : "bg-gray-100"}`} />

                        <div className="flex items-center justify-between pt-1">
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${selectedGroup?.id === group.id ? "text-gray-400" : "text-gray-400"}`}>
                                <Users className="w-4 h-4" />
                                {group.memberCount.toLocaleString()} members
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                selectedGroup?.id === group.id 
                                ? "bg-white text-[#2D2D2D]" 
                                : "bg-gray-50 text-gray-400 group-hover:bg-[#4A7C59] group-hover:text-white"
                            }`}>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Right Panel: Detail & Chat (Desktop: Always visible if selected, Mobile: Full screen overlay) */}
        <div className={`flex-[2] bg-white rounded-[2.5rem] border border-gray-100 shadow-lg flex-col overflow-hidden relative transition-all duration-500 ${selectedGroup ? 'flex' : 'hidden md:flex md:items-center md:justify-center bg-gray-50/50'}`}>
            
            {selectedGroup ? (
                <>
                    {/* Chat Header */}
                    <div className="h-24 border-b border-gray-100 px-8 flex items-center justify-between bg-white/90 backdrop-blur absolute top-0 left-0 right-0 z-10">
                        <div className="flex items-center gap-5">
                            <button onClick={() => setSelectedGroup(null)} className="md:hidden p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-serif font-bold ${selectedGroup.imageColor} text-gray-700 shadow-sm`}>
                                {selectedGroup.name[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#2D2D2D] leading-tight">{selectedGroup.name}</h2>
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold mt-1">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {selectedGroup.memberCount.toLocaleString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{selectedGroup.type === "public" ? "誰でも参加可能" : "承認制グループ"}</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <Info className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Chat Content or Join Prompt */}
                    <div className="flex-1 overflow-y-auto pt-24 pb-28 px-8 bg-[#FAFAFA]">
                        
                        {!selectedGroup.isJoined ? (
                            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
                                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl font-serif font-bold mb-8 ${selectedGroup.imageColor} text-gray-700 shadow-md`}>
                                    {selectedGroup.name[0]}
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-[#2D2D2D] mb-4">{selectedGroup.name}</h2>
                                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                                    {selectedGroup.description}
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-2 mb-10">
                                    {selectedGroup.tags.map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 font-bold shadow-sm">
                                            # {tag}
                                        </span>
                                    ))}
                                </div>

                                {selectedGroup.isPending ? (
                                     <div className="w-full py-4 px-6 bg-orange-50 text-orange-600 rounded-2xl font-bold flex items-center justify-center gap-3 border border-orange-100">
                                        <Clock className="w-6 h-6" /> 承認待ちです
                                     </div>
                                ) : (
                                    <button 
                                        onClick={() => handleJoinRequest(selectedGroup)}
                                        className="w-full py-4 rounded-2xl bg-[#2D2D2D] text-white font-bold shadow-xl hover:bg-[#4A7C59] hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                                    >
                                        {selectedGroup.type === "public" ? "グループに参加する" : "参加リクエストを送る"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Chat Timeline */
                            <div className="space-y-8 py-6">
                                <div className="flex justify-center">
                                    <span className="text-xs font-bold text-gray-400 bg-gray-200/50 px-4 py-1.5 rounded-full">Today</span>
                                </div>
                                
                                {MOCK_MESSAGES.map(msg => (
                                    <div key={msg.id} className="flex gap-5 animate-in slide-in-from-bottom-4 duration-500">
                                        <Image src={msg.avatar} fill alt={msg.user} className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-3 mb-1.5">
                                                <span className="font-bold text-[#2D2D2D]">{msg.user}</span>
                                                <span className="text-xs text-gray-400 font-bold">{msg.timestamp}</span>
                                            </div>
                                            <div className="bg-white p-5 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed">
                                                {msg.text}
                                            </div>
                                            <div className="flex items-center gap-5 mt-2 ml-2">
                                                <button className="text-xs font-bold text-gray-400 hover:text-pink-500 flex items-center gap-1.5 transition-colors group">
                                                    <div className="p-1.5 rounded-full group-hover:bg-pink-50 transition-colors">
                                                        <Heart className="w-4 h-4" />
                                                    </div>
                                                    {msg.likes}
                                                </button>
                                                <button className="text-xs font-bold text-gray-400 hover:text-[#2D2D2D] transition-colors px-2 py-1 rounded-lg hover:bg-gray-100">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message Input (Only if joined) */}
                    {selectedGroup.isJoined && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-4xl mx-auto">
                                <button type="button" className="p-3.5 text-gray-400 hover:bg-gray-50 hover:text-[#2D2D2D] rounded-2xl transition-colors">
                                    <Plus className="w-6 h-6" />
                                </button>
                                <div className="flex-1 bg-gray-50 rounded-3xl p-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4A7C59]/20 transition-all border border-transparent focus-within:border-[#4A7C59] shadow-inner">
                                    <textarea 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="メッセージを送信..."
                                        rows={1}
                                        className="w-full bg-transparent outline-none text-base resize-none max-h-32 px-4 py-3 min-h-[48px]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3.5 bg-[#2D2D2D] text-white rounded-2xl shadow-lg hover:bg-[#4A7C59] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}

                </>
            ) : (
                /* Empty State for Right Panel */
                <div className="text-center text-gray-300 p-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <MessageCircle className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-400 mb-3">Select a Group</h3>
                    <p className="text-sm font-medium text-gray-300 max-w-xs mx-auto leading-relaxed">
                        左側のリストからグループを選択して、<br/>同じ目的を持つ仲間とつながりましょう。
                    </p>
                </div>
            )}
        </div>

      </main>

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D2D2D]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)} />
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-serif text-xl font-bold text-[#2D2D2D]">新規グループ作成</h2>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">グループ名</label>
                        <input type="text" placeholder="例: スパイスカレー研究会" className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent outline-none transition-all placeholder:text-gray-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">説明</label>
                        <textarea placeholder="グループの目的や活動内容を入力..." rows={3} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">公開設定</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer group">
                                <input type="radio" name="type" className="peer hidden" defaultChecked />
                                <div className="p-5 rounded-2xl border-2 border-gray-100 peer-checked:border-[#4A7C59] peer-checked:bg-[#4A7C59]/5 transition-all hover:border-gray-200">
                                    <Globe className="w-6 h-6 text-gray-400 peer-checked:text-[#4A7C59] mb-2 transition-colors" />
                                    <p className="font-bold text-sm text-[#2D2D2D]">Public</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">誰でも参加・閲覧可能</p>
                                </div>
                            </label>
                            <label className="cursor-pointer group">
                                <input type="radio" name="type" className="peer hidden" />
                                <div className="p-5 rounded-2xl border-2 border-gray-100 peer-checked:border-[#4A7C59] peer-checked:bg-[#4A7C59]/5 transition-all hover:border-gray-200">
                                    <Lock className="w-6 h-6 text-gray-400 peer-checked:text-[#4A7C59] mb-2 transition-colors" />
                                    <p className="font-bold text-sm text-[#2D2D2D]">Private</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">承認された人のみ参加可能</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-[#2D2D2D] text-white font-bold rounded-2xl shadow-xl hover:bg-[#4A7C59] hover:shadow-2xl hover:-translate-y-0.5 transition-all mt-4 text-lg">
                        作成する
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}