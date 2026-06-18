import z from "zod";

import { HouseStatus } from "@/generated/prisma/enums";
import { RelationshipType, ResidentRole } from "@/generated/prisma/enums";
import { HouseCreateInput, HouseUpdateInput } from "@/generated/prisma/models";

export const formSchema = z.object({
  ownerId: z.string().min(1, "Pemilik wajib diisi"),
  block: z.string().min(1, "Blok wajib diisi"),
  status: z
    .enum([HouseStatus.OCCUPIED, HouseStatus.VACANT])
    .default(HouseStatus.OCCUPIED),
  houseNumber: z.string().min(1, "Nomor rumah wajib diisi"),
  residents: z.array(
    z.object({
      userId: z.string().optional(),
      residentRole: z.enum([
        ResidentRole.MAIN_RESIDENT,
        ResidentRole.FAMILY_MEMBER,
      ]),
      relationship: z.enum([
        RelationshipType.SELF,
        RelationshipType.SPOUSE,
        RelationshipType.CHILD,
        RelationshipType.PARENT,
        RelationshipType.SIBLING,
        RelationshipType.OTHER,
      ]),
    }),
  ),
});

export const createFormSchema = formSchema.transform(
  ({ ownerId, residents, ...data }) => ({
    ...data,
    owner: {
      connect: {
        id: ownerId,
      },
    },
    residents: {
      createMany: {
        data: residents,
      },
    },
  }),
) satisfies z.ZodType<HouseCreateInput>;

export const updateFormSchema = formSchema.transform(
  ({ ownerId, residents, ...data }) => ({
    ...data,
    owner: {
      connect: {
        id: ownerId,
      },
    },
    residents: {
      deleteMany: {},
      createMany: {
        data: residents,
      },
    },
  }),
) satisfies z.ZodType<HouseUpdateInput>;

export type InputFormSchema = z.input<typeof formSchema>;
