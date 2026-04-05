import type { Metadata } from "next";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export const metadata: Metadata = {
  title: "Overview | FinDash",
  description:
    "See account balance, income, expenses, and key finance trends in one overview.",
};

export default function OverviewPage() {
  return <OverviewDashboard />;
}
