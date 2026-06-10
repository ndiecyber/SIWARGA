"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { CreateUserSchema, createUserSchema } from "../schema";
import FileUploadField from "./file-upload-field";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createUserAction } from "../action";

type CreateUserInput = z.input<typeof createUserSchema>;
type CreateUserValues = z.output<typeof createUserSchema>;

export function CreateUserDialog() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateUserInput, unknown, CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      role: "USER",
      kkFile: undefined,
      ktpFile: undefined,
    },
    mode: "onChange",
  });

  const { mutateAsync: handleCreateUser } = useMutation({
    mutationKey: ["create-user"],

    mutationFn: async (values: CreateUserSchema) => {
      const result = await createUserAction(values);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    onMutate: () => {
      toast.loading("Data warga sedang ditambahkan. Mohon tunggu sebentar 😄", {
        id: "create-user",
      });
    },

    onError: (error) => {
      toast.error(
        error.message || "Data warga gagal ditambahkan. Silahkan coba lagi 😫",
        {
          id: "create-user",
        },
      );
    },

    onSuccess: () => {
      toast.success("Data warga berhasil ditambahkan 🤗", {
        id: "create-user",
      });

      form.reset({
        name: "",
        phoneNumber: "",
        role: "USER",
        kkFile: undefined,
        ktpFile: undefined,
      });

      setOpen(false);
    },

    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (values: CreateUserSchema) => {
    await handleCreateUser(values);
    try {
    } catch {
      // Sudah ditangani oleh onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Tambah Warga
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah warga baru</DialogTitle>
          <DialogDescription>
            Isi data lengkap warga beserta dokumen KK dan KTP.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="py-2">
          <FieldGroup>
            {/* Nama */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-name">
                    Nama lengkap
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-user-name"
                    placeholder="Budi Santoso"
                    aria-invalid={fieldState.invalid}
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Nomor Telepon */}
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-phone">
                    Nomor telepon
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-user-phone"
                    placeholder="Format: 08xxxxxx"
                    type="tel"
                    aria-invalid={fieldState.invalid}
                    autoComplete="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Role */}
            {/* <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-role">Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="create-user-role"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Pilih role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="WARGA">Warga</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}

            {/* Dokumen */}
            <FieldSet className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <FieldLegend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dokumen
                </FieldLegend>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* KK */}
              <Controller
                name="kkFile"
                control={form.control}
                render={({ field, fieldState }) => {
                  const fileValue =
                    field.value instanceof File ? field.value : undefined;

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="create-user-kk-file">
                        Kartu Keluarga (KK)
                      </FieldLabel>

                      <FileUploadField
                        id="create-user-kk-file"
                        label="Unggah file KK"
                        description="JPG, PNG, atau PDF · maks. 5 MB"
                        accept=".jpg,.jpeg,.png,.pdf"
                        value={fileValue}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* KTP */}
              <Controller
                name="ktpFile"
                control={form.control}
                render={({ field, fieldState }) => {
                  const fileValue =
                    field.value instanceof File ? field.value : undefined;

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="create-user-ktp-file">
                        KTP
                      </FieldLabel>

                      <FileUploadField
                        id="create-user-ktp-file"
                        label="Unggah file KTP"
                        description="JPG, PNG, atau PDF · maks. 5 MB"
                        accept=".jpg,.jpeg,.png,.pdf"
                        value={fileValue}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldSet>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
