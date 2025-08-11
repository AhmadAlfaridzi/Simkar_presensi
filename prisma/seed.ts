import { prisma } from '../src/lib/prisma'
import { dummyAttendance } from '../src/data/attendence'

async function main() {
  console.log('🌱 Mulai seeding attendance...')

  // Hapus data attendance lama (opsional, kalau mau clean insert)
  await prisma.attendance.deleteMany()

  const allowedStatuses = ['TEPAT_WAKTU', 'TERLAMBAT', 'TIDAK_HADIR']

  for (const rec of dummyAttendance) {
    try {
      // ambil customId user dari dummyAttendance
      const userCustomId = (rec as any).employee?.id ?? (rec as any).userId
      if (!userCustomId) {
        console.warn(`⚠️ Skip attendance (tidak ada userId):`, rec)
        continue
      }

      // cari user di DB
      const user = await prisma.user.findUnique({ where: { customId: String(userCustomId) } })
      if (!user) {
        console.warn(`⚠️ Skip attendance — user customId=${userCustomId} tidak ditemukan`)
        continue
      }

      // normalisasi status
      let status = (rec as any).status
      if (!allowedStatuses.includes(status)) {
        console.warn(`⚠️ Status "${status}" tidak dikenal, fallback ke "TEPAT_WAKTU"`)
        status = 'TEPAT_WAKTU'
      }

      // insert attendance
      await prisma.attendance.create({
        data: {
          userId: user.customId,
          date: new Date((rec as any).date),
          clockIn: (rec as any).clockIn ?? '',
          clockOut: (rec as any).clockOut ?? null,
          status: status as any,
          photoIn: (rec as any).photoIn ?? null,
          photoOut: (rec as any).photoOut ?? null,
          latitude: (rec as any).latitude ?? undefined,
          longitude: (rec as any).longitude ?? undefined,
          location: (rec as any).location ?? undefined,
          barcodeIn: (rec as any).barcodeIn ?? undefined,
          barcodeOut: (rec as any).barcodeOut ?? undefined,
          barcodeInAt: (rec as any).barcodeInAt ? new Date((rec as any).barcodeInAt) : undefined,
          barcodeOutAt: (rec as any).barcodeOutAt ? new Date((rec as any).barcodeOutAt) : undefined,
        }
      })
    } catch (err) {
      console.error('❌ Error saat seeding attendance record:', err)
    }
  }

  console.log('✅ Seeding attendance selesai!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
