import { Role, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { dummyPegawai } from '../src/data/users'
import {prisma } from '../src/lib/prisma'

const SALT_ROUNDS = 10

function toRole(role: string): Role {
  const map: Record<string, Role> = {
    admin: Role.ADMIN,
    owner: Role.OWNER,
    direktur: Role.DIREKTUR,
    manajer: Role.MANAJER,
    teknisi: Role.TEKNISI,
    karyawan: Role.KARYAWAN,
  }
  return map[role.toLowerCase()] || Role.KARYAWAN
}

function toUserStatus(status?: string): UserStatus {
  if (!status) return UserStatus.AKTIF
  const s = status.toLowerCase()
  if (s.includes('non')) return UserStatus.NONAKTIF
  if (s.includes('tangguh')) return UserStatus.DITANGGUHKAN
  return UserStatus.AKTIF
}

async function main() {
  console.log('🌱 Start seeding...')

  await prisma.attendance.deleteMany()
  await prisma.user.deleteMany()

  for (const user of dummyPegawai) {
    const hashedPassword = await bcrypt.hash(`${user.username}123`, SALT_ROUNDS)

    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || null,
        address: user.address || null,
        birthDate: user.birthDate || null,
        joinDate: user.joinDate,
        role: toRole(user.role),
        position: user.position,
        department: user.department,
        image: user.image || null,
        status: toUserStatus(user.status),
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  console.log('✅ Done seeding users!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
