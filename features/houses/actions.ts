import { z } from "zod";

import {
  HouseCreateInputObjectZodSchema,
  HouseModelSchema,
  HouseResidentModelSchema,
  HouseStatusSchema,
  HouseUpdateInputObjectZodSchema,
  UserModelSchema,
} from "@/generated/zod/schemas";

export type createHouseSchema = z.infer<typeof HouseCreateInputObjectZodSchema>;
export type updateHouseSchema = z.infer<typeof HouseUpdateInputObjectZodSchema>;
const house = HouseModelSchema.pick({
  id: true,
  houseNumber: true,
  block: true,
  status: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  owner: true,
});

const resident = HouseResidentModelSchema.pick({
  id: true,
  userId: true,
  houseId: true,
  user: true,
  house: true,
  createdAt: true,
  updatedAt: true,
});

const user = UserModelSchema.pick({
  id: true,
  name: true,
  phoneNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type House = z.infer<typeof house>;
export type HouseResident = z.infer<typeof resident>;
export type User = z.infer<typeof user>;

export async function createHouse(data: createHouseSchema): Promise<House> {
  return {
    id: "1",
    houseNumber: "1",
    block: "1",
    status: HouseStatusSchema.enum.OCCUPIED,
    ownerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: null,
  };
}
