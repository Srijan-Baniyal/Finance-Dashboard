"use client";

import {
  IconChartInfographic,
  IconEye,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
  IconMoon,
  IconReceipt2,
  IconShieldCheck,
  IconSun,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/Utils";
import { useStore } from "@/store/UseStore";
import type { Role } from "@/types/Index";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: IconLayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: IconReceipt2 },
  { href: "/insights", label: "Insights", icon: IconChartInfographic },
] as const;

const SIDEBAR_COLLAPSED_KEY = "findash-sidebar-collapsed";

function NavLinkItem({
  collapsed,
  href,
  icon: Icon,
  isActive,
  label,
  onNavigate,
}: Readonly<{
  collapsed: boolean;
  href: string;
  icon: (typeof NAV_ITEMS)[number]["icon"];
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
}>) {
  const link = (
    <Link
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 font-medium text-sm transition-colors duration-200",
        collapsed ? "justify-center px-2" : "",
        isActive
          ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_25%,transparent)]"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
      href={href}
      onClick={onNavigate}
      transitionTypes={["nav-lateral"]}
    >
      <span
        className={cn(
          "absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300",
          isActive ? "opacity-100" : "scale-y-0 opacity-0"
        )}
      />
      <Icon
        aria-hidden
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
          isActive ? "scale-105" : "group-hover:scale-105"
        )}
      />
      {collapsed ? null : <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger delay={0} render={link} />
        <TooltipContent className="font-medium text-xs" side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const role = useStore((state) => state.role);
  const setRole = useStore((state) => state.setRole);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === "1") {
        setSidebarCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistCollapsed = useCallback((next: boolean) => {
    setSidebarCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const handleToggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isThemeAnimating) {
      return;
    }

    const { clientX, clientY } = event;
    document.documentElement.style.setProperty(
      "--theme-origin-x",
      `${clientX}px`
    );
    document.documentElement.style.setProperty(
      "--theme-origin-y",
      `${clientY}px`
    );

    const finish = () => {
      document.documentElement.classList.add("theme-transitioning");
      toggleTheme();
      setIsThemeAnimating(true);
      animationTimerRef.current = setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
        setIsThemeAnimating(false);
      }, 480);
    };

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(finish);
    } else {
      finish();
    }
  };

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <TooltipProvider>
      <div className="dashboard-canvas min-h-screen text-foreground selection:bg-primary/20">
        <div className="mx-auto flex min-h-screen max-w-350">
          {/* Desktop sidebar */}
          <aside
            className={cn(
              "sticky top-0 hidden h-screen shrink-0 flex-col border-border/80 border-r bg-sidebar/85 backdrop-blur-xl transition-[width] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] md:flex",
              sidebarCollapsed ? "w-[4.5rem]" : "w-64"
            )}
            style={{ viewTransitionName: "dashboard-shell-sidebar" }}
          >
            <div
              className={cn(
                "flex h-16 shrink-0 items-center border-border/60 border-b px-4",
                sidebarCollapsed ? "justify-center px-2" : ""
              )}
            >
              <Link
                className="group flex items-center gap-2.5 text-primary transition-opacity hover:opacity-90"
                href="/"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-[1.03]">
                  <IconWallet className="h-[18px] w-[18px]" />
                </div>
                {sidebarCollapsed ? null : (
                  <span className="font-bold font-heading text-lg tracking-tight">
                    FinDash
                  </span>
                )}
              </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden px-2.5 pt-4 pb-3">
              {sidebarCollapsed ? null : (
                <p className="mb-2 px-3 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Navigate
                </p>
              )}
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <NavLinkItem
                    collapsed={sidebarCollapsed}
                    href={item.href}
                    icon={item.icon}
                    isActive={pathname === item.href}
                    key={item.href}
                    label={item.label}
                  />
                ))}
              </nav>
            </div>

            <div className="border-border/60 border-t p-2">
              <Button
                className={cn(
                  "h-10 w-full gap-2 rounded-xl text-muted-foreground hover:bg-muted/90 hover:text-foreground",
                  sidebarCollapsed ? "px-0" : "justify-start"
                )}
                onClick={() => persistCollapsed(!sidebarCollapsed)}
                type="button"
                variant="ghost"
              >
                {sidebarCollapsed ? (
                  <IconLayoutSidebarLeftExpand className="h-[18px] w-[18px]" />
                ) : (
                  <>
                    <IconLayoutSidebarLeftCollapse className="h-[18px] w-[18px]" />
                    <span className="text-xs">Collapse</span>
                  </>
                )}
                <span className="sr-only">
                  {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
              </Button>
            </div>

            <div className="border-border/60 border-t p-3">
              <div
                className={cn(
                  "rounded-2xl border border-border/80 bg-card/60 p-3 shadow-sm",
                  sidebarCollapsed ? "flex justify-center p-2" : ""
                )}
              >
                {sidebarCollapsed ? null : (
                  <p className="mb-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                    Workspace
                  </p>
                )}
                <div
                  className={cn(
                    "flex items-center gap-2",
                    sidebarCollapsed ? "flex-col" : "justify-between"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        role === "admin"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-amber-500/15 text-amber-500"
                      )}
                    >
                      {role === "admin" ? (
                        <IconShieldCheck className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </div>
                    {sidebarCollapsed ? null : (
                      <span className="font-semibold text-sm capitalize">
                        {role}
                      </span>
                    )}
                  </div>
                  {sidebarCollapsed ? null : (
                    <Badge
                      className={cn(
                        "h-5 rounded-full px-2 text-[10px] shadow-none",
                        role === "admin"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400"
                      )}
                      variant="outline"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header
              className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-border/80 border-b bg-background/75 px-3 backdrop-blur-xl supports-backdrop-filter:bg-background/65 sm:px-5"
              style={{ viewTransitionName: "dashboard-shell-header" }}
            >
              <Button
                className="h-9 w-9 shrink-0 rounded-xl md:hidden"
                onClick={() => setMobileNavOpen(true)}
                size="icon"
                type="button"
                variant="outline"
              >
                <IconMenu2 className="h-[18px] w-[18px]" />
                <span className="sr-only">Open menu</span>
              </Button>

              <div className="flex min-w-0 items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <IconWallet className="h-4 w-4" />
                </div>
                <span className="truncate font-bold font-heading text-base tracking-tight">
                  FinDash
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block">
                  <Select
                    onValueChange={(value) => value && setRole(value as Role)}
                    value={role}
                  >
                    <SelectTrigger className="h-9 min-w-[7.5rem] rounded-full border-border/70 bg-muted/40 text-xs shadow-none ring-offset-background focus:ring-2 focus:ring-primary/25">
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
                </div>

                <Separator
                  className="hidden h-5 sm:block"
                  orientation="vertical"
                />

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        className="theme-toggle-btn relative h-9 w-9 overflow-hidden rounded-full border border-border/60 bg-muted/40 hover:bg-muted/80"
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

            <Drawer
              direction="left"
              onOpenChange={setMobileNavOpen}
              open={mobileNavOpen}
            >
              <DrawerContent className="h-full max-h-full w-[min(100vw-3rem,20rem)] rounded-none border-r data-[vaul-drawer-direction=left]:mt-0 data-[vaul-drawer-direction=left]:max-h-full">
                <DrawerHeader className="flex flex-row items-center justify-between border-border/60 border-b py-4">
                  <DrawerTitle className="font-heading text-base">
                    Menu
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button
                      className="h-8 w-8 rounded-lg"
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <IconX className="h-4 w-4" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col gap-1 p-3">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        href={item.href}
                        key={item.href}
                        onClick={closeMobileNav}
                        transitionTypes={["nav-lateral"]}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </DrawerContent>
            </Drawer>

            <main className="flex-1 p-4 sm:p-6 md:p-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
