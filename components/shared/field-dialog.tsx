"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FieldDialogContextValue = {
  close: () => void;
};

const FieldDialogContext = React.createContext<FieldDialogContextValue | null>(
  null,
);

export function useFieldDialog() {
  const context = React.useContext(FieldDialogContext);

  if (!context) {
    throw new Error("useFieldDialog must be used inside FieldDialog");
  }

  return context;
}

type FieldDialogProps = {
  label: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
};

function FieldDialogWrapper({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({
      close: () => onOpenChange(false),
    }),
    [onOpenChange],
  );

  return (
    <FieldDialogContext.Provider value={value}>
      {children}
    </FieldDialogContext.Provider>
  );
}

export function FieldDialog({
  label,
  title,
  description,
  children,
  buttonProps,
}: FieldDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{label}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <FieldDialogWrapper open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {children}
        </FieldDialogWrapper>
      </DialogContent>
    </Dialog>
  );
}
