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
  createUserSchema,
  UpdateUserSchema,
  updateUserSchema,
} from "../schema";
import FileUploadField from "./file-upload-field";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUserAction } from "../action";
import { User } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UpdateUserInput = z.input<typeof updateUserSchema>;
type UpdateUserValues = z.output<typeof updateUserSchema>;

type UpdateUserDialogProps = {
  id: string;
};

export function UpdateUserDialog(props: UpdateUserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: dataUser } = useQuery<User>({
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
      // familyCount: undefined,
      identificationNumber: "",
      role: "USER",
      kkFile: undefined,
      ktpFile: undefined,
    },
    mode: "onChange",
  });

  console.log({ dataUser });

  React.useEffect(() => {
    if (!dataUser) return;

    form.reset({
      name: dataUser.name ?? "",
      phoneNumber: dataUser.phoneNumber ?? "",
      role: dataUser.role ?? "USER",
      // familyCount: dataUser.familyCount ? dataUser.familyCount : undefined,
      identificationNumber: dataUser.identificationNumber
        ? dataUser.identificationNumber
        : "Data NIK Belum Ada",
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
        <Button variant="ghost" className="justify-start w-full gap-2">
          <Pencil className="w-4 h-4" />
          <span>Ubah</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Ubah data warga</DialogTitle>
          <DialogDescription>
            Perbarui data warga jika ada informasi yang salah atau sudah
            berubah.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-2">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      inputMode="tel"
                      aria-invalid={fieldState.invalid}
                      autoComplete="tel"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* NIK */}
              <Controller
                name="identificationNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-user-nik">
                      Nomor Induk Penduduk
                    </FieldLabel>

                    <Input
                      id="create-user-nik"
                      value={field.value ?? ""}
                      placeholder="Masukkan 16 digit NIK"
                      type="text"
                      inputMode="numeric"
                      maxLength={16}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(event) => {
                        const onlyNumber = event.target.value.replace(
                          /\D/g,
                          "",
                        );
                        field.onChange(onlyNumber.slice(0, 16));
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Jumlah Anggota Keluarga */}
              {/* <Controller
                name="familyCount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-user-family-count">
                      Jumlah anggota keluarga
                    </FieldLabel>

                    <Input
                      id="create-user-family-count"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              /> */}

              {/* Role */}
              <Controller
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

                      <SelectContent
                        position="popper"
                        side="bottom"
                        align="start"
                      >
                        <SelectItem value="ADMIN">Pengurus</SelectItem>
                        <SelectItem value="USER">Warga</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Dokumen */}
            <FieldSet className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <FieldLegend className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                  Dokumen
                </FieldLegend>
                <div className="flex-1 h-px bg-border" />
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
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
