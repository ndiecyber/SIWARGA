# Admin Loading UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-page skeleton loading states to all 5 admin routes, showing placeholder UI while async RSC data fetches resolve.

**Architecture:** Shared skeleton components in `components/shared/skeletons/`, each `loading.tsx` file composes the matching skeleton. Admin shell (sidebar + header) rendered by `AdministrationLayout` persists uninterrupted — `loading.tsx` only replaces `{children}` inside `<main>`.

**Tech Stack:** Next.js 16, React 19, shadcn/ui (radix-vega), Tailwind CSS 4, `components/ui/skeleton.tsx` (already exists)

## Global Constraints

- All new skeleton components go under `components/shared/skeletons/`
- Every skeleton uses the existing `Skeleton` from `components/ui/skeleton.tsx`
- No changes to existing page.tsx, client components, data fetching, or admin layout
- Each `loading.tsx` is `"use client"` if it uses client-side features (not needed — skeletons are pure markup + Tailwind)
- Follow existing naming/style conventions from `components/ui/card.tsx`, `components/ui/skeleton.tsx`

---

### Task 1: Base skeleton building blocks — SkeletonCard + SkeletonTable

**Files:**
- Create: `components/shared/skeletons/skeleton-card.tsx`
- Create: `components/shared/skeletons/skeleton-table.tsx`
- Create: `components/shared/skeletons/index.ts`

**Interfaces:**
- Produces: `SkeletonCard` — reusable card skeleton, accepts `rows` (number of content lines), `width` (`"sm"` | `"md"` | `"lg"` | `"full"`), `className`
- Produces: `SkeletonTable` — reusable table skeleton, accepts `rows` (number of data rows), `columns` (number of columns), `actionColumn` (boolean — adds right-aligned action button column)

- [ ] **Step 1: Create `skeleton-card.tsx`**

```tsx
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCardProps {
  rows?: number
  width?: "sm" | "md" | "lg" | "full"
  className?: string
}

const widthMap = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
}

function SkeletonCard({ rows = 2, width = "full", className }: SkeletonCardProps) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        "flex flex-col gap-4 overflow-hidden rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="size-9 shrink-0 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3", i === rows - 1 ? widthMap[width] : "w-full")}
          />
        ))}
      </div>
    </div>
  )
}

export { SkeletonCard }
```

- [ ] **Step 2: Create `skeleton-table.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonTableProps {
  rows?: number
  columns?: number
  actionColumn?: boolean
}

function SkeletonTable({ rows = 8, columns = 5, actionColumn = false }: SkeletonTableProps) {
  const totalColumns = actionColumn ? columns + 1 : columns
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
        {Array.from({ length: totalColumns }).map((_, i) => (
          <Skeleton
            key={`h-${i}`}
            className={`h-3 ${i === totalColumns - 1 && actionColumn ? "ml-auto w-16" : "flex-1"}`}
          />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`r-${r}`}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: totalColumns }).map((_, c) => (
            <Skeleton
              key={`c-${r}-${c}`}
              className={`h-3 ${c === totalColumns - 1 && actionColumn ? "ml-auto w-16" : "flex-1"}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { SkeletonTable }
```

- [ ] **Step 3: Create `index.ts` barrel export**

```ts
export { SkeletonCard } from "./skeleton-card"
export { SkeletonTable } from "./skeleton-table"
```

- [ ] **Step 4: Commit**

```bash
git add components/shared/skeletons/
git commit -m "feat: add SkeletonCard and SkeletonTable base components"
```

---

### Task 2: Page-level skeletons — AdminDashboardSkeleton + AdminCRUDSkeleton

**Files:**
- Create: `components/shared/skeletons/admin-dashboard-skeleton.tsx`
- Create: `components/shared/skeletons/admin-crud-skeleton.tsx`
- Modify: `components/shared/skeletons/index.ts` (add exports)

**Interfaces:**
- Consumes: `SkeletonCard` (rows, width, className), `SkeletonTable` (rows, columns, actionColumn)
- Produces: `AdminDashboardSkeleton` — matches `/admin` page layout (banner + 4 metric cards + 3-section row + 2-section row)
- Produces: `AdminCRUDSkeleton` — matches CRUD page layout (page title + optional stats row + table)

- [ ] **Step 1: Create `admin-dashboard-skeleton.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "./skeleton-card"

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-44 rounded-xl" />
      </div>

      {/* Metric Cards — 4-column grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard rows={2} />
        <SkeletonCard rows={2} />
        <SkeletonCard rows={2} />
        <SkeletonCard rows={2} />
      </div>

      {/* Middle Section — 3 cards */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <SkeletonCard rows={5} className="h-full" />
        </div>
        <div className="md:col-span-4">
          <SkeletonCard rows={5} className="h-full" />
        </div>
        <div className="md:col-span-4">
          <SkeletonCard rows={4} className="h-full" />
        </div>
      </div>

      {/* Bottom Section — 2 list cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-9 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AdminDashboardSkeleton }
```

- [ ] **Step 2: Create `admin-crud-skeleton.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonTable } from "./skeleton-table"

interface AdminCRUDSkeletonProps {
  showStats?: boolean
}

function AdminCRUDSkeleton({ showStats = false }: AdminCRUDSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Optional stats row (used by fees page) */}
      {showStats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar row (search + filter + sort) */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Table */}
      <SkeletonTable rows={8} columns={5} actionColumn />
    </div>
  )
}

