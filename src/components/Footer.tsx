
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-gray-200 py-10">
    <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="text-lg font-semibold mb-4">My Fridge</h4>
        <p className="text-sm">
          冷蔵庫の中身をスマートに管理して、<br />余り物から新しいアイデアを見つけよう。
        </p>
      </div>
      <div >
        <h4 className="text-lg font-semibold mb-4">メニュー</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:underline">在庫リスト</a></li>
          <li><a href="#" className="hover:underline">レシピ検索</a></li>
          <li><a href="#" className="hover:underline">お気に入り</a></li>
          <li><a href="#" className="hover:underline">グループ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-4">サポート</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:underline">FAQ</a></li>
          <li><a href="#" className="hover:underline">お問い合わせ</a></li>
          <li><a href="#" className="hover:underline">利用規約</a></li>
          <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
        </ul>
      </div>
    </div>
    <div className="mt-10 border-t border-gray-600 pt-4 text-center text-xs text-gray-400">
      © 2025 My Fridge. All rights reserved.
    </div>
  </footer>
);

export default Footer;
