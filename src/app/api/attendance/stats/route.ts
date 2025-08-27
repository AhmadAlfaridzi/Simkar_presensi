import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMonthWIB } from '@/lib/timezone'

export async function GET() {
  try {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)

    const attendances = await prisma.attendance.findMany({
      where: { date: { gte: startOfYear, lte: endOfYear } },
      include: { user: { include: { karyawan: true } } },
    })

    const stats: Record<number, { hadir: number; terlambat: number; tidakHadir: number }> = {}
    for (let m = 0; m < 12; m++) stats[m] = { hadir: 0, terlambat: 0, tidakHadir: 0 }
    
    attendances.forEach(a => {
        try {
            const month = getMonthWIB(new Date(a.date)) 
            if (a.status === 'TEPAT_WAKTU') stats[month].hadir++
            else if (a.status === 'TERLAMBAT') stats[month].terlambat++
            else if (a.status === 'TIDAK_HADIR') stats[month].tidakHadir++
        } catch (err) {
            console.error('Error processing attendance record', a, err)
        }
    })
    console.log('Attendances fetched:', attendances)
    const data = Object.keys(stats).map(k => ({
      name: new Date(0, Number(k)).toLocaleString('id', { month: 'short' }),
      ...stats[Number(k)]
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}