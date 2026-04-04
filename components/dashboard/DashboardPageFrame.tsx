"use client";

import { ViewTransition } from "react";

/**
 * Wraps dashboard page content so `<Link transitionTypes={["nav-lateral"]}>` cross-fades
 * between routes (pairs with CSS in `globals.css`).
 */
export function DashboardPageFrame({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransition
      default="none"
      enter={{ "nav-lateral": "fade-in", default: "none" }}
      exit={{ "nav-lateral": "fade-out", default: "none" }}
    >
      {children}
    </ViewTransition>
  );
}
