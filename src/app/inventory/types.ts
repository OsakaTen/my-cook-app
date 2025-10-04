// Prismaのenumに合わせる
export type FoodCategory = '野菜' | '果物' | '肉' | '魚' | '乳製品' | '調味料' | 'その他'| 'すべて';

export type FoodStatus = '新鮮' | 'まもなく期限切れ' | '期限切れ';

export interface FoodItem {
  id: number;
  name: string;
  quantity: string;
  expiryDate: string;
  category: FoodCategory;
  status: FoodStatus;
}

export interface AddFoodFormProps {
  userId: number;
  onAdd: () => void;
  onCancel: () => void;
}

export interface FoodTableProps {
  items: FoodItem[];
  onEdit: (id: number, updatedItem: Omit<FoodItem, 'id'>) => void;
  onDelete: (id: number) => void;
}