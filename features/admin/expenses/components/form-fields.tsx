"use client";

import { Controller } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import type { InputFormSchema } from "../schemas";

const CATEGORY_OPTIONS = [
  { value: "ATK & Perlengkapan", label: "ATK & Perlengkapan" },
  { value: "Listrik & Air", label: "Listrik & Air" },
  { value: "Perbaikan Fasilitas", label: "Perbaikan Fasilitas" },
  { value: "Kegiatan & Acara", label: "Kegiatan & Acara" },
  { value: "Sumbangan & Sosial", label: "Sumbangan & Sosial" },
  { value: "Transportasi", label: "Transportasi" },
  { value: "Lainnya", label: "Lainnya" },
];

interface ExpenseFormFieldsProps {
  control: Control<InputFormSchema>;
  setValue: UseFormSetValue<InputFormSchema>;
}

export function ExpenseFormFields({
  control,
  setValue,
}: ExpenseFormFieldsProps) {
  return (
    <div className="w-full space-y-6">
      <FieldGroup className="grid gap-4 md:grid-cols-2">
        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Tanggal *</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {field.value
                      ? format(new Date(field.value), "dd MMMM yyyy", { locale: id })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) setValue("date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
                    }}
                    locale={id}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Kategori *</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Deskripsi *</FieldLabel>
            <Textarea
              {...field}
              placeholder="Uraikan pengeluaran..."
              className="min-h-24"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Jumlah (Rp) *</FieldLabel>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={Number(field.value) || 0}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Note */}
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Catatan</FieldLabel>
              <Input {...field} placeholder="Opsional" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
