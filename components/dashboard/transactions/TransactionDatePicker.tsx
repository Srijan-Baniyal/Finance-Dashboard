"use client";

import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/Utils";

interface TransactionDatePickerProps {
  ariaLabel: string;
  id?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

const parseIsoDate = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }
  const parts = value.split("-");
  if (parts.length !== 3) {
    return undefined;
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (
    !(Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day))
  ) {
    return undefined;
  }
  return new Date(year, month - 1, day);
};

const toIsoDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function TransactionDatePicker({
  value,
  onChange,
  ariaLabel,
  placeholder = "Pick date",
  id,
}: TransactionDatePickerProps) {
  const selectedDate = parseIsoDate(value);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={ariaLabel}
            className={cn(
              "h-9 w-full justify-between rounded-lg border-border/70 bg-background/70 px-3 font-medium text-sm shadow-sm transition-colors hover:bg-muted/40 focus-visible:ring-1 focus-visible:ring-primary/30",
              !selectedDate && "text-muted-foreground"
            )}
            id={id}
            variant="outline"
          >
            <span className="truncate">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
            </span>
            <IconCalendar className="ml-2 h-4 w-4 shrink-0 opacity-70" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-auto rounded-xl border border-border/70 bg-card/95 p-0 shadow-xl"
      >
        <Calendar
          autoFocus
          className="rounded-xl p-2"
          mode="single"
          onSelect={(date) => onChange(date ? toIsoDate(date) : "")}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
