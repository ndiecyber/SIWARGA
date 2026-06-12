import { UserGetPayload } from "@/generated/prisma/models";

export type UserWithResident = UserGetPayload<{
  include: { residentProfile: { include: { familyMembers: true } } };
}>;
