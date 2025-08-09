import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const karyawans = await prisma.karyawan.findMany({
      select: {
        id: true,
        customId: true,
        name: true,
        department: true,
        position: true,
      },
    });
    return NextResponse.json(karyawans);
  } catch (error) {
    console.error("Error fetching karyawan:", error);
    return NextResponse.json({ error: "Failed to fetch karyawan" }, { status: 500 });
  }
}
