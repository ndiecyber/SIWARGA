"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  CheckCircleIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useDebounce } from "@uidotdev/usehooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldDialog } from "@/components/shared/field-dialog";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HouseStatus,
  RelationshipType,
  ResidentRole,
} from "@/generated/prisma/enums";
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

import { formSchema, InputFormSchema } from "../schemas";
import { createHouseAction, getOwnersLookupAction } from "../actions";

const BLOCK_OPTIONS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
];

const RESIDENT_ROLE_OPTIONS = [
  { value: ResidentRole.MAIN_RESIDENT, label: "Penghuni Utama" },
  { value: ResidentRole.FAMILY_MEMBER, label: "Anggota Keluarga" },
];

const RELATIONSHIP_OPTIONS = [
  { value: RelationshipType.SELF, label: "Diri Sendiri" },
  { value: RelationshipType.SPOUSE, label: "Istri/Suami" },
  { value: RelationshipType.CHILD, label: "Anak" },
  { value: RelationshipType.PARENT, label: "Orang Tua" },
  { value: RelationshipType.SIBLING, label: "Saudara" },
  { value: RelationshipType.OTHER, label: "Lainnya" },
];

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

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "residents",
  });

  const watchedStatus = useWatch({ control: form.control, name: "status" });
  const selectedOwnerId = useWatch({ control: form.control, name: "ownerId" });
  const watchedResidents =
    useWatch({ control: form.control, name: "residents" }) || [];

  const isVacant = watchedStatus === HouseStatus.VACANT;
  const ownerResidentIndex = watchedResidents.findIndex(
    (r) => r.isOwnerToggle === true,
  );
  const ownerAsResident = ownerResidentIndex !== -1;
  const hasMainResident = watchedResidents.some(
    (r) => r.residentRole === ResidentRole.MAIN_RESIDENT,
  );

  // Sync / Clean up residents if house becomes vacant
  useEffect(() => {
    if (isVacant && watchedResidents.length > 0) {
      replace([]);
    }
  }, [isVacant, replace, watchedResidents.length]);

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

  const selectedOwner = owners.find((o) => o.value === selectedOwnerId);
  const ownerAlreadyResident = selectedOwner?.isResident ?? false;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-house"],
    mutationFn: async (data: InputFormSchema) => {
      const response = await createHouseAction(data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
    },
  });

  const enforceMainResidentConstraint = (newMainIndex: number) => {
    watchedResidents.forEach((r, i) => {
      if (i !== newMainIndex && r.residentRole === ResidentRole.MAIN_RESIDENT) {
        update(i, { ...r, residentRole: ResidentRole.FAMILY_MEMBER });
      }
    });
  };

  const handleOwnerToggle = (pressed: boolean) => {
    if (pressed) {
      if (!selectedOwnerId)
        return toast.warning("Pilih pemilik terlebih dahulu.");

      append({
        userId: selectedOwnerId,
        residentRole: ResidentRole.MAIN_RESIDENT,
        relationship: RelationshipType.SELF,
        isOwnerToggle: true, // Clean internal tracking element
      });
      enforceMainResidentConstraint(fields.length);
    } else {
      if (ownerResidentIndex !== -1) remove(ownerResidentIndex);
    }
  };

  const handleRoleChange = (index: number, value: ResidentRole) => {
    update(index, { ...watchedResidents[index], residentRole: value });
    if (value === ResidentRole.MAIN_RESIDENT)
      enforceMainResidentConstraint(index);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    // Sanitize extra visual runtime tracking fields before network transit
    const sanitizedResidents = (data.residents || []).map(
      ({ isOwnerToggle, ...rest }) => rest,
    );

    const submitData = {
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
      {/* Detail Rumah Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <HomeIcon className="size-4 text-primary" />
          </div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Detail Rumah
          </h4>
        </div>
        <FieldGroup className="flex flex-col md:grid md:gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <FieldLabel>
              Nomor Rumah <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="flex flex-col gap-2 md:grid grid-cols-2">
              <Controller
                name="block"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24 shrink-0">
                        <SelectValue placeholder="Blok" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {BLOCK_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="houseNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <Input
                      {...field}
                      placeholder="Contoh: 12"
                      autoComplete="off"
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
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status Hunian *</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="end">
                    <SelectItem value={HouseStatus.OCCUPIED}>
                      Ditempati
                    </SelectItem>
                    <SelectItem value={HouseStatus.VACANT}>Kosong</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </section>

      {/* Pemilik Properti Section */}
      <section className="space-y-4 p-4 bg-muted/40 rounded-xl border border-border">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <UserIcon className="size-4 text-primary" />
            </div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pemilik Properti
            </h4>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Toggle
                  type="button"
                  variant="outline"
                  pressed={ownerAsResident}
                  disabled={
                    isVacant || !selectedOwnerId || ownerAlreadyResident
                  }
                  onPressedChange={handleOwnerToggle}
                  className="group/toggle aria-pressed:bg-primary/10 aria-pressed:border-primary aria-pressed:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={16} /> Penghuni
                  </div>
                </Toggle>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {ownerAlreadyResident
                ? "Sudah terdaftar di rumah lain"
                : isVacant
                  ? "Rumah kosong"
                  : "Jadikan penghuni utama"}
            </TooltipContent>
          </Tooltip>
        </header>

        <Controller
          name="ownerId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel>Cari Pemilik *</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {selectedOwner?.label ?? "Pilih Pemilik Rumah"}
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-full min-w-(--radix-popover-trigger-width)"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Ketik nama pemilik..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      {isLoadingOwners && (
                        <div className="p-4 text-center text-sm">
                          <Loader2Icon className="animate-spin inline mr-2 size-4" />
                          Loading...
                        </div>
                      )}
                      {!isLoadingOwners && owners.length === 0 && (
                        <CommandEmpty>
                          Tidak ada pengguna ditemukan.
                        </CommandEmpty>
                      )}
                      <CommandGroup>
                        {owners.map(({ label, value }) => (
                          <CommandItem
                            key={value}
                            value={value}
                            onSelect={() => {
                              if (ownerAsResident && ownerResidentIndex !== -1)
                                remove(ownerResidentIndex);
                              form.setValue("ownerId", value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            {label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>

      {/* Daftar Penghuni Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <UsersIcon className="size-4 text-primary" />
            </div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Daftar Penghuni
            </h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            // className="text-primary font-semibold gap-1"
            disabled={isVacant}
            onClick={() =>
              append({
                residentRole: hasMainResident
                  ? ResidentRole.FAMILY_MEMBER
                  : ResidentRole.MAIN_RESIDENT,
                relationship: RelationshipType.SELF,
              })
            }
          >
            <PlusIcon className="size-4" /> Tambah Penghuni
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-xl">
            Belum ada penghuni.
          </p>
        )}

        <ScrollArea className={cn("h-32", fields.length === 0 && "hidden")}>
          <div className="space-y-3">
            {fields.map((fieldItem, index) => {
              const isThisMainResident =
                watchedResidents[index]?.residentRole ===
                ResidentRole.MAIN_RESIDENT;
              const roleSelectDisabled =
                isVacant || (hasMainResident && !isThisMainResident);

              return (
                <div
                  key={fieldItem.id}
                  className="grid md:grid-cols-3 gap-3 p-4 bg-muted/20 border rounded-xl items-start"
                >
                  <Controller
                    name={`residents.${index}.residentRole`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Peran</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(val) =>
                            handleRoleChange(index, val as ResidentRole)
                          }
                          disabled={roleSelectDisabled}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" align="start">
                            {RESIDENT_ROLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="flex gap-2 items-end md:col-span-2">
                    <Controller
                      name={`residents.${index}.relationship`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="flex-1"
                        >
                          <FieldLabel>Hubungan</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                              {RELATIONSHIP_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </section>

      {/* Footer Actions */}
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
