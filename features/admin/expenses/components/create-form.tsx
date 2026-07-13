"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ExpenseFormFields } from "./form-fields";
import { formSchema, InputFormSchema } from "../schemas";
import { createExpenseAction } from "../actions";

interface Props {
  className?: string;
  onSuccess?: () => void;
}

export function ExpenseCreateForm({ className, onSuccess }: Props) {
  const form = useForm<InputFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: undefined as unknown as InputFormSchema["category"],
      amount: 0,
      note: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-expense"],
    mutationFn: async (data: InputFormSchema) => {
      const response = await createExpenseAction(data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    toast.promise(mutateAsync(data), {
      loading: "Menyimpan pengeluaran...",
      success: () => {
        form.reset();
        onSuccess?.();
        return "Pengeluaran berhasil dicatat";
      },
      error: (err) =>
        err instanceof Error ? err.message : "Terjadi kesalahan.",
    });
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
            "Simpan Pengeluaran"
          )}
        </Button>
      </div>
    </form>
  );
}
