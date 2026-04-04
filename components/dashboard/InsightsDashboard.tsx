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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 px-5 py-6 shadow-sm sm:px-8 sm:py-7">
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-48 translate-x-1/4 -translate-y-1/2 rounded-full bg-chart-2/15 blur-3xl" />
            <div className="relative">
              <p className="mb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.22em]">
                Intelligence
              </p>
              <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
                Insights
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-relaxed">
                Savings pace, category leaders, and month-over-month movement —
                computed directly from your ledger.
              </p>
            </div>
          </div>

          <Separator className="opacity-60" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card className="rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-xs uppercase tracking-wider">
                    Savings rate
                  </CardDescription>
                  <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500 dark:bg-emerald-500/20">
                    <IconPercentage className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle
                  className={
                    insights.savingsRate >= 0
                      ? "mt-2 text-2xl text-emerald-600 dark:text-emerald-500"
                      : "mt-2 text-2xl text-rose-600 dark:text-rose-500"
                  }
                >
                  {formatPercent(insights.savingsRate)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Tooltip>
                  <TooltipTrigger className="w-full text-left">
                    <Progress value={savingsProgress}>
                      <ProgressLabel className="text-muted-foreground text-xs">
                        Saved of income
                      </ProgressLabel>
                      <ProgressValue />
                    </Progress>
                  </TooltipTrigger>
                  <TooltipContent>
                    {savingsProgress.toFixed(1)}% of income retained as savings
                  </TooltipContent>
                </Tooltip>
                <p className="text-muted-foreground text-xs">
                  {getSavingsMessage(insights.savingsRate)}
                </p>
              </CardContent>
            </Card>

            {/* MoM Expense Change */}
            <Card className="rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-xs uppercase tracking-wider">
                    MoM expense change
                  </CardDescription>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <IconChartBar className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle className="mt-2 flex items-center gap-2 text-2xl">
                  {formatPercent(insights.monthOverMonthExpenseDelta)}
                  <MomDeltaIcon delta={insights.monthOverMonthExpenseDelta} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress
                  className={
                    insights.monthOverMonthExpenseDelta > 0
                      ? "[&_[data-slot=progress-indicator]]:bg-rose-500"
                      : "[&_[data-slot=progress-indicator]]:bg-emerald-500"
                  }
                  value={clamp(momProgress, 0, 100)}
                >
                  <ProgressLabel className="text-muted-foreground text-xs">
                    Month-over-month delta
                  </ProgressLabel>
                  <ProgressValue />
                </Progress>
                <MomBadge delta={insights.monthOverMonthExpenseDelta} />
              </CardContent>
            </Card>

            {/* Top Spending Category */}
            <Card className="rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-xs uppercase tracking-wider">
                    Top spending category
                  </CardDescription>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <IconChartPie className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle className="mt-2 truncate text-2xl">
                  {insights.topCategory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-muted-foreground text-sm">
                  {formatCurrency(insights.topCategoryAmount)}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Highest cumulative spend across all transactions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-xs uppercase tracking-wider">
                    Biggest single expense
                  </CardDescription>
                  <div className="rounded-full bg-rose-500/10 p-2 text-rose-500 dark:bg-rose-500/20">
                    <IconReceiptTax className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle className="mt-2 line-clamp-1 text-2xl">
                  {insights.biggestExpenseLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-rose-600 text-sm dark:text-rose-500">
                  {formatCurrency(insights.biggestExpenseAmount)}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Single largest expense transaction on record.
                </p>
              </CardContent>
            </Card>

            {/* Average Monthly Spend */}
            <Card className="rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-xs uppercase tracking-wider">
                    Avg. monthly spend
                  </CardDescription>
                  <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-500 dark:bg-cyan-500/20">
                    <IconCoin className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle className="mt-2 text-2xl">
                  {formatCurrency(insights.averageMonthlySpend)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your baseline reference for future budget alerts and goal
                  setting. Compare each month's expenses to this figure to gauge
                  spending trends.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Summary strip ──────────────────────────────────── */}
          <Card className="rounded-2xl border border-border/80 bg-card/60 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5 sm:p-6">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                  Top Category
                </span>
                <span className="font-semibold text-sm">
                  {insights.topCategory}
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
                  {insights.biggestExpenseLabel}
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
