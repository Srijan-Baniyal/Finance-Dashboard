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

const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 3)}...`;
};

export const exportTransactionsPdf = (transactions: Transaction[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  import("jspdf").then(({ jsPDF }) => {
    const document = new jsPDF({ format: "a4", unit: "pt" });

    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();
    const left = 36;
    const right = pageWidth - 36;
    const rowHeight = 18;

    const drawHeader = (): number => {
      document.setFont("helvetica", "bold");
      document.setFontSize(14);
      document.text("Transactions Export", left, 44);

      document.setFont("helvetica", "normal");
      document.setFontSize(9);
      document.setTextColor(100, 100, 100);
      document.text(
        `Generated ${new Date().toLocaleString("en-US")}`,
        left,
        60
      );
      document.setTextColor(0, 0, 0);

      let y = 82;
      document.setDrawColor(210, 210, 210);
      document.line(left, y, right, y);
      y += 14;

      document.setFont("helvetica", "bold");
      document.setFontSize(9);
      document.text("Date", left, y);
      document.text("Description", 106, y);
      document.text("Category", 296, y);
      document.text("Type", 404, y);
      document.text("Amount", right, y, { align: "right" });

      y += 8;
      document.setDrawColor(220, 220, 220);
      document.line(left, y, right, y);
      document.setFont("helvetica", "normal");
      document.setFontSize(9);

      return y + 12;
    };

    let y = drawHeader();

    for (const transaction of transactions) {
      if (y > pageHeight - 36) {
        document.addPage();
        y = drawHeader();
      }

      const signedAmount =
        transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount;
      const amountPrefix = signedAmount < 0 ? "-" : "+";
      const amountValue = Math.abs(signedAmount).toFixed(2);

      document.text(transaction.date, left, y);
      document.text(truncateText(transaction.description, 34), 106, y);
      document.text(truncateText(transaction.category, 18), 296, y);
      document.text(transaction.type, 404, y);
      document.text(`${amountPrefix}$${amountValue}`, right, y, {
        align: "right",
      });

      y += rowHeight;
    }

    document.save("transactions.pdf");
  });
};
