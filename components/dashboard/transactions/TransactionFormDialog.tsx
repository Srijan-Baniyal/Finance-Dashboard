"use client";

import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type TransactionDraft } from "@/types/Index";
import { TransactionDatePicker } from "./TransactionDatePicker";

interface TransactionFormDialogProps {
  draft: TransactionDraft;
  isEditing: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  setDraft: React.Dispatch<React.SetStateAction<TransactionDraft>>;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  isEditing,
  draft,
  setDraft,
}: TransactionFormDialogProps) {
  return (
    <Dialog onOpenChange={(nextOpen) => onOpenChange(nextOpen)} open={open}>
      <DialogContent
        className="max-w-xl overflow-hidden rounded-2xl border-border p-0 shadow-2xl"
        showCloseButton={false}
      >
        <div className="border-border border-b bg-muted/40 p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl tracking-tight">
              {isEditing ? "Edit Transaction" : "New Transaction"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Keep amounts positive. The transaction type determines whether it
              is considered income or an expense.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
              htmlFor="transaction-description"
            >
              Description
            </Label>
            <Input
              className="h-10 transition-shadow focus-visible:ring-1 focus-visible:ring-primary/30"
              id="transaction-description"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="e.g. Weekly Groceries"
              value={draft.description}
            />
          </div>

          <div className="space-y-2">
            <Label
              className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
              htmlFor="transaction-amount"
            >
              Amount
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 font-medium text-muted-foreground">
                $
              </span>
              <Input
                className="h-10 pl-7 transition-shadow focus-visible:ring-1 focus-visible:ring-primary/30"
                id="transaction-amount"
                min={0}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    amount: Number(event.target.value),
                  }))
                }
                placeholder="0.00"
                step="0.01"
                type="number"
                value={draft.amount || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
              htmlFor="transaction-date"
            >
              Date
            </Label>
            <TransactionDatePicker
              ariaLabel="Transaction date"
              id="transaction-date"
              onChange={(value) =>
                setDraft((current) => ({ ...current, date: value }))
              }
              value={draft.date}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Category
            </Label>
            <Select
              onValueChange={(value) => {
                if (value) {
                  setDraft((current) => ({
                    ...current,
                    category: value as TransactionDraft["category"],
                  }));
                }
              }}
              value={draft.category}
            >
              <SelectTrigger
                aria-label="Transaction category"
                className="h-10 w-full transition-shadow focus:ring-1 focus:ring-primary/30"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
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
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Type
            </Label>
            <Select
              onValueChange={(value) => {
                if (value) {
                  setDraft((current) => ({
                    ...current,
                    type: value as TransactionDraft["type"],
                  }));
                }
              }}
              value={draft.type}
            >
              <SelectTrigger
                aria-label="Transaction type"
                className="h-10 w-full transition-shadow focus:ring-1 focus:ring-primary/30"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem
                  className="rounded-lg font-medium text-rose-600 dark:text-rose-500"
                  value="expense"
                >
                  Expense
                </SelectItem>
                <SelectItem
                  className="rounded-lg font-medium text-emerald-600 dark:text-emerald-500"
                  value="income"
                >
                  Income
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
              htmlFor="transaction-note"
            >
              Note (Optional)
            </Label>
            <Textarea
              className="h-24 resize-none transition-shadow focus-visible:ring-1 focus-visible:ring-primary/30"
              id="transaction-note"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              placeholder="Add some optional context or details here..."
              value={draft.note}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 border-border border-t bg-muted/20 p-4">
          <Button
            className="rounded-lg text-muted-foreground hover:bg-muted"
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            <IconX className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="rounded-lg shadow-sm"
            onClick={onSubmit}
            type="button"
          >
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            {isEditing ? "Save Changes" : "Create Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
