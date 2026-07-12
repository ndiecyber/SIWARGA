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
import { createHouseAction, getOwnersLookupAction, getResidentsLookupAction } from "../actions";

interface Props {
  className?: string;
}

export function HouseCreateForm({ className }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

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

  const [residentSearch, setResidentSearch] = useState("");
  const debouncedResidentSearch = useDebounce(residentSearch, 500);

  const { data: residentOptions = [], isLoading: isLoadingResidents } = useQuery({
    queryKey: ["users-resident-search", debouncedResidentSearch],
    queryFn: async () => {
      const response = await getResidentsLookupAction(debouncedResidentSearch);
      if (!response.success) throw new Error(response.globalError || response.message);
      return response.data.map((user) => ({ value: user.id, label: user.name }));
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

  const watchedResidents = form.watch("residents") ?? [];
  const residentUserNameMap = Object.fromEntries(
    residentOptions
      .filter(opt => watchedResidents.some(r => r.userId === opt.value))
      .map(opt => [opt.value, opt.label]),
  );

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
        return "Data rumah berhasil ditambahkan";
      },
      error: (err) =>
        err instanceof Error ? err.message : "Terjadi kesalahan.",
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("w-full mx-auto space-y-6", className)}
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
