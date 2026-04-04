import type { Category, Transaction, TransactionType } from "@/types/Index";

const EXPENSE_CATEGORIES: Category[] = [
  "Housing",
  "Food & Dining",
  "Transport",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Utilities",
];

const CATEGORY_DESCRIPTIONS: Record<Category, string[]> = {
  Housing: ["Rent", "Home insurance", "Repair service"],
  "Food & Dining": ["Groceries", "Cafe", "Dinner"],
  Transport: ["Metro pass", "Fuel", "Ride share"],
  Entertainment: ["Streaming", "Movie night", "Concert"],
  Healthcare: ["Pharmacy", "Clinic", "Wellness"],
  Shopping: ["Online order", "Clothing", "Household items"],
  Utilities: ["Electricity", "Internet", "Water bill"],
  Income: ["Salary", "Freelance payout", "Bonus"],
};

const toIsoDate = (value: Date): string => value.toISOString().slice(0, 10);

const seededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

const pickOne = <T>(items: readonly T[], random: () => number): T => {
  const index = Math.floor(random() * items.length);
  return items[index] as T;
};

const randomBetween = (
  min: number,
  max: number,
  random: () => number
): number => {
  return Math.floor(min + (max - min + 1) * random());
};

const buildDateInMonth = (
  year: number,
  month: number,
  random: () => number
): Date => {
  const day = randomBetween(1, 27, random);
  return new Date(year, month, day);
};

const buildTransaction = ({
  id,
  date,
  type,
  category,
  description,
  amount,
}: {
  id: string;
  date: Date;
  type: TransactionType;
  category: Category;
  description: string;
  amount: number;
}): Transaction => ({
  id,
  date: toIsoDate(date),
  type,
  category,
  description,
  amount,
});

export const generateMockTransactions = (): Transaction[] => {
  const random = seededRandom(20_260_404);
  const results: Transaction[] = [];
  const now = new Date();
  let cursor = 0;

  for (let monthOffset = 11; monthOffset >= 0; monthOffset -= 1) {
    const base = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = base.getFullYear();
    const month = base.getMonth();

    const incomeAmount = randomBetween(4200, 6000, random);
    const incomeDescription = pickOne(CATEGORY_DESCRIPTIONS.Income, random);

    results.push(
      buildTransaction({
        id: `txn-${year}-${month}-income-${cursor}`,
        date: buildDateInMonth(year, month, random),
        type: "income",
        category: "Income",
        description: incomeDescription,
        amount: incomeAmount,
      })
    );

    cursor += 1;
    const expenseCount = randomBetween(7, 11, random);

    for (let index = 0; index < expenseCount; index += 1) {
      const category = pickOne(EXPENSE_CATEGORIES, random);
      const description = pickOne(CATEGORY_DESCRIPTIONS[category], random);
      const amount = randomBetween(18, 740, random);

      results.push(
        buildTransaction({
          id: `txn-${year}-${month}-expense-${cursor}`,
          date: buildDateInMonth(year, month, random),
          type: "expense",
          category,
          description,
          amount,
        })
      );

      cursor += 1;
    }
  }

  return results.sort((left, right) => right.date.localeCompare(left.date));
};
