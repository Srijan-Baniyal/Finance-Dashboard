"use client";

import { IconFilterOff, IconSearch, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, type TransactionFilters } from "@/types/Index";
import { TransactionDatePicker } from "./TransactionDatePicker";

interface TransactionsFiltersProps {
  filters: TransactionFilters;
  resetFilters: () => void;
  setFilter: <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => void;
}

/** Returns the className for the type filter trigger based on current value */
function getTypeTriggerClass(type: TransactionFilters["type"]): string {
  if (type === "income") {
    return "h-9 w-full text-sm border-emerald-300 bg-emerald-500/5 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400";
  }
  if (type === "expense") {
    return "h-9 w-full text-sm border-rose-300 bg-rose-500/5 text-rose-700 dark:border-rose-700 dark:text-rose-400";
  }
  return "h-9 w-full text-sm";
}

/** Count how many non-default filters are currently active */
function countActiveFilters(filters: TransactionFilters): number {
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
}

export function TransactionsFilters({
  filters,
  setFilter,
  resetFilters,
}: TransactionsFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      {/* Card header strip */}
      <div className="flex items-center justify-between border-border/50 border-b bg-muted/20 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            Filters
          </span>
          {activeCount > 0 && (
            <Badge
              className="h-5 min-w-5 rounded-full px-1.5 font-semibold text-[10px] shadow-none"
              variant="default"
            >
              {activeCount}
            </Badge>
          )}
        </div>

        {activeCount > 0 && (
          <Button
            className="h-7 gap-1 rounded-full px-2.5 text-muted-foreground text-xs hover:bg-muted hover:text-foreground"
            onClick={resetFilters}
            size="sm"
            type="button"
            variant="ghost"
          >
            <IconFilterOff className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          {/* Row 1: Search + Category + Type */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search with inline clear button */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                className="h-9 w-full pr-9 pl-9 text-sm"
                onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Search description or note…"
                value={filters.search}
              />
              {filters.search && (
                <button
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setFilter("search", "")}
                  type="button"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category + Type selects */}
            <div className="grid grid-cols-2 gap-3 sm:w-96">
              <Select
                onValueChange={(value) => {
                  if (value) {
                    setFilter(
                      "category",
                      value as TransactionFilters["category"]
                    );
                  }
                }}
                value={filters.category}
              >
                <SelectTrigger
                  aria-label="Filter by category"
                  className={`h-9 w-full text-sm ${
                    filters.category === "all"
                      ? ""
                      : "border-primary/40 bg-primary/5 text-primary"
                  }`}
                >
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem className="rounded-lg" value="all">
                    All categories
                  </SelectItem>
                  <Separator className="my-1" />
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      className="rounded-lg"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => {
                  if (value) {
                    setFilter("type", value as TransactionFilters["type"]);
                  }
                }}
                value={filters.type}
              >
                <SelectTrigger
                  aria-label="Filter by type"
                  className={getTypeTriggerClass(filters.type)}
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem className="rounded-lg" value="all">
                    All types
                  </SelectItem>
                  <Separator className="my-1" />
                  <SelectItem
                    className="rounded-lg font-medium text-emerald-600 dark:text-emerald-400"
                    value="income"
                  >
                    Income
                  </SelectItem>
                  <SelectItem
                    className="rounded-lg font-medium text-rose-600 dark:text-rose-400"
                    value="expense"
                  >
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Date range + Reset (desktop) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid flex-1 grid-cols-2 gap-3">
              <TransactionDatePicker
                ariaLabel="Start date"
                onChange={(value) => setFilter("dateFrom", value)}
                placeholder="From date"
                value={filters.dateFrom}
              />
              <TransactionDatePicker
                ariaLabel="End date"
                onChange={(value) => setFilter("dateTo", value)}
                placeholder="To date"
                value={filters.dateTo}
              />
            </div>

            {/* Desktop reset button (full label) */}
            <Button
              className="hidden w-auto gap-1.5 text-muted-foreground hover:bg-muted sm:flex"
              disabled={activeCount === 0}
              onClick={resetFilters}
              type="button"
              variant="outline"
            >
              <IconFilterOff className="h-4 w-4" />
              Reset Filters
              {activeCount > 0 && (
                <Badge
                  className="ml-1 h-5 min-w-5 rounded-full px-1 font-semibold text-[10px] shadow-none"
                  variant="secondary"
                >
                  {activeCount}
                </Badge>
              )}
            </Button>

            {/* Mobile reset button (compact) */}
            <Button
              className="w-full gap-1.5 text-muted-foreground hover:bg-muted sm:hidden"
              disabled={activeCount === 0}
              onClick={resetFilters}
              type="button"
              variant="outline"
            >
              <IconFilterOff className="h-4 w-4" />
              Reset Filters
              {activeCount > 0 && (
                <Badge
                  className="ml-1 h-5 min-w-5 rounded-full px-1 font-semibold text-[10px] shadow-none"
                  variant="secondary"
                >
                  {activeCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
