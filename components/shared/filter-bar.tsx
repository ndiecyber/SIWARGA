import FilterDropdown from "./filter-dropdown";
import FilterChip from "./filter-chip";
import type { FilterCategory, ActiveFilter } from "@/lib/types/filter";

interface FilterBarProps<TData> {
  filterCategories: FilterCategory<TData>[];
  activeFilters: ActiveFilter<TData>[];
  onAddFilter: (filter: ActiveFilter<TData>) => void;
  onRemoveFilter: (categoryId: keyof TData) => void;
  onClearAll: () => void;
}

export function FilterBar<TData>({
  filterCategories,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onClearAll,
}: FilterBarProps<TData>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <FilterDropdown
        filterCategories={filterCategories}
        activeFilters={activeFilters}
        onAddFilter={onAddFilter}
      />
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.categoryId as string}
              filter={filter}
              filterCategories={filterCategories}
              onRemove={() => onRemoveFilter(filter.categoryId)}
            />
          ))}
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Hapus semua
          </button>
        </div>
      )}
    </div>
  );
}
