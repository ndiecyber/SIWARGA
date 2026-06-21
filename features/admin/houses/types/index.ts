import { HouseGetPayload } from "@/generated/prisma/models";

export type HouseWithOwner = HouseGetPayload<{ include: { owner: true } }>;
export type HouseWithResidents = HouseGetPayload<{
  include: { residents: true };
}>;
export type HouseWithResidentsWithUser = HouseGetPayload<{
  include: { residents: { include: { user: true } } };
}>;
