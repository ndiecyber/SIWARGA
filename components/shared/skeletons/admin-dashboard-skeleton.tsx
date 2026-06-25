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
