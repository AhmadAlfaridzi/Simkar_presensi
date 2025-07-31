import { config } from 'dotenv'
config({ path: '.env.local' })

import { dummyPegawai } from '../src/data/users'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

// Validasi environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase credentials are missing in environment variables.')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SALT_ROUNDS = 10

function toRole(role: string): string {
  const map: Record<string, string> = {
    admin: 'ADMIN',
    owner: 'OWNER',
    direktur: 'DIREKTUR',
    manajer: 'MANAJER',
    teknisi: 'TEKNISI',
    karyawan: 'KARYAWAN',
  }
  return map[role.toLowerCase()] || 'KARYAWAN'
}

function toUserStatus(status?: string): string {
  if (!status) return 'AKTIF'
  const s = status.toLowerCase()
  if (s.includes('non')) return 'NONAKTIF'
  if (s.includes('tangguh')) return 'DITANGGUHKAN'
  return 'AKTIF'
}

async function main() {
  console.log('🌱 Start seeding to Supabase...')

  // ✅ Perbaikan di sini
  const { error: deleteError } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('❌ Failed to clear users table:', deleteError.message)
    process.exit(1)
  }

  for (const user of dummyPegawai) {
    const hashedPassword = await bcrypt.hash(`${user.username}123`, SALT_ROUNDS)

    const { error } = await supabase.from('users').insert({
      customid: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || null,
      address: user.address || null,
      birth_date: user.birthDate || null,
      join_date: user.joinDate,
      role: toRole(user.role),
      position: user.position,
      department: user.department,
      image: user.image || null,
      status: toUserStatus(user.status),
      password: hashedPassword,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error(`❌ Failed to insert ${user.username}:`, error.message)
    } else {
      console.log(`✅ Inserted: ${user.username}`)
    }
  }

  console.log('🎉 Done seeding Supabase users!')
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
