import { z } from "zod/v4";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileSchema = (message: string) =>
  z
    .unknown()
    .refine((file): file is File => file instanceof File, {
      message,
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Ukuran file maksimal 5 MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Format file harus JPG, PNG, atau PDF",
    });

// Create User Schema
export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Nomor telepon tidak valid")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^08[0-9]{7,18}$/, "Nomor telepon harus diawali 08 dan hanya berisi angka"),
  identificationNumber
    : z
      .string()
      .trim()
      .min(16, "Nomor Induk Penduduk Tidak Valid")
      .max(16, "Nomor Induk Penduduk Tidak Valid"),
  familyCount: z.number().default(0),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  kkFile: fileSchema("File KK wajib diunggah").optional(),
  ktpFile: fileSchema("File KTP wajib diunggah").optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>

// Update User Schema
export const updateUserSchema = createUserSchema

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;