import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'


export async function POST(request: Request) {
  try {
    const data = await request.json()

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

  const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)
    const attendanceStatus: AttendanceStatus = convertStatus(status || '')

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
      userId,
      date: {
        equals: attendanceDate
      },
      ...(lokasiId ? { lokasiId } : {})
    }
  })
    
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

    if (existingAttendance) {
      // Update absen pulang (clockOut)
      const updated = await prisma.attendance.update({
        where: { id_at: existingAttendance.id_at },
        data: {
          clockIn: existingAttendance.clockIn, 
          clockOut: clockOut ?? existingAttendance.clockOut,
          status: attendanceStatus ?? existingAttendance.status,
          photoIn: existingAttendance.photoIn,
          photoOut: photoOut ?? existingAttendance.photoOut,
          latitude: latitude ?? existingAttendance.latitude,
          longitude: longitude ?? existingAttendance.longitude,
          location: location ?? existingAttendance.location,
        },
      })
      return NextResponse.json(updated)
    } else { 
      const created = await prisma.attendance.create({
        data: {
          id_at: crypto.randomUUID(),
          userId,
          date: attendanceDate,
          clockIn: clockIn ?? '',
          clockOut: null,
          status: attendanceStatus ?? AttendanceStatus.TEPAT_WAKTU,
          photoIn: photoIn ?? null,
          photoOut: null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          location: location ?? null,
          createdAt: new Date(),
        },
      })
      return NextResponse.json(created)
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}