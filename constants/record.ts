import {
  ArrowUpCircle,
  ArrowDownCircle,
  Briefcase,
  Wallet,
  Gift,
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  GraduationCap,
  ShoppingBag,
  Plane,
  Home,
  TrendingUp,
} from 'lucide-react';

export const types = [
  { value: 'income', label: 'Income', icon: ArrowUpCircle },
  { value: 'expense', label: 'Expense', icon: ArrowDownCircle },
];

export const categories = [
  { value: 'salary', label: 'Salary', icon: Wallet },
  { value: 'freelance', label: 'Freelance', icon: Briefcase },
  { value: 'investment', label: 'Investment', icon: TrendingUp },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'food', label: 'Food', icon: Utensils },
  { value: 'transport', label: 'Transport', icon: Car },
  { value: 'utilities', label: 'Utilities', icon: Zap },
  { value: 'entertainment', label: 'Entertainment', icon: Film },
  { value: 'health', label: 'Health', icon: Heart },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'rent', label: 'Rent', icon: Home },
];
