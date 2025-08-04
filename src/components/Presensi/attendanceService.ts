import {prisma }  from '@/lib/prisma'
import { dummyAttendance } from '@/data/attendence'
import { AttendanceStatus } from '@prisma/client'

export const attendanceService = {
  async seedDummyAttendances() {
    try {
      console.log('Starting attendance seeding...')
    
      await prisma.attendance.deleteMany()
      
      const results = await Promise.allSettled(
        dummyAttendance.map(att => 
          prisma.attendance.create({
            data: {
              userId: att.employee.id,
              date: att.date.split('T')[0],
              clockIn: att.clockIn,
              clockOut: att.clockOut || null,
              status: this.convertStatus(att.status),
              photoIn: att.photoIn || null,
              photoOut: att.photoOut || null,
              createdAt: new Date(att.date)
            }
          })
        )
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      console.log(`✅ Successfully seeded ${successful}/${dummyAttendance.length} attendances`)
      
      return results
    } catch (error) {
      console.error('❌ Attendance seeding failed:', error)
      throw error
    }
  },

  async getUserAttendances(userId: string) {
    try {
      return await prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      })
    } catch (error) {
      console.error('Failed to fetch user attendances:', error)
      throw error
    }
  },

  convertStatus(status: string): AttendanceStatus {
    switch(status) {
      case 'Tepat Waktu': return AttendanceStatus.TEPAT_WAKTU
      case 'Terlambat': return AttendanceStatus.TERLAMBAT
      case 'Pulang Cepat': return AttendanceStatus.PULANG_CEPAT
      default: return AttendanceStatus.TEPAT_WAKTU
    }
  }
}