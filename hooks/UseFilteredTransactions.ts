"use client";

import { useMemo } from "react";
import { useStore } from "@/store/UseStore";
import type { Transaction } from "@/types/Index";

export const useFilteredTransactions = (): Transaction[] => {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);

  return useMemo(() => {
    let result = [...transactions];

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter((transaction) => {
        return (
          transaction.description.toLowerCase().includes(query) ||
          transaction.note?.toLowerCase().includes(query)
        );
      });
    }

    if (filters.category !== "all") {
      result = result.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    if (filters.type !== "all") {
      result = result.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    if (filters.dateFrom) {
      result = result.filter(
        (transaction) => transaction.date >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      result = result.filter(
        (transaction) => transaction.date <= filters.dateTo
      );
    }

    return result;
  }, [transactions, filters]);
};