export { AdminCRUDSkeleton }
```

- [ ] **Step 3: Update `index.ts`**

```ts
export { SkeletonCard } from "./skeleton-card"
export { SkeletonTable } from "./skeleton-table"
export { AdminDashboardSkeleton } from "./admin-dashboard-skeleton"
export { AdminCRUDSkeleton } from "./admin-crud-skeleton"
```

- [ ] **Step 4: Commit**

```bash
git add components/shared/skeletons/
git commit -m "feat: add AdminDashboardSkeleton and AdminCRUDSkeleton page skeletons"
```

---

### Task 3: loading.tsx files in all admin routes

**Files:**
- Create: `app/admin/loading.tsx`
- Create: `app/admin/announcement/loading.tsx`
- Create: `app/admin/fees/loading.tsx`
- Create: `app/admin/houses/loading.tsx`
- Create: `app/admin/users/loading.tsx`

**Interfaces:**
- Consumes: `AdminDashboardSkeleton`, `AdminCRUDSkeleton`
- Each loading.tsx is a server component (no `"use client"` needed — all child skeletons are pure markup)

- [ ] **Step 1: Create `app/admin/loading.tsx`**

```tsx
import { AdminDashboardSkeleton } from "@/components/shared/skeletons"

export default function AdminDashboardLoading() {
  return <AdminDashboardSkeleton />
}
```

- [ ] **Step 2: Create `app/admin/announcement/loading.tsx`**

```tsx
import { AdminCRUDSkeleton } from "@/components/shared/skeletons"

export default function AnnouncementLoading() {
  return <AdminCRUDSkeleton />
}
```

- [ ] **Step 3: Create `app/admin/fees/loading.tsx`**

```tsx
import { AdminCRUDSkeleton } from "@/components/shared/skeletons"

export default function FeesLoading() {
  return <AdminCRUDSkeleton showStats />
}
```

- [ ] **Step 4: Create `app/admin/houses/loading.tsx`**

```tsx
import { AdminCRUDSkeleton } from "@/components/shared/skeletons"

export default function HousesLoading() {
  return <AdminCRUDSkeleton />
}
```

- [ ] **Step 5: Create `app/admin/users/loading.tsx`**

```tsx
import { AdminCRUDSkeleton } from "@/components/shared/skeletons"

export default function UsersLoading() {
  return <AdminCRUDSkeleton />
}
```

- [ ] **Step 6: Verify build succeeds**

```bash
pnpm build
```

Expected: Build completes with no errors. Verify no type errors from new files.

- [ ] **Step 7: Commit**

```bash
git add app/admin/*/loading.tsx app/admin/loading.tsx
git commit -m "feat: add loading.tsx to all admin routes"
```

---

### Task 4: Visual verification

**Files:** None — verification only

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Verify each admin route**

Navigate to each route and confirm:
- Admin sidebar + header visible immediately
- Loading skeleton renders while data fetches
- Skeleton replaced by real content once data resolves

Routes to check:
- `http://localhost:3000/admin`
- `http://localhost:3000/admin/announcement`
- `http://localhost:3000/admin/fees`
- `http://localhost:3000/admin/houses`
- `http://localhost:3000/admin/users`

- [ ] **Step 3: Throttle network test (DevTools > Network > Slow 3G)**

Repeat navigation to `/admin` with throttling enabled. Verify skeleton remains visible long enough to be meaningful (at least 1-2 seconds).
