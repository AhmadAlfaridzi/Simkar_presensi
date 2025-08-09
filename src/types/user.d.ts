export type UserRole = 'ADMIN' | 'OWNER' | 'DIREKTUR' | 'MANAJER' | 'KARYAWAN' | 'TEKNISI' | 'KEUANGAN' | 'KEPALA_GUDANG';
export type UserStatus = 'AKTIF' | 'NONAKTIF' | 'DITANGGUHKAN';
export type AttendanceStatus = 'TEPAT_WAKTU' | 'TERLAMBAT' | 'TIDAK_HADIR';
export type ApprovalStatus = 'PENDING' | 'DISETUJUI' | 'DITOLAK';

export interface KaryawanProfile {
  id: string;
  customId: string;
  name: string;
  nip?: string;
  nik?: string;
  npwp?: string;
  emailPribadi?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  tempatLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  joinDate: string;
  position: string;
  department: string;
  pendidikan?: string;
  golongan?: string;
  image?: string;
  kontakDarurat?: string;
  hubunganDarurat?: string;
  status: UserStatus;
  lastLogin?: string;
}

export interface UserAccount {
  id: string;
  customId: string;
  username: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  karyawan?: KaryawanProfile;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface ProfileChangeRequest {
  id: string;
  userId: string;
  field: string;
  oldValue: string;
  newValue: string;
  requestedAt: string;
  approvedBy?: string;
  approvalStatus: ApprovalStatus;
  approvalNotes?: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  loginTime: string;
  ipAddress: string;
  device: string;
  location?: string;
  status: 'Success' | 'Failed';
  failureReason?: string;
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  items?: SubMenuItem[];
  allowedRoles: UserRole[];
}

export interface SubMenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  allowedRoles?: UserRole[];
}
