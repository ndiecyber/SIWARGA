"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ActionOption } from "./column-helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BatchActionBarProps<TData> {
  selectedRows: TData[];
  batchActions: ActionOption<TData>[];
  onClearSelection: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BatchActionBar<TData>({
  selectedRows,
  batchActions,
  onClearSelection,
}: BatchActionBarProps<TData>) {
  const count = selectedRows.length;
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/50 px-3 py-2">
      {/* Left: selection count + clear */}
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <button
          type="button"
          onClick={onClearSelection}
          className="flex items-center justify-center rounded size-5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Clear selection"
        >
          <X className="size-3.5" />
        </button>
        <span>
          {count} {count === 1 ? "item" : "item"} dipilih
        </span>
      </div>

      {/* Right: batch action buttons */}
      <div className="flex items-center gap-1">
        {batchActions.map((action, i) => (
          <Button
            key={i}
            size="sm"
            variant={action.destructive ? "destructive" : "outline"}
            className="h-8 gap-1.5"
            onClick={() => action.onClick(selectedRows)}
          >
            {action.icon && (
              <span className="size-4 shrink-0">{action.icon}</span>
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
