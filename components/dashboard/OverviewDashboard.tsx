"use client";

import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconChartBar,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/UseStore";
import { formatCurrency } from "@/utils/Formatters";
import { DashboardPageFrame } from "./DashboardPageFrame";

/* ── Chart colour config ─────────────────────────────────────────────────── */
const barChartConfig = {
  income: { label: "Income", color: "#10b981" },
  expense: { label: "Expense", color: "#f43f5e" },
} satisfies ChartConfig;

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const pieChartConfig = {} satisfies ChartConfig;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function OverviewDashboard() {
  const transactions = useStore((state) => state.transactions);
  const hasTransactions = transactions.length > 0;

  const { cards, pieData, barData } = useMemo(() => {
    const incomeTotal = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenseTotal = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthMap = new Map<
      string,
      { name: string; income: number; expense: number }
    >();
    const categoryMap = new Map<string, number>();

    for (const tx of transactions) {
      const monthPrefix = tx.date.slice(0, 7);
      const existing = monthMap.get(monthPrefix) ?? {
        name: monthPrefix,
        income: 0,
        expense: 0,
      };

      if (tx.type === "income") {
        existing.income += tx.amount;
      } else {
        existing.expense += tx.amount;
      }

      monthMap.set(monthPrefix, existing);

      if (tx.type === "expense") {
        categoryMap.set(
          tx.category,
          (categoryMap.get(tx.category) ?? 0) + tx.amount
        );
      }
    }

    const sortedMonths = Array.from(monthMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const sortedCategories = Array.from(categoryMap.entries())
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

  return (
    <DashboardPageFrame>
      <section className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 px-5 py-6 shadow-sm sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 flex items-center gap-2 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.22em]">
                <IconSparkles className="h-3.5 w-3.5 text-primary" />
                Snapshot
              </p>
              <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
                Overview
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground text-sm leading-relaxed">
                Balances, cash flow, and category mix — one calm place to see
                how you are doing.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Balance */}
          <Card className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
            {/* Colour accent stripe */}
            <span className="absolute inset-y-0 left-0 w-0.75 rounded-l-xl bg-primary/70" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pl-6">
              <CardTitle className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Total Balance
              </CardTitle>
              <div className="rounded-full bg-primary/10 p-2.5 text-primary transition-transform duration-200 group-hover:scale-110">
                <IconWallet className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="pl-6">
              <div className="font-bold font-heading text-3xl tracking-tight">
                {formatCurrency(cards.balance)}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">Savings rate</p>
              {/* Savings-rate progress */}
              <div className="mt-2">
                <Progress value={cards.savingsRate}>
                  <ProgressLabel className="font-medium text-[11px] text-muted-foreground">
                    {cards.savingsRate.toFixed(1)}% saved
                  </ProgressLabel>
                  <ProgressValue className="text-[11px]" />
                </Progress>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
            <span className="absolute inset-y-0 left-0 w-0.75 rounded-l-xl bg-emerald-500/70" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pl-6">
              <CardTitle className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Total Income
              </CardTitle>
              <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-500 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-500/20">
                <IconArrowUpRight className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="pl-6">
              <div className="font-bold font-heading text-3xl text-emerald-600 tracking-tight dark:text-emerald-500">
                {formatCurrency(cards.income)}
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                Lifetime accumulation
              </p>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:ring-white/10">
            <span className="absolute inset-y-0 left-0 w-0.75 rounded-l-xl bg-rose-500/70" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pl-6">
              <CardTitle className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Total Expenses
              </CardTitle>
              <div className="rounded-full bg-rose-500/10 p-2.5 text-rose-500 transition-transform duration-200 group-hover:scale-110 dark:bg-rose-500/20">
                <IconArrowDownRight className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="pl-6">
              <div className="font-bold font-heading text-3xl text-rose-600 tracking-tight dark:text-rose-500">
                {formatCurrency(cards.expenses)}
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                Lifetime accumulation
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="opacity-60" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all lg:col-span-4 dark:ring-white/10">
            <CardHeader className="border-border/50 border-b bg-muted/25 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <IconChartBar className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="font-semibold text-sm">
                    Income vs Expenses
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Monthly breakdown
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-4">
              {hasTransactions ? (
                <ChartContainer className="h-80 w-full" config={barChartConfig}>
                  <BarChart
                    data={barData}
                    margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      className="opacity-40"
                      stroke="hsl(var(--border))"
                      strokeDasharray="4 4"
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
                      width={46}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => (
                            <>
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
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
                      maxBarSize={40}
                      name="Income"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill="var(--color-expense)"
                      maxBarSize={40}
                      name="Expense"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-80 items-center justify-center p-8">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No chart data</EmptyTitle>
                      <EmptyDescription>
                        Add transactions to see the monthly breakdown.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart — Spending Breakdown */}
          <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 transition-all lg:col-span-3 dark:ring-white/10">
            <CardHeader className="border-border/50 border-b bg-muted/25 px-5 py-4">
              <CardTitle className="font-semibold text-sm">
                Spending Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                All-time expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-4">
              {pieData.length === 0 ? (
                <div className="flex h-80 items-center justify-center p-8">
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
                <ChartContainer className="h-80 w-full" config={pieChartConfig}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="44%"
                      data={pieData}
                      dataKey="value"
                      innerRadius={72}
                      outerRadius={104}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
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
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    PIE_COLORS[
                                      pieData.findIndex(
                                        (d) => d.name === name
                                      ) % PIE_COLORS.length
                                    ],
                                }}
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
                        />
                      }
                    />
                    {/* Manual legend rows */}
                    <foreignObject height="120" width="100%" x="0" y="66%">
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-4">
                        {pieData.slice(0, 5).map((entry, index) => (
                          <div
                            className="flex items-center gap-1.5"
                            key={entry.name}
                          >
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  PIE_COLORS[index % PIE_COLORS.length],
                              }}
                            />
                            <span className="text-[11px] text-muted-foreground">
                              {entry.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </foreignObject>
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardPageFrame>
  );
}
