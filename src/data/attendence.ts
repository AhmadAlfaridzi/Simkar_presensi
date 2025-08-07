import { AttendanceStatus } from '@prisma/client'
import { subDays } from 'date-fns'

export const attendanceData = [
  {
    userId: 'USR-001',
    date: new Date().toISOString().split('T')[0],
    clockIn: '07:50',
    clockOut: '17:20',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
  {
    userId: 'USR-001',
    date: subDays(new Date(), 1).toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '17:00',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
  {
    userId: 'USR-002',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:10',
    clockOut: '17:05',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
  {
    userId: 'USR-002',
    date: subDays(new Date(), 1).toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '16:30',
    status: AttendanceStatus.PULANG_CEPAT,
  },
  {
    userId: 'USR-002',
    date: subDays(new Date(), 2).toISOString().split('T')[0],
    clockIn: '08:45',
    clockOut: '17:00',
    status: AttendanceStatus.TERLAMBAT,
  },
  {
    userId: 'USR-002',
    date: subDays(new Date(), 4).toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '17:00',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
  {
    userId: 'USR-010',
    date: new Date().toISOString().split('T')[0],
    clockIn: '07:50',
    clockOut: '17:20',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
  {
    userId: 'USR-010',
    date: subDays(new Date(), 1).toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '17:00',
    status: AttendanceStatus.TEPAT_WAKTU,
  },
]