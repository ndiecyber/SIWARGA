"use client";

import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { HouseStatus } from "@/generated/prisma/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { HouseWithOwner, HouseWithResidents } from "../types";
import { HouseFormFields } from "./form-fields";
import { formSchema, InputFormSchema } from "../schemas";
import { getOwnersLookupAction, updateHouseAction } from "../actions";

interface HouseEditFormProps {
  house: HouseWithOwner & HouseWithResidents;
  onSuccess: () => void;
}

export function HouseEditForm({ house, onSuccess }: HouseEditFormProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const form = useForm<InputFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: house.status as HouseStatus,
      block: house.block,
      houseNumber: house.houseNumber,
      ownerId: house.ownerId ?? "",
      residents: (house.residents ?? []).map((resident) => ({
        userId: resident.userId ?? undefined,
        residentRole: resident.residentRole,
        relationship: resident.relationship,
        isOwnerToggle: false,
      })),
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-house", house.id],
    mutationFn: async (data: InputFormSchema) => {
      const response = await updateHouseAction(house.id, data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
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
    // Seed with current owner so the combobox renders immediately without a fetch
    initialData:
      !debouncedSearch && house.owner
        ? [
            {
              value: house.owner.id,
              label: house.owner.name,
              isResident: false,
            },
          ]
        : undefined,
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

    const mutationPromise = mutateAsync(submitData);

    toast.promise(mutationPromise, {
      loading: "Data rumah sedang diperbarui. Mohon tunggu sebentar...",
      success: (response) =>
        response.message ?? "Data rumah berhasil diperbarui",
      error: (err) =>
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.",
    });

    try {
      await mutationPromise;
      onSuccess();
    } catch {
      // error already surfaced via toast
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-3xl gap-2 pt-6 mx-auto rounded-md"
    >
      <HouseFormFields
        control={form.control}
        setValue={form.setValue}
        ownerSearch={search}
        onOwnerSearchChange={setSearch}
        owners={owners}
        isLoadingOwners={isLoadingOwners}
      />

      <div className="flex items-center justify-end w-full gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => form.reset()}
        >
          Reset Changes
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center">
              <Loader2Icon className="mr-2 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
