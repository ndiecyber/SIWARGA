import { ActiveFilter, FilterCategory } from "@/lib/types/filter";
import { X } from "lucide-react";

function FilterChip({
  filterCategories,
  filter,
  onRemove,
}: {
  filterCategories: FilterCategory[];
  filter: ActiveFilter;
  onRemove: () => void;
}) {
  const category = filterCategories.find((c) => c.id === filter.categoryId);
  const option = category?.options.find((o) => o.value === filter.value);

  return (
    <div className="flex h-7 items-center overflow-hidden rounded-md border bg-background text-xs shadow-sm">
      {/* Category label */}
      <span className="border-r bg-muted px-2 py-1 font-medium text-muted-foreground">
        {filter.categoryLabel}
      </span>

      {/* Value */}
      <span className="flex items-center gap-1.5 px-2 py-1 font-medium">
        {option?.icon}
        {filter.valueLabel}
      </span>
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex h-full items-center border-l px-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Hapus filter ${filter.categoryLabel}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export default FilterChip;
