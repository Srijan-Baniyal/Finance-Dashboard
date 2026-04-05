import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/lib/Axios";

type MarketAssetId = "bitcoin" | "ethereum" | "solana";

const MARKET_ASSETS = [
  "bitcoin",
  "ethereum",
  "solana",
] as const satisfies Readonly<MarketAssetId[]>;

const MARKET_ASSET_META: Record<
  MarketAssetId,
  {
    label: string;
    symbol: string;
  }
> = {
  bitcoin: { label: "Bitcoin", symbol: "BTC" },
  ethereum: { label: "Ethereum", symbol: "ETH" },
  solana: { label: "Solana", symbol: "SOL" },
};

interface CoinGeckoSimplePriceResponse {
  bitcoin?: {
    usd?: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
  ethereum?: {
    usd?: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
  solana?: {
    usd?: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
}

export interface MarketPulsePoint {
  dayChangePercent: number;
  id: MarketAssetId;
  label: string;
  priceUsd: number;
  symbol: string;
}

export interface MarketPulseSnapshot {
  points: MarketPulsePoint[];
  updatedAt: number;
}

const asFinite = (value: number | undefined): number =>
  Number.isFinite(value) ? Number(value) : 0;

const fetchMarketPulse = async (): Promise<MarketPulseSnapshot> => {
  const { data } = await marketApi.get<CoinGeckoSimplePriceResponse>(
    "/simple/price",
    {
      params: {
        ids: MARKET_ASSETS.join(","),
        vs_currencies: "usd",
        include_24hr_change: true,
        include_last_updated_at: true,
      },
    }
  );

  const points = MARKET_ASSETS.map((assetId) => {
    const raw = data[assetId];
    return {
      id: assetId,
      label: MARKET_ASSET_META[assetId].label,
      symbol: MARKET_ASSET_META[assetId].symbol,
      priceUsd: asFinite(raw?.usd),
      dayChangePercent: asFinite(raw?.usd_24h_change),
    } satisfies MarketPulsePoint;
  });

  const updatedAt =
    asFinite(data.bitcoin?.last_updated_at) || Math.floor(Date.now() / 1000);

  return {
    points,
    updatedAt,
  };
};

export const useMarketPulse = () => {
  return useQuery({
    queryKey: ["market-pulse"],
    queryFn: fetchMarketPulse,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
