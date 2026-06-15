"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import { SortOption } from "@/lib/types/sort";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/lib/types/filter";
import { useSortState } from "@/hooks/use-sort-state";
import { useFilterState } from "@/hooks/use-filter-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import FilterChips from "./filter-chips";
import SortDropdown from "./sort-dropdown";
import FilterDropdown from "./filter-dropdown";
import { MobileFilterSort } from "./mobile-filter-sort";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterCategories?: FilterCategory<TData>[];
  sortOptions?: SortOption<TData>[];
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns,
  data,
  filterCategories = [],
  sortOptions = [],
}: DataTableProps<TData, TValue>) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Filter and sort hooks
  const { activeFilters, columnFilters, addFilter, removeFilter, clearAll } =
    useFilterState<TData>();
  const { activeSort, sorting, onSortChange } = useSortState<TData>();

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
    },
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

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <header className="flex flex-col w-full gap-2">
        {/* Desktop view */}
        <div className="flex-row items-center justify-between hidden gap-3 md:flex">
          {/* Search input */}
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="opacity-50 size-4 shrink-0" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama, "
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </InputGroup>

          {/* Filter and sort actions */}
          <div className="flex flex-row items-center justify-between gap-1">
            <FilterDropdown
              filterCategories={filterCategories}
              activeFilters={activeFilters}
              onAddFilter={addFilter}
            />

            <SortDropdown
              sortOptions={sortOptions}
              activeSort={activeSort}
              onSortChange={onSortChange}
            />
          </div>
        </div>

        {/* Mobile view */}
        <div className="flex flex-row items-center justify-between gap-3 md:hidden">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="opacity-50 size-4 shrink-0" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama, "
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </InputGroup>

          <MobileFilterSort
            filterCategories={filterCategories}
            activeFilters={activeFilters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
            onClearAllFilters={clearAll}
            sortOptions={sortOptions}
            activeSort={activeSort}
            onSortChange={onSortChange}
          />
        </div>

        <div className="hidden w-full md:block">
          <FilterChips
            filterCategories={filterCategories}
            activeFilters={activeFilters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAll}
          />
        </div>
      </header>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
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
            <SelectTrigger className="h-8 w-17.5">
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
