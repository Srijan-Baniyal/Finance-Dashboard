import {
  IconArrowRight,
  IconBolt,
  IconChartBar,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-200/50 via-background to-background dark:from-zinc-900/50 dark:via-background dark:to-background" />
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute top-40 left-0 -z-10 h-100 w-100 rounded-full bg-orange-500/5 blur-[100px] dark:bg-orange-500/10" />

      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 text-center">
        <Badge
          className="fade-in slide-in-from-bottom-4 animate-in rounded-full bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm duration-500"
          variant="outline"
        >
          <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Now available as an open-source template
        </Badge>

        <div className="relative max-w-4xl space-y-4">
          <h1 className="fade-in slide-in-from-bottom-6 animate-in fill-mode-both font-extrabold text-5xl tracking-tighter delay-150 duration-700 sm:text-6xl md:text-7xl lg:text-8xl">
            Clarity for your <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
              financial life.
            </span>
          </h1>
          <p className="fade-in slide-in-from-bottom-6 mx-auto max-w-2xl animate-in fill-mode-both text-lg text-muted-foreground leading-relaxed delay-300 duration-700 md:text-xl">
            Experience a beautifully crafted, privacy-first dashboard that turns
            your chaotic transaction data into meaningful insights. No tracking.
            No limits. Just you and your money.
          </p>
        </div>

        <div className="fade-in slide-in-from-bottom-8 mt-4 flex w-full animate-in flex-col items-center gap-4 fill-mode-both delay-500 duration-700 sm:w-auto sm:flex-row">
          <Link className="w-full sm:w-auto" href="/overview">
            <Button
              className="h-14 w-full rounded-full px-8 text-base shadow-xl transition-all duration-300 hover:-translate-y-1 sm:w-auto"
              size="lg"
            >
              Start Exploring <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link className="w-full sm:w-auto" href="/transactions">
            <Button
              className="h-14 w-full rounded-full border-zinc-200 bg-background/50 px-8 text-base backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:w-auto dark:border-zinc-800"
              size="lg"
              variant="outline"
            >
              View Transactions
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="fade-in slide-in-from-bottom-10 grid w-full max-w-5xl animate-in gap-6 fill-mode-both pt-16 delay-700 duration-1000 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <IconBolt className="h-6 w-6 text-orange-500" />,
              title: "Lightning Fast",
              description:
                "State managed globally with Zustand. Zero layout shifts and instant interactions.",
            },
            {
              icon: <IconShieldCheck className="h-6 w-6 text-green-500" />,
              title: "Client-side Only",
              description:
                "Your data never leaves your browser. Persisted securely via local storage.",
            },
            {
              icon: <IconChartBar className="h-6 w-6 text-blue-500" />,
              title: "Deep Insights",
              description:
                "Automatically grouped spending categories and calculated trends.",
            },
          ].map((feature, _i) => (
            <div
              className="flex flex-col items-center space-y-3 rounded-3xl border border-zinc-200/50 bg-white/50 p-8 pt-10 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-950/50"
              key={feature.title}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
