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
