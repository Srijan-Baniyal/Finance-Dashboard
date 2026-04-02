# FinDash — Personal Finance Dashboard

> A clean, interactive finance dashboard built with React, Zustand, and Recharts. Track your balance, explore transactions, understand spending patterns, and switch between Viewer and Admin roles — all in the browser, no backend required.

---

## Preview

```
┌──────────────────────────────────────────────────────────────┐
│  💳 FinDash                              [Viewer ▾]  [🌙]    │
├──────────┬───────────────────────────────────────────────────┤
│          │  Overview                                         │
│ Overview │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│          │  │ Balance  │  │ Income   │  │ Expenses │        │
│ Transact │  │ $12,450  │  │ $5,200   │  │ $2,890   │        │
│          │  └──────────┘  └──────────┘  └──────────┘        │
│ Insights │  [Balance Trend — 12mo line chart]                │
│          │  [Spending Breakdown — donut chart]               │
└──────────┴───────────────────────────────────────────────────┘
```

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Role-Based Access](#role-based-access)
- [Technical Decisions](#technical-decisions)
- [Optional Enhancements Included](#optional-enhancements-included)
- [Design Philosophy](#design-philosophy)
- [Possible Extensions](#possible-extensions)

---

## Features

### Dashboard Overview
- **Summary cards** for Total Balance, Total Income, and Total Expenses — with month-over-month delta indicators
- **Balance trend chart** — a 12-month line chart showing your running balance over time
- **Spending breakdown** — a donut chart categorising expenses across Housing, Food, Transport, Entertainment, and more
- **Monthly comparison bar chart** — side-by-side income vs expenses per month

### Transactions
- Full transaction list with **date, description, category, type, and amount**
- **Search** by description or note
- **Filter** by category, transaction type (income / expense), and date range
- **Sort** by date, amount, or category (ascending or descending)
- **Graceful empty states** when no transactions match the active filters

### Insights
- **Highest spending category** — where your money goes most
- **Month-over-month comparison** — are you spending more or less than last month?
- **Savings rate** — what percentage of income you're keeping
- **Biggest single expense** — the largest individual transaction
- **Average monthly spend** — normalised across all months in the dataset

### Role-Based UI
- **Viewer role** — read-only access to all data and charts
- **Admin role** — can add new transactions, edit existing ones, delete entries, and export data
- Switch roles instantly via the dropdown in the top bar — no reload required

### Data Persistence
- Transactions and theme preference survive page refreshes via `localStorage`
- Fresh installs load a rich set of 120 realistic mock transactions spanning 12 months

### Dark Mode
- Full dark theme with a single toggle — all charts, cards, and typography adapt

### Export
- **Admin only** — export all transactions as CSV or JSON from the Transactions page

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9+ or yarn 1.22+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/findash.git
cd findash

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the built output locally
```

### Other Commands

```bash
npm run lint      # ESLint
npx tsc --noEmit  # Type-check without building
```

---

## Project Structure

```
src/
├── main.tsx                  # App entry point
├── App.tsx                   # Shell layout (Sidebar + Topbar + Outlet)
├── store/
│   └── useStore.ts           # Zustand store — all global state
├── data/
│   └── mockData.ts           # 120 deterministic mock transactions
├── types/
│   └── index.ts              # TypeScript interfaces
├── pages/
│   ├── Overview.tsx          # Dashboard home
│   ├── Transactions.tsx      # Transaction list + filters
│   └── Insights.tsx          # Derived metrics and patterns
├── components/
│   ├── layout/               # Sidebar, Topbar
│   ├── cards/                # SummaryCard, InsightCard
│   ├── charts/               # BalanceTrend, SpendingBreakdown, MonthlyBar
│   ├── transactions/         # Table, Row, FilterBar, Modal
│   └── ui/                   # Badge, EmptyState, Skeleton, RoleBadge
├── hooks/
│   ├── useFilteredTransactions.ts
│   ├── useInsights.ts
│   └── useDateRange.ts
├── utils/
│   ├── formatters.ts         # Currency, date formatting
│   ├── categoryColors.ts     # Category → colour mapping
│   └── exportData.ts         # CSV / JSON export
└── styles/
    └── globals.css           # CSS design tokens (light + dark)
```

---

## Usage Guide

### Switching Roles

Click the **role dropdown** in the top right corner of the header. Select **Admin** to unlock transaction management (add, edit, delete, export). Select **Viewer** to return to read-only mode.

> ⚠️ This is a frontend-only simulation for demonstration purposes. No data is hidden from the browser — role switching controls UI affordances only.

### Adding a Transaction (Admin only)

1. Switch to **Admin** role
2. Navigate to **Transactions**
3. Click **+ Add Transaction**
4. Fill in description, amount, date, category, and type
5. Submit — the new transaction appears immediately and persists in localStorage

### Editing / Deleting (Admin only)

Each transaction row in Admin mode has an action menu (⋯). Choose **Edit** to open the pre-filled modal, or **Delete** to remove it. Changes are immediate and persistent.

### Filtering Transactions

Use the **Filter Bar** above the transaction table:
- Type in the **search box** to filter by description or note
- Use the **category dropdown** to show one category at a time
- Toggle between **All / Income / Expense**
- Set a **date range** to narrow by time period
- Click **Reset Filters** to clear everything

### Sorting

Click any **column header** in the table to sort by that column. Click again to reverse the sort direction. An arrow indicator shows the active sort.

### Exporting Data (Admin only)

On the Transactions page, the **Export** button (Admin only) lets you download:
- **CSV** — opens in Excel, Google Sheets, etc.
- **JSON** — useful for further processing or backup

---

## Role-Based Access

| Feature | Viewer | Admin |
|---|---|---|
| View summary cards | ✅ | ✅ |
| View all charts | ✅ | ✅ |
| Browse transactions | ✅ | ✅ |
| Filter & search | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Export data | ❌ | ✅ |

---

## Technical Decisions

### Why Zustand?

React Context + `useReducer` was the first consideration. But a finance dashboard has several independently-updating state slices: transactions, filters, role, and theme. Context causes the entire consuming subtree to re-render on every update. Zustand uses per-selector subscriptions — a filter change re-renders only the filter bar and the transaction table, not the charts or summary cards.

### Why derived state instead of stored state?

Balance, totals, insight metrics — none of these are stored in the Zustand store. They are computed from `transactions` using `useMemo` inside hooks. Storing derived values creates synchronisation risk: what happens when a transaction is deleted but the stored total isn't updated? By computing at read-time, correctness is guaranteed.

### Why positive amounts with a type field?

Transactions store `amount` as a positive number and use a `type: 'income' | 'expense'` field for sign. The alternative — storing signed amounts — creates ambiguity at filter time (how do you filter "expenses over $100" when expenses are negative?). The explicit type field keeps the data model self-documenting.

### Why mock data with a seed?

The insights section is most compelling when the data has realistic patterns — a dominant spending category, a month with unusually high expenses, a healthy savings rate. A seeded pseudo-random generator produces the same 120 transactions every time the app loads fresh, so the Insights page tells a consistent story rather than a different one on every visit.

### Why localStorage for persistence?

The brief asks for a frontend-only project. LocalStorage is the simplest durable layer available — no IndexedDB complexity, no third-party service. It covers the most important use case (don't lose transactions I added) with minimal code via Zustand's `persist` middleware.

---

## Optional Enhancements Included

The following optional features from the brief are implemented:

| Enhancement | Status |
|---|---|
| Dark mode | ✅ Full dark theme, persisted |
| Data persistence | ✅ localStorage via Zustand persist |
| Animations / transitions | ✅ Count-up on summary cards, chart mount animations, modal transitions |
| Export functionality | ✅ CSV and JSON export (Admin only) |
| Advanced filtering | ✅ Date range, multi-criteria, combined filters |

---

## Design Philosophy

The visual direction for this dashboard is **refined utility** — a finance tool that feels trustworthy and focused, not flashy. A few deliberate choices:

- **Typography pairing:** A geometric display font for headings (Sora) with a highly legible body font (DM Sans) — professional without being corporate
- **Colour restraint:** One accent colour (indigo) for interactive elements; green and red reserved exclusively for income and expense indicators so the meaning is never ambiguous
- **Information hierarchy:** Summary cards → trend over time → categorical breakdown — the overview page answers "how am I doing?" in three descending levels of detail
- **Empty states as first-class UI:** Every list and chart has a purposeful empty state with context-specific copy, not a generic "No data" message

---

## Possible Extensions

If this were a production application, the next steps would be:

1. **Real authentication** — JWT or OAuth, with server-side role assignment
2. **Backend API** — REST or GraphQL endpoint replacing `mockData.ts`; the store's `addTransaction` action would become an API call with optimistic updates
3. **Budget tracking** — monthly budget targets per category, with progress bars and over-budget alerts
4. **Recurring transactions** — mark transactions as recurring and auto-generate future entries
5. **Multi-account support** — track checking, savings, and credit card balances separately
6. **Notifications** — alert when a category exceeds its monthly budget
7. **Virtualised list** — replace the transaction table with `react-window` for 10,000+ transaction datasets

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

*Built as a frontend engineering assignment — April 2026*