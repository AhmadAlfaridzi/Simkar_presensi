import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'
import { nowWIB, startOfDayWIB, endOfDayWIB, isWeekendWIB } from '@/lib/timezone'
import { console } from 'node:inspector'
// import { console } from 'inspector'

function getAttendanceStatusByNow(
  now: Date,
  hasIzinLokasi: boolean,
  isSecondClockIn: boolean
): AttendanceStatus {
  const minutes = now.getHours() * 60 + now.getMinutes()

  if (isSecondClockIn) return 'TEPAT_WAKTU' 
  if (hasIzinLokasi) return 'TEPAT_WAKTU'  

  if (minutes <= 8 * 60 + 30) return 'TEPAT_WAKTU'
  if (minutes <= 9 * 60) return 'TERLAMBAT'
  return 'TIDAK_HADIR'
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
      console.log('📩 Data diterima di API /attendance:', data)
    const {
      userId,
      clockIn,
      clockOut,
      photoIn,
      photoOut,
      latitude,
      longitude,
      location,
      lokasiId,
    } = data
    
    if (!userId ) {
      return NextResponse.json(
        { error: 'userId and date are required' },
        { status: 400 }
      )
    }

    const now = nowWIB()
    if (isWeekendWIB(now)) {
      return NextResponse.json(
        { error: 'Hari ini libur (weekend), tidak bisa presensi' },
        { status: 400 }
      )
    }
   
    const user = await prisma.user.findUnique({ where: { customId: userId }, select: { kantorId: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    

    let validLokasiId: string | null = null;
    let validKantorId: string | null = null;

    if (lokasiId) {
      const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: {
          userId,
          tanggalMulai: { lte: now },
          tanggalSelesai: { gte: now },
          OR: [{ lokasiId }, { kantorId: lokasiId }]
        },
      })
     
      if (izinLokasi?.lokasiId) {
        validLokasiId = izinLokasi.lokasiId
      } else if (izinLokasi?.kantorId) {
        validKantorId = izinLokasi.kantorId
      } else if (lokasiId === user?.kantorId) {
        // fallback ke kantor tetap
        validKantorId = lokasiId
      } else {
        return NextResponse.json(
          { error: 'Lokasi presensi tidak valid' },
          { status: 400 }
        )
      }
    } else {
      
    const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: {
          userId,
          tanggalMulai: { lte: now },
          tanggalSelesai: { gte: now },
        },
      })

    if (izinLokasi?.lokasiId) {
      validLokasiId = izinLokasi.lokasiId
      validKantorId = null
    } else if (user?.kantorId) {
      validKantorId = user.kantorId
      validLokasiId = null
    }
  }
  
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDayWIB(now),
          lte: endOfDayWIB(now),
        },
        ...(validLokasiId ? { lokasiId: validLokasiId } : {}),
        ...(validKantorId ? { kantorId: validKantorId } : {}),
      },
    })

    let attendanceStatus: AttendanceStatus | undefined
    if (clockIn) {
      const hasIzinLokasi = !!existingAttendance?.lokasiId 
      const isSecondClockIn = !!existingAttendance?.clockIn
      attendanceStatus = getAttendanceStatusByNow(now, hasIzinLokasi, isSecondClockIn)
    }

    const validateAttendance = () => {
    if (clockIn) {
      if (existingAttendance?.clockIn) 
        throw new Error('Anda sudah melakukan presensi masuk di lokasi ini hari ini')
    }
    if (clockOut) {
      if (!existingAttendance?.clockIn) 
        throw new Error('Anda belum melakukan presensi masuk hari ini')
      if (existingAttendance?.clockOut) 
        throw new Error('Anda sudah melakukan presensi pulang hari ini')
    }
  }
    
    try {
      validateAttendance()
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 })
    }

      // Update absen pulang (clockOut)
    if (existingAttendance) {
      const updated = await prisma.attendance.update({
        where: { id_at: existingAttendance.id_at },
        data: {
          clockIn: clockIn ?? existingAttendance.clockIn,
          clockOut: clockOut ?? existingAttendance.clockOut,
          photoIn: photoIn ?? existingAttendance.photoIn,
          photoOut: photoOut ?? existingAttendance.photoOut,
          latitude: latitude ?? existingAttendance.latitude,
          longitude: longitude ?? existingAttendance.longitude,
          location: location ?? existingAttendance.location,
        },
      })

      return NextResponse.json(updated)
    }
     const created = await prisma.attendance.create({
      data: {
        id_at: crypto.randomUUID(),
        userId,
        date: startOfDayWIB(now),
        clockIn: clockIn ?? null,
        clockOut: clockOut ?? null,
        status: attendanceStatus ?? AttendanceStatus.TEPAT_WAKTU,
        photoIn: photoIn ?? null,
        photoOut: photoOut ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        location: location ?? null,
        createdAt: now,
        kantorId: validKantorId,
        lokasiId: validLokasiId,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}