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
import { type LucideIcon } from "lucide-react";

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
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
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
  trigger,
  title,
  description,
  children,
}: FieldDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button>Open</Button>}
      </DialogTrigger>

      <DialogContent className="h-screen max-w-screen md:min-w-[calc(100%-52rem)] md:h-fit ">
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
