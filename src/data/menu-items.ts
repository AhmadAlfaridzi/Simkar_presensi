import { UserRole } from '@/types/user';

export interface MenuItem {
  name: string;
  href: string;
  icon?: string;
  items: {
    name: string;
    href: string;
    icon?: string;
    allowedRoles?: UserRole[];
  }[];
  allowedRoles: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
    items: [],
    allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER', 'KARYAWAN']
  },
  {
    name: 'Presensi',
    icon: 'CalendarCheck',
    href: '/dashboard/presensi',
    items: [
      { 
        name: 'Absen', 
        icon: 'LogIn',
        href: '/dashboard/presensi/absen', 
        allowedRoles: ['DIREKTUR', 'MANAJER', 'KARYAWAN', 'TEKNISI','ADMIN']
      },
      { 
        name: 'History', 
        icon: 'History',
        href: '/dashboard/presensi/history',
        allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER','TEKNISI','KARYAWAN']
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KARYAWAN', 'TEKNISI']
  },
  {
    name: 'Riwayat Absensi',
    icon: 'History',
    href: '/dashboard/riwayat-absensi',
    items: [],
    allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER']
  },
  {
    name: 'Surat Keluar',
    icon: 'Mail',
    href: '/dashboard/surat-keluar',
    items: [],
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Pegawai',
    icon: 'Users',
    href: '/dashboard/pegawai',
    items: [],
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Inventory',
    icon: 'Box',
    href: '/dashboard/inventory',
    items: [
      { 
        name: 'Alat Kalibrasi', 
        icon: 'Wrench',
        href: '/dashboard/inventory/alat-kalibrasi', 
        allowedRoles: ['ADMIN', 'DIREKTUR', 'TEKNISI']
      },
      { 
        name: 'Sparepart', 
        icon: 'Package',
        href: '/dashboard/inventory/spare-part', 
        allowedRoles: ['ADMIN', 'TEKNISI']
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'TEKNISI']
  },
  {
    name: 'Pengaturan Sistem',
    icon: 'Settings',
    href: '/dashboard/pengaturan',
    items: [],
    allowedRoles: ['ADMIN']
  },
];