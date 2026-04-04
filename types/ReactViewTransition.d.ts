import type { ExoticComponent, ReactNode } from "react";

declare module "react" {
  interface ViewTransitionProps {
    children?: ReactNode;
    default?: unknown;
    enter?: unknown;
    exit?: unknown;
    name?: string;
    share?: unknown;
    update?: unknown;
  }

  export const ViewTransition: ExoticComponent<ViewTransitionProps>;
}
