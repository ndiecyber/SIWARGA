import { ExpenseGetPayload } from "@/generated/prisma/models";

export type ExpenseWithCreator = ExpenseGetPayload<{
  include: { createdBy: true; approvedBy: true };
}>;
