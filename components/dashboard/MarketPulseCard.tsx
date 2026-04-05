import {
  IconAlertTriangle,
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoinBitcoin,
  IconRefresh,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMarketPulse } from "@/hooks/UseMarketPulse";

const formatUsd = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
};

const formatTime = (unixSeconds: number): string => {
  return new Date(unixSeconds * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function MarketPulseCard() {
  const { data, isPending, isError, refetch, isFetching } = useMarketPulse();

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm">
      <div className="flex items-center justify-between border-border/50 border-b bg-muted/20 px-5 py-4">
        <div>
          <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Live Pulse
          </p>
          <h2 className="mt-1 font-semibold text-sm">Crypto Market Snapshot</h2>
        </div>

        <Button
          className="h-8 w-8 rounded-full"
          disabled={isFetching}
          onClick={() => refetch()}
          size="icon"
          type="button"
          variant="ghost"
        >
          <IconRefresh
            className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
          <span className="sr-only">Refresh market snapshot</span>
        </Button>
      </div>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {isPending && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Spinner />
            Fetching latest market prices...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-amber-700 text-sm dark:text-amber-300">
              <IconAlertTriangle className="h-4 w-4" />
              Unable to fetch market pulse right now.
            </div>
            <Button
              className="h-8 rounded-md"
              onClick={() => refetch()}
              size="sm"
              type="button"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        )}

        {data && (
          <>
            <div className="grid gap-2 sm:grid-cols-3">
              {data.points.map((point) => {
                const isPositive = point.dayChangePercent >= 0;

                return (
                  <div
                    className="rounded-xl border border-border/60 bg-background/60 p-3"
                    key={point.id}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 font-semibold text-sm">
                        {point.id === "bitcoin" && (
                          <IconCoinBitcoin className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{point.symbol}</span>
                      </p>
                      <Badge
                        className={
                          isPositive
                            ? "rounded-full border-emerald-200 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-600 dark:border-emerald-700 dark:text-emerald-400"
                            : "rounded-full border-rose-200 bg-rose-500/10 px-1.5 text-[10px] text-rose-600 dark:border-rose-700 dark:text-rose-400"
                        }
                        variant="outline"
                      >
                        <span className="inline-flex items-center gap-0.5">
                          {isPositive ? (
                            <IconArrowUpRight className="h-3 w-3" />
                          ) : (
                            <IconArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(point.dayChangePercent).toFixed(2)}%
                        </span>
                      </Badge>
                    </div>

                    <p className="font-mono font-semibold text-base tabular-nums">
                      {formatUsd(point.priceUsd)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {point.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-muted-foreground">
              Updated {formatTime(data.updatedAt)} • Data source: CoinGecko
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
