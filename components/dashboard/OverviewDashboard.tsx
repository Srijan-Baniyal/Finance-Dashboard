"use client";

import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconSparkles,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { useStore } from "@/store/UseStore";
import { formatCurrency } from "@/utils/Formatters";
import { DashboardPageFrame } from "./DashboardPageFrame";
import { MarketPulseCard } from "./MarketPulseCard";

/* ─── Chart configs ─────────────────────────────────────────────────────── */

const barChartConfig = {
  income: { label: "Income", color: "#10b981" },
  expense: { label: "Expense", color: "#f43f5e" },
} satisfies ChartConfig;

/*
 * Hardcoded hex palette for the pie / donut chart.
 *
 * SVG `fill` attributes resolve CSS custom properties inconsistently across
 * browsers — hex values are the only safe choice for recharts Cell fills.
 * Colours are chosen to read clearly in both light and dark themes.
 */
const CATEGORY_COLORS = [
  "#f97316", // orange   – brand-adjacent warm hue
  "#3b82f6", // blue
  "#a855f7", // purple
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
] as const;

const pieConfig = {} satisfies ChartConfig;

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/* ─── Component ─────────────────────────────────────────────────────────── */

export function OverviewDashboard() {
  const transactions = useStore((s) => s.transactions);
  const hasTransactions = transactions.length > 0;

  const { cards, pieData, barData } = useMemo(() => {
    const incomeTotal = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expenseTotal = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const monthMap = new Map<
      string,
      { name: string; income: number; expense: number }
    >();
    const categoryMap = new Map<string, number>();

    for (const tx of transactions) {
      const key = tx.date.slice(0, 7);
      const row = monthMap.get(key) ?? { name: key, income: 0, expense: 0 };
      if (tx.type === "income") {
        row.income += tx.amount;
      } else {
        row.expense += tx.amount;
      }
      monthMap.set(key, row);

      if (tx.type === "expense") {
        categoryMap.set(
          tx.category,
          (categoryMap.get(tx.category) ?? 0) + tx.amount
        );
      }
    }

    const sortedMonths = [...monthMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const sortedCategories = [...categoryMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      cards: {
        balance: incomeTotal - expenseTotal,
        income: incomeTotal,
        expenses: expenseTotal,
        savingsRate:
          incomeTotal === 0
            ? 0
            : clamp(((incomeTotal - expenseTotal) / incomeTotal) * 100, 0, 100),
      },
      pieData: sortedCategories,
      barData: sortedMonths,
    };
  }, [transactions]);

  const expenseRatio =
    cards.income > 0 ? clamp((cards.expenses / cards.income) * 100, 0, 100) : 0;

  const totalCategorySpend = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <DashboardPageFrame>
      <section className="space-y-8">
        {/* ── Page header ──────────────────────────────────────────── */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            <IconSparkles className="h-3 w-3 text-primary" />
            Snapshot
          </p>
          <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground text-sm leading-relaxed">
            Balances, cash flow, and category mix — one calm place to see how
            you are doing.
          </p>
        </div>

        {/* ── KPI panels (connected tile grid) ─────────────────────── */}
        {/*
         * gap-px + bg-border/40 on the wrapper lets the background bleed through
         * the 1 px gaps, creating hairline dividers between panels without any
         * explicit border-right / border-bottom gymnastics.
         */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 shadow-sm sm:grid-cols-3">
          {/* Balance */}
          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Total Balance
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                <IconWallet className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 font-bold font-heading text-4xl tracking-tight">
              {formatCurrency(cards.balance)}
            </div>

            {/* Savings-rate progress strip */}
            <div className="mt-5">
              <Progress value={cards.savingsRate}>
                <ProgressLabel className="text-[11px] text-muted-foreground">
                  {cards.savingsRate.toFixed(1)}% of income saved
                </ProgressLabel>
              </Progress>
            </div>
          </div>

          {/* Income */}
          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Total Income
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-500/20">
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 font-bold font-heading text-4xl text-emerald-600 tracking-tight dark:text-emerald-500">
              {formatCurrency(cards.income)}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              Lifetime accumulation
            </p>
          </div>

          {/* Expenses */}
          <div className="group bg-card/95 px-6 pt-5 pb-6 transition-colors hover:bg-card">
            <div className="flex items-start justify-between">
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                Total Expenses
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 transition-transform duration-200 group-hover:scale-110 dark:bg-rose-500/20">
                <IconArrowDownRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 font-bold font-heading text-4xl text-rose-600 tracking-tight dark:text-rose-500">
              {formatCurrency(cards.expenses)}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              Lifetime accumulation
            </p>
          </div>
        </div>

        {/* ── Cash-flow ratio strip ─────────────────────────────────── */}
        {hasTransactions && cards.income > 0 && (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 px-5 py-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Cash flow
              </span>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {expenseRatio.toFixed(1)}% of income spent
              </span>
            </div>

            {/* Two-tone split bar */}
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-l-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${100 - expenseRatio}%` }}
              />
              <div className="h-full flex-1 rounded-r-full bg-rose-500 transition-all duration-700" />
            </div>

            <div className="mt-2.5 flex justify-between">
              <span className="font-medium text-[11px] text-emerald-600 tabular-nums dark:text-emerald-500">
                ↑ {formatCurrency(cards.income)}
              </span>
              <span className="font-medium text-[11px] text-rose-600 tabular-nums dark:text-rose-500">
                ↓ {formatCurrency(cards.expenses)}
              </span>
            </div>
          </div>
        )}

        <MarketPulseCard />

        {/* ── Charts ───────────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Income vs Expenses — bar chart */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm lg:col-span-3">
            <div className="border-border/50 border-b bg-muted/20 px-5 py-4">
              <h2 className="font-semibold text-sm">Income vs Expenses</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Monthly breakdown
              </p>
            </div>

            <div className="px-3 pt-3">
              {hasTransactions ? (
                <ChartContainer
                  className="h-full w-full"
                  config={barChartConfig}
                >
                  <BarChart
                    barCategoryGap="28%"
                    barGap={2}
                    data={barData}
                    margin={{ top: 12, right: 4, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="black"
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => {
                        const [y, m] = val.split("-");
                        return new Date(
                          Number(y),
                          Number(m) - 1
                        ).toLocaleDateString("en-US", { month: "short" });
                      }}
                      tickLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) =>
                        val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                      }
                      tickLine={false}
                      width={44}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => (
                            <>
                              <div
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <div className="flex flex-1 justify-between gap-6 leading-none">
                                <span className="text-muted-foreground">
                                  {name}
                                </span>
                                <span className="font-medium text-foreground tabular-nums">
                                  {formatCurrency(Number(value))}
                                </span>
                              </div>
                            </>
                          )}
                          labelFormatter={(value) => {
                            const [y, m] = String(value).split("-");
                            return new Date(
                              Number(y),
                              Number(m) - 1
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            });
                          }}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="income"
                      fill="var(--color-income)"
                      maxBarSize={36}
                      name="Income"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill="var(--color-expense)"
                      maxBarSize={36}
                      name="Expense"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-72 items-center justify-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No chart data yet</EmptyTitle>
                      <EmptyDescription>
                        Add transactions to see the monthly breakdown.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              )}
            </div>
          </div>

          {/* Spending mix — donut + category list */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm lg:col-span-2">
            <div className="border-border/50 border-b bg-muted/20 px-5 py-4">
              <h2 className="font-semibold text-sm">Spending Mix</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                All-time expenses by category
              </p>
            </div>

            {pieData.length === 0 ? (
              <div className="flex h-72 items-center justify-center p-8">
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No expenses yet</EmptyTitle>
                    <EmptyDescription>
                      Add expense transactions to see the breakdown.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              <>
                {/*
                 * Compact donut — the category list below carries
                 * the narrative; the donut is purely a visual accent.
                 */}
                <ChartContainer className="h-44 w-full" config={pieConfig}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={pieData}
                      dataKey="value"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          key={`cell-${entry.name}`}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, _item) => (
                            <>
                              <div
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    CATEGORY_COLORS[
                                      pieData.findIndex(
                                        (d) => d.name === name
                                      ) % CATEGORY_COLORS.length
                                    ],
                                }}
                              />
                              <div className="flex flex-1 justify-between gap-4 leading-none">
                                <span className="text-muted-foreground">
                                  {name}
                                </span>
                                <span className="font-medium text-foreground tabular-nums">
                                  {formatCurrency(Number(value))}
                                </span>
                              </div>
                            </>
                          )}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>

                {/*
                 * Category breakdown list — replaces the foreignObject legend.
                 * Each row: colour dot · name · mini-bar · % · amount
                 */}
                <div className="space-y-3 px-5 pb-5">
                  {pieData.slice(0, 6).map((entry, index) => {
                    const pct =
                      totalCategorySpend > 0
                        ? (entry.value / totalCategorySpend) * 100
                        : 0;
                    const color =
                      CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                    return (
                      <div key={entry.name}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="flex-1 truncate text-foreground text-sm">
                            {entry.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                            {pct.toFixed(1)}%
                          </span>
                          <span className="w-20 text-right font-medium font-mono text-[11px] text-foreground tabular-nums">
                            {formatCurrency(entry.value)}
                          </span>
                        </div>
                        {/* Proportional mini-bar */}
                        <div className="mt-1.5 ml-4.5 h-0.75 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardPageFrame>
  );
}
