import { prisma } from '../src/lib/prisma'

async function main() {
  await prisma.kantor.create({
    data: {
      kodeKantor: 'KTR-001',
      nama: 'Apotek Aishy',
      alamat: 'Jl. Banda Aceh - Medan No.07, Mns Mee, Kec. Muara Dua, Kota Lhokseumawe, Aceh 24355',
      latitude: 5.166254982245708, 
      longitude: 97.13566795922469,
      radiusMeter: 20, 
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
