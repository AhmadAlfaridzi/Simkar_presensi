import { Role, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { dummyPegawai } from '../src/data/users'
import fs from 'fs'

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

// Escape double quote in values
const escape = (str: string) => str.replace(/"/g, '""')

function quote(value: string | null | undefined): string {
  if (!value) return 'NULL'
  return `'${value.replace(/'/g, "''")}'` 
}

async function main() {
  const allSql: string[] = []

  for (const user of dummyPegawai) {
    const hashedPassword = await bcrypt.hash(`${user.username}123`, SALT_ROUNDS)

    const sql = `
INSERT INTO users (
  "customId", "name", "username", "email", "phone", "address", "birthDate",
  "joinDate", "role", "position", "department", "image", "status",
  "passwordHash", "createdAt", "updatedAt"
) VALUES (
  ${quote(user.id)}, ${quote(user.name)}, ${quote(user.username)}, ${quote(user.email)},
  ${quote(user.phone)}, ${quote(user.address)}, ${quote(user.birthDate)},
  ${quote(user.joinDate)}, ${quote(toRole(user.role))}, ${quote(user.position)},
  ${quote(user.department)}, ${quote(user.image)}, ${quote(toUserStatus(user.status))},
  ${quote(hashedPassword)}, NOW(), NOW()
);`
    allSql.push(sql.trim())
  }

  allSql.push('COMMIT;')
  fs.writeFileSync('seed.sql', allSql.join('\n\n'), 'utf-8')
}

main().catch((err) => {
  console.error('❌ Error generating SQL:', err)
  process.exit(1)
})
