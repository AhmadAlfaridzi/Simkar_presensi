export function nowWIB(): Date {
  return new Date(Date.now() + 7 * 60 * 60 * 1000)
}

export function startOfDayWIB(date: Date): Date {
  const d = new Date(date.getTime())
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function endOfDayWIB(date: Date): Date {
  const d = new Date(date.getTime())
  d.setUTCHours(23, 59, 59, 999)
  return d
}
