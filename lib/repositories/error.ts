import { Prisma } from "@/generated/prisma/client";

const errorMessages: Record<string, string> = {
  P2002: "Data dengan nilai unik sudah terdaftar.",
  P2025: "Data yang dimaksud tidak ditemukan.",
  P2003: "Data terkait tidak ditemukan.",
  P2014: "Operasi gagal karena melanggar integritas relasi.",
};

export function handleDbError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const message = errorMessages[error.code] || "Terjadi kesalahan database.";
    return { success: false as const, message };
  }

  if (error instanceof Error) {
    return { success: false as const, message: error.message };
  }

  return { success: false as const, message: "Terjadi kesalahan yang tidak diketahui." };
}
