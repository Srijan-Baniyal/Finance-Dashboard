import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navigation } from "@/components/landing/Navigation";

export const metadata: Metadata = {
  title: "Home | FinDash",
  description:
    "FinDash home page with quick entry to your personal finance dashboard and tools.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
