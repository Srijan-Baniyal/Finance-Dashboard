import { type ReactNode, Suspense } from "react";

interface SuspenseProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseProvider({
  children,
  fallback = (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  ),
}: SuspenseProviderProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
