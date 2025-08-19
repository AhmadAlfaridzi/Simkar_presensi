import DashboardClient from './dashboardClient'
import { prisma } from '@/lib/prisma'

export default async function DashboardServer() {
  const karyawan = await prisma.karyawan.findMany({
     where: {
      user: {
        role: { not: 'OWNER' },
      },
    },
    select: {
      id: true,
      customId: true,
      name: true,
      department: true,
      position: true,
      joinDate: true,
      status: true,
    }
  })

  const today = new Date().toISOString().split('T')[0]
  const attendanceRecordsRaw = await prisma.attendance.findMany({
    where: {
      date: {
        gte: new Date(today),
        lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      user: {
        include: {
          karyawan: true
        }
      }
    },
    orderBy: { date: 'desc' }
  })

  const attendanceRecords = attendanceRecordsRaw.map(att => ({
    id_at: att.id_at,
    userId: att.userId,
    date: att.date.toISOString(),
    clockIn: att.clockIn ?? null,
    clockOut: att.clockOut ?? null,
    status: att.status,
    karyawan: att.user?.karyawan
      ? {
          id: att.user.customId ?? att.user.id,
          customId: att.user.customId ?? att.user.id,
          name: att.user.karyawan.name,
          department: att.user.karyawan.department,
          position: att.user.karyawan.position,
          joinDate: att.user.karyawan.joinDate,
          status: att.user.karyawan.status,
        }
      : null,
    photoIn: att.photoIn ?? '/images/placeholder-user.jpg',
    photoOut: att.photoOut ?? '/images/placeholder-user.jpg',
  }))
  return (
    <DashboardClient
      initialEmployees={karyawan}  
      initialAttendance={attendanceRecords}
    />
  )
}