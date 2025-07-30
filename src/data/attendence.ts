import { AttendanceRecord } from '@/types/attendance'
import { subDays } from 'date-fns'

// const generateEmployee = (id: string, name: string, dept: string, position: string) => ({
//   id, name, department: dept, position
// })
// import { subDays, subHours, addDays } from 'date-fns';

export const dummyAttendance: AttendanceRecord[] = [
  // Ahmad Alfaridzi (USR-001)
  {
    id: '1',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-001',
      name: 'Ahmad Alfaridzi',
      department: 'IT',
      position: 'System Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '2',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:05',
    clockOut: '17:10',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-001',
      name: 'Ahmad Alfaridzi',
      department: 'IT',
      position: 'System Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '3',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '07:55',
    clockOut: '16:50',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-001',
      name: 'Ahmad Alfaridzi',
      department: 'IT',
      position: 'System Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '4',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:30',
    clockOut: '17:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-001',
      name: 'Ahmad Alfaridzi',
      department: 'IT',
      position: 'System Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Alam Alfaridzi (USR-002)
  {
    id: '5',
    date: new Date().toISOString(),
    clockIn: '08:10',
    clockOut: '17:05',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-002',
      name: 'Alam Alfaridzi',
      department: 'IT',
      position: 'IT Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '6',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '16:30',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-002',
      name: 'Alam Alfaridzi',
      department: 'IT',
      position: 'IT Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '7',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:45',
    clockOut: '17:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-002',
      name: 'Alam Alfaridzi',
      department: 'IT',
      position: 'IT Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '8',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-002',
      name: 'Alam Alfaridzi',
      department: 'IT',
      position: 'IT Administrator'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Muhammad Reza Pahlevi (USR-010)
  {
    id: '9',
    date: new Date().toISOString(),
    clockIn: '07:50',
    clockOut: '17:20',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-010',
      name: 'Muhammad Reza Pahlevi',
      department: 'IT',
      position: 'Koordinator IT'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '10',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-010',
      name: 'Muhammad Reza Pahlevi',
      department: 'IT',
      position: 'Koordinator IT'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '11',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-010',
      name: 'Muhammad Reza Pahlevi',
      department: 'IT',
      position: 'Koordinator IT'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '12',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:35',
    clockOut: '17:10',
    status: 'Terlambat',
    employee: {
      id: 'USR-010',
      name: 'Muhammad Reza Pahlevi',
      department: 'IT',
      position: 'Koordinator IT'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Zulfikar (USR-011)
  {
    id: '13',
    date: new Date().toISOString(),
    clockIn: '09:00',
    clockOut: '16:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-011',
      name: 'Zulfikar',
      department: 'Manajemen',
      position: 'Pemilik Perusahaan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '14',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '10:00',
    clockOut: '15:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-011',
      name: 'Zulfikar',
      department: 'Manajemen',
      position: 'Pemilik Perusahaan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '15',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '09:30',
    clockOut: '16:30',
    status: 'Terlambat',
    employee: {
      id: 'USR-011',
      name: 'Zulfikar',
      department: 'Manajemen',
      position: 'Pemilik Perusahaan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Afrizal Daud (USR-003)
  {
    id: '16',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-003',
      name: 'Afrizal Daud',
      department: 'Manajemen',
      position: 'Direktur Utama'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '17',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:05',
    clockOut: '17:05',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-003',
      name: 'Afrizal Daud',
      department: 'Manajemen',
      position: 'Direktur Utama'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '18',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:00',
    clockOut: '16:00',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-003',
      name: 'Afrizal Daud',
      department: 'Manajemen',
      position: 'Direktur Utama'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '19',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '07:45',
    clockOut: '17:15',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-003',
      name: 'Afrizal Daud',
      department: 'Manajemen',
      position: 'Direktur Utama'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Khairul Fahmi (USR-006)
  {
    id: '20',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-006',
      name: 'Khairul Fahmi',
      department: 'HRD',
      position: 'Manajer HRD'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '21',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:30',
    clockOut: '17:30',
    status: 'Terlambat',
    employee: {
      id: 'USR-006',
      name: 'Khairul Fahmi',
      department: 'HRD',
      position: 'Manajer HRD'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '22',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-006',
      name: 'Khairul Fahmi',
      department: 'HRD',
      position: 'Manajer HRD'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '23',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-006',
      name: 'Khairul Fahmi',
      department: 'HRD',
      position: 'Manajer HRD'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Muhammad Adfal (USR-004)
  {
    id: '24',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-004',
      name: 'Muhammad Adfal',
      department: 'HRD',
      position: 'Staf Administrasi'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '25',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:15',
    clockOut: '17:15',
    status: 'Terlambat',
    employee: {
      id: 'USR-004',
      name: 'Muhammad Adfal',
      department: 'HRD',
      position: 'Staf Administrasi'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '26',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '07:55',
    clockOut: '17:05',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-004',
      name: 'Muhammad Adfal',
      department: 'HRD',
      position: 'Staf Administrasi'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '27',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:00',
    clockOut: '16:30',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-004',
      name: 'Muhammad Adfal',
      department: 'HRD',
      position: 'Staf Administrasi'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Nurul Ahyatul (USR-007)
  {
    id: '28',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-007',
      name: 'Nurul Ahyatul',
      department: 'Keuangan',
      position: 'Staf Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '29',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-007',
      name: 'Nurul Ahyatul',
      department: 'Keuangan',
      position: 'Staf Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '30',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-007',
      name: 'Nurul Ahyatul',
      department: 'Keuangan',
      position: 'Staf Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '31',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:25',
    clockOut: '17:05',
    status: 'Terlambat',
    employee: {
      id: 'USR-007',
      name: 'Nurul Ahyatul',
      department: 'Keuangan',
      position: 'Staf Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '32',
    date: subDays(new Date(), 6).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-007',
      name: 'Nurul Ahyatul',
      department: 'Keuangan',
      position: 'Staf Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Afriandi SE (USR-012)
  {
    id: '33',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-012',
      name: 'Afriandi SE',
      department: 'Keuangan',
      position: 'Analis Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '34',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '07:45',
    clockOut: '17:15',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-012',
      name: 'Afriandi SE',
      department: 'Keuangan',
      position: 'Analis Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '35',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:30',
    clockOut: '17:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-012',
      name: 'Afriandi SE',
      department: 'Keuangan',
      position: 'Analis Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '36',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:00',
    clockOut: '16:00',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-012',
      name: 'Afriandi SE',
      department: 'Keuangan',
      position: 'Analis Keuangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Ika Maulina Sari (USR-013)
  {
    id: '37',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-013',
      name: 'Ika Maulina Sari',
      department: 'Pemasaran',
      position: 'Staf Marketing'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '38',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:20',
    clockOut: '17:10',
    status: 'Terlambat',
    employee: {
      id: 'USR-013',
      name: 'Ika Maulina Sari',
      department: 'Pemasaran',
      position: 'Staf Marketing'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '39',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-013',
      name: 'Ika Maulina Sari',
      department: 'Pemasaran',
      position: 'Staf Marketing'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '40',
    date: subDays(new Date(), 6).toISOString(),
    clockIn: '07:55',
    clockOut: '17:05',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-013',
      name: 'Ika Maulina Sari',
      department: 'Pemasaran',
      position: 'Staf Marketing'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Gita Puspa Rani (USR-014)
  {
    id: '41',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-014',
      name: 'Gita Puspa Rani',
      department: 'Layanan Pelanggan',
      position: 'Staf Customer Service'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '42',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-014',
      name: 'Gita Puspa Rani',
      department: 'Layanan Pelanggan',
      position: 'Staf Customer Service'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '43',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:35',
    clockOut: '17:05',
    status: 'Terlambat',
    employee: {
      id: 'USR-014',
      name: 'Gita Puspa Rani',
      department: 'Layanan Pelanggan',
      position: 'Staf Customer Service'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '44',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:00',
    clockOut: '16:30',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-014',
      name: 'Gita Puspa Rani',
      department: 'Layanan Pelanggan',
      position: 'Staf Customer Service'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Mahmudi (USR-005)
  {
    id: '45',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-005',
      name: 'Mahmudi',
      department: 'Teknik',
      position: 'Teknisi Senior'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '46',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '07:45',
    clockOut: '17:15',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-005',
      name: 'Mahmudi',
      department: 'Teknik',
      position: 'Teknisi Senior'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '47',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:30',
    clockOut: '17:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-005',
      name: 'Mahmudi',
      department: 'Teknik',
      position: 'Teknisi Senior'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '48',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-005',
      name: 'Mahmudi',
      department: 'Teknik',
      position: 'Teknisi Senior'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '49',
    date: subDays(new Date(), 6).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-005',
      name: 'Mahmudi',
      department: 'Teknik',
      position: 'Teknisi Senior'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Dedy Rahmat (USR-008)
  {
    id: '50',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-008',
      name: 'Dedy Rahmat',
      department: 'Laboratorium',
      position: 'Teknisi Lab'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '51',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:15',
    clockOut: '17:15',
    status: 'Terlambat',
    employee: {
      id: 'USR-008',
      name: 'Dedy Rahmat',
      department: 'Laboratorium',
      position: 'Teknisi Lab'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '52',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:00',
    clockOut: '16:30',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-008',
      name: 'Dedy Rahmat',
      department: 'Laboratorium',
      position: 'Teknisi Lab'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '53',
    date: subDays(new Date(), 7).toISOString(),
    clockIn: '07:50',
    clockOut: '17:10',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-008',
      name: 'Dedy Rahmat',
      department: 'Laboratorium',
      position: 'Teknisi Lab'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Muhammad Ridha (USR-015)
  {
    id: '54',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-015',
      name: 'Muhammad Ridha',
      department: 'IT',
      position: 'Teknisi Jaringan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '55',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-015',
      name: 'Muhammad Ridha',
      department: 'IT',
      position: 'Teknisi Jaringan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '56',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:25',
    clockOut: '17:05',
    status: 'Terlambat',
    employee: {
      id: 'USR-015',
      name: 'Muhammad Ridha',
      department: 'IT',
      position: 'Teknisi Jaringan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '57',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-015',
      name: 'Muhammad Ridha',
      department: 'IT',
      position: 'Teknisi Jaringan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '58',
    date: subDays(new Date(), 6).toISOString(),
    clockIn: '07:55',
    clockOut: '17:05',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-015',
      name: 'Muhammad Ridha',
      department: 'IT',
      position: 'Teknisi Jaringan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Faisal Abdullah (USR-016)
  {
    id: '59',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-016',
      name: 'Faisal Abdullah',
      department: 'Operasional',
      position: 'Teknisi Lapangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '60',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-016',
      name: 'Faisal Abdullah',
      department: 'Operasional',
      position: 'Teknisi Lapangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '61',
    date: subDays(new Date(), 3).toISOString(),
    clockIn: '08:30',
    clockOut: '17:00',
    status: 'Terlambat',
    employee: {
      id: 'USR-016',
      name: 'Faisal Abdullah',
      department: 'Operasional',
      position: 'Teknisi Lapangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '62',
    date: subDays(new Date(), 5).toISOString(),
    clockIn: '08:00',
    clockOut: '16:30',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-016',
      name: 'Faisal Abdullah',
      department: 'Operasional',
      position: 'Teknisi Lapangan'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },

  // Alfahmi (USR-017)
  {
    id: '63',
    date: new Date().toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-017',
      name: 'Alfahmi',
      department: 'Teknik',
      position: 'Supervisor Teknik'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '64',
    date: subDays(new Date(), 1).toISOString(),
    clockIn: '07:45',
    clockOut: '17:15',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-017',
      name: 'Alfahmi',
      department: 'Teknik',
      position: 'Supervisor Teknik'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '65',
    date: subDays(new Date(), 2).toISOString(),
    clockIn: '08:00',
    clockOut: '17:00',
    status: 'Tepat Waktu',
    employee: {
      id: 'USR-017',
      name: 'Alfahmi',
      department: 'Teknik',
      position: 'Supervisor Teknik'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '66',
    date: subDays(new Date(), 4).toISOString(),
    clockIn: '08:20',
    clockOut: '17:10',
    status: 'Terlambat',
    employee: {
      id: 'USR-017',
      name: 'Alfahmi',
      department: 'Teknik',
      position: 'Supervisor Teknik'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  },
  {
    id: '67',
    date: subDays(new Date(), 6).toISOString(),
    clockIn: '08:00',
    clockOut: '16:45',
    status: 'Pulang Cepat',
    employee: {
      id: 'USR-017',
      name: 'Alfahmi',
      department: 'Teknik',
      position: 'Supervisor Teknik'
    },
    photoIn: '/images/placeholder-user.jpg',
    photoOut: '/images/placeholder-user.jpg'
  }
];