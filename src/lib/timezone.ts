export function nowWIB(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; 
  return new Date(utc + 7 * 60 * 60 * 1000); 
}

export function startOfDayWIB(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); 
  return d;
}

export function endOfDayWIB(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999); 
  return d;
}
