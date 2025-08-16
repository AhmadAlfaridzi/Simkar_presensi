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

    const lokasiList: {
      id: string
      nama: string
      latitude: number
      longitude: number
      radiusMeter: number
      tipe: 'izin_lokasi' | 'kantor_tetap'
    }[] = []

    izinLokasi.forEach((izin) => {
      if (izin.lokasi) {
        lokasiList.push({
          id: izin.lokasi.id ?? '',
          nama: izin.lokasi.name ?? '',
          latitude: izin.lokasi.latitude ?? 0,
          longitude: izin.lokasi.longitude ?? 0,
          radiusMeter: izin.lokasi.radius ?? 0,
          tipe: 'izin_lokasi',
        })
      } else if (izin.kantor) {
        lokasiList.push({
          id: izin.kantor.id ?? '',
          nama: izin.kantor.nama ?? '',
          latitude: izin.kantor.latitude ?? 0,
          longitude: izin.kantor.longitude ?? 0,
          radiusMeter: izin.kantor.radiusMeter ?? 0,
          tipe: 'izin_lokasi',
        })
      }
    })

    if (user.kantor) {
      lokasiList.push({
        id: user.kantor.id ?? '',
        nama: user.kantor.nama ?? '',
        latitude: user.kantor.latitude ?? 0,
        longitude: user.kantor.longitude ?? 0,
        radiusMeter: user.kantor.radiusMeter ?? 0,
        tipe: 'kantor_tetap',
      })
    }

    if (lokasiList.length === 0) {
      return NextResponse.json({ error: 'No active location found' }, { status: 404 })
    }

    const offset = 7 * 60 
    const startOfDay = new Date(now.getTime() + offset * 60 * 1000)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now.getTime() + offset * 60 * 1000)
    endOfDay.setHours(23, 59, 59, 999)

    console.log("🕒 Start of Day UTC:", startOfDay , " End of Day UTC:", endOfDay)

    const todayAttendance = await prisma.attendance.findMany({
      where: {
         userId: user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    console.log("🗒 Raw todayAttendance (DB):", todayAttendance)
    const attendanceByLocation = lokasiList.map((loc) => { 
      const att = todayAttendance.find((a) =>
      loc.tipe === 'kantor_tetap'
        ? a.lokasiId === loc.id || a.lokasiId === null
        : a.lokasiId === loc.id
      )
      return {
        ...loc,
        clockIn: att?.clockIn ?? null,
        clockOut: att?.clockOut ?? null,
        status: att?.status ?? null,
      }
    })

    console.log("📦 attendanceByLocation (hasil gabung):", attendanceByLocation)
    
    return NextResponse.json({
      tipeLokasi: lokasiList.length > 1 ? 'multi_lokasi' : 'kantor_tetap',
      lokasi: attendanceByLocation,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
