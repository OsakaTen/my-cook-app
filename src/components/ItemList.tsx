import React from "react";
import { Item } from "../page";

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  if (items.length === 0) return <p>まだ食材がありません。</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          {item.name}
          <button onClick={() => onDelete(item.id)}>削除</button>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;