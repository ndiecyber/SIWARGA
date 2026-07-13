"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ExpenseFormFields } from "./form-fields";
import { formSchema, InputFormSchema } from "../schemas";
import { updateExpenseAction } from "../actions";
import type { ExpenseWithCreator } from "../types";

interface ExpenseEditFormProps {
  expense: ExpenseWithCreator;
  className?: string;
  onSuccess: () => void;
}

export function ExpenseEditForm({
  expense,
  className,
  onSuccess,
}: ExpenseEditFormProps) {
  const form = useForm<InputFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      date: format(new Date(expense.date), "yyyy-MM-dd"),
      description: expense.description,
      category: expense.category as InputFormSchema["category"],
      amount: Number(expense.amount),
      note: expense.note ?? "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-expense", expense.id],
    mutationFn: async (data: InputFormSchema) => {
      const response = await updateExpenseAction(expense.id, data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const mutationPromise = mutateAsync(data);
    toast.promise(mutationPromise, {
      loading: "Memperbarui pengeluaran...",
      success: () => {
        onSuccess();
        return "Pengeluaran berhasil diperbarui";
      },
      error: (err) =>
        err instanceof Error ? err.message : "Terjadi kesalahan.",
    });

    try {
      await mutationPromise;
    } catch {
      // error already surfaced via toast
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("w-full mx-auto space-y-6", className)}>
      <ExpenseFormFields control={form.control} setValue={form.setValue} />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" disabled={isPending} onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 animate-spin size-4" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
}
