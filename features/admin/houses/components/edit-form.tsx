"use client";

import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { HouseStatus } from "@/generated/prisma/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { HouseFormFields } from "./form-fields";
import { formSchema, InputFormSchema } from "../schemas";
import { HouseWithOwner, HouseWithResidentsWithUser } from "../types";
import { getOwnersLookupAction, getResidentsLookupAction, updateHouseAction } from "../actions";

interface HouseEditFormProps {
  house: HouseWithOwner & HouseWithResidentsWithUser;
  className?: string;
  onSuccess: () => void;
}

export function HouseEditForm({
  house,
  className,
  onSuccess,
}: HouseEditFormProps) {
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
      residents: (house.residents ?? [])
        .filter((r) => r.userId !== null)
        .map((resident) => ({
          userId: resident.userId!,
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

  const [residentSearch, setResidentSearch] = useState("");
  const debouncedResidentSearch = useDebounce(residentSearch, 500);

  const existingResidentsNames = Object.fromEntries(
    house.residents
      .filter((r): r is typeof r & { user: NonNullable<typeof r.user> } => r.user !== null)
      .map((r) => [r.user.id, r.user.name]),
  );

  const { data: residentOptions = [], isLoading: isLoadingResidents } = useQuery({
    queryKey: ["users-resident-search", debouncedResidentSearch],
    queryFn: async () => {
      const response = await getResidentsLookupAction(debouncedResidentSearch, house.id);
      if (!response.success) throw new Error(response.globalError || response.message);
      return response.data.map((user) => ({ value: user.id, label: user.name }));
    },
    initialData: !debouncedResidentSearch
      ? Object.entries(existingResidentsNames).map(([value, label]) => ({ value, label }))
      : undefined,
  });

  const residentUserNameMap = {
    ...existingResidentsNames,
    ...Object.fromEntries(residentOptions.map(opt => [opt.value, opt.label])),
  };

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
      className={cn("w-full max-w-3xl gap-2 mx-auto rounded-md", className)}
    >
      <HouseFormFields
        control={form.control}
        setValue={form.setValue}
        ownerSearch={search}
        onOwnerSearchChange={setSearch}
        owners={owners}
        isLoadingOwners={isLoadingOwners}
        residentSearch={residentSearch}
        onResidentSearchChange={setResidentSearch}
        residentOptions={residentOptions}
        isLoadingResidents={isLoadingResidents}
        residentUserNameMap={residentUserNameMap}
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
