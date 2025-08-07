import type { UserRole } from '@/types/user';

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