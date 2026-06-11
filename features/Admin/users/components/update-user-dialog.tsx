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
import { Loader2, Pencil, UserPlus } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  CreateUserSchema,
  createUserSchema,
  UpdateUserSchema,
  updateUserSchema,
} from "../schema";
import FileUploadField from "./file-upload-field";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUserAction, updateUserAction } from "../action";

type UpdateUserInput = z.input<typeof updateUserSchema>;
type UpdateUserValues = z.output<typeof updateUserSchema>;

type UpdateUserDialog = {
  id: string;
};

export function UpdateUserDialog(props: UpdateUserDialog) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: dataUser } = useQuery({
    queryKey: ["update-user", props.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${props.id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: open && !!props.id,
    staleTime: 1000 * 60,
  });

  const form = useForm<UpdateUserInput, unknown, UpdateUserValues>({
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

  React.useEffect(() => {
    if (!dataUser) return;

    form.reset({
      name: dataUser.name ?? "",
      phoneNumber: dataUser.phoneNumber ?? "",
      role: dataUser.role ?? "USER",
      kkFile: undefined,
      ktpFile: undefined,
    });
  }, [dataUser, form]);

  const { mutateAsync: handleUpdateUser } = useMutation({
    mutationKey: ["update-user"],

    mutationFn: async (values: UpdateUserSchema) => {
      setIsSubmitting(true);
      const result = await updateUserAction(values, props.id);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    onMutate: () => {
      toast.loading("Data warga sedang dirubah. Mohon tunggu sebentar 😄", {
        id: "update-user",
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Data warga gagal dirubah. Silahkan coba lagi 😫",
        {
          id: "update-user",
        },
      );
    },

    onSuccess: () => {
      toast.success("Data warga berhasil dirubah 🤗", {
        id: "update-user",
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

  const onSubmit = async (values: UpdateUserSchema) => {
    try {
      await handleUpdateUser(values);
    } catch {
      // Sudah ditangani oleh onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Pencil className="h-4 w-4" />
          <span>Ubah</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ubah data warga</DialogTitle>
          <DialogDescription>
            Perbarui data warga jika ada informasi yang salah atau sudah
            berubah.
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
                  <FieldLabel htmlFor="update-user-name">
                    Nama lengkap
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-user-name"
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
                  <FieldLabel htmlFor="update-user-phone">
                    Nomor telepon
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-user-phone"
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
                  <FieldLabel htmlFor="update-user-role">Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="update-user-role"
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
                      <FieldLabel htmlFor="update-user-kk-file">
                        Kartu Keluarga (KK)
                      </FieldLabel>

                      <FileUploadField
                        id="update-user-kk-file"
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
                      <FieldLabel htmlFor="update-user-ktp-file">
                        KTP
                      </FieldLabel>

                      <FileUploadField
                        id="update-user-ktp-file"
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
