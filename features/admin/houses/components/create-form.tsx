"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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

// Sentinel index used to track which field array entry was injected by the
// "owner as resident" toggle so we can remove it cleanly on untoggle.
const OWNER_RESIDENT_MARKER = "__owner__";

function SectionHeader({
  icon: Icon,
  title,
  className,
}: {
  icon: React.ElementType;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="size-4 text-primary " />
      </div>
      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
    </div>
  );
}

export function HouseCreateForm() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Tracks whether the owner-as-resident toggle is pressed
  const [ownerAsResident, setOwnerAsResident] = useState(false);

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

  const {
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "residents",
  });

  // ── Derived state ────────────────────────────────────────────────────────────

  const watchedResidents = form.watch("residents");
  const watchedStatus = form.watch("status");
  const selectedOwnerId = form.watch("ownerId");

  const isVacant = watchedStatus === HouseStatus.VACANT;

  // Index of the resident currently set as MAIN_RESIDENT (-1 if none)
  const mainResidentIndex = watchedResidents.findIndex(
    (r) => r.residentRole === ResidentRole.MAIN_RESIDENT,
  );
  const hasMainResident = mainResidentIndex !== -1;

  // ── Query: owner lookup ──────────────────────────────────────────────────────
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
    enabled: true,
  });

  const selectedOwner = owners.find((o) => o.value === selectedOwnerId);
  const selectedOwnerLabel = selectedOwner?.label;
  // Owner is already a resident in another house
  const ownerAlreadyResident = selectedOwner?.isResident ?? false;

  // ── Mutation: create house ───────────────────────────────────────────────────
  const { mutateAsync } = useMutation({
    mutationKey: ["create-house"],
    mutationFn: async (data: InputFormSchema) => {
      const response = await createHouseAction(data);
      if (!response.success)
        throw new Error(response.globalError || response.message);
      return response;
    },
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * When a resident is set to MAIN_RESIDENT, force all others to FAMILY_MEMBER.
   * Called after append or after a role select change.
   */
  function enforceMainResidentConstraint(newMainIndex: number) {
    watchedResidents.forEach((r, i) => {
      if (i !== newMainIndex && r.residentRole === ResidentRole.MAIN_RESIDENT) {
        update(i, { ...r, residentRole: ResidentRole.FAMILY_MEMBER });
      }
    });
  }

  /** Index of the owner-injected resident entry, or -1. */
  function ownerResidentIndex(): number {
    // We store the owner's userId; match by userId === selectedOwnerId
    return watchedResidents.findIndex((r) => r.userId === selectedOwnerId);
  }

  // ── Toggle: owner as resident ────────────────────────────────────────────────
  function handleOwnerToggle(pressed: boolean) {
    if (pressed) {
      // Dynamically grab the absolute freshest value directly from the form store
      const currentOwnerId = form.getValues("ownerId");

      // Strictly check against both undefined/null AND empty strings
      if (!currentOwnerId || currentOwnerId.trim() === "") {
        toast.warning("Pilih pemilik terlebih dahulu.");
        return;
      }

      const newIndex = fields.length;

      append({
        userId: currentOwnerId, // Use the guaranteed valid UUID string here
        residentRole: ResidentRole.MAIN_RESIDENT,
        relationship: RelationshipType.SELF,
      });

      enforceMainResidentConstraint(newIndex);
      setOwnerAsResident(true);
    } else {
      const currentOwnerId = form.getValues("ownerId");
      const idx = watchedResidents.findIndex(
        (r) => r.userId === currentOwnerId,
      );
      if (idx !== -1) remove(idx);
      setOwnerAsResident(false);
    }
  }

  // ── Status change: VACANT handling ──────────────────────────────────────────
  function handleStatusChange(value: string) {
    form.setValue("status", value as HouseStatus, { shouldValidate: true });
    if (value === HouseStatus.VACANT) {
      // Keep the data in the field array but it will be excluded on submit.
      // Also turn off owner-as-resident toggle visually (data kept, disabled UI).
      // We do NOT remove entries — they're simply greyed out and excluded on submit.
    }
  }

  // ── Add resident ─────────────────────────────────────────────────────────────
  function handleAddResident() {
    // New residents default to FAMILY_MEMBER when a main resident already exists
    append({
      residentRole: hasMainResident
        ? ResidentRole.FAMILY_MEMBER
        : ResidentRole.MAIN_RESIDENT,
      relationship: RelationshipType.SELF,
    });
  }

  // ── Role change for a specific resident ─────────────────────────────────────
  function handleRoleChange(index: number, value: ResidentRole) {
    const current = watchedResidents[index];
    update(index, { ...current, residentRole: value });
    if (value === ResidentRole.MAIN_RESIDENT) {
      enforceMainResidentConstraint(index);
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = form.handleSubmit(
    async (data: InputFormSchema) => {
      // Exclude residents when house is VACANT
      const submitData: InputFormSchema =
        data.status === HouseStatus.VACANT ? { ...data, residents: [] } : data;

      const mutationPromise = mutateAsync(submitData);

      toast.promise(mutationPromise, {
        loading: "Data rumah sedang ditambahkan. Mohon tunggu sebentar...",
        success: (res) => res.message || "Data rumah berhasil ditambahkan",
        error: (err) =>
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan. Silakan coba lagi.",
      });

      try {
        await mutationPromise;
        form.reset();
        setOwnerAsResident(false);
        close();
      } catch (error) {
        console.error(error);
      }
    },
    (errors) => {
      console.log("Error on submit: ", errors);
    },
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto space-y-6">
      {/* ── Section 1: Detail Rumah ── */}
      <section className="space-y-4">
        <SectionHeader icon={HomeIcon} title="Detail Rumah" />

        <FieldGroup className="flex flex-col md:grid md:gap-4 md:grid-cols-3">
          {/* House Number, Block, Occupancy */}
          <div className="md:col-span-2 space-y-3">
            <FieldLabel>
              Nomor Rumah
              <span className="text-destructive">*</span>
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
                      type="text"
                      aria-invalid={fieldState.invalid}
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

          {/* Status */}
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status Hunian *</FieldLabel>
                <Select value={field.value} onValueChange={handleStatusChange}>
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

      {/* ── Section 2: Pemilik Properti ── */}
      <section className="space-y-4 p-4 bg-muted/40 rounded-xl border border-border">
        <header className="flex items-center justify-between">
          <SectionHeader
            icon={UserIcon}
            title="Pemilik Properti"
            className="mb-0"
          />

          {/* Owner-as-resident toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Wrapper span so Tooltip still works when the Toggle is disabled */}
              <span className="inline-flex">
                <Toggle
                  type="button"
                  variant="outline"
                  size="default"
                  pressed={ownerAsResident}
                  disabled={
                    isVacant || !selectedOwnerId || ownerAlreadyResident
                  }
                  onPressedChange={handleOwnerToggle}
                  className="group/toggle aria-pressed:bg-primary/10 aria-pressed:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="group-aria-pressed/toggle:text-primary flex items-center gap-2">
                    <CheckCircleIcon size={16} />
                    Penghuni
                  </div>
                </Toggle>
              </span>
            </TooltipTrigger>
            <TooltipContent className="w-fit">
              {ownerAlreadyResident
                ? "Pemilik ini sudah terdaftar sebagai penghuni di rumah lain"
                : isVacant
                  ? "Tidak dapat menambah penghuni pada rumah kosong"
                  : "Jadikan pemilik sebagai penghuni utama rumah ini"}
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
                    role="combobox"
                    className={cn(
                      "w-full justify-between active:scale-100",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {selectedOwnerLabel ?? "Pilih Pemilik Rumah"}
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 min-w-(--radix-popper-anchor-width) w-full"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Ketik nama pemilik..."
                      className="h-10"
                      autoComplete="off"
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      {isLoadingOwners && (
                        <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                          <Loader2Icon className="animate-spin size-4" />{" "}
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
                            // Use the UUID 'value' here so cmdk maps the selected value correctly to the callback argument
                            value={value}
                            key={value}
                            onSelect={(currentValue) => {
                              if (ownerAsResident) {
                                const idx = ownerResidentIndex();
                                if (idx !== -1) remove(idx);
                                setOwnerAsResident(false);
                              }

                              // Use the explicit mapped 'value' variable directly to bypass internal cmdk lowercase string matching quirks
                              form.setValue("ownerId", value, {
                                shouldValidate: true,
                              });
                            }}
                            className="cursor-pointer"
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

      {/* ── Section 3: Daftar Penghuni ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader
            icon={UsersIcon}
            title="Daftar Penghuni"
            className="mb-0"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary font-semibold gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isVacant}
                  onClick={handleAddResident}
                >
                  <PlusIcon className="size-4" />
                  Tambah Penghuni
                </Button>
              </span>
            </TooltipTrigger>
            {isVacant && (
              <TooltipContent>
                Tidak dapat menambah penghuni pada rumah kosong
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Vacant banner */}
        {isVacant && fields.length > 0 && (
          <p className="text-xs text-muted-foreground bg-muted/40 border border-dashed border-border rounded-lg px-3 py-2">
            Data penghuni di bawah tidak akan disimpan karena status rumah
            adalah <strong>Kosong</strong>.
          </p>
        )}

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">
            Belum ada penghuni. Klik &quot;Tambah Penghuni&quot; untuk
            menambahkan.
          </p>
        )}

        <ScrollArea className={cn("h-34", fields.length === 0 && "hidden")}>
          <div className="space-y-3">
            {fields.map((fieldItem, index) => {
              const isOwnerEntry =
                watchedResidents[index]?.userId === selectedOwnerId &&
                !!selectedOwnerId;

              // This entry is the current main resident
              const isThisMainResident =
                watchedResidents[index]?.residentRole ===
                ResidentRole.MAIN_RESIDENT;

              // Role select is disabled when:
              // - house is vacant (whole row is greyed)
              // - another resident is already the main resident AND this one isn't
              const roleSelectDisabled =
                isVacant || (hasMainResident && !isThisMainResident);

              return (
                <div
                  key={fieldItem.id}
                  className={cn(
                    "grid md:grid-cols-3 gap-3 p-4 bg-muted/20 border border-border rounded-xl items-start transition-opacity",
                    isVacant && "opacity-50 pointer-events-none select-none",
                  )}
                >
                  {/* Peran */}
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih peran" />
                          </SelectTrigger>
                          <SelectContent>
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

                  {/* Hubungan + Delete */}
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
                            disabled={isVacant}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih hubungan" />
                            </SelectTrigger>
                            <SelectContent>
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
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 self-end"
                      onClick={() => {
                        // If removing the owner-resident entry, also untoggle
                        if (isOwnerEntry) setOwnerAsResident(false);
                        remove(index);
                      }}
                      aria-label="Hapus penghuni"
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

      {/* ── Footer Actions ── */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="reset"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => {
            form.reset();
            setOwnerAsResident(false);
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
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
