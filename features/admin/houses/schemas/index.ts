import z from "zod";

import { HouseStatus } from "@/generated/prisma/enums";
import { HouseCreateInput } from "@/generated/prisma/models";

export const formSchema = z
  .object({
    ownerId: z.string().min(1, "Pemilik wajib diisi"),
    block: z.string().min(1, "Blok wajib diisi"),
    status: z
      .enum([HouseStatus.OCCUPIED, HouseStatus.VACANT])
      .default(HouseStatus.OCCUPIED),
    houseNumber: z.string().min(1, "Nomor rumah wajib diisi"),
  })
  .transform((data) => ({
    ...data,
    owner: {
      connect: {
        id: data.ownerId,
      },
    },
  })) satisfies z.ZodType<HouseCreateInput>;

export type InputFormSchema = z.input<typeof formSchema>;
