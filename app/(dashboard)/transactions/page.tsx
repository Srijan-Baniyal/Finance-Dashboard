import type { Metadata } from "next";
import { TransactionsDashboard } from "@/components/dashboard/TransactionsDashboard";
import { SuspenseProvider } from "@/providers/SuspenseProvider";

export const metadata: Metadata = {
  title: "Transactions | FinDash",
  description:
    "Browse, search, and manage all transactions with filters, sorting, and date controls.",
};

export default function TransactionsPage() {
  return (
    <SuspenseProvider>
      <TransactionsDashboard />
    </SuspenseProvider>
  );
}
