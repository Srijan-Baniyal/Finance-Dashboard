"use client";

import { useMemo } from "react";
import type { Transaction } from "@/types/Index";

const getMonthKey = (date: string): string => date.slice(0, 7);

interface InsightSnapshot {
  averageMonthlySpend: number;
  biggestExpenseAmount: number;
  biggestExpenseLabel: string;
  hasExpenseData: boolean;
  monthOverMonthExpenseDelta: number;
  savingsRate: number;
  topCategory: string;
  topCategoryAmount: number;
}

export const useInsights = (transactions: Transaction[]): InsightSnapshot => {
  return useMemo(() => {
    const expenses = transactions.filter(
      (transaction) => transaction.type === "expense"
    );
    const income = transactions.filter(
      (transaction) => transaction.type === "income"
    );

    const expenseByCategory = new Map<string, number>();

    for (const expense of expenses) {
      const current = expenseByCategory.get(expense.category) ?? 0;
      expenseByCategory.set(expense.category, current + expense.amount);
    }

    let topCategory = "No data";
    let topCategoryAmount = 0;

    for (const [category, amount] of expenseByCategory.entries()) {
      if (amount > topCategoryAmount) {
        topCategory = category;
        topCategoryAmount = amount;
      }
    }

    const expenseByMonth = new Map<string, number>();

    for (const expense of expenses) {
      const monthKey = getMonthKey(expense.date);
      const current = expenseByMonth.get(monthKey) ?? 0;
      expenseByMonth.set(monthKey, current + expense.amount);
    }

    const sortedExpenseMonths = [...expenseByMonth.entries()].sort(
      ([left], [right]) => left.localeCompare(right)
    );

    let monthOverMonthExpenseDelta = 0;

    if (sortedExpenseMonths.length >= 2) {
      const previous = sortedExpenseMonths.at(-2)?.[1] ?? 0;
      const current = sortedExpenseMonths.at(-1)?.[1] ?? 0;
      monthOverMonthExpenseDelta =
        previous === 0 ? 0 : ((current - previous) / previous) * 100;
    }

    const incomeTotal = income.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    const expenseTotal = expenses.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    const savingsRate =
      incomeTotal === 0
        ? 0
        : ((incomeTotal - expenseTotal) / incomeTotal) * 100;

    const biggestExpense = expenses.reduce<Transaction | null>(
      (currentBiggest, expense) => {
        if (!currentBiggest) {
          return expense;
        }

        return expense.amount > currentBiggest.amount
          ? expense
          : currentBiggest;
      },
      null
    );

    const monthsCovered = new Set(
      transactions.map((transaction) => getMonthKey(transaction.date))
    ).size;
    const averageMonthlySpend =
      monthsCovered === 0 ? 0 : expenseTotal / monthsCovered;

    return {
      topCategory,
      topCategoryAmount,
      monthOverMonthExpenseDelta,
      savingsRate,
      hasExpenseData: expenses.length > 0,
      biggestExpenseLabel: biggestExpense?.description ?? "No expense found",
      biggestExpenseAmount: biggestExpense?.amount ?? 0,
      averageMonthlySpend,
    };
  }, [transactions]);
};
