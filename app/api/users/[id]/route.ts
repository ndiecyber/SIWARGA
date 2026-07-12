import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { apiLogger } from "@/lib/logger";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        identificationNumber: true,
        role: true,
        ktpUrl: true,
        kkUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Data warga tidak ditemukan.",
          data: null,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data warga berhasil ditemukan.",
        data: user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    apiLogger.error({ err: error, userId: id }, 'Gagal ambil data user lewat API')

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data warga.",
        data: null,
      },
      {
        status: 500,
      },
    );
  }
}
