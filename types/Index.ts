export const CATEGORIES = [
  "Housing",
  "Food & Dining",
  "Transport",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Utilities",
  "Income",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type TransactionType = "income" | "expense";

export type Role = "admin" | "viewer";

export type ThemeMode = "light" | "dark";

export interface Transaction {
  amount: number;
  category: Category;
  date: string;
  description: string;
  id: string;
  note?: string;
  type: TransactionType;
}

export interface TransactionFilters {
  category: Category | "all";
  dateFrom: string;
  dateTo: string;
  search: string;
  sortBy: "date" | "amount" | "category";
  sortOrder: "asc" | "desc";
  type: TransactionType | "all";
}

export interface TransactionDraft {
  amount: number;
  category: Category;
  date: string;
  description: string;
  note?: string;
  type: TransactionType;
}
