# Admin Loading UX — Skeleton Placeholders

**Date:** 2026-06-24
**Status:** Approved design, pending implementation

## Problem

All admin pages fetch data via async RSC with direct Prisma calls. There are zero `loading.tsx`, `<Suspense>` boundaries, or `error.tsx` files anywhere. Users see a blank white `<main>` area until every query resolves. For pages like the admin dashboard (9+ sequential queries, 606 lines of JSX), this is a multi-second blank screen.

## Scope

Admin routes only:
- `/admin` — dashboard (9+ queries, complex layout)
- `/admin/announcement` — CRUD table (1 server action)
- `/admin/fees` — CRUD table (1 query + searchParams)
- `/admin/houses` — CRUD table (1 query)
- `/admin/users` — CRUD table (1 query)

User-facing and landing pages excluded (future work).

## Approach

Approach B from the brainstorm: a shared skeleton component system in `components/shared/skeletons/`. Each `loading.tsx` file composes the relevant skeleton. The admin shell (sidebar + header) is rendered by `AdministrationLayout` and is **never blocked** — `loading.tsx` only replaces `{children}` inside `<main>`, so the shell stays visible and interactive during data fetches.

## Architecture

### Component tree (new files)

```
components/shared/skeletons/
  skeleton-card.tsx          — reusable card shell with header + body placeholder
  skeleton-table.tsx         — table with configurable rows/columns
  admin-dashboard-skeleton.tsx — composes SkeletonCard for dashboard layout sections
  admin-crud-skeleton.tsx    — page header + SkeletonTable for CRUD pages
```

### loading.tsx files (one per route)

```
app/admin/
  loading.tsx                → <AdminDashboardSkeleton />
  announcement/loading.tsx   → <AdminCRUDSkeleton />
  fees/loading.tsx           → <AdminCRUDSkeleton />
  houses/loading.tsx         → <AdminCRUDSkeleton />
  users/loading.tsx          → <AdminCRUDSkeleton />
```

### Component details

**SkeletonCard** — renders a card-styled div with `Skeleton` placeholders mimicking `CardHeader` + `CardContent`. Accepts `rows` (number of content lines) and `width` (optional text width variant).

**SkeletonTable** — renders a table-like structure with header row and N data rows. Accepts `rows` (number of data rows), `columns` (number of columns), and optional `actionColumn` (for edit/delete action buttons). Mirrors the shape of the `DataTable` used by every CRUD page.

**AdminDashboardSkeleton** — renders the full dashboard layout:
- Welcome banner skeleton (header text + date chip)
- 4 metric cards grid (`SkeletonCard` x4)
- 3-section grid row (occupancy chart + dues progress + quick actions — `SkeletonCard` each)
- 2-section grid row (recent users + recent payments — `SkeletonCard` each with list-item skeletons)

**AdminCRUDSkeleton** — renders:
- Page title skeleton
- Optional stats bar skeleton (for fees page)
- `SkeletonTable` with 8 rows and 5 columns

## Existing dependencies

- `components/ui/skeleton.tsx` — already exists, used as the base building block
- `components/layouts/administration-layout.tsx` — no changes needed; shell persists during loading
- Tailwind CSS v4 — animation utilities available out of the box

## What does NOT change

- No changes to existing page.tsx files
- No changes to existing client components
- No changes to data fetching patterns
- No changes to admin layout or sidebar
- No new dependencies

## Error states

Not in scope for this spec. `error.tsx` files can be added in a follow-up pass.

## Verification

- Navigate to each admin route
- Confirm admin sidebar + header remain visible and interactive immediately
- Confirm skeleton placeholders render while data loads
- Confirm skeletons are replaced by real content once data resolves
- Test on slow network (DevTools throttling) to verify skeleton visibility window
