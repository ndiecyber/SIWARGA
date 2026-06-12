import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        identificationNumber: true,
        familyCount: true,
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
    console.error("GET_USER_BY_ID_ERROR:", error);

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