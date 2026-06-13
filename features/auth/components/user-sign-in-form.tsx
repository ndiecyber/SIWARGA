"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { userLoginSchema, UserLoginValues } from "../schemas";
import { DialogFooter } from "@/components/ui/dialog";

function UserSignInForm() {
  const form = useForm({
    resolver: standardSchemaResolver(userLoginSchema),
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (values: UserLoginValues) => {
      const formInput = userLoginSchema.safeParse(values);

      if (!formInput.success) {
        throw new Error(formInput.error.message);
      }

      const { data, error } = await authClient.signIn.username({
        username: formInput.data.username,
        password: formInput.data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  async function onSubmit(data: UserLoginValues) {
    const mutationPromise = mutateAsync(data);

    toast.promise(mutationPromise, {
      loading: "Sedang masuk sebagai warga...",
      success: () => "Login warga berhasil",
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
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-user-phone">Nomor telepon</FieldLabel>

              <Input
                {...field}
                id="login-user-phone"
                placeholder="08xxxxxxxxxx"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
              />

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
          {isSubmitting ? "Memproses..." : "Masuk sebagai warga"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default UserSignInForm;
