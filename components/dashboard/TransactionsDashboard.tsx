"use client";

import {
  IconFileArrowRight,
  IconFileExport,
  IconFileTypePdf,
  IconListDetails,
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilteredTransactions } from "@/hooks/UseFilteredTransactions";
import { useStore } from "@/store/UseStore";
import type { Transaction, TransactionDraft } from "@/types/Index";
import {
  exportTransactionsCsv,
  exportTransactionsJson,
  exportTransactionsPdf,
} from "@/utils/ExportData";
import { formatCurrency } from "@/utils/Formatters";
import { DashboardPageFrame } from "./DashboardPageFrame";
import { TransactionFormDialog } from "./transactions/TransactionFormDialog";
import { TransactionsDataTable } from "./transactions/TransactionsDataTable";
import { TransactionsFilters } from "./transactions/TransactionsFilters";

const getToday = () => new Date().toISOString().slice(0, 10);

const buildInitialDraft = (): TransactionDraft => ({
  date: getToday(),
  description: "",
  amount: 0,
  type: "expense",
  category: "Food & Dining",
  note: "",
});

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export function TransactionsDashboard() {
  const role = useStore((state) => state.role);
  const filters = useStore((state) => state.filters);
  const setFilter = useStore((state) => state.setFilter);
  const resetFilters = useStore((state) => state.resetFilters);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const transactions = useStore((state) => state.transactions);

  const filteredTransactions = useFilteredTransactions();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TransactionDraft>(buildInitialDraft);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const transaction of filteredTransactions) {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    }

    return { income, expense };
  }, [filteredTransactions]);

  const net = totals.income - totals.expense;
  const isNetPositive = net >= 0;
  const filteredCount = filteredTransactions.length;
  const totalCount = transactions.length;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) {
      count++;
    }
    if (filters.category !== "all") {
      count++;
    }
    if (filters.type !== "all") {
      count++;
    }
    if (filters.dateFrom) {
      count++;
    }
    if (filters.dateTo) {
      count++;
    }
    return count;
  }, [filters]);

  const coverage =
    totalCount > 0 ? clamp((filteredCount / totalCount) * 100, 0, 100) : 0;

  const closeDialog = () => {
    setFormOpen(false);
    setEditingId(null);
    setDraft(buildInitialDraft());
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft(buildInitialDraft());
    setFormOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setDraft({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      note: transaction.note ?? "",
    });
    setFormOpen(true);
  };

  const submitDraft = () => {
    const normalizedDescription = draft.description.trim();

    if (!normalizedDescription || draft.amount <= 0 || !draft.date) {
      return;
    }

    if (editingId) {
      updateTransaction(editingId, {
        ...draft,
        description: normalizedDescription,
      });
    } else {
      addTransaction({
        ...draft,
        description: normalizedDescription,
      });
    }

    closeDialog();
  };

  return (
    <DashboardPageFrame>
      <section className="space-y-8">
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            <IconListDetails className="h-3 w-3 text-primary" />
            Ledger
          </p>
          <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
            Transactions
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground text-sm leading-relaxed">
            Search, filter, and manage every movement in one clean timeline.
          </p>
        </div>

        {role === "admin" && (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="h-8 gap-1.5 hover:bg-muted"
                      onClick={() => exportTransactionsCsv(transactions)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <IconFileArrowRight className="h-3.5 w-3.5" />
                      Export CSV
                    </Button>
                  }
                />
                <TooltipContent side="bottom">
                  Export all transactions as CSV
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="h-8 gap-1.5 hover:bg-muted"
                      onClick={() => exportTransactionsJson(transactions)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <IconFileExport className="h-3.5 w-3.5" />
                      Export JSON
                    </Button>
                  }
                />
                <TooltipContent side="bottom">
                  Export all transactions as JSON
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="h-8 gap-1.5 hover:bg-muted"
                      onClick={() => exportTransactionsPdf(transactions)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <IconFileTypePdf className="h-3.5 w-3.5" />
                      Export PDF
                    </Button>
                  }
                />
                <TooltipContent side="bottom">
                  Export all transactions as PDF
                </TooltipContent>
              </Tooltip>

              <Separator
                className="mx-1 hidden h-6 sm:block"
                orientation="vertical"
              />

              <Button
                className="h-8 gap-1.5 rounded-lg sm:ml-auto"
                onClick={openCreate}
                size="sm"
                type="button"
              >
                <IconPlus className="h-3.5 w-3.5" />
                Add Transaction
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 shadow-sm sm:grid-cols-3">
          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Filtered Income
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-500/20">
                <IconTrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 font-bold font-heading text-4xl text-emerald-600 tracking-tight dark:text-emerald-500">
              {formatCurrency(totals.income)}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              Income inside current filters
            </p>
          </div>

          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Filtered Expenses
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 transition-transform duration-200 group-hover:scale-110 dark:bg-rose-500/20">
                <IconTrendingDown className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 font-bold font-heading text-4xl text-rose-600 tracking-tight dark:text-rose-500">
              {formatCurrency(totals.expense)}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              Expense load in the visible slice
            </p>
          </div>

          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Filtered Balance
              </span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${
                  isNetPositive
                    ? "bg-primary/10 text-primary"
                    : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20"
                }`}
              >
                <IconWallet className="h-3.5 w-3.5" />
              </div>
            </div>

            <div
              className={`mt-3 font-bold font-heading text-4xl tracking-tight ${
                isNetPositive
                  ? "text-foreground"
                  : "text-rose-600 dark:text-rose-500"
              }`}
            >
              {formatCurrency(net)}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              Net movement in current result set
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 px-5 py-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Visible coverage
            </span>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {filteredCount} / {totalCount} transactions shown
            </span>
          </div>

          <Progress className="gap-0" value={coverage} />

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[11px] text-muted-foreground">
                Active filters
              </span>
              <Badge
                className="h-5 rounded-full px-1.5 text-[10px]"
                variant="secondary"
              >
                {activeFilterCount}
              </Badge>
            </div>
            <span
              className={`font-medium text-[11px] tabular-nums ${
                isNetPositive
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-rose-600 dark:text-rose-500"
              }`}
            >
              Balance {isNetPositive ? "surplus" : "deficit"}:{" "}
              {formatCurrency(net)}
            </span>
          </div>
        </div>

        <TransactionsFilters
          filters={filters}
          resetFilters={resetFilters}
          setFilter={setFilter}
        />

        <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-border/50 border-b bg-muted/20 px-5 py-4">
            <div>
              <h2 className="font-semibold text-sm">Transactions Ledger</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {filteredCount} visible of {totalCount} total entries
              </p>
            </div>
            {activeFilterCount > 0 && (
              <Badge
                className="h-6 rounded-full px-2.5 text-[10px]"
                variant="secondary"
              >
                {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}{" "}
                applied
              </Badge>
            )}
          </div>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="p-12">
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No transactions found</EmptyTitle>
                    <EmptyDescription>
                      {role === "admin"
                        ? "Try adjusting your filters or add a new transaction."
                        : "Try resetting the filters to see all transactions."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              <TransactionsDataTable
                onDelete={deleteTransaction}
                onEdit={openEdit}
                onSortChange={(sortBy, sortOrder) => {
                  setFilter("sortBy", sortBy);
                  setFilter("sortOrder", sortOrder);
                }}
                role={role}
                rows={filteredTransactions}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
              />
            )}
          </CardContent>
        </Card>

        {/* ── Add / Edit dialog (admin only) ───────────────── */}
        {role === "admin" && (
          <TransactionFormDialog
            draft={draft}
            isEditing={Boolean(editingId)}
            onClose={closeDialog}
            onOpenChange={setFormOpen}
            onSubmit={submitDraft}
            open={formOpen}
            setDraft={setDraft}
          />
        )}
      </section>
    </DashboardPageFrame>
  );
}
