import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navigation } from "@/components/landing/Navigation";

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
