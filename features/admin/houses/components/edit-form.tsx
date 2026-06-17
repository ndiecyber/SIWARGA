"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { ChevronsUpDownIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { HouseStatus } from "@/generated/prisma/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { HouseWithOwner } from "../types";
import { formSchema, InputFormSchema } from "../schemas";
import { getOwnersLookupAction, updateHouseAction } from "../actions";

interface HouseEditFormProps {
  house: HouseWithOwner;
  onSuccess: () => void;
}

export function HouseEditForm({ house, onSuccess }: HouseEditFormProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: house.status as HouseStatus,
      block: house.block,
      houseNumber: house.houseNumber,
      ownerId: house.ownerId || "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Query configuration with initialData so current owner displays immediately
  const { data: owners = [], isLoading: isLoadingOwners } = useQuery({
    queryKey: ["users-search", debouncedSearch],
    queryFn: async () => {
      const response = await getOwnersLookupAction(debouncedSearch);

      if (!response.success) {
        throw new Error(response.globalError || response.message);
      }

      return response.data.map((user) => ({
        value: user.id,
        label: user.name,
      }));
    },

    // Populate with the existing owner data initially if search is empty
    initialData:
      !debouncedSearch && house.owner
        ? [{ value: house.owner.id, label: house.owner.name }]
        : undefined,
    enabled: true,
  });

  // Mutation configuration passing the house ID to the server action
  const { mutateAsync } = useMutation({
    mutationKey: ["update-house", house.id],
    mutationFn: async (data: InputFormSchema) => {
      const response = await updateHouseAction(house.id, data);

      if (!response.success) {
        throw new Error(response.globalError || response.message);
      }

      return response;
    },
  });

  const handleSubmit = form.handleSubmit(async (data: InputFormSchema) => {
    const mutationPromise = mutateAsync(data);

    toast.promise(mutationPromise, {
      loading: "Data rumah sedang diperbarui. Mohon tunggu sebentar...",
      success: (response) => {
        return response.message || "Data rumah berhasil diperbarui";
      },
      error: (error) =>
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi.",
    });

    try {
      await mutationPromise;
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl gap-2 mx-auto rounded-md"
    >
      <FieldGroup className="grid gap-4 mb-6 md:grid-cols-6">
        <div className="grid gap-1 col-span-full">
          <FieldLabel>House Number *</FieldLabel>

          <div className="flex gap-2">
            <Controller
              name="block"
              control={form.control}
              render={({ field, fieldState }) => {
                const options = [
                  { value: "a", label: "A" },
                  { value: "b", label: "B" },
                  { value: "c", label: "C" },
                  { value: "d", label: "D" },
                ];
                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="gap-2 md:col-span-2"
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24 shrink-0">
                        <SelectValue placeholder="Pilih Blok" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="houseNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-2 col-span-full"
                >
                  <Input
                    {...field}
                    id="house-number"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan nomor rumah"
                    autoComplete="off"
                    className="flex"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-2 md:col-span-2"
              >
                <FieldLabel htmlFor="status">Status Hunian *</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status hunian rumah" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(HouseStatus).map((statusValue) => (
                      <SelectItem key={statusValue} value={statusValue}>
                        {statusValue === HouseStatus.OCCUPIED
                          ? "Ditempati"
                          : "Kosong"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <Controller
          name="ownerId"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-4 gap-2"
              >
                <FieldLabel htmlFor="ownerId">Pemilik *</FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between active:scale-100",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? owners.find((option) => option.value === field.value)
                            ?.label
                        : "Pilih Pemilik Rumah"}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 min-w-(--radix-popper-anchor-width) w-full"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="tap to search..."
                        className="h-10"
                        autoComplete="off"
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandList>
                        {isLoadingOwners && (
                          <div className="flex items-center justify-center gap-2 p-4 text-sm text-center text-muted-foreground">
                            <Loader2Icon className="animate-spin size-4" />{" "}
                            Loading users...
                          </div>
                        )}
                        {!isLoadingOwners && owners.length === 0 && (
                          <CommandEmpty>No items found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {owners.map(({ label, value }) => (
                            <CommandItem
                              value={label}
                              key={value}
                              onSelect={() => {
                                form.setValue("ownerId", value, {
                                  shouldValidate: true,
                                });
                              }}
                              className="flex justify-between w-full cursor-pointer"
                            >
                              {label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <div className="flex items-center justify-end w-full gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => form.reset()}
        >
          Reset Changes
        </Button>
        <Button disabled={isSubmitting}>
          {isSubmitting ? (
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
