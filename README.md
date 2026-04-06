# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built with **Next.js**, **JavaScript**, and **Context API** for state management.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

> **Node.js 18+** required.

---

## ✨ Features

### Core
| Feature | Details |
|---|---|
| **Dashboard Overview** | Summary cards (Balance, Income, Expenses), balance trend chart, spending donut chart, recent transactions |
| **Transactions** | Full CRUD (Admin only), search, filter by type/category/date range, multi-column sort |
| **Insights** | KPI cards, monthly comparison bar chart, category breakdown with progress bars |
| **Role-Based UI** | Admin (full CRUD) vs Viewer (read-only) — switch via sidebar dropdown |

### Optional Enhancements (All Implemented ✅)
| Enhancement | Implementation |
|---|---|
| 🌙 **Dark Mode** | Full CSS variable system, persisted to localStorage |
| 💾 **Data Persistence** | All state (transactions, role, dark mode) saved to localStorage |
| 📤 **Export** | CSV and JSON export for filtered transaction sets |
| 🎨 **Animations** | Smooth modal transitions, card hovers, chart animations |
| 🔍 **Advanced Filtering** | Combined search + type + category + date range + sort |

---

## 🗂 Folder Structure

```
finance-dashboard/
├── pages/
│   ├── _app.js            # App wrapper with FinanceProvider + Toaster
│   ├── _document.js       # Custom document, font imports
│   └── index.js           # Root page, tab routing
├── components/
│   ├── layout/
│   │   ├── Sidebar.js     # Desktop sidebar: nav, role switcher, dark toggle
│   │   └── MobileNav.js   # Mobile bottom navigation bar
│   ├── dashboard/
│   │   ├── DashboardPage.js      # Page shell
│   │   ├── SummaryCards.js       # Balance / Income / Expense KPI cards
│   │   ├── BalanceTrendChart.js  # 6-month area chart (Recharts)
│   │   ├── SpendingBreakdown.js  # Current month donut chart
│   │   └── RecentTransactions.js # Latest 6 transactions list
│   ├── transactions/
│   │   ├── TransactionsPage.js   # Page shell
│   │   ├── FilterBar.js          # Search + filters + export buttons
│   │   ├── TransactionTable.js   # Data table with edit/delete (admin)
│   │   ├── TransactionModal.js   # Add / Edit modal form
│   │   └── DeleteConfirmModal.js # Confirmation dialog
│   └── insights/
│       └── InsightsPage.js       # KPIs + bar chart + category bars
├── context/
│   └── FinanceContext.js  # useReducer-based global state + localStorage sync
├── data/
│   └── mockData.js        # 50+ mock transactions, category config, role config
├── utils/
│   └── finance.js         # Pure calculation helpers + export utilities
└── styles/
    └── globals.css        # Full CSS variable theming, all component styles
```

---

## 🏗 Architecture Decisions

### State Management — Context + useReducer
Chosen over Redux for this scope: no boilerplate, no extra packages, full type transparency. A single `FinanceContext` holds:
- `transactions[]` — the data source of truth
- `filters` — search, type, category, dateRange, sortBy, sortOrder
- `role` — ADMIN | VIEWER
- `darkMode` — boolean
- `ui` — modal open/close state (not persisted)

All mutations go through a typed reducer for predictability. Side effects (localStorage sync, dark mode DOM attribute) live in `useEffect` hooks.

### Styling — Pure CSS with Variables
No framework dependency. CSS custom properties (`--bg-primary`, `--text-secondary`, etc.) make dark/light mode a single `data-theme` attribute swap. Every component uses these variables so theming is zero-cost.

### Component Design — Presentational + Container split
Pages (`DashboardPage`, `TransactionsPage`, `InsightsPage`) are containers — they read state and pass props down. Leaf components (`SummaryCards`, `FilterBar`, `TransactionTable`) are mostly presentational with isolated concerns.

---

## 🔐 Role-Based UI

| Capability | Admin 👑 | Viewer 👁️ |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Export CSV/JSON | ✅ | ✅ |

Switch roles anytime via the sidebar dropdown. UI updates instantly with no page reload.

---

## 📊 Mock Data

50+ realistic transactions across 6 months covering:
- **Salary, Freelance, Investment** income sources
- **Food, Transport, Shopping, Health, Entertainment, Utilities, Rent** expense categories
- Seasonal patterns (festivals, travel, bonuses) for interesting chart shapes

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Language | JavaScript (ES2022) |
| State | React Context + useReducer |
| Charts | Recharts |
| Dates | date-fns |
| Fonts | Syne (display) + Outfit (body) + JetBrains Mono (numbers) |
| Styling | Custom CSS with CSS variables |

---

## 🎨 Design Philosophy

**Warm Minimal** — Off-white backgrounds (`#f7f5f2`), warm grays, and a single gold accent (`#c4a882`) keep the interface calm and readable. Display numbers use `JetBrains Mono` for instant scanability. The `Syne` display font gives headings character without shouting.

Dark mode uses deep warm darks (`#0f0e0c`, `#1a1814`) instead of cold grays — matching the overall warm personality.

---

## 📱 Responsive Design

- **Desktop (>768px):** Fixed sidebar + main content area
- **Tablet (768–1024px):** Sidebar hidden, 2-column summary grid
- **Mobile (<768px):** Bottom navigation bar, single-column layout, horizontal scroll on table
