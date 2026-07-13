import z from "zod";

const CATEGORY_OPTIONS = [
  "ATK & Perlengkapan",
  "Listrik & Air",
  "Perbaikan Fasilitas",
  "Kegiatan & Acara",
  "Sumbangan & Sosial",
  "Transportasi",
  "Lainnya",
] as const;

export const formSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi").max(500),
  category: z.enum(CATEGORY_OPTIONS, {
    message: "Kategori wajib dipilih",
  }),
  amount: z.coerce
    .number({ message: "Jumlah wajib diisi" })
    .positive("Jumlah harus lebih dari 0"),
  proofUrl: z.string().optional(),
  note: z.string().optional(),
});

export const createFormSchema = formSchema.transform((data) => ({
  ...data,
  date: new Date(data.date),
}));

export const updateFormSchema = formSchema.transform((data) => ({
  ...data,
  date: new Date(data.date),
}));

export type InputFormSchema = z.input<typeof formSchema>;
