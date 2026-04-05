"use client";

import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconChartBar,
  IconChartPie,
  IconCoin,
  IconMinus,
  IconPercentage,
  IconReceiptTax,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInsights } from "@/hooks/UseInsights";
import { useStore } from "@/store/UseStore";
import { formatCurrency, formatPercent } from "@/utils/Formatters";
import { DashboardPageFrame } from "./DashboardPageFrame";

/* ─── helpers ────────────────────────────────────────────────────────────── */

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function getSavingsMessage(rate: number): string {
  if (rate >= 20) {
    return "Strong habit — you are above the 20% savings benchmark.";
  }
  if (rate >= 0) {
    return "There is room to grow — aim for 20% or more saved.";
  }
  return "Spending is outpacing income for this period.";
}

function MomDeltaIcon({ delta }: { delta: number }) {
  if (delta > 0) {
    return <IconArrowUpRight className="h-5 w-5 text-rose-500" />;
  }
  if (delta < 0) {
    return <IconArrowDownRight className="h-5 w-5 text-emerald-500" />;
  }
  return null;
}

function MomBadge({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <Badge
        className="flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground shadow-none"
        variant="outline"
      >
        <IconMinus className="h-3 w-3" />
        No change
      </Badge>
    );
  }

  const isUp = delta > 0;

  return (
    <Badge
      className={
        isUp
          ? "flex items-center gap-0.5 rounded-full border-rose-200 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-600 shadow-none dark:border-rose-800 dark:text-rose-400"
          : "flex items-center gap-0.5 rounded-full border-emerald-200 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 shadow-none dark:border-emerald-800 dark:text-emerald-400"
      }
      variant="outline"
    >
      {isUp ? (
        <IconTrendingUp className="h-3 w-3" />
      ) : (
        <IconTrendingDown className="h-3 w-3" />
      )}
      {isUp ? "+" : ""}
      {formatPercent(delta)} MoM
    </Badge>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */

export function InsightsDashboard() {
  const transactions = useStore((state) => state.transactions);
  const insights = useInsights(transactions);

  const savingsProgress = clamp(insights.savingsRate, 0, 100);
  const momAbs = Math.abs(insights.monthOverMonthExpenseDelta);
  const momProgress = clamp(momAbs, 0, 100);

  return (
    <TooltipProvider>
      <DashboardPageFrame>
        <section className="space-y-8">
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
              <IconChartBar className="h-3 w-3 text-primary" />
              Intelligence
            </p>
            <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
              Insights
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm leading-relaxed">
              Savings pace, category leaders, and month-over-month movement,
              computed directly from your ledger.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 shadow-sm sm:grid-cols-2 xl:grid-cols-3">
            <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
              <div className="flex items-start justify-between">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Savings Rate
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-500/20">
                  <IconPercentage className="h-3.5 w-3.5" />
                </div>
              </div>

              <div
                className={
                  insights.savingsRate >= 0
                    ? "mt-3 font-bold font-heading text-4xl text-emerald-600 tracking-tight dark:text-emerald-500"
                    : "mt-3 font-bold font-heading text-4xl text-rose-600 tracking-tight dark:text-rose-500"
                }
              >
                {formatPercent(insights.savingsRate)}
              </div>

              <p className="mt-5 text-[11px] text-muted-foreground">
                {getSavingsMessage(insights.savingsRate)}
              </p>
            </div>

            <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
              <div className="flex items-start justify-between">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  MoM Expense Change
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                  <IconChartBar className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 font-bold font-heading text-4xl tracking-tight">
                {formatPercent(insights.monthOverMonthExpenseDelta)}
                <MomDeltaIcon delta={insights.monthOverMonthExpenseDelta} />
              </div>

              <div className="mt-5">
                <MomBadge delta={insights.monthOverMonthExpenseDelta} />
              </div>
            </div>

            <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card sm:col-span-2 xl:col-span-1">
              <div className="flex items-start justify-between">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Top Spending Category
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                  <IconChartPie className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-3 truncate font-bold font-heading text-4xl tracking-tight">
                {insights.hasExpenseData
                  ? insights.topCategory
                  : "No spending yet"}
              </div>

              <p className="mt-5 text-[11px] text-muted-foreground">
                {insights.hasExpenseData
                  ? `${formatCurrency(insights.topCategoryAmount)} across all recorded expenses.`
                  : "Add an expense transaction to unlock category insights."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 px-5 py-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Insight momentum
              </span>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {momAbs.toFixed(1)}% absolute MoM swing
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Tooltip>
                <TooltipTrigger className="w-full text-left">
                  <Progress value={savingsProgress}>
                    <ProgressLabel className="text-muted-foreground text-xs">
                      Savings capture
                    </ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </TooltipTrigger>
                <TooltipContent>
                  {savingsProgress.toFixed(1)}% of income retained as savings
                </TooltipContent>
              </Tooltip>

              <Progress
                className={
                  insights.monthOverMonthExpenseDelta > 0
                    ? "**:data-[slot=progress-indicator]:bg-rose-500"
                    : "**:data-[slot=progress-indicator]:bg-emerald-500"
                }
                value={clamp(momProgress, 0, 100)}
              >
                <ProgressLabel className="text-muted-foreground text-xs">
                  Month-over-month delta
                </ProgressLabel>
                <ProgressValue />
              </Progress>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm">
              <div className="border-border/50 border-b bg-muted/20 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">
                    Biggest Single Expense
                  </h2>
                  <div className="rounded-full bg-rose-500/10 p-1.5 text-rose-500 dark:bg-rose-500/20">
                    <IconReceiptTax className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Largest single outgoing transaction
                </p>
              </div>
              <CardContent className="space-y-2 px-5 py-4">
                <p className="line-clamp-1 font-semibold text-foreground text-xl">
                  {insights.hasExpenseData
                    ? insights.biggestExpenseLabel
                    : "No expense recorded yet"}
                </p>
                <p className="font-semibold text-rose-600 text-sm tabular-nums dark:text-rose-500">
                  {formatCurrency(insights.biggestExpenseAmount)}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Single largest expense transaction on record.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm">
              <div className="border-border/50 border-b bg-muted/20 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Avg. Monthly Spend</h2>
                  <div className="rounded-full bg-cyan-500/10 p-1.5 text-cyan-500 dark:bg-cyan-500/20">
                    <IconCoin className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Baseline trend reference
                </p>
              </div>
              <CardContent className="space-y-2 px-5 py-4">
                <p className="font-semibold text-foreground text-xl tabular-nums">
                  {formatCurrency(insights.averageMonthlySpend)}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your baseline reference for future budget alerts and goal
                  setting. Compare each month's expenses to this figure to gauge
                  spending trends.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border border-border/60 bg-card/80 shadow-sm">
            <div className="border-border/50 border-b bg-muted/20 px-5 py-3">
              <h2 className="font-semibold text-sm">Insight Snapshot</h2>
            </div>
            <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5 sm:p-6">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  Top Category
                </span>
                <span className="font-semibold text-sm">
                  {insights.hasExpenseData
                    ? insights.topCategory
                    : "No spending yet"}
                </span>
              </div>

              <Separator
                className="hidden h-8 sm:block"
                orientation="vertical"
              />

              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  Biggest Expense
                </span>
                <span className="max-w-40 truncate font-semibold text-sm">
                  {insights.hasExpenseData
                    ? insights.biggestExpenseLabel
                    : "No expense recorded yet"}
                </span>
              </div>

              <Separator
                className="hidden h-8 sm:block"
                orientation="vertical"
              />

              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  Savings Rate
                </span>
                <span
                  className={
                    insights.savingsRate >= 0
                      ? "font-semibold text-emerald-600 text-sm dark:text-emerald-500"
                      : "font-semibold text-rose-600 text-sm dark:text-rose-500"
                  }
                >
                  {formatPercent(insights.savingsRate)}
                </span>
              </div>

              <Separator
                className="hidden h-8 sm:block"
                orientation="vertical"
              />

              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  MoM Change
                </span>
                <MomBadge delta={insights.monthOverMonthExpenseDelta} />
              </div>

              <Separator
                className="hidden h-8 sm:block"
                orientation="vertical"
              />

              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  Avg. Monthly
                </span>
                <span className="font-semibold text-sm">
                  {formatCurrency(insights.averageMonthlySpend)}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </DashboardPageFrame>
    </TooltipProvider>
  );
}
