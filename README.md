# FinDash - Personal Finance Dashboard

A Next.js finance dashboard focused on clarity: overview metrics, transaction controls, and spending insights, with a simple Viewer/Admin role simulation.

## Current Scope (Phase 1)

This phase includes:

- Hero and project-intro landing page
- Core global state with Zustand
- Seeded mock transaction dataset
- Three core pages:
  - `overview`
  - `transactions`
  - `insights`
- Basic role-based UI behavior:
  - Viewer: read-only
  - Admin: add/edit/delete and export
- Local persistence for transactions and theme
- Bun-first workflow and commands

## Tech Stack

- Next.js App Router
- React 19
- Zustand
- Recharts
- Tailwind CSS
- TypeScript

## Getting Started (Bun)

Prerequisites:

- Bun installed (latest stable recommended)

Install and run:

```bash
bun install
bun run dev
```

Open:

- <http://localhost:3000>

Production build:

```bash
bun run build
bun run start
```

Quality checks:

```bash
bun run lint
bun run check
bun run fix
bun x tsc --noEmit
```

## Routes

- `/` - Hero + project overview
- `/overview` - Summary cards + charts
- `/transactions` - Filters, sorting, table, admin actions
- `/insights` - Derived spending metrics

## Assignment Requirement Mapping

| Requirement | Implementation in this project |
| --- | --- |
| Dashboard overview (summary + charts) | `overview` page with summary cards, balance trend, spending breakdown, and monthly income vs expenses |
| Transactions section (date, amount, category, type + filter/search/sort) | `transactions` page with filters, searchable/sortable data table, and responsive mobile cards |
| Basic role-based UI | Role switcher in dashboard shell (`viewer` / `admin`) with admin-only create, edit, delete, and export actions |
| Insights section | `insights` page with highest category, month-over-month expense change, savings rate, biggest expense, and average monthly spend |
| State management | Zustand store for transactions, filters, role, and theme; derived hooks for filtered views and insight calculations |
| UI/UX expectations | Responsive shell and components, role-aware interactions, and explicit empty states for transactions and overview charts |
| Documentation quality | This README includes setup, stack, route overview, and requirement mapping for evaluator review |

Optional enhancements included:

- Dark mode
- Local persistence (transactions + theme)
- Export functionality (CSV/JSON)

## Project Structure

```bash
app/
  layout.tsx
  page.tsx
  (dashboard)/
    layout.tsx
    overview/page.tsx
    transactions/page.tsx
    insights/page.tsx

components/
  ui/

data/
  mockData.ts

hooks/
  UseMobile.ts
  useFilteredTransactions.ts
  useInsights.ts

store/
  useStore.ts

types/
  index.ts

utils/
  exportData.ts
  formatters.ts

lib/
  Utils.ts
```

## Notes

- Role-based access here is UI-level simulation only.
- No backend/auth layer yet.
- This repository now uses Bun commands as the default workflow.

## Next Phase Ideas

- Better dashboard shell polish (micro-interactions, stronger visual hierarchy)
- Modal-based transaction forms
- Budget targets and alerts
- API-backed persistence and auth
- Virtualized table for large datasets
