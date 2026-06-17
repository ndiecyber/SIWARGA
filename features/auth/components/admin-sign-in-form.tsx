"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DialogFooter } from "@/components/ui/dialog";
import { ButtonGroup } from "@/components/ui/button-group";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { adminSignInSchema, AdminSignInValues } from "../schemas";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess?: () => void;
}

function AdminSignInForm({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: standardSchemaResolver(adminSignInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationKey: ["sign-in-admin"],
    mutationFn: async (values: AdminSignInValues) => {
      const formInput = adminSignInSchema.safeParse(values);

      if (!formInput.success) {
        throw new Error(formInput.error.message);
      }

      const { data, error } = await authClient.signIn.email({
        email: formInput.data.email,
        password: formInput.data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin");

      return data;
    },
  });

  async function onSubmit(data: AdminSignInValues) {
    const mutationPromise = mutateAsync(data);

    toast.promise(mutationPromise, {
      loading: "Sedang masuk sebagai pengurus...",
      success: () => {
        if (onSuccess) {
          onSuccess();
        }

        return "Login pengurus berhasil";
      },
      error: (error) =>
        error instanceof Error ? error.message : "Unknown error",
    });

    try {
      await mutationPromise;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-admin-email">Email</FieldLabel>

              <Input
                {...field}
                id="login-admin-email"
                placeholder="Masukkan email"
                type="text"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-admin-password">Password</FieldLabel>

              <ButtonGroup>
                <Input
                  {...field}
                  id="login-admin-password"
                  placeholder="Masukkan password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye
                    size={16}
                    className={cn(showPassword ? "hidden" : "block")}
                  />
                  <EyeClosed
                    size={16}
                    className={cn(showPassword ? "block" : "hidden")}
                  />
                </Button>
              </ButtonGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Batal
        </Button>

        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default AdminSignInForm;
