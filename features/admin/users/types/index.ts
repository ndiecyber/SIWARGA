import { Role } from "@/generated/prisma/enums";
import { UserGetPayload } from "@/generated/prisma/models";

export type UserWithResident = UserGetPayload<{
  include: { residentProfile: true };
}>;

export type UserWithHouse = UserGetPayload<{
  include: { residentProfile: { include: { house: true } } };
}>;

export type User = {
  role: Role;
  id: string;
  name: string;
  phoneNumber: string;
  identificationNumber: string;
  familyCount: number;
  kkUrl: string;
  ktpUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
