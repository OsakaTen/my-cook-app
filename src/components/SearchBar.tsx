import React from "react";

// Spot型に views を追加
type Spot = {
  title: string;
  description: string;
  image: string;
  views: number;
};

// データ（views = 人気度）
const spots: Spot[] = [
  {
    title: "肉じゃが",
    description:
      "おいしい",
    image: "4224510_s.jpg",
    views: 200,
  },
  {
    title: "オムライス",
    description:
      "おいしい",
    image: "32574037_s.jpg",
    views: 350,
  },
  {
    title: "回鍋肉",
    description:
      "おいしい",
    image: "111_銀山温泉5.jpg",
    views: 250,
  },
  {
    title: "豚の生姜焼き",
    description:
      "おいしい",
    image: "dogoonsen.jpg",
    views: 500,
  },
  {
    title: "ピーマンの肉詰め",
    description:
      "おいしい",
    image: "dogoonsen.jpg",
    views: 500,
  },
];

// 人気順に並べて上位4件だけ取り出す
const topSpots = [...spots]
  .sort((a, b) => b.views - a.views)
  .slice(0, 4);

// SpotCardコンポーネント
const SpotCard: React.FC<Spot> = ({ title, description, image }) => (
  <section className="spot-card  border rounded-lg shadow-md overflow-hidden ">
    <div className="spot-image">
      <img src={image} alt={title} className="w-full h-50 object-cover" />
    </div>
    <div className="spot-info p-4">
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <a href="#" className="text-blue-500 hover:underline">
        詳しく見る
      </a>
    </div>
  </section>
);

// メインページ
const MainPage: React.FC = () => {
  return (
    <main className="grid grid-cols-4 gap-8 w-full px-8 mt-8">
      {topSpots.map((spot) => (
        <SpotCard key={spot.title} {...spot} />
      ))}
    </main>
  );
};

export default MainPage;