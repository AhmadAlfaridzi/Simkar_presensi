import { prisma } from '@/lib/prisma'

async function main() {
  await prisma.({
    data: {
      nama: 'Kantor Pusat',
      alamat: 'Jl. Jend. Sudirman No. 123, Jakarta',
      latitude: 5.186042001404348, 
      longitude: 97.14615234609988,
      radiusMeter: 100, // radius valid area
    },
  })

  console.log('✅ Kantor seeded')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
