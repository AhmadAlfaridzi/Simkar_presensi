import { PrismaClient } from '@prisma/client'
import { attendanceData } from 'src/data/attendence'

const prisma = new PrismaClient()

async function main() {
  for (const record of attendanceData) {
    await prisma.attendance.create({
      data: {
        ...record,
        photoIn: '/images/placeholder-user.jpg',
        photoOut: '/images/placeholder-user.jpg',
      },
    })

    console.log(`✅ Presensi seeded: ${record.userId} - ${record.date}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Gagal seeding presensi:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
