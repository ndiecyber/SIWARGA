"use server";

import { revalidatePath } from "next/cache";
import { generateDuesForMonth } from "@/lib/repositories/monthly-dues";

const DUES_AMOUNT = 25000;

interface GenerateDuesInput {
  month: number;
  year: number;
}

function formatMonthYear(month: number, year: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1));
}

export async function generateDuesAction(input: GenerateDuesInput) {
  const { month, year } = input;
  const result = await generateDuesForMonth(month, year);
  revalidatePath("/admin/fees");
  return result;
}
