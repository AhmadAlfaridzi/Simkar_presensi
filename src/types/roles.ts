
import type { UserRole } from '@/types/user'; 

export const roleToTitleCase: Record<UserRole, string> = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  DIREKTUR: 'Direktur',
  MANAJER: 'Manajer',
  KARYAWAN: 'Karyawan',
  TEKNISI: 'Teknisi'
};