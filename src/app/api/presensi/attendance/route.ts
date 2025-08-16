import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const data = await request.json()
      console.log('📩 Data diterima di API /attendance:', data)
    const {
      userId,
      date,
      clockIn,
      clockOut,
      status,
      photoIn,
      photoOut,
      latitude,
      longitude,
      location,
      lokasiId,
    } = data

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'userId and date are required' },
        { status: 400 }
      )
    }

  function convertStatus(status: string): AttendanceStatus {
    switch(status.toLowerCase()) {
        case 'tepat waktu':
        case 'tepat_waktu':
        case 'TEPAT_WAKTU':
        return 'TEPAT_WAKTU'
        case 'terlambat':
        case 'TERLAMBAT':
        return 'TERLAMBAT'
        case 'tidak hadir':
        case 'TIDAK_HADIR':
        return 'TIDAK_HADIR'
        default:
        return 'TEPAT_WAKTU'
    }
  }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)
    const attendanceStatus: AttendanceStatus = convertStatus(status || '')
    const user = await prisma.user.findUnique({ where: { customId: userId }, select: { kantorId: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    

    let validLokasiId: string | null = null
    // let validKantorId: string | null = null;
    
    if (lokasiId) {
      const lokasi = await prisma.lokasiDinas.findUnique({ where: { id: lokasiId } })
      const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: { lokasiId, userId }
      }) 
     
      if (lokasi || izinLokasi || lokasiId === user?.kantorId) {
        validLokasiId = lokasiId
      } else {
        return NextResponse.json({ error: 'Lokasi presensi tidak valid' }, { status: 400 })
      }
    } else {
      const now = new Date()
      const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: {
          userId,
          tanggalMulai: { lte: now },
          tanggalSelesai: { gte: now },
        },
      })

     if (izinLokasi?.lokasiId) {
        validLokasiId = izinLokasi.lokasiId
      } else {
        validLokasiId = user?.kantorId || null
      }
    }


    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          equals: attendanceDate
        },
        ...(validLokasiId ? { lokasiId: validLokasiId } : {})
      }
    })


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
          status: attendanceStatus ?? existingAttendance.status,
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
        date: attendanceDate,
        clockIn: clockIn ?? null,
        clockOut: clockOut ?? null,
        status: attendanceStatus ?? AttendanceStatus.TEPAT_WAKTU,
        photoIn: photoIn ?? null,
        photoOut: photoOut ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        location: location ?? null,
        createdAt: new Date(),
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