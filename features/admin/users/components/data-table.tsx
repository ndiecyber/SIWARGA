"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, Filter, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FilterCategory {
  id: keyof Pick<User, "role">;
  label: string;
  options: FilterOption[];
}

interface ActiveFilter {
  categoryId: keyof Pick<User, "role">;
  categoryLabel: string;
  value: string;
  valueLabel: string;
}

interface DataTableProps {
  columns: ColumnDef<User>[];
  data: User[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  // {
  //   id: "duesStatus",
  //   label: "Status Iuran",
  //   options: [
  //     {
  //       label: "Lunas",
  //       value: "LUNAS",
  //       icon: (
  //         <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
  //       ),
  //     },
  //     {
  //       label: "Menunggak",
  //       value: "MENUNGGAK",
  //       icon: <span className="inline-block h-2 w-2 rounded-full bg-red-500" />,
  //     },
  //   ],
  // },
  {
    id: "role",
    label: "Role",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Warga", value: "WARGA" },
    ],
  },
];

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  activeFilters,
  onAddFilter,
}: {
  activeFilters: ActiveFilter[];
  onAddFilter: (filter: ActiveFilter) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [hoveredCategory, setHoveredCategory] =
    React.useState<FilterCategory | null>(null);
  const [submenuPos, setSubmenuPos] = React.useState({ top: 0 });
  const categoryRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
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
            {FILTER_CATEGORIES.map((cat) => (
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

// ─── Active Filter Chip ───────────────────────────────────────────────────────

function FilterChip({
  filter,
  onRemove,
}: {
  filter: ActiveFilter;
  onRemove: () => void;
}) {
  const category = FILTER_CATEGORIES.find((c) => c.id === filter.categoryId);
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

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // Sync activeFilters → columnFilters
  const handleAddFilter = (filter: ActiveFilter) => {
    // One active filter per category (replace if same category)
    const next = [
      ...activeFilters.filter((f) => f.categoryId !== filter.categoryId),
      filter,
    ];
    setActiveFilters(next);
    applyColumnFilters(next);
  };

  const handleRemoveFilter = (categoryId: string) => {
    const next = activeFilters.filter((f) => f.categoryId !== categoryId);
    setActiveFilters(next);
    applyColumnFilters(next);
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setColumnFilters([]);
  };

  const applyColumnFilters = (filters: ActiveFilter[]) => {
    const colFilters: ColumnFiltersState = filters.map((f) => ({
      id: f.categoryId,
      value: f.value,
    }));
    setColumnFilters(colFilters);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama ... "
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterDropdown
            activeFilters={activeFilters}
            onAddFilter={handleAddFilter}
          />
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.categoryId}
              filter={filter}
              onRemove={() => handleRemoveFilter(filter.categoryId)}
            />
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Hapus semua
          </button>
        </div>
      )}

      {/* Summary stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          Total:{" "}
          <strong className="text-foreground">{data.length} warga</strong>
        </span>
        {/* <span>
          Lunas:{" "}
          <strong className="text-emerald-600">
            {data.filter((d) => d.duesStatus === "LUNAS").length}
          </strong>
        </span>
        <span>·</span>
        <span>
          Menunggak:{" "}
          <strong className="text-red-600">
            {data.filter((d) => d.duesStatus === "MENUNGGAK").length}
          </strong>
        </span> */}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Baris per halaman</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val: string) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Halaman{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
