<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.

---

## AGENT.md - Finance Dashboard

> Internal guide for developers, AI coding agents, and contributors working on or extending this codebase.

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Problem Statement](#2-problem-statement)
3. [Solution Architecture](#3-solution-architecture)
4. [Codebase Map](#4-codebase-map)
5. [State Management Contract](#5-state-management-contract)
6. [Data Model](#6-data-model)
7. [Role-Based Access Control (RBAC)](#7-role-based-access-control-rbac)
8. [Component Inventory](#8-component-inventory)
9. [Routing & Navigation](#9-routing--navigation)
10. [Styling System](#10-styling-system)
11. [Mock Data Strategy](#11-mock-data-strategy)
12. [Key Algorithms & Logic](#12-key-algorithms--logic)
13. [Extension Patterns](#13-extension-patterns)
14. [Known Constraints & Tradeoffs](#14-known-constraints--tradeoffs)
15. [Commands Reference](#15-commands-reference)

---

## 1. Project Context

This is a **client-side only** React application. There is no backend, no authentication server, and no database. All data is either mock-generated at runtime or persisted via `localStorage`. The app is designed to be demonstrable in isolation - interviewers, reviewers, or non-technical stakeholders can open it in a browser with zero setup and fully explore its capabilities.

The audience for this codebase is:

- A **reviewer** evaluating frontend architecture decisions
- A **developer** extending or maintaining the app
- An **AI agent** (like Cursor, GitHub Copilot, or Claude) making changes or adding features

**Tech stack:**

| Concern | Choice | Reason |
| --- | --- | --- |
| Framework | React 18 + Vite | Fast HMR, modern JSX transform, lightweight |
| State | Zustand | Minimal boilerplate, no providers needed, devtools-friendly |
| Styling | Tailwind CSS + CSS variables | Utility-first speed, custom token layer for theming |
| Charts | Recharts | React-native, composable, declarative |
| Routing | React Router v6 | Industry standard, nested routes |
| Persistence | localStorage via Zustand middleware | Zero-dependency, survives refresh |
| Icons | Lucide React | Consistent, tree-shakeable |

---

## 2. Problem Statement

### What was asked

Build a finance dashboard that:

1. Shows a **financial summary** (balance, income, expenses)
2. Displays **transactions** with filter/sort/search
3. Simulates **role-based UI** (Viewer vs Admin)
4. Renders **insights** from spending data
5. Manages **state** cleanly across the app
6. Works on **all screen sizes**
7. Handles **empty/edge-case states** gracefully

### Why this is non-trivial

Several tensions exist in this kind of project:

**Data density vs. clarity.** Finance dashboards are data-heavy. Showing everything at once creates cognitive overload. Showing too little makes the dashboard feel hollow. The solution requires deliberate information hierarchy - what does the user *need* first?

**Interactivity vs. performance.** Filtering, sorting, and searching all against the same in-memory array can be naively re-computed every render. For 50 mock transactions this doesn't matter; for 5,000 it does. The architecture should be ready to scale.

**Role simulation vs. real RBAC.** A frontend-only RBAC simulation must be visually convincing (the UI changes meaningfully) without pretending to be secure. The line between "demo" and "misleading" matters.

**Insight generation vs. over-engineering.** Deriving insights (highest spend category, MoM comparison) should use pure functions over the transaction array - not a graph database or ML model.

---

## 3. Solution Architecture

```bash
┌─────────────────────────────────────────────────────────┐
│                        App Shell                         │
│  (Theme provider, Router, Role switcher in topbar)       │
└──────────────────┬──────────────────────────────────────┘
                   │
       ┌───────────┴──────────────┐
       ▼                          ▼
┌─────────────┐          ┌───────────────────┐
│  Sidebar    │          │   Page Content     │
│  Nav        │          │                   │
└─────────────┘          │  ┌─────────────┐  │
                         │  │  Overview   │  │
                         │  ├─────────────┤  │
                         │  │ Transactions│  │
                         │  ├─────────────┤  │
                         │  │  Insights   │  │
                         │  └─────────────┘  │
                         └───────────────────┘
                                  │
                    ┌─────────────┴───────────────┐
                    ▼                              ▼
           ┌────────────────┐           ┌──────────────────┐
           │  Zustand Store │           │  Mock Data Layer  │
           │                │           │                   │
           │  transactions  │           │  generateTxns()   │
           │  filters       │           │  12 months data   │
           │  role          │           │  8 categories     │
           │  theme         │           └──────────────────┘
           └────────────────┘
```

### Key design decisions

#### Decision 1: Zustand over Context + useReducer

Context re-renders the entire subtree on every state change. For a dashboard where filters, role, theme, and transactions all live in global state, this causes excessive renders. Zustand uses shallow equality selectors - components only re-render when their specific slice changes.

#### Decision 2: Derived state computed at read time, not stored

Totals (balance, income, expenses), filtered transaction lists, and insight metrics are all **computed from `transactions`** on the fly using `useMemo` or selector functions. They are never stored as separate state. This prevents stale data and eliminates sync bugs.

#### Decision 3: Role state in Zustand, not localStorage by default

Role switches are session-level. Persisting role to localStorage would surprise a real user who closes and reopens the app as Admin. Only transactions and theme persist.

#### Decision 4: Single source of truth for transactions

There is one `transactions: Transaction[]` array in the store. The Transactions page filters a *view* of it; the Overview page aggregates it; the Insights page derives metrics from it. Nothing duplicates or transforms the array into a second store.

---

## 4. Codebase Map

```bash
src/
├── main.tsx                  # React root, Router wrapper
├── App.tsx                   # Shell: Sidebar + Topbar + <Outlet>
│
├── store/
│   └── useStore.ts           # Single Zustand store (all global state)
│
├── data/
│   └── mockData.ts           # Mock transaction generator + seed data
│
├── types/
│   └── index.ts              # TypeScript interfaces: Transaction, Role, Category, etc.
│
├── pages/
│   ├── Overview.tsx          # Dashboard home: summary cards + charts
│   ├── Transactions.tsx      # Full transaction list with filter/sort/search
│   └── Insights.tsx          # Derived metrics and spending patterns
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # Left nav (collapses on mobile)
│   │   └── Topbar.tsx        # Role switcher, theme toggle, breadcrumb
│   │
│   ├── cards/
│   │   ├── SummaryCard.tsx   # Balance / Income / Expenses tiles
│   │   └── InsightCard.tsx   # Metric callout card
│   │
│   ├── charts/
│   │   ├── BalanceTrend.tsx  # Line chart - balance over 12 months
│   │   ├── SpendingBreakdown.tsx  # Donut chart - spending by category
│   │   └── MonthlyBar.tsx    # Grouped bar - income vs expenses by month
│   │
│   ├── transactions/
│   │   ├── TransactionTable.tsx   # Table with sort headers
│   │   ├── TransactionRow.tsx     # Single row (read + edit mode)
│   │   ├── FilterBar.tsx          # Search, category filter, type filter, date range
│   │   └── AddTransactionModal.tsx # Admin-only modal (create/edit)
│   │
│   └── ui/
│       ├── Badge.tsx         # Category / type pill
│       ├── EmptyState.tsx    # Zero-data placeholder
│       ├── Skeleton.tsx      # Loading skeleton blocks
│       └── RoleBadge.tsx     # Visual indicator of current role
│
├── hooks/
│   ├── useFilteredTransactions.ts   # Applies all active filters -> memoized
│   ├── useInsights.ts               # Derives insight metrics from transactions
│   └── useDateRange.ts              # Date range helpers
│
├── utils/
│   ├── formatters.ts         # Currency, date, percentage formatters
│   ├── categoryColors.ts     # Category -> Tailwind color mapping
│   └── exportData.ts         # CSV and JSON export helpers
│
└── styles/
    ├── globals.css           # CSS custom properties (design tokens)
    └── tailwind.config.js    # Extended theme (custom colors, fonts)
```

---

## 5. State Management Contract

All global state lives in `src/store/useStore.ts`.

```typescript
interface AppStore {
  // --- Data ---
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // --- Filters (Transactions page) ---
  filters: {
    search: string;
    category: Category | 'all';
    type: 'income' | 'expense' | 'all';
    dateFrom: string | null;   // ISO date string
    dateTo: string | null;
    sortBy: 'date' | 'amount' | 'category';
    sortOrder: 'asc' | 'desc';
  };
  setFilter: <K extends keyof AppStore['filters']>(key: K, value: AppStore['filters'][K]) => void;
  resetFilters: () => void;

  // --- Role ---
  role: 'admin' | 'viewer';
  setRole: (r: 'admin' | 'viewer') => void;

  // --- Theme ---
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**Persistence:** The Zustand `persist` middleware serializes `transactions` and `theme` to `localStorage` under key `"findash-store"`. `filters` and `role` are excluded from persistence.

**Selector pattern - always use slices:**

```typescript
// ✅ Correct - only re-renders when transactions change
const transactions = useStore(s => s.transactions);

// ❌ Wrong - re-renders on every store update
const store = useStore();
```

---

## 6. Data Model

```typescript
type Category =
  | 'Housing'
  | 'Food & Dining'
  | 'Transport'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Utilities'
  | 'Income';

interface Transaction {
  id: string;               // nanoid() - e.g. "V1StGXR8"
  date: string;             // ISO 8601 - "2024-03-15"
  description: string;      // Human-readable label
  amount: number;           // Always positive. Type determines sign in UI.
  type: 'income' | 'expense';
  category: Category;
  note?: string;            // Optional free-text
}
```

**Amount is always stored positive.** The sign is applied at display time based on `type`. This avoids confusion when filtering by amount range or sorting.

---

## 7. Role-Based Access Control (RBAC)

This is **frontend-only simulation**. No route is server-protected. The role switcher in the Topbar writes to `useStore.role`. Components read it and conditionally render.

| Feature | Viewer | Admin |
| --- | --- | --- |
| View summary cards | ✅ | ✅ |
| View transactions list | ✅ | ✅ |
| View charts | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ (button hidden) | ✅ |
| Edit transaction | ❌ (row read-only) | ✅ (inline or modal) |
| Delete transaction | ❌ | ✅ |
| Export data | ❌ | ✅ |

**Implementation pattern:**

```tsx
// In any component that needs role-gating
const role = useStore(s => s.role);

// Option A: conditional render
{role === 'admin' && <AddTransactionButton />}

// Option B: disabled state
<button disabled={role !== 'admin'} title={role !== 'admin' ? 'Admin only' : undefined}>
  Export
</button>
```

Do **not** use role checks inside store actions (e.g., blocking `addTransaction` when role is viewer). The store is role-agnostic. Role enforcement is a **UI concern only**.

---

## 8. Component Inventory

### `SummaryCard`

```tsx
<SummaryCard
  label="Total Balance"
  value={12450.00}
  delta={+3.2}           // % change vs last month, optional
  icon={<WalletIcon />}
  variant="balance"      // 'balance' | 'income' | 'expense'
/>

```

Displays formatted currency value, optional delta badge (green/red), and icon. Animates value on mount using a count-up effect.

### `TransactionTable`

Renders a `<table>` with sortable column headers. Each header click toggles `sortBy` and `sortOrder` in the store. Rows are rendered from `useFilteredTransactions()`.

Admin rows include an action menu (edit, delete). Viewer rows are display-only.

### `FilterBar`

Controlled by store `filters` slice. Components:

- Text input -> `setFilter('search', value)`
- Category `<select>` -> `setFilter('category', value)`
- Type toggle (All / Income / Expense) -> `setFilter('type', value)`
- Date range pickers -> `setFilter('dateFrom', ...)`, `setFilter('dateTo', ...)`
- Reset button -> `resetFilters()`

### `AddTransactionModal`

Only mounts when `role === 'admin'`. Opens in create mode (no initial values) or edit mode (pre-filled from selected transaction). On submit, calls `addTransaction()` or `updateTransaction()` from the store.

### `EmptyState`

Renders when the filtered transaction list is empty. Distinguishes between:

- "No transactions at all" (seed data) - prompts to add one
- "No results for current filters" - prompts to clear filters

---

## 9. Routing & Navigation

```bash\
/                -> redirect to /overview
/overview        -> Overview page (Dashboard home)
/transactions    -> Transactions page
/insights        -> Insights page
```

React Router v6. All routes are inside the `App` shell component which renders the persistent Sidebar and Topbar. The `<Outlet>` renders page content.

The Sidebar highlights the active route using `NavLink`'s `isActive` prop.

---

## 10. Styling System

### Design tokens (CSS custom properties in `globals.css`)

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-accent: #6366f1;         /* Indigo - primary brand */
  --color-income: #22c55e;         /* Green */
  --color-expense: #ef4444;        /* Red */
  --color-chart-1 through 8: ...;  /* Category palette */
}

[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  /* accent, income, expense stay the same */
}
```

Theme toggle sets `document.documentElement.setAttribute('data-theme', theme)` and writes to the store.

### Tailwind extension

Custom color aliases in `tailwind.config.js` map to these CSS variables so utility classes like `bg-surface`, `text-primary`, `border-border` work consistently.

---

## 11. Mock Data Strategy

`src/data/mockData.ts` generates **120 transactions** across 12 months using a seeded pseudo-random function. The seed ensures the data is **deterministic** - the same mock data appears every time the app loads fresh (no localStorage), which makes the insights section predictable and reviewable.

```typescript
// Rough shape of the generator
function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  for (let month = 0; month < 12; month++) {
    // 1 income transaction per month
    txns.push(generateIncome(month));
    // 6-12 expense transactions per month spread across categories
    for (let i = 0; i < randomInt(6, 12); i++) {
      txns.push(generateExpense(month));
    }
  }
  return txns.sort((a, b) => b.date.localeCompare(a.date)); // newest first
}
```

The store hydrates with `generateTransactions()` as the initial value **only if** `localStorage` is empty. If the user has added/edited transactions, those persist.

---

## 12. Key Algorithms & Logic

### `useFilteredTransactions`

```typescript
function useFilteredTransactions(): Transaction[] {
  const transactions = useStore(s => s.transactions);
  const filters = useStore(s => s.filters);

  return useMemo(() => {
    let result = [...transactions];

    // 1. Search (description + note)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // 3. Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // 4. Date range
    if (filters.dateFrom) result = result.filter(t => t.date >= filters.dateFrom!);
    if (filters.dateTo) result = result.filter(t => t.date <= filters.dateTo!);

    // 5. Sort
    result.sort((a, b) => {
      const dir = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return a.date.localeCompare(b.date) * dir;
      if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
      return a.category.localeCompare(b.category) * dir;
    });

    return result;
  }, [transactions, filters]);
}
```

### `useInsights`

Derives 5 metrics from raw `transactions`:

1. **Top spending category** - `groupBy(category)` -> `maxBy(sum)`
2. **MoM expense change** - compare `thisMonth.expenses` vs `lastMonth.expenses`
3. **Savings rate** - `(income - expenses) / income * 100`
4. **Biggest single expense** - `maxBy(amount)` on type=expense
5. **Average monthly spend** - `totalExpenses / monthCount`

All pure functions. No side effects.

---

## 13. Extension Patterns

### Adding a new page

1. Create `src/pages/NewPage.tsx`
2. Add a route in `App.tsx`: `<Route path="/new-page" element={<NewPage />} />`
3. Add a `NavLink` entry in `Sidebar.tsx`

### Adding a new filter

1. Add the field to `AppStore['filters']` in `useStore.ts`
2. Add a default value in the `resetFilters` action
3. Add a UI control in `FilterBar.tsx` that calls `setFilter()`
4. Add the filter logic in `useFilteredTransactions.ts`

### Adding a new chart

1. Create `src/components/charts/MyChart.tsx` using Recharts primitives
2. Derive the data it needs using a `useMemo` or a custom hook
3. Drop it into the relevant page

### Replacing mock data with a real API

1. Create `src/api/transactions.ts` with a `fetchTransactions()` function
2. Add a `loading` and `error` field to the store
3. In `App.tsx` or a top-level effect, call `fetchTransactions()` and dispatch to `setTransactions()`
4. Mock data generator becomes the fallback or test fixture only

---

## 14. Known Constraints & Tradeoffs

| Constraint | Impact | Mitigation |
| --- | --- | --- |
| No backend | Role-switching is a UI demo, not secure | Clearly documented as frontend simulation |
| All data in memory | Filtering 10,000+ transactions would be slow | `useMemo` helps; virtualisation (react-window) if needed |
| localStorage only | Data doesn't sync across devices/browsers | Acceptable for a demo; API layer needed for production |
| Recharts bundle size | Adds ~130KB gzipped | Acceptable; can lazy-load chart pages if needed |
| No test suite | Regressions possible | Pure utility functions (formatters, insight derivers) are trivially testable - add Vitest if required |

---

## 15. Commands Reference

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type-check without emitting
bun x tsc --noEmit

# Lint
bun run lint

# Ultracite checks/fixes
bun x ultracite check
bun x ultracite fix
```

---
