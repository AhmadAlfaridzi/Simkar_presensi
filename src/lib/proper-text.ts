import type { UserRole, AttendanceStatus, UserStatus, ApprovalStatus } from '@/types/user';


export const roleToTitleCase: Record<UserRole, string> = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  DIREKTUR: 'Direktur',
  MANAJER: 'Manajer',
  KEPALA_GUDANG: 'Kepala Gudang',
  KEUANGAN: 'Keuangan',
  TEKNISI: 'Teknisi',
  KARYAWAN: 'Karyawan'
};

export const attendanceStatusLabel: Record<AttendanceStatus, string> = {
  TEPAT_WAKTU: 'Tepat Waktu',
  TERLAMBAT: 'Terlambat',
  PULANG_CEPAT: 'Pulang Cepat',
}

export const attendanceStatusColor: Record<AttendanceStatus, string> = {
  TEPAT_WAKTU: 'text-emerald-400',
  TERLAMBAT: 'text-amber-400',
  PULANG_CEPAT: 'text-orange-300',
}

export const UserStatusLabel: Record<UserStatus, string> = {
  AKTIF: 'Aktif',
  NONAKTIF: 'Non Aktif',
  DITANGGUHKAN: 'Ditangguhkan',
}

export const ApprovalStatusLabel: Record<ApprovalStatus, string> = {
  PENDING: 'Aktif',
  DISETUJUI: 'Non Aktif',
  DITOLAK: 'Ditangguhkan',
}
