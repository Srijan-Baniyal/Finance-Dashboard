"use client";

import {
  IconArrowDown,
  IconArrowsSort,
  IconArrowUp,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Role, Transaction, TransactionFilters } from "@/types/Index";
import { formatDate, formatSignedAmount } from "@/utils/Formatters";

interface TransactionsDataTableProps {
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onSortChange: (
    sortBy: TransactionFilters["sortBy"],
    sortOrder: TransactionFilters["sortOrder"]
  ) => void;
  role: Role;
  rows: Transaction[];
  sortBy: TransactionFilters["sortBy"];
  sortOrder: TransactionFilters["sortOrder"];
}

const SortIcon = ({ isSorted }: { isSorted: false | "asc" | "desc" }) => {
  if (isSorted === "asc") {
    return <IconArrowUp className="ml-1.5 h-3.5 w-3.5" />;
  }
  if (isSorted === "desc") {
    return <IconArrowDown className="ml-1.5 h-3.5 w-3.5" />;
  }
  return (
    <IconArrowsSort className="ml-1.5 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-40" />
  );
};

function TypeBadge({ type }: { type: Transaction["type"] }) {
  if (type === "income") {
    return (
      <Badge className="rounded-full border-emerald-200 bg-emerald-500/10 px-2 py-0.5 font-semibold text-[10px] text-emerald-600 shadow-none dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
        Income
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full border-rose-200 bg-rose-500/10 px-2 py-0.5 font-semibold text-[10px] text-rose-600 shadow-none dark:border-rose-800 dark:bg-rose-500/20 dark:text-rose-400">
      Expense
    </Badge>
  );
}

export function TransactionsDataTable({
  rows,
  role,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSortChange,
}: TransactionsDataTableProps) {
  const sorting = useMemo<SortingState>(
    () => [{ id: sortBy, desc: sortOrder === "desc" }],
    [sortBy, sortOrder]
  );

  const columns = useMemo<ColumnDef<Transaction>[]>(() => {
    const base: ColumnDef<Transaction>[] = [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            className="group -ml-2 h-8 rounded-md px-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:bg-muted"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            type="button"
            variant="ghost"
          >
            Date <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="whitespace-nowrap font-medium text-foreground text-sm tabular-nums">
            {formatDate(row.original.date)}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <Button
            className="group -ml-2 h-8 rounded-md px-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:bg-muted"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            type="button"
            variant="ghost"
          >
            Description <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="max-w-52 truncate font-medium text-foreground text-sm">
            {row.original.description}
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <Button
            className="group -ml-2 h-8 rounded-md px-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:bg-muted"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            type="button"
            variant="ghost"
          >
            Category <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">
            {row.original.category}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: () => (
          <div className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Type
          </div>
        ),
        cell: ({ row }) => <TypeBadge type={row.original.type} />,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            className="group -ml-2 h-8 rounded-md px-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:bg-muted"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            type="button"
            variant="ghost"
          >
            Amount <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => {
          const isExpense = row.original.type === "expense";
          return (
            <div
              className={
                isExpense
                  ? "whitespace-nowrap font-semibold text-rose-600 text-sm tabular-nums dark:text-rose-500"
                  : "whitespace-nowrap font-semibold text-emerald-600 text-sm tabular-nums dark:text-emerald-500"
              }
            >
              {formatSignedAmount(row.original.amount, isExpense)}
            </div>
          );
        },
      },
      {
        accessorKey: "note",
        header: () => (
          <div className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Note
          </div>
        ),
        cell: ({ row }) => (
          <div className="max-w-48 truncate text-muted-foreground text-sm italic">
            {row.original.note ? (
              `"${row.original.note}"`
            ) : (
              <span className="not-italic opacity-70">No notes</span>
            )}
          </div>
        ),
      },
    ];

    if (role === "admin") {
      base.push({
        id: "actions",
        header: () => (
          <div className="px-1 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Actions
          </div>
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    onClick={() => onEdit(row.original)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <IconEdit className="h-4 w-4" />
                    <span className="sr-only">Edit transaction</span>
                  </Button>
                }
              />
              <TooltipContent side="top">Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(row.original.id)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <IconTrash className="h-4 w-4" />
                    <span className="sr-only">Delete transaction</span>
                  </Button>
                }
              />
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          </div>
        ),
      });
    }

    return base;
  }, [role, onEdit, onDelete]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    getRowId: (row) => row.id,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const nextSort = next[0];

      if (!nextSort) {
        onSortChange("date", "desc");
        return;
      }

      const rawSortBy = String(nextSort.id);
      const supportedSortBy: TransactionFilters["sortBy"] =
        rawSortBy === "date" ||
        rawSortBy === "amount" ||
        rawSortBy === "category" ||
        rawSortBy === "description"
          ? rawSortBy
          : "date";

      onSortChange(supportedSortBy, nextSort.desc ? "desc" : "asc");
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const desktopHidden = new Set(["note"]);
  const wideOnly = new Set(["category"]);

  return (
    <TooltipProvider>
      <div className="grid gap-2 p-3 md:hidden">
        {table.getRowModel().rows.map((row) => {
          const transaction = row.original;
          const isExpense = transaction.type === "expense";

          return (
            <div
              className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 px-3.5 py-3.5 shadow-sm transition-colors hover:bg-muted/35"
              key={row.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground text-sm">
                    {transaction.description}
                  </p>
                  <p className="mt-0.5 font-medium text-muted-foreground text-xs">
                    {formatDate(transaction.date)}
                    <span className="mx-1.5 opacity-40">·</span>
                    {transaction.category}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <p
                    className={
                      isExpense
                        ? "font-bold text-rose-600 text-sm tabular-nums dark:text-rose-500"
                        : "font-bold text-emerald-600 text-sm tabular-nums dark:text-emerald-500"
                    }
                  >
                    {formatSignedAmount(transaction.amount, isExpense)}
                  </p>
                  <TypeBadge type={transaction.type} />
                </div>
              </div>

              <p className="truncate text-muted-foreground text-xs italic">
                {transaction.note ? `"${transaction.note}"` : "No notes"}
              </p>

              {role === "admin" && (
                <div className="flex gap-2 border-border/50 border-t pt-3">
                  <Button
                    className="h-8 flex-1 gap-1.5 rounded-md border-border/70 bg-background text-xs hover:bg-primary/10 hover:text-primary"
                    onClick={() => onEdit(transaction)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    className="h-8 flex-1 gap-1.5 rounded-md text-destructive text-xs hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onDelete(transaction.id)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/25">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-border/70 border-b hover:bg-muted/45"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  const columnId = header.column.id;
                  const className = [
                    "h-11 px-4 align-middle",
                    desktopHidden.has(columnId) ? "hidden lg:table-cell" : "",
                    wideOnly.has(columnId) ? "hidden xl:table-cell" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <TableHead className={className} key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/45 data-[even=true]:bg-muted/22"
                data-even={rowIndex % 2 === 0}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;
                  const className = [
                    "p-4 align-middle",
                    desktopHidden.has(columnId) ? "hidden lg:table-cell" : "",
                    wideOnly.has(columnId) ? "hidden xl:table-cell" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <TableCell className={className} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
