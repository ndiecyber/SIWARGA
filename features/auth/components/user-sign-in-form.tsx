"use client";

import z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DialogFooter } from "@/components/ui/dialog";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { userSignInSchema, UserSignInValues } from "../schemas";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess?: () => void;
}

function UserSignInForm({ onSuccess }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: standardSchemaResolver(userSignInSchema),
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationKey: ["sign-in-user"],
    mutationFn: async (values: z.input<typeof userSignInSchema>) => {
      const parsed = userSignInSchema.parse(values);

      const { data, error } = await authClient.signIn.username({
        username: parsed.username,
        password: parsed.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push("/dashboard");

      return data;
    },
  });

  async function onSubmit(data: UserSignInValues) {
    console.log(data);

    const mutationPromise = mutateAsync(form.getValues());

    toast.promise(mutationPromise, {
      loading: "Sedang masuk sebagai warga...",
      success: () => {
        if (onSuccess) {
          onSuccess();
        }

        return "Login warga berhasil";
      },
      error: (error) => {
        console.log(error);

        if (error instanceof Error) {
          return error.message;
        } else {
          return "Unknown error";
        }
      },
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
              <FieldLabel htmlFor="sign-in-user-phone">
                Nomor telepon
              </FieldLabel>

              <Input
                {...field}
                id="sign-in-user-phone"
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
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default UserSignInForm;
