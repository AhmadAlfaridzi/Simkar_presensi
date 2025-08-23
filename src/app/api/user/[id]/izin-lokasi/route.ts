import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nowWIB, startOfDayWIB, endOfDayWIB } from '@/lib/timezone'

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

    const now = nowWIB()
    const startOfDay = startOfDayWIB(now)
    const endOfDay = endOfDayWIB(now)
    
    const izinLokasi = await prisma.absensiIzinLokasi.findMany({
      where: {
        userId: user.customId,
        tanggalMulai: { lte: now },
        tanggalSelesai: { gte: now },
      },
      include: {
        lokasi: true,
        kantor: true,
      },
    })
    console.log("🎟 izinLokasi (filtered by date):", izinLokasi)
    const rawIzin = await prisma.$queryRawUnsafe(`
      SELECT * FROM "AbsensiIzinLokasi" WHERE "userId" = '${user.customId}'
    `);
    console.log("🛠 Raw query izin lokasi:", rawIzin);
    const lokasiList: {
      id: string
      nama: string
      latitude: number
      longitude: number
      radiusMeter: number
      tipe: 'izin_lokasi' | 'kantor_tetap'
    }[] = []

    if (izinLokasi.length > 0) {
      izinLokasi.forEach((izin) => {
        if (izin.lokasi) {
          lokasiList.push({
            id: izin.lokasi.id,
            nama: izin.lokasi.name,
            latitude: izin.lokasi.latitude,
            longitude: izin.lokasi.longitude,
            radiusMeter: izin.lokasi.radius,
            tipe: 'izin_lokasi',
          })
        } else if (izin.kantor) {
          lokasiList.push({
            id: izin.kantor.id,
            nama: izin.kantor.nama,
            latitude: izin.kantor.latitude,
            longitude: izin.kantor.longitude,
            radiusMeter: izin.kantor.radiusMeter,
            tipe: 'izin_lokasi',
          })
        }
      })
    } else if (user.kantor) {
      lokasiList.push({
        id: user.kantor.id,
        nama: user.kantor.nama,
        latitude: user.kantor.latitude,
        longitude: user.kantor.longitude,
        radiusMeter: user.kantor.radiusMeter,
        tipe: 'kantor_tetap',
      })
    }

    if (lokasiList.length === 0) {
      return NextResponse.json({ error: 'No active location found' }, { status: 404 })
    }

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        userId: user.customId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })
    
    console.log("🎟 izinLokasi ditemukan:", izinLokasi)
    console.log("🗒 Raw todayAttendance (DB):", todayAttendance)
    const attendanceByLocation = lokasiList.map((loc) => { 
    const att = todayAttendance.find((a) =>
      loc.tipe === 'kantor_tetap'
          ? a.kantorId === loc.id
          : a.lokasiId === loc.id
      )

      let enableClockIn = false
      let enableClockOut = false

      if (!att) {
        enableClockIn = true
        enableClockOut = false
      } else {
        if (att.clockIn && !att.clockOut) {
          enableClockIn = false
          enableClockOut = true
        } else {
          enableClockIn = false
          enableClockOut = false
        }
      }
      return {
        ...loc,
        fieldTarget: loc.tipe === 'kantor_tetap' ? 'kantorId' : 'lokasiId',
        clockIn: att?.clockIn ?? null,
        clockOut: att?.clockOut ?? null,
        status: att?.status ?? null,
        enableClockIn,  
        enableClockOut,
      }
    })

    // console.log("📦 attendanceByLocation (hasil gabung):", attendanceByLocation)
    
    return NextResponse.json({
        lokasi: attendanceByLocation,
        todayAttendance: attendanceByLocation.map(a => ({
          lokasiId: a.tipe === 'kantor_tetap' ? a.id : a.id,
          clockIn: a.clockIn,
          clockOut: a.clockOut,
        })),
        tipeLokasi: 
          lokasiList.every((l) => l.tipe === 'kantor_tetap')
            ? 'kantor_tetap'
            : lokasiList.every((l) => l.tipe === 'izin_lokasi')
            ? 'izin_lokasi'
            : 'multi_lokasi',
      })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
