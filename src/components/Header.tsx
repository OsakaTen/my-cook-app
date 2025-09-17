import Link from "next/link";

interface NavItem {
  title: string;
  href: string;
}

const Header: React.FC = () => {

  const navItems: NavItem[] = [
    { title: '食材管理', href: '/inventory' },
    { title: 'レシピ提案', href: '/recipes' },
    { title: 'グループ共有', href: '/groups' },
    { title: 'お気に入り', href: '/favorites' },
    { title: '設定', href: '/settings' },
  ]

  return (
    <header className="flex justify-around  py-6 px-8  mb-30 fixed top-0 left-0 w-full z-50 bg-[#FAFAFA] shadow-md">
      {/* <h1 className="font-bold text-gray-800 text-3xl">My Fridge</h1> */}
      <Link href="/" className="font-bold text-gray-800 text-3xl">My Fridge</Link>
      <ul className="flex flex-row gap-8 text-xl">
        {navItems.map((item: NavItem) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="inline-block text-gray-700 hover:text-blue-500 hover:underline transition-colors">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}

export default Header;

