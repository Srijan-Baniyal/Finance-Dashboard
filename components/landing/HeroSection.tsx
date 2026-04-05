import {
  IconArrowRight,
  IconChartBar,
  IconLayoutDashboard,
  IconReceipt2,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DASHBOARD_SECTIONS = [
  {
    description: "Balances and cash flow snapshot",
    href: "/overview",
    icon: IconLayoutDashboard,
    title: "Overview",
  },
  {
    description: "Filter and manage ledger entries",
    href: "/transactions",
    icon: IconReceipt2,
    title: "Transactions",
  },
  {
    description: "Savings rate and spending patterns",
    href: "/insights",
    icon: IconChartBar,
    title: "Insights",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-border/40 border-b pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-36">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/40 via-background to-background" />
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-56 w-56 rounded-full bg-chart-3/15 blur-3xl" />

      <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-7">
          <Badge
            className="rounded-full px-3.5 py-1 text-[11px] uppercase tracking-[0.2em]"
            variant="outline"
          >
            Client-side finance workspace
          </Badge>

          <div className="space-y-4">
            <h1 className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl md:text-6xl">
              Your money dashboard,
              <span className="block text-muted-foreground">
                without the clutter.
              </span>
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              FinDash gives you a clear snapshot of balance, transactions, and
              trends in one calm interface.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link className="w-full sm:w-auto" href="/overview">
              <Button
                className="h-12 w-full gap-2 rounded-full px-6 sm:w-auto"
                size="lg"
              >
                Open Dashboard
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link className="w-full sm:w-auto" href="/transactions">
              <Button
                className="h-12 w-full rounded-full border-border/70 bg-background/70 px-6 hover:bg-background sm:w-auto"
                size="lg"
                variant="outline"
              >
                Browse Ledger
              </Button>
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-sm">
          <p className="px-3 pt-2 pb-3 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Product Map
          </p>
          <div className="space-y-1">
            {DASHBOARD_SECTIONS.map((section) => (
              <Link
                className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border/70 hover:bg-muted/40"
                href={section.href}
                key={section.title}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <section.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm tracking-tight">
                    {section.title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
