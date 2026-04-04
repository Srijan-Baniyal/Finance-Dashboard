import type { Transaction } from "@/types/Index";

const toCsvRow = (values: string[]): string => {
  const escaped = values.map((value) => `"${value.replaceAll('"', '""')}"`);
  return escaped.join(",");
};

const triggerDownload = (
  fileName: string,
  mimeType: string,
  content: string
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportTransactionsCsv = (transactions: Transaction[]): void => {
  const header = [
    "id",
    "date",
    "description",
    "category",
    "type",
    "amount",
    "note",
  ];
  const rows = transactions.map((transaction) => {
    return toCsvRow([
      transaction.id,
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.type,
      String(transaction.amount),
      transaction.note ?? "",
    ]);
  });

  const csvContent = [toCsvRow(header), ...rows].join("\n");
  triggerDownload("transactions.csv", "text/csv;charset=utf-8", csvContent);
};

export const exportTransactionsJson = (transactions: Transaction[]): void => {
  const jsonContent = JSON.stringify(transactions, null, 2);
  triggerDownload(
    "transactions.json",
    "application/json;charset=utf-8",
    jsonContent
  );
};
