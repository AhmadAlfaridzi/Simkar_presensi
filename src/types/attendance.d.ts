import type { AttendanceStatus, KaryawanProfile } from './user';

export interface AttendanceRecord {
  id_at: string;
  userId: string;
  date: string;
  clockIn: string;
  clockOut?: string | null;
  status: AttendanceStatus;

<<<<<<< HEAD
=======
  kantorId?: string | null; 
  lokasiId?: string | null;
>>>>>>> presensi
  photoIn?: string | null;
  photoOut?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: string | null;
  barcodeIn?: string | null;
  barcodeOut?: string | null;
  barcodeInAt?: string | null;
  barcodeOutAt?: string | null;
  createdAt?: string | null;

 karyawan?: KaryawanProfile | null;
}
