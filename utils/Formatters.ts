export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSignedAmount = (
  amount: number,
  isExpense: boolean
): string => {
  const sign = isExpense ? "-" : "+";
  return `${sign}${formatCurrency(amount)}`;
};

export const formatDate = (date: string): string => {
  const parsed = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
};

export const formatPercent = (value: number): string => {
  const normalized = Number.isFinite(value) ? value : 0;
  return `${normalized.toFixed(1)}%`;
};
