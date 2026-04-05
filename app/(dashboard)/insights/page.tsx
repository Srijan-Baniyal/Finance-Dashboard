import type { Metadata } from "next";
import { InsightsDashboard } from "@/components/dashboard/InsightsDashboard";

export const metadata: Metadata = {
  title: "Insights | FinDash",
  description:
    "Review spending patterns, category trends, and key financial insights over time.",
};

export default function InsightsPage() {
  return <InsightsDashboard />;
}
