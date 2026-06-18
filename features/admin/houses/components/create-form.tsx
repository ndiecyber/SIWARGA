"use client";

import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { HouseStatus } from "@/generated/prisma/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldDialog } from "@/components/shared/field-dialog";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { formSchema, InputFormSchema } from "../schemas";
import { createHouseAction, getOwnersLookupAction } from "../actions";
import { HouseFormFields } from "./form-fields";

export function HouseCreateForm() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { close } = useFieldDialog();

  const form = useForm<InputFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: HouseStatus.OCCUPIED,
      block: "",
      houseNumber: "",
      ownerId: "",
      residents: [],
    },
  });

  const { data: owners = [], isLoading: isLoadingOwners } = useQuery({
    queryKey: ["users-search", debouncedSearch],
    queryFn: async () => {
      const response = await getOwnersLookupAction(debouncedSearch);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response.data.map((user) => ({
        value: user.id,
        label: user.name,
        isResident: user.isResident,
      }));
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-house"],
    mutationFn: async (data: InputFormSchema) => {
      const response = await createHouseAction(data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const isVacant = data.status === HouseStatus.VACANT;

    // Strip internal tracking field before sending
    const sanitizedResidents = (data.residents ?? []).map(
      ({ isOwnerToggle, ...rest }) => rest,
    );

    const submitData: InputFormSchema = {
      ...data,
      residents: isVacant ? [] : sanitizedResidents,
    };

    toast.promise(mutateAsync(submitData), {
      loading: "Data rumah sedang ditambahkan...",
      success: () => {
        form.reset();
        close();
        return "Data rumah berhasil ditambahkan";
      },
      error: (err) =>
        err instanceof Error ? err.message : "Terjadi kesalahan.",
    });
  });

  return (
    <form onSubmit={onSubmit} className="w-full mx-auto space-y-6">
      <HouseFormFields
        control={form.control}
        setValue={form.setValue}
        ownerSearch={search}
        onOwnerSearchChange={setSearch}
        owners={owners}
        isLoadingOwners={isLoadingOwners}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 animate-spin size-4" />
              Menyimpan...
            </>
          ) : (
            "Simpan Properti"
          )}
        </Button>
      </div>
    </form>
  );
}
