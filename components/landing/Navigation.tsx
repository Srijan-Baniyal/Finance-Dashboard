import { IconActivity } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="group flex items-center space-x-2" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white transition-transform group-hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
            <IconActivity className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">FinDash</span>
        </Link>
        <nav className="flex items-center gap-6 font-medium text-sm">
          <Link
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
            href="/overview"
          >
            Dashboard
          </Link>
          <Link
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
            href="/transactions"
          >
            Transactions
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <Link href="/overview">
            <Button
              className="rounded-full px-5 transition-transform hover:scale-105"
              size="sm"
            >
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
