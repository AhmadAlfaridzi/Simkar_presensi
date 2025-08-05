import type { AttendanceStatus } from './user';

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string | null;
  status: AttendanceStatus;
  employee: Employee;
  photoIn?: string | null;
  photoOut?: string | null;
  barcodeIn?: string | null;
  barcodeOut?: string | null;
  barcodeInAt?: string | null;
  barcodeOutAt?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: string | null;
}
