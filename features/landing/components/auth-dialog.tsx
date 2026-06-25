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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogIn, ShieldCheck, UserRound } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { authLogger } from "@/lib/logger";

// Ganti import ini sesuai action login kamu
// import { loginUserAction, loginAdminAction } from "../action";

const userLoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 karakter")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .regex(/^08[0-9]{8,13}$/, "Nomor telepon harus diawali 08"),
});

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type UserLoginValues = z.infer<typeof userLoginSchema>;
type AdminLoginValues = z.infer<typeof adminLoginSchema>;

type AuthDialogProps = {
  children?: React.ReactNode;
};

export function AuthDialog({ children }: AuthDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"user" | "admin">("user");

  const userForm = useForm<UserLoginValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const adminForm = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: handleUserLogin, isPending: isUserSubmitting } =
    useMutation({
      mutationKey: ["login-user"],

      mutationFn: async (values: UserLoginValues) => {
        /**
         * Ganti bagian ini dengan action login user kamu.
         *
         * Contoh:
         * const result = await loginUserAction(values);
         *
         * if (!result.success) {
         *   throw new Error(result.message);
         * }
         *
         * return result;
         */

        authLogger.info({ phoneNumber: values.phoneNumber }, 'Login user dari landing page');

        return {
          success: true,
          message: "Login warga berhasil",
        };
      },

      onMutate: () => {
        toast.loading("Sedang masuk sebagai warga...", {
          id: "login-user",
        });
      },

      onError: (error) => {
        toast.error(error.message || "Login warga gagal. Silakan coba lagi.", {
          id: "login-user",
        });
      },

      onSuccess: () => {
        toast.success("Login warga berhasil", {
          id: "login-user",
        });

        userForm.reset();
        setOpen(false);
      },
    });

  const { mutateAsync: handleAdminLogin, isPending: isAdminSubmitting } =
    useMutation({
      mutationKey: ["login-admin"],

      mutationFn: async (values: AdminLoginValues) => {
        /**
         * Ganti bagian ini dengan action login admin kamu.
         *
         * Contoh:
         * const result = await loginAdminAction(values);
         *
         * if (!result.success) {
         *   throw new Error(result.message);
         * }
         *
         * return result;
         */

        authLogger.info({ username: values.username }, 'Login admin dari landing page');

        return {
          success: true,
          message: "Login pengurus berhasil",
        };
      },

      onMutate: () => {
        toast.loading("Sedang masuk sebagai pengurus...", {
          id: "login-admin",
        });
      },

      onError: (error) => {
        toast.error(
          error.message || "Login pengurus gagal. Silakan coba lagi.",
          {
            id: "login-admin",
          },
        );
      },

      onSuccess: () => {
        toast.success("Login pengurus berhasil", {
          id: "login-admin",
        });

        adminForm.reset();
        setOpen(false);
      },
    });

  const isSubmitting = isUserSubmitting || isAdminSubmitting;

  const onSubmitUser = async (values: UserLoginValues) => {
    try {
      await handleUserLogin(values);
    } catch {
      // Error sudah ditangani oleh onError
    }
  };

  const onSubmitAdmin = async (values: AdminLoginValues) => {
    try {
      await handleAdminLogin(values);
    } catch {
      // Error sudah ditangani oleh onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            Masuk
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Masuk ke SiWarga</DialogTitle>
          <DialogDescription>
            Pilih jenis akun yang sesuai untuk masuk ke sistem.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "user" | "admin")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="gap-2">
              <UserRound className="h-4 w-4" />
              Warga
            </TabsTrigger>

            <TabsTrigger value="admin" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Pengurus
            </TabsTrigger>
          </TabsList>

          {/* Login Warga */}
          <TabsContent value="user" className="mt-5">
            <form
              onSubmit={userForm.handleSubmit(onSubmitUser)}
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="phoneNumber"
                  control={userForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-user-phone">
                        Nomor telepon
                      </FieldLabel>

                      <Input
                        {...field}
                        id="login-user-phone"
                        placeholder="08xxxxxxxxxx"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>

                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isUserSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isUserSubmitting ? "Memproses..." : "Masuk sebagai warga"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Login Admin */}
          <TabsContent value="admin" className="mt-5">
            <form
              onSubmit={adminForm.handleSubmit(onSubmitAdmin)}
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="username"
                  control={adminForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-admin-username">
                        Username
                      </FieldLabel>

                      <Input
                        {...field}
                        id="login-admin-username"
                        placeholder="Masukkan username"
                        type="text"
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={adminForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-admin-password">
                        Password
                      </FieldLabel>

                      <Input
                        {...field}
                        id="login-admin-password"
                        placeholder="Masukkan password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>

                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isAdminSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isAdminSubmitting
                    ? "Memproses..."
                    : "Masuk sebagai pengurus"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
