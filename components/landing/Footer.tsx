"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 border-t bg-zinc-50/50 pt-16 pb-8 dark:bg-zinc-950/50">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <Link className="group flex w-fit items-center space-x-2" href="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white transition-transform group-hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
                <span className="font-bold">FD</span>
              </div>
              <span className="font-bold text-lg tracking-tight">FinDash</span>
            </Link>
            <p className="max-w-xs pt-2 text-muted-foreground text-sm leading-relaxed">
              A minimalist, open-source dashboard designed to help you take back
              control of your personal finances.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold tracking-tight">Product</h4>
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
            <h4 className="font-semibold tracking-tight">Resources</h4>
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
            <h4 className="font-semibold tracking-tight">Legal</h4>
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

        <Separator className="my-10 border-border/60" />

        <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm md:flex-row">
          <p>© {currentYear} FinDash. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <span className="animate-pulse text-red-500">♥</span>
            <span>and shadcn/ui.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
