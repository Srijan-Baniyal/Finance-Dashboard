"use client";

import {
  IconChartInfographic,
  IconEye,
  IconLayoutDashboard,
  IconMoon,
  IconReceipt2,
  IconShieldCheck,
  IconSun,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/UseMobile";
import { cn } from "@/lib/Utilss";
import { useStore } from "@/store/UseStore";
import type { Role } from "@/types/Index";

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: IconLayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: IconReceipt2 },
  { href: "/insights", label: "Insights", icon: IconChartInfographic },
] as const;

/* ─── Sidebar footer collapse button ────────────────────────────────────── */

function SidebarCollapseButton() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuButton
      className="justify-start rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      onClick={toggleSidebar}
      tooltip={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <svg
        aria-hidden="true"
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-300",
          isCollapsed && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="18" rx="2" width="18" x="3" y="3" />
        <path d="M9 3v18" />
        <path d="m15 9-3 3 3 3" />
      </svg>
      <span className="text-xs">{isCollapsed ? "Expand" : "Collapse"}</span>
    </SidebarMenuButton>
  );
}

/* ─── Shell ──────────────────────────────────────────────────────────────── */

export function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync dark class with theme store */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* Cleanup animation timer on unmount */
  useEffect(
    () => () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    },
    []
  );

  /* Keep desktop nav usable by default when switching pages */
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  /* Theme toggle — uses View Transition API ripple when available */
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

  const roleIsAdmin = role === "admin";

  return (
    <TooltipProvider>
      <SidebarProvider onOpenChange={setSidebarOpen} open={sidebarOpen}>
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <Sidebar
          className="border-sidebar-border/80 group-data-[side=left]:border-r-2 group-data-[side=right]:border-l-2"
          collapsible="icon"
          style={
            {
              /*
               * Override the sidebar accent tokens so that the active
               * nav item gets a gentle primary-colour tint instead of
               * the default blue/amber accent.
               */
              "--sidebar-accent":
                "color-mix(in oklch, var(--primary) 10%, transparent)",
              "--sidebar-accent-foreground": "var(--primary)",
            } as React.CSSProperties
          }
        >
          {/* Brand ──────────────────────────────────────────────────── */}
          <SidebarHeader className="h-14 justify-center border-border/40 border-b p-0">
            <SidebarMenu>
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  className="h-14 rounded-none px-4 hover:bg-transparent data-active:bg-transparent group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  render={<Link href="/" />}
                  size="lg"
                  tooltip="FinDash home"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-transform duration-200 group-hover/menu-button:scale-[1.04] group-data-[collapsible=icon]:mx-auto">
                    <IconWallet className="h-4.25 w-4.25" />
                  </div>
                  <span className="font-bold font-heading text-[17px] tracking-tight group-data-[collapsible=icon]:hidden">
                    FinDash
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation ─────────────────────────────────────────────── */}
          <SidebarContent className="pt-3">
            <SidebarGroup className="px-2 py-0">
              <SidebarMenu className="gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        className={cn(
                          "relative overflow-hidden rounded-lg",
                          isActive &&
                            "bg-primary/10 text-primary hover:bg-primary/13 hover:text-primary"
                        )}
                        isActive={isActive}
                        render={
                          <Link
                            href={item.href}
                            transitionTypes={["nav-lateral"]}
                          />
                        }
                        tooltip={item.label}
                      >
                        {/* Active left-edge pill — hidden in icon mode */}
                        <span
                          className={cn(
                            "absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 group-data-[collapsible=icon]:hidden",
                            isActive
                              ? "scale-y-100 opacity-100"
                              : "scale-y-0 opacity-0"
                          )}
                        />
                        <item.icon className="shrink-0" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer — collapse toggle ────────────────────────────────── */}
          <SidebarFooter className="border-border/40 border-t p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarCollapseButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main inset ───────────────────────────────────────────────── */}
        <SidebarInset>
          {/*
           * Header
           * h-14 aligns exactly with the sidebar brand row so the
           * border-b forms one continuous horizontal rule.
           */}
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-border/50 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-5">
            {/* Sidebar toggle (visible on all breakpoints) */}
            <SidebarTrigger className="text-muted-foreground hover:bg-muted/60 hover:text-foreground" />

            {!(isMobile || sidebarOpen) && (
              <Button
                className="h-8 rounded-full border-border/60 bg-muted/30 px-3 text-[11px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                onClick={() => setSidebarOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                Expand sidebar
              </Button>
            )}

            <Separator className="h-4" orientation="vertical" />

            {/* ── Right controls ── */}
            <div className="ml-auto flex items-center gap-2">
              {!roleIsAdmin && (
                <div className="hidden items-center rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-[11px] text-amber-700 lg:flex dark:text-amber-400">
                  You are viewing as Viewer. Switch to Admin from the role
                  selector on the left.
                </div>
              )}

              {/* Workspace role pill */}
              <div
                className={cn(
                  "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs sm:flex",
                  roleIsAdmin
                    ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400"
                    : "border-amber-500/20 bg-amber-500/8 text-amber-700 dark:text-amber-400"
                )}
              >
                {roleIsAdmin ? (
                  <IconShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <IconEye className="h-3.5 w-3.5" />
                )}
                <span className="capitalize">{role}</span>
              </div>

              {/* Role switcher */}
              <Select
                onValueChange={(v) => v && setRole(v as Role)}
                value={role}
              >
                <SelectTrigger className="h-8 min-w-30 rounded-full border-border/60 bg-muted/40 text-xs shadow-none focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem className="rounded-lg text-xs" value="viewer">
                    <span className="flex items-center gap-2">
                      <IconEye className="h-3.5 w-3.5 text-amber-500" />
                      Viewer
                    </span>
                  </SelectItem>
                  <SelectItem className="rounded-lg text-xs" value="admin">
                    <span className="flex items-center gap-2">
                      <IconShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Admin
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Separator className="h-4" orientation="vertical" />

              {/* Theme toggle */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="relative h-8 w-8 overflow-hidden rounded-full border border-border/50 bg-muted/40 hover:bg-muted/70"
                      onClick={handleToggleTheme}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <span
                        className={cn(
                          "relative z-10 inline-flex items-center justify-center transition-transform duration-500",
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
                  }
                />
                <TooltipContent side="bottom">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
