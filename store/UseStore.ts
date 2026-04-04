"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateMockTransactions } from "@/data/MockData";
import type {
  Role,
  ThemeMode,
  Transaction,
  TransactionDraft,
  TransactionFilters,
} from "@/types/Index";

const defaultFilters: TransactionFilters = {
  search: "",
  category: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
};

interface AppStore {
  addTransaction: (draft: TransactionDraft) => void;
  deleteTransaction: (id: string) => void;
  filters: TransactionFilters;
  resetFilters: () => void;
  role: Role;
  setFilter: <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => void;
  setRole: (role: Role) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  transactions: Transaction[];
  updateTransaction: (id: string, patch: Partial<TransactionDraft>) => void;
}

const buildId = (): string => {
  return `txn-${Date.now()}-${Math.floor(Math.random() * 100_000)}`;
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      filters: defaultFilters,
      role: "viewer",
      theme: "light",
      addTransaction: (draft) => {
        set((state) => ({
          transactions: [
            {
              ...draft,
              id: buildId(),
              amount: Math.abs(draft.amount),
            },
            ...state.transactions,
          ],
        }));
      },
      updateTransaction: (id, patch) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) => {
            if (transaction.id !== id) {
              return transaction;
            }

            return {
              ...transaction,
              ...patch,
              amount:
                typeof patch.amount === "number"
                  ? Math.abs(patch.amount)
                  : transaction.amount,
            };
          }),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        }));
      },
      setFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        }));
      },
      resetFilters: () => {
        set({ filters: defaultFilters });
      },
      setRole: (role) => {
        set({ role });
      },
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        }));
      },
    }),
    {
      name: "findash-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        theme: state.theme,
      }),
    }
  )
);
