// ─── Filter Dropdown ──────────────────────────────────────────────────────────

import { ActiveFilter, FilterCategory } from "@/lib/types/filter";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, Filter } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

function FilterDropdown({
  filterCategories,
  activeFilters,
  onAddFilter,
}: {
  filterCategories: FilterCategory[];
  activeFilters: ActiveFilter[];
  onAddFilter: (filter: ActiveFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<FilterCategory | null>(
    null,
  );
  const [submenuPos, setSubmenuPos] = useState({ top: 0 });
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleCategoryHover = (cat: FilterCategory) => {
    setHoveredCategory(cat);
    const el = categoryRefs.current.get(cat.id);
    if (el) {
      setSubmenuPos({ top: el.offsetTop });
    }
  };

  const isOptionActive = (catId: string, value: string) =>
    activeFilters.some((f) => f.categoryId === catId && f.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-9 gap-1.5 text-sm",
          activeFilters.length > 0 && "border-primary/50 text-primary",
        )}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setHoveredCategory(null);
        }}
      >
        <Filter className="h-3.5 w-3.5" />
        Filter
        {activeFilters.length > 0 && (
          <Badge
            variant="secondary"
            className="ml-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]"
          >
            {activeFilters.length}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-10 z-50 flex shadow-md">
          {/* Main category list */}
          <div className="w-44 rounded-r-md border bg-popover py-1">
            <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Tambah Filter
            </p>
            {filterCategories.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => {
                  if (el) categoryRefs.current.set(cat.id, el);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors",
                  hoveredCategory?.id === cat.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseEnter={() => handleCategoryHover(cat)}
              >
                <span>{cat.label}</span>
                <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>

          {/* Submenu — muncul di sebelah kiri panel utama */}
          {hoveredCategory && (
            <div
              className="absolute right-44 w-44 rounded-l-md border border-r-0 bg-popover py-1 shadow-md"
              style={{ top: submenuPos.top }}
              onMouseEnter={() => {
                /* keep open */
              }}
            >
              <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {hoveredCategory.label}
              </p>
              {hoveredCategory.options.map((opt) => {
                const active = isOptionActive(hoveredCategory.id, opt.value);
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                      active && "pointer-events-none opacity-60",
                    )}
                    onClick={() => {
                      if (!active) {
                        onAddFilter({
                          categoryId: hoveredCategory.id,
                          categoryLabel: hoveredCategory.label,
                          value: opt.value,
                          valueLabel: opt.label,
                        });
                      }
                      setOpen(false);
                      setHoveredCategory(null);
                    }}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                    {active && (
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        Aktif
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
