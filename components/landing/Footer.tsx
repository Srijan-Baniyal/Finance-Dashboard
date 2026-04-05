"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-border/40 border-t bg-background pt-14 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/35 via-background to-background" />
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-10 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Client-side Workspace
            </p>
            <Link className="group flex w-fit items-center gap-2.5" href="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:text-primary">
                <span className="font-semibold text-sm">FD</span>
              </div>
              <span className="font-bold font-heading text-lg tracking-tight">
                FinDash
              </span>
            </Link>

            <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
              A minimalist, open-source dashboard designed to help you take back
              control of your personal finances.
            </p>

            <Link
              className="inline-flex items-center rounded-full border border-border/70 px-4 py-2 font-medium text-sm transition-colors hover:bg-muted/50"
              href="/overview"
            >
              Open Dashboard
            </Link>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-[11px] uppercase tracking-[0.18em]">
              Product
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="/overview"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="/transactions"
                >
                  Transactions
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="/insights"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-[11px] uppercase tracking-[0.18em]">
              Resources
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="https://github.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="#"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="#"
                >
                  Design System
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-[11px] uppercase tracking-[0.18em]">
              Legal
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="#"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="#"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="#"
                >
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 border-border/60" />

        <div className="flex flex-col items-center justify-between gap-3 text-muted-foreground text-sm md:flex-row">
          <p>© {currentYear} FinDash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
