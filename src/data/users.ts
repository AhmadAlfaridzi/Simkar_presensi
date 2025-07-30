'use client'

import { UserProfile, UserAccount, User } from '@/types/user'

export const dummyPegawai: UserProfile[] = [
    //admin
    {
    id: 'USR-001',
    name: 'Ahmad Alfaridzi',
    username: 'ahmad_admin',
    email: 'ahmad.alfaridzi@Gmail.com',
    phone: '081234567891',
    address: 'Jl. Sudirman No. 1, Jakarta',
    birthDate: '1985-05-15',
    joinDate: '2020-01-10',
    role: 'ADMIN',
    position: 'System Administrator',
    department: 'IT',
    image: '/images/avatar-admin.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:30:00Z'
  },
  {
    id: 'USR-002',
    name: 'Alam Alfaridzi',
    username: 'alam_admin',
    email: 'alam.alfaridzi@Gmail.com',
    phone: '081234567892',
    address: 'Jl. Thamrin No. 12, Jakarta',
    birthDate: '1978-10-20',
    joinDate: '2018-03-15',
    role: 'ADMIN',
    position: 'IT Administrator',
    department: 'IT',
    image: '/images/avatar-admin2.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-24T09:15:00Z'
  },
  {
    id: 'USR-010',
    name: 'Muhammad Reza Pahlevi',
    username: 'reza_admin',
    email: 'reza.pahlevi@Gmail.com',
    phone: '081234567810',
    birthDate: '1991-07-15',
    joinDate: '2022-03-18',
    role: 'ADMIN',
    position: 'Koordinator IT',
    department: 'IT',
    image: '/images/avatar-it2.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T07:30:00Z'
  },

  // Owner
  {
    id: 'USR-011',
    name: 'Zulfikar',
    username: 'zulfikar_owner',
    email: 'zulfikar@Gmail.com',
    phone: '081234567811',
    address: 'Jl. Mega Kuningan No. 1, Jakarta',
    birthDate: '1975-08-10',
    joinDate: '2015-01-01',
    role: 'OWNER',
    position: 'Pemilik Perusahaan',
    department: 'Manajemen',
    image: '/images/avatar-owner.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T09:00:00Z'
  },

  // Direktur
  {
    id: 'USR-003',
    name: 'Afrizal Daud',
    username: 'afrizal_direktur',
    email: 'afrizal.daud@Gmail.com',
    phone: '081234567893',
    birthDate: '1980-07-22',
    joinDate: '2019-05-18',
    role: 'DIREKTUR',
    position: 'Direktur Utama',
    department: 'Manajemen',
    image: '/images/avatar-director.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T07:45:00Z'
  },

  // Manajer
  {
    id: 'USR-006',
    name: 'Khairul Fahmi',
    username: 'khairul_manajer',
    email: 'khairul.fahmi@Gmail.com',
    phone: '081234567896',
    address: 'Jl. Rasuna Said No. 8, Jakarta',
    birthDate: '1987-04-18',
    joinDate: '2019-11-05',
    role: 'MANAJER',
    position: 'Manajer HRD',
    department: 'HRD',
    image: '/images/avatar-hr.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:15:00Z'
  },

  // Karyawan
  {
    id: 'USR-004',
    name: 'Muhammad Adfal',
    username: 'adfal_karyawan',
    email: 'muhammad.adfal@Gmail.com',
    phone: '081234567894',
    address: 'Jl. Gatot Subroto No. 45, Jakarta',
    birthDate: '1990-03-30',
    joinDate: '2021-02-10',
    role: 'KARYAWAN',
    position: 'Staf Administrasi',
    department: 'HRD',
    image: '/images/avatar-staff1.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:05:00Z'
  },
  {
    id: 'USR-007',
    name: 'Nurul Ahyatul',
    username: 'nurul_karyawan',
    email: 'nurul.ahyatul@Gmail.com',
    phone: '081234567897',
    birthDate: '1992-09-25',
    joinDate: '2022-01-15',
    role: 'KARYAWAN',
    position: 'Staf Keuangan',
    department: 'Keuangan',
    image: '/images/avatar-finance.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:10:00Z'
  },
  {
    id: 'USR-012',
    name: 'Afriandi SE',
    username: 'afriandi_karyawan',
    email: 'afriandi.se@Gmail.com',
    phone: '081234567812',
    address: 'Jl. Kebon Sirih No. 22, Jakarta',
    birthDate: '1989-06-14',
    joinDate: '2021-07-20',
    role: 'KARYAWAN',
    position: 'Analis Keuangan',
    department: 'Keuangan',
    image: '/images/avatar-finance2.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-24T10:20:00Z'
  },
  {
    id: 'USR-013',
    name: 'Ika Maulina Sari',
    username: 'ika_karyawan',
    email: 'ika.sari@Gmail.com',
    phone: '081234567813',
    birthDate: '1993-03-08',
    joinDate: '2022-05-10',
    role: 'KARYAWAN',
    position: 'Staf Marketing',
    department: 'Pemasaran',
    image: '/images/avatar-marketing.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:25:00Z'
  },
  {
    id: 'USR-014',
    name: 'Gita Puspa Rani',
    username: 'gita_karyawan',
    email: 'gita.rani@Gmail.com',
    phone: '081234567814',
    address: 'Jl. Palmerah No. 15, Jakarta',
    birthDate: '1991-11-25',
    joinDate: '2021-09-05',
    role: 'KARYAWAN',
    position: 'Staf Customer Service',
    department: 'Layanan Pelanggan',
    image: '/images/avatar-cs.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:18:00Z'
  },

  // Teknisi
  {
    id: 'USR-005',
    name: 'Mahmudi',
    username: 'mahmudi_teknisi',
    email: 'mahmudi@Gmail.com',
    phone: '081234567895',
    birthDate: '1988-11-12',
    joinDate: '2020-08-22',
    role: 'TEKNISI',
    position: 'Teknisi Senior',
    department: 'Teknik',
    image: '/images/avatar-technician.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-24T13:20:00Z'
  },
  {
    id: 'USR-008',
    name: 'Dedy Rahmat',
    username: 'dedy_teknisi',
    email: 'dedy.rahmat@Gmail.com',
    phone: '081234567898',
    address: 'Jl. Kuningan No. 22, Jakarta',
    birthDate: '1989-12-05',
    joinDate: '2021-06-30',
    role: 'TEKNISI',
    position: 'Teknisi Lab',
    department: 'Laboratorium',
    image: '/images/avatar-lab.jpg',
    status: 'DITANGGUHKAN',
    lastLogin: '2023-11-20T09:00:00Z'
  },
  {
    id: 'USR-015',
    name: 'Muhammad Ridha',
    username: 'ridha_teknisi',
    email: 'muhammad.ridha@Gmail.com',
    phone: '081234567815',
    birthDate: '1990-08-17',
    joinDate: '2022-02-14',
    role: 'TEKNISI',
    position: 'Teknisi Jaringan',
    department: 'IT',
    image: '/images/avatar-network.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T07:45:00Z'
  },
  {
    id: 'USR-016',
    name: 'Faisal Abdullah',
    username: 'faisal_teknisi',
    email: 'faisal.abdullah@Gmail.com',
    phone: '081234567816',
    address: 'Jl. Mampang Prapatan No. 33, Jakarta',
    birthDate: '1987-05-30',
    joinDate: '2020-11-22',
    role: 'TEKNISI',
    position: 'Teknisi Lapangan',
    department: 'Operasional',
    image: '/images/avatar-field-tech.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-24T14:10:00Z'
  },
  {
    id: 'USR-017',
    name: 'Alfahmi',
    username: 'alfahmi_teknisi',
    email: 'alfahmi@Gmail.com',
    phone: '081234567817',
    address: 'Jl. HR Rasuna Said No. 3, Jakarta',
    birthDate: '1983-02-28',
    joinDate: '2020-09-12',
    role: 'TEKNISI',
    position: 'Supervisor Teknik',
    department: 'Teknik',
    image: '/images/avatar-technician2.jpg',
    status: 'AKTIF',
    lastLogin: '2023-11-25T08:20:00Z'
  }
]
// Untuk auth context (hanya field yang diperlukan)
export const authUsers: User[] = dummyPegawai.map(user => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  position: user.position,
  department: user.department,
  image: user.image
}))

// Untuk table view sederhana
export const tablePegawai = dummyPegawai.map(item => ({
  id: item.id,
  name: item.name,
  email: item.email,
  position: item.position,
  department: item.department,
  role: item.role,
  status: item.status
}))

// admin management (dengan data sensitif)
export const dummyAccounts: UserAccount[] = dummyPegawai.map(user => ({
  ...user,
  passwordHash: '$2a$10$' + Math.random().toString(36).substring(2, 12), // Contoh hash dummy
  resetPasswordToken: undefined,
  resetPasswordExpires: undefined
}))