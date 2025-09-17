// 食材の種類
export type FoodCategory = 'すべて' | '果物' | '野菜' | '乳製品' | '肉類';

// 食材アイテムの型定義
export interface FoodItem {
  id: number;
  name: string;
  quantity: string;
  expiryDate: string;
  category: FoodCategory;
  status: '新鮮' | 'まもなく期限切れ' | '期限切れ';
}

export interface AddFoodFormProps {
  onAdd: (item: Omit<FoodItem, 'id'>) => void;
  onCancel: () => void;
}

export interface FoodTableProps {
  items: FoodItem[];
  onEdit: (id: number, updatedItem: Omit<FoodItem, 'id'>) => void;
  onDelete: (id: number) => void;
}