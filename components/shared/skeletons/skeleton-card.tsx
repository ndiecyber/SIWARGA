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
