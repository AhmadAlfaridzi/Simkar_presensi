import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { dummyPegawai } from '../src/data/pegawai'
import { dummyAccounts } from '../src/data/users'

async function main() {
  console.log('🌱 Mulai seeding...')

  await prisma.attendance.deleteMany()
  await prisma.user.deleteMany()
  await prisma.karyawan.deleteMany()

  // Seed Karyawan
  for (const pegawai of dummyPegawai) {
    await prisma.karyawan.create({
      data: {
        customId: pegawai.customId,
        name: pegawai.name,
        nip: pegawai.nip,
        nik: pegawai.nik,
        npwp: pegawai.npwp,
        emailPribadi: pegawai.emailPribadi,
        phone: pegawai.phone,
        address: pegawai.address,
        birthDate: pegawai.birthDate,
        tempatLahir: pegawai.tempatLahir,
        jenisKelamin: pegawai.jenisKelamin,
        agama: pegawai.agama,
        joinDate: pegawai.joinDate,
        position: pegawai.position,
        department: pegawai.department,
        pendidikan: pegawai.pendidikan,
        golongan: pegawai.golongan,
        image: pegawai.image,
        kontakDarurat: pegawai.kontakDarurat,
        hubunganDarurat: pegawai.hubunganDarurat,
        status: pegawai.status,
        lastLogin: pegawai.lastLogin ? new Date(pegawai.lastLogin) : undefined
      }
    })
  }

  for (const account of dummyAccounts) {
    const passwordHash = await bcrypt.hash(account.username + '123', 10)

    await prisma.user.create({
      data: {
        customId: account.customId,
        username: account.username,
        email: account.email,
        role: account.role,
        passwordHash,
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      }
    })
  }

  console.log('✅ Seeding selesai!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
