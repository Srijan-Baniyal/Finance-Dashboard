"use client";

import {
  IconFileArrowRight,
  IconFileExport,
  IconListDetails,
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
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
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border/80 bg-card/40 px-5 py-6 shadow-sm sm:px-8 sm:py-7 lg:max-w-2xl">
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
            <div className="relative">
              <p className="mb-1.5 flex items-center gap-2 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.22em]">
                <IconListDetails className="h-3.5 w-3.5 text-primary" />
                Ledger
              </p>
              <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
                Transactions
              </h1>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                Search, slice, and export — every movement in one place.
              </p>
            </div>
          </div>

          {role === "admin" && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              {/* Export buttons */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="flex-1 gap-1.5 shadow-sm hover:bg-muted sm:flex-none"
                      onClick={() => exportTransactionsCsv(transactions)}
                      type="button"
                      variant="outline"
                    >
                      <IconFileArrowRight className="h-4 w-4" />
                      CSV
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
                      className="flex-1 gap-1.5 shadow-sm hover:bg-muted sm:flex-none"
                      onClick={() => exportTransactionsJson(transactions)}
                      type="button"
                      variant="outline"
                    >
                      <IconFileExport className="h-4 w-4" />
                      JSON
                    </Button>
                  }
                />
                <TooltipContent side="bottom">
                  Export all transactions as JSON
                </TooltipContent>
              </Tooltip>

              <Separator
                className="hidden h-6 sm:block"
                orientation="vertical"
              />

              <Button
                className="w-full gap-1.5 rounded-xl shadow-sm sm:w-auto"
                onClick={openCreate}
                type="button"
              >
                <IconPlus className="h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          )}
        </div>

        <TransactionsFilters
          filters={filters}
          resetFilters={resetFilters}
          setFilter={setFilter}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="group rounded-2xl border border-emerald-500/25 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/45 hover:shadow-md dark:ring-white/10">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-500/20">
                <IconTrendingUp className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                  Filtered Income
                </p>
                <p className="mt-0.5 font-bold text-emerald-600 text-xl tabular-nums tracking-tight dark:text-emerald-500">
                  {formatCurrency(totals.income)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="group rounded-2xl border border-rose-500/25 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/45 hover:shadow-md dark:ring-white/10">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-full bg-rose-500/10 p-3 text-rose-500 transition-transform duration-200 group-hover:scale-110 dark:bg-rose-500/20">
                <IconTrendingDown className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                  Filtered Expenses
                </p>
                <p className="mt-0.5 font-bold text-rose-600 text-xl tabular-nums tracking-tight dark:text-rose-500">
                  {formatCurrency(totals.expense)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Net balance */}
          <Card
            className={`group rounded-2xl border bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10 ${
              isNetPositive
                ? "border-primary/25 hover:border-primary/45"
                : "border-rose-500/25 hover:border-rose-500/45"
            }`}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`rounded-full p-3 transition-transform duration-200 group-hover:scale-110 ${
                  isNetPositive
                    ? "bg-primary/10 text-primary"
                    : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20"
                }`}
              >
                <IconWallet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                  Filtered Balance
                </p>
                <p
                  className={`mt-0.5 font-bold text-xl tabular-nums tracking-tight ${
                    isNetPositive
                      ? "text-foreground"
                      : "text-rose-600 dark:text-rose-500"
                  }`}
                >
                  {formatCurrency(net)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
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
                role={role}
                rows={filteredTransactions}
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
