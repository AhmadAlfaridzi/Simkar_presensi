import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { customId: params.id },
      include: { kantor: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const now = new Date()
    const izinLokasi = await prisma.absensiIzinLokasi.findMany({
      where: {
        userId: user.id,
        tanggalMulai: { lte: now },
        tanggalSelesai: { gte: now },
     
      },
      include: {
        lokasi: true,
        kantor: true,
      },
    })

    const lokasiList = []

    if (user.kantor) {
      lokasiList.push({
        id: user.kantor.id,
        nama: user.kantor.nama,
        latitude: user.kantor.latitude,
        longitude: user.kantor.longitude,
        radiusMeter: user.kantor.radiusMeter,
        tipe: 'kantor_tetap',
      })
    }

    izinLokasi.forEach((izin) => {
      lokasiList.push({
        id: izin.lokasi?.id || izin.kantor?.id,
        nama: izin.lokasi?.name || izin.kantor?.nama,
        latitude: izin.lokasi?.latitude || izin.kantor?.latitude,
        longitude: izin.lokasi?.longitude || izin.kantor?.longitude,
        radiusMeter: izin.lokasi?.radius || izin.kantor?.radiusMeter,
        tipe: 'izin_lokasi',
      })
    })

    if (lokasiList.length === 0) {
      return NextResponse.json({ error: 'No active location found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) 

    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        date: today
      },
    })

    return NextResponse.json({
      tipeLokasi: lokasiList.length > 1 ? 'multi_lokasi' : 'kantor_tetap',
      lokasi: lokasiList,
      todayAttendance: {
        clockIn: todayAttendance?.clockIn || null,
        clockOut: todayAttendance?.clockOut || null
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
