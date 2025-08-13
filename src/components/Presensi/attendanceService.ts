import { supabase } from '@/lib/supabase'

export const attendanceService = {
<<<<<<< HEAD
  async getUserAttendances(userId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Failed to fetch user attendances:', error)
      throw error
    }

    return data
=======
  async seedDummyAttendances() {
    try {
      console.log('Starting attendance seeding...')

      await prisma.attendance.deleteMany()
      const convertStatus = this.convertStatus

      const results = await Promise.allSettled(
        dummyAttendance.map(att => {
          if (!att.karyawan?.customId) {
            throw new Error('Missing customId for attendance record')
          }

          return prisma.attendance.create({
            data: {
              userId: att.karyawan.customId,
              date: new Date(att.date),       
              clockIn: att.clockIn,
              clockOut: att.clockOut || null,
              status: convertStatus(att.status),
              photoIn: att.photoIn || null,
              photoOut: att.photoOut || null,
              createdAt: new Date(att.date),
              latitude: att.latitude || null,
              longitude: att.longitude || null,
              location: att.location || null,
            }
          })
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      console.log(`✅ Successfully seeded ${successful}/${dummyAttendance.length} attendances`)

      return results
    } catch (error) {
      console.error('❌ Attendance seeding failed:', error)
      throw error
    }
  },
  convertStatus(status: string): AttendanceStatus {
    switch(status) {
      case 'Tepat Waktu': return AttendanceStatus.TEPAT_WAKTU
      case 'Terlambat': return AttendanceStatus.TERLAMBAT
      case 'Pulang Cepat': return AttendanceStatus.TIDAK_HADIR
      default: return AttendanceStatus.TEPAT_WAKTU
    }
>>>>>>> presensi
  }
}
