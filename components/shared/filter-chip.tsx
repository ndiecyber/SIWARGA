import { ActiveFilter, FilterCategory } from "@/lib/types/filter";
import { X } from "lucide-react";

type FilterChipProps<TData> = {
  filterCategories: FilterCategory<TData>[];
  filter: ActiveFilter<TData>;
  onRemove: () => void;
};

function FilterChip<TData>({
  filterCategories,
  filter,
  onRemove,
}: FilterChipProps<TData>) {
  const category = filterCategories.find((c) => c.id === filter.categoryId);
  const option = category?.options.find((o) => o.value === filter.value);

  return (
    <div className="flex h-7 items-center overflow-hidden rounded-md border bg-background text-xs shadow-sm">
      <span className="border-r bg-muted px-2 py-1 font-medium text-muted-foreground">
        {filter.categoryLabel}
      </span>

      <span className="flex items-center gap-1.5 px-2 py-1 font-medium">
        {option?.icon}
        {filter.valueLabel}
      </span>

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
