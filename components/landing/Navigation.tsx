"use client";

import { IconMoon, IconSun, IconWallet } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/Utils";
import { useStore } from "@/store/UseStore";

export function Navigation() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(
    () => () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    },
    []
  );

  const handleToggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isThemeAnimating) {
      return;
    }

    document.documentElement.style.setProperty(
      "--theme-origin-x",
      `${event.clientX}px`
    );
    document.documentElement.style.setProperty(
      "--theme-origin-y",
      `${event.clientY}px`
    );

    const commit = () => {
      document.documentElement.classList.add("theme-transitioning");
      toggleTheme();
      setIsThemeAnimating(true);
      animationTimerRef.current = setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
        setIsThemeAnimating(false);
      }, 480);
    };

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(commit);
    } else {
      commit();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="group flex items-center gap-2.5" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:text-primary">
            <IconWallet className="h-5 w-5" />
          </div>
          <span className="font-bold font-heading text-lg tracking-tight">
            FinDash
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            className="hidden rounded-full px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted/40 hover:text-foreground sm:block"
            href="/overview"
          >
            Dashboard
          </Link>
          <Link
            className="hidden rounded-full px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted/40 hover:text-foreground sm:block"
            href="/transactions"
          >
            Transactions
          </Link>

          <Button
            className="relative h-9 w-9 rounded-full border border-border/60 bg-card/70 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            onClick={handleToggleTheme}
            size="icon"
            type="button"
            variant="ghost"
          >
            <span
              className={cn(
                "inline-flex items-center justify-center transition-transform duration-500",
                isThemeAnimating && "spin-once"
              )}
            >
              {theme === "dark" ? (
                <IconSun className="h-4 w-4" />
              ) : (
                <IconMoon className="h-4 w-4" />
              )}
            </span>
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/overview">
            <Button
              className="h-9 rounded-full px-5 transition-transform hover:-translate-y-0.5"
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
