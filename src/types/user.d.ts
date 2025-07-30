  
  export type UserRole = 'ADMIN' | 'OWNER' | 'DIREKTUR' | 'MANAJER' | 'KARYAWAN' | 'TEKNISI';
  export type UserStatus = 'AKTIF' | 'NONAKTIF' | 'DITANGGUHKAN';
  export type ApprovalStatus = 'Pending' | 'Disetujui' | 'Ditolak';
  export type AttendanceStatus = 'Tepat Waktu' | 'Terlambat' | 'Pulang Cepat';

  export interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    joinDate: string;
    role: UserRole;
    position: string;
    department: string;
    image?: string;
    status: UserStatus;
    lastLogin?: string;
  }

  export interface UserAccount extends UserProfile {
    passwordHash?: string;
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

  export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    position?: string;
    department?: string;
    image?: string;
  }

  export interface AttendanceRecord {
    id: string;
    userId: string;
    date: string;
    clockIn: string;
    clockOut: string | null;
    status: AttendanceStatus;
    photoIn?: string | null;
    photoOut?: string | null;
    employee?: { 
      id: string;
      name: string;
      department: string;
      position: string;
    };
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
    items: {
      name: string;
      href: string;
      icon?: React.ReactNode;
      allowedRoles?: UserRole[];
    }[];
    allowedRoles: UserRole[];
  }

  export interface SubMenuItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
    allowedRoles?: UserRole[];
  }



