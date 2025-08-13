import { prisma } from '../src/lib/prisma'

async function main() {
  await prisma.kantor.create({
    data: {
      kodeKantor:'KTR-001',
      nama: 'PT. AISHY AND SONS',
      alamat: 'Jl. Darussalam No.18, Kp. Jawa Baru, Kec. Banda Sakti, Kota Lhokseumawe, Aceh',
      latitude: 5.1862466081887435, 
      longitude:  97.1464353751523,
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
