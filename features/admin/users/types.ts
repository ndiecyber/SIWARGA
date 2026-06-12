import { Role } from "@/generated/prisma/enums";

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
