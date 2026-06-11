"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldDialog } from "@/components/shared/field-dialog";
import { HouseCreateInput } from "@/generated/prisma/models";
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
import { HouseStatus } from "@/generated/prisma/enums";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}

const formSchema = z.object({
  ownerId: z.string().optional(),
  block: z.string().min(1, "Blok wajib diisi"),
  status: z
    .enum([HouseStatus.OCCUPIED, HouseStatus.VACANT])
    .default(HouseStatus.OCCUPIED),
  houseNumber: z.string().min(1, "Nomor rumah wajib diisi"),
}) satisfies z.ZodType<HouseCreateInput>;

type InputFormSchema = z.input<typeof formSchema>;

export function HouseCreateForm() {
  const { close } = useFieldDialog();

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: HouseStatus.OCCUPIED,
      block: "",
      houseNumber: "",
      ownerId: "",
    },
  });
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = form;

  const handleSubmit = form.handleSubmit(async (data: InputFormSchema) => {
    try {
      // TODO: implement form submission
      console.log(data);
      form.reset();

      close();
    } catch (error) {
      // TODO: handle error
    }
  });

  if (isSubmitSuccessful) {
    return (
      <div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="text-center text-2xl text-pretty font-bold mb-2">
            Thank you
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 max-w-3xl mx-auto"
    >
      <FieldGroup className="grid md:grid-cols-6 gap-4 mb-6">
        <Controller
          name="houseNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-1 col-span-full"
            >
              <FieldLabel htmlFor="house-number">Nomor Rumah *</FieldLabel>
              <Input
                {...field}
                id="house-number"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Masukkan nomor rumah"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                className="gap-1 md:col-span-2"
              >
                <FieldLabel htmlFor="block">Blok Rumah *</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Blok Rumah" />
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
          name="status"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-2"
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
            const options = [
              { value: "asep", label: "Asep" },
              { value: "spanish", label: "Spanish" },
            ];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-2 col-span-full"
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
                        ? field.options.find(
                            (option) => option.value === field.value,
                          )?.label
                        : "Pilih Pemilik Rumah"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 min-w-(--radix-popper-anchor-width) w-full"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="tap to search..."
                        className="h-10"
                      />
                      <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                          {options.map(({ label, value }) => (
                            <CommandItem
                              value={value}
                              key={value}
                              onSelect={() => {
                                form.setValue("ownerId", value);
                              }}
                            >
                              {label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
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
      <div className="flex justify-end items-center w-full">
        <Button
          type="reset"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button disabled={isSubmitting}>
          {isSubmitting ? (
            <span>
              <Loader2 className="mr-2 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
