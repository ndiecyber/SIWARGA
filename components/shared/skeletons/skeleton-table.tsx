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
