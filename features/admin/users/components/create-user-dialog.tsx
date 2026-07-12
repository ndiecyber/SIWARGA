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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type CreateUserInput = z.input<typeof createUserSchema>;
type CreateUserValues = z.output<typeof createUserSchema>;

export function CreateUserDialog() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateUserInput, unknown, CreateUserValues>({
    resolver: zodResolver(createUserSchema as any),
    defaultValues: {
      name: "",
      phoneNumber: "",
      // familyCount: undefined,
      identificationNumber: "",
      role: "user",
      kkFile: undefined,
      ktpFile: undefined,
    },
    mode: "onChange",
  });

  const { mutateAsync: handleCreateUser } = useMutation({
    mutationKey: ["create-user"],

    mutationFn: async (values: CreateUserSchema) => {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("identificationNumber", values.identificationNumber);
      formData.append("role", values.role);

      if (values.kkFile) {
        formData.append("kkFile", values.kkFile);
      }

      if (values.ktpFile) {
        formData.append("ktpFile", values.ktpFile);
      }

      const result = await createUserAction(formData);

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
        role: "user",
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
    try {
      await handleCreateUser(values);
    } catch {
      // Sudah ditangani oleh onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Tambah Warga
        </Button>
      </DialogTrigger>

      <DialogContent className="h-screen max-w-screen md:min-w-[calc(100%-32rem)] md:h-fit gap-0">
        <DialogHeader className="sticky pb-4 -mx-6 space-y-4 border-b">
          <main className="px-6">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-primary ">
              Tambah warga baru
            </DialogTitle>
            <DialogDescription>
              Isi data lengkap warga beserta dokumen KK dan KTP.
            </DialogDescription>
          </main>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(100vh-12rem)] -mr-6 pr-6">
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

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                          // sideOffset={4}
                        >
                          <SelectItem value="admin">Pengurus</SelectItem>
                          <SelectItem value="user">Warga</SelectItem>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
