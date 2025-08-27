import { toZonedTime, formatInTimeZone } from "date-fns-tz";

const timeZone = "Asia/Jakarta";

export function nowWIB(): Date {
  return toZonedTime(new Date(), timeZone);
}

export function startOfDayWIB(date: Date): Date {
  const zoned = toZonedTime(date, timeZone);
  zoned.setHours(0, 0, 0, 0);
  return zoned;
}

export function endOfDayWIB(date: Date): Date {
  const zoned = toZonedTime(date, timeZone);
  zoned.setHours(23, 59, 59, 999);
  return zoned;
}

export function formatDateWIB(date: Date, pattern = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, timeZone, pattern);
}

export function formatTimeWIB(date: Date, pattern = "HH:mm:ss"): string {
  return formatInTimeZone(date, timeZone, pattern);
}

export function formatDateTimeWIB(date: Date, pattern = "yyyy-MM-dd HH:mm:ss"): string {
  return formatInTimeZone(date, timeZone, pattern);
}

export function isWeekendWIB(date: Date = nowWIB()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getMonthWIB(date: Date): number {
  const zoned = toZonedTime(date, timeZone);
  return zoned.getMonth();
}