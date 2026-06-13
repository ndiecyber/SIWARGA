import z from "zod";

const passwordPlaceholder = "password1234";

export const userLoginSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(10, "Nomor telepon minimal 10 karakter")
      .max(15, "Nomor telepon maksimal 15 karakter")
      .regex(/^08[0-9]{8,13}$/, "Nomor telepon harus diawali 08"),
  })
  .transform((data) => ({
    username: data.phoneNumber,
    password: passwordPlaceholder,
  }));

export const adminLoginSchema = z.object({
  email: z.email().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type UserLoginValues = z.infer<typeof userLoginSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
