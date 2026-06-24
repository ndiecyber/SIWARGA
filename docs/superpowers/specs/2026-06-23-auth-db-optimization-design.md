# Auth & DB Optimization Design

**Date:** 2026-06-23
**Project:** SIWARGA
**Stack:** Next.js 16, better-auth, Prisma (PostgreSQL / Neon), shadcn/ui, TanStack Table

## Problem

1. **Neon cold-start stalls.** The Neon DB compute suspends after inactivity. The first auth session query after idle takes 2-5s, causing "failed to get session" errors in dev.
2. **No middleware-level route protection.** Auth is enforced via HOC wrappers (`layoutWithAuthAdmin`, `layoutWithAuthUser`) that run _after_ render starts. No edge-level guard exists.
3. **Repetitive DB action patterns.** Every server action repeats the same try/catch/error-format. No transaction boundaries for multi-step ops. Admin dashboard runs ~10 sequential DB queries.
4. **Client-side pagination only.** The `DataTable` receives all rows upfront (tanstack in-memory pagination). Not sustainable as data grows.

## Scope

Two domains, single spec, built sequentially:

1. **AuthN/AuthZ (Phase 1)** — middleware guard, Neon pool tuning, session helper replacement
2. **DB Action Patterns (Phase 2)** — repository layer, transactions, dashboard consolidation, server-side pagination, error helper

---

## Phase 1: Auth Improvements

### Architecture

```
Request
  │
  ▼
[Middleware]  — getSessionCookie() at edge, redirect if absent
  │
  ▼
[Layout]      — getSession() via React.cache(), full DB verification
  │
  ▼
[Page/Action] — requireAdmin() / requireUser() guards as needed
```

### Middleware (`middleware.ts`)

- Import `getSessionCookie` from `better-auth/cookies`
- Edge-compatible, zero DB calls
- Matcher: `/admin/*`, `/dashboard`, `/iuran`, `/pengumuman`, `/piket`
- If cookie missing → `redirect("/")`
- No role check at middleware level — role enforcement stays in layout/pages

### Session Helper (`lib/auth.ts`)

Replace HOC wrappers with three exported functions:

| Helper | Returns | Redirects |
|---|---|---|
| `getSession()` | `Session \| null` | Never |
| `requireAdmin()` | `Session` | If null or role !== "admin" → `/` |
| `requireUser()` | `Session` | If null or role !== "user" → `/dashboard` |

All wrapped in `React.cache()` so they're memoized per-request — multiple calls within the same render tree hit the cache, not the DB.

### Layout Changes

**Before:**
```tsx
// app/admin/layout.tsx — HOC wraps the layout
export default layoutWithAuthAdmin(Layout)
```

**After:**
```tsx
// app/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const { user } = await requireAdmin()
  return <AdministrationLayout>{children}</AdministrationLayout>
}
```

No more HOC wrapping. Pages that previously used `layoutWithAuthAdmin(Page)` just export their component — the layout handles enforcement.

### Neon Pool Optimization

Current `db.ts` uses `PrismaPg` adapter with no pool config. Changes:

1. **Connection string suffix:** append `?pgbouncer=true&connect_timeout=5` to the pooled URL (already uses `-pooler`)
2. **PrismaPg options:** add `connection_limit: 1, pool_timeout: 2` — fail fast when Neon compute is cold
3. **Remove `log: ["query"]` in production** — query logging adds overhead to every operation

If the DB fails to respond (cold-start), the session check redirects immediately rather than hanging for seconds.

---

## Phase 2: DB Action Patterns

### Repository Layer

Thin wrappers under `lib/repositories/`, one file per domain entity:

```
lib/repositories/
  users.ts       — findByPhone, create, update, delete, list, search, paginate
  houses.ts      — findById, create, update, delete, listOwned, paginate
  payments.ts    — create, markPaid, recentPayments, totalCollected
  monthly-dues.ts — generateForMonth, findByHouseMonth, statsByPeriod
  announcements.ts — create, update, delete, list, paginate
  dashboard.ts   — aggregateDashboardStats()
```

Each repository exports plain async functions that accept `prisma` (defaults to the shared instance). They do **not** replace the ORM — they encapsulate common query patterns and join shapes. Server actions call repositories, never `prisma` directly.

### Transactions

Multi-step operations wrapped in `prisma.$transaction()`:

- `generateDuesAction` — loop of create calls becomes a single transactional batch
- Mark-as-paid — create `Payment` + update `MonthlyDues.status` in one transaction
- Delete user — delete related profiles/sessions/accounts in cascade

### Dashboard Query Consolidation

Current admin dashboard page runs 10 sequential `await prisma.*` calls. Replace with:

```ts
// lib/repositories/dashboard.ts
export async function aggregateDashboardStats() {
  const [totalResidents, totalHouses, occupiedCount, paymentAgg, duesStats, recentUsers, recentPayments]
    = await Promise.all([...]) // 3-4 batched queries instead of 10
}
```

Reduces DB round-trips from ~10 to 3-4.

### Standardized Pagination

Shared helper in `lib/repositories/pagination.ts`:

```ts
interface PaginationInput {
  page: number
  pageSize: number
  filters?: Record<string, unknown>
  sort?: { field: string; dir: "asc" | "desc" }
  select?: unknown  // Prisma select object
}

interface PaginatedResult<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
```

### DataTable Server-Side Pagination

The current `DataTable` uses tanstack's `getPaginationRowModel` (client-side). Changes:

**New props:**
- `totalCount: number` (replaces inference from `data.length`)
- `pageCount: number`
- `page: number`, `pageSize: number`
- `onPageChange: (page: number) => void`
- `onPageSizeChange: (size: number) => void`
- `onSortChange: (sort) => void`
- `onFilterChange: (filters) => void`

**Removed/retained:**
- Keep client-side column visibility, row selection, search input
- Remove `getPaginationRowModel` — pagination becomes fully server-controlled
- Search input fires `onFilterChange` (debounced) instead of client-side global filter

Each page using the DataTable passes a server action as the data fetcher, wired to the pagination callbacks.

### Error Helper

```ts
// lib/repositories/error.ts
export function handleDbError(error: unknown): { success: false; message: string }
```

Wraps `Prisma.PrismaClientKnownRequestError` codes (P2002 → duplicate, P2025 → not found) into user-facing Indonesian messages. All server actions call `handleDbError` instead of writing their own catch blocks.

---

## Out of Scope

- Granular permissions / RBAC beyond `user`/`admin`
- Cookie-backed session cache (Approach B was considered and rejected as over-engineered for this app)
- OAuth / SSO providers
- WebSocket / real-time data

## Migration Path

1. **Phase 1a:** Update `db.ts` with Neon pool config
2. **Phase 1b:** Create `getSession` helpers in `lib/auth.ts`
3. **Phase 1c:** Create `middleware.ts` with `getSessionCookie`
4. **Phase 1d:** Rewrite admin layout and user layout to use helpers (remove HOCs)
5. **Phase 2a:** Create `lib/repositories/` directory with initial files
6. **Phase 2b:** Create `handleDbError` helper
7. **Phase 2c:** Migrate each server action to use repositories
8. **Phase 2d:** Consolidate dashboard queries
9. **Phase 2e:** Add pagination helper and update DataTable
10. **Phase 2f:** Add transaction boundaries to multi-step actions

Each step is independently verifiable — no big-bang deployment.
