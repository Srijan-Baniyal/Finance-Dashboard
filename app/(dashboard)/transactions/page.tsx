import { TransactionsDashboard } from "@/components/dashboard/TransactionsDashboard";
import { SuspenseProvider } from "@/providers/SuspenseProvider";

export default function TransactionsPage() {
  return (
    <SuspenseProvider>
      <TransactionsDashboard />
    </SuspenseProvider>
  );
}
