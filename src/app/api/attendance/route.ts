export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("date");

    const where = dateFilter
      ? {
          date: {
            gte: new Date(dateFilter),
            lt: new Date(new Date(dateFilter).getTime() + 24 * 60 * 60 * 1000),
          },
        }
      : {};

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          include: {
            karyawan: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const formatted = attendances.map((att) => ({
      id_at: att.id_at,
      userId: att.userId,
      date: att.date.toISOString(),
      clockIn: att.clockIn || null,
      clockOut: att.clockOut || null,
      status: att.status,
      karyawan: att.user?.karyawan
        ? {
            id: att.user.customId ?? att.user.id,
            name: att.user.karyawan.name,
            department: att.user.karyawan.department,
            position: att.user.karyawan.position,
          }
        : null,
      photoIn: att.photoIn || "/images/placeholder-user.jpg",
      photoOut: att.photoOut || "/images/placeholder-user.jpg",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
