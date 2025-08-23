'use client'

import { useState, useEffect } from 'react'
import { AttendanceRecord } from '@/types/attendance'
import { AttendanceStatus } from '@prisma/client'
import { GenericTable } from '@/components/Common/genericTable'
import { ColumnDef } from '@tanstack/react-table'
import { isToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { AttendanceDetailModal } from '@/components/Common/attendanceDetailModal'
import { PageHeader } from '@/components/Common/pageHeader'
import { useAuth } from '@/context/authContext'
import { redirect } from 'next/navigation'
import { usePageMetadata } from '@/context/pageMetadataContext'
import { attendanceStatusLabel } from '@/lib/proper-text'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMobile } from '@/hooks/use-mobile'

interface Props {
  initialAttendance: AttendanceRecord[]
  initialEmployees: { id: string; name: string; department?: string; position?: string }[]
}

const calculateStats = (attendanceData: AttendanceRecord[], totalKaryawan: number) => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = attendanceData.filter(record => record.date.includes(today))

  // Gunakan Map untuk deduplikasi user
  const userStatusMap = new Map<string, AttendanceStatus>()
  todayRecords.forEach(record => {
    if (!userStatusMap.has(record.userId)) {
      userStatusMap.set(record.userId, record.status)
    }
  })

  const statuses = Array.from(userStatusMap.values())

  return {
    totalKaryawan,
    tepatWaktu: statuses.filter(s => s === AttendanceStatus.TEPAT_WAKTU).length,
    terlambat: statuses.filter(s => s === AttendanceStatus.TERLAMBAT).length,
    tidakHadir: statuses.filter(s => s === AttendanceStatus.TIDAK_HADIR).length,
  }
}

export default function DashboardClient({ initialAttendance, initialEmployees }: Props) {
  const { user } = useAuth()
  const { setMetadata } = usePageMetadata()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance)
  const [allEmployees, setAllEmployees] = useState(initialEmployees)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const isMobile = useMobile()

  const attendanceDataY = [
    { name: 'Jan', hadir: 45, terlambat: 5, tidakHadir: 2 },
    { name: 'Feb', hadir: 42, terlambat: 8, tidakHadir: 3 },
    { name: 'Mar', hadir: 48, terlambat: 2, tidakHadir: 1 },
    { name: 'Apr', hadir: 42, terlambat: 8, tidakHadir: 3 },
    { name: 'Mei', hadir: 48, terlambat: 2, tidakHadir: 1 },
    { name: 'Jun', hadir: 45, terlambat: 5, tidakHadir: 2 },
    { name: 'Jul', hadir: 42, terlambat: 8, tidakHadir: 3 },
    { name: 'Agu', hadir: 48, terlambat: 2, tidakHadir: 1 },
    { name: 'Sep', hadir: 42, terlambat: 8, tidakHadir: 3 },
    { name: 'Okt', hadir: 48, terlambat: 2, tidakHadir: 1 },
    { name: 'Nov', hadir: 48, terlambat: 2, tidakHadir: 1 },
    { name: 'Des', hadir: 42, terlambat: 8, tidakHadir: 3 },
  ]

 const attendanceDataM = [
    { name: '1 Apr', hadir: 2, terlambat: 0, tidakHadir: 1 },
    { name: '2 Apr', hadir: 4, terlambat: 1, tidakHadir: 0 },
    { name: '3 Apr', hadir: 3, terlambat: 2, tidakHadir: 0 },
    { name: '4 Apr', hadir: 5, terlambat: 0, tidakHadir: 0 },
 ]

  useEffect(() => {
    setMetadata({
      title: 'Dashboard',
      breadcrumbs: [
        { label: 'Home', href: '/dashboard' },
        { label: 'Dashboard' }
      ]
    })
  }, [setMetadata])

  useEffect(() => {
    async function fetchLatestData() {
      setLoading(true)
      try {
        const today = new Date().toISOString().split('T')[0]
        const [attendanceRes, employeesRes] = await Promise.all([
          fetch(`/api/attendance?date=${today}`, { cache: 'no-store' }),
          fetch('/api/karyawan', { cache: 'no-store' }),
        ])

        if (!attendanceRes.ok || !employeesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const attendanceData = await attendanceRes.json() as AttendanceRecord[]
        const employeesData = await employeesRes.json()

        setAttendanceRecords(attendanceData)
        setAllEmployees(employeesData)
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }

    const interval = setInterval(fetchLatestData, 100000)

    return () => clearInterval(interval)
  }, [])

  if (!user) redirect('/login')
  
  const filteredEmployees = allEmployees.filter(emp => emp.position !== 'Owner')
  const filteredAttendance = attendanceRecords.filter(att => att.userId !== 'OWNER')

  const dashboardStats = calculateStats(filteredAttendance, filteredEmployees.length)
  const todayAttendance = filteredAttendance.filter(record => isToday(new Date(record.date)))

  const todayAttendanceColumns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorFn: (row) => row.karyawan?.name ?? '-',
      id: 'karyawanName',
      header: 'Nama Karyawan',
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
    },
    {
      accessorFn: (row) => row.karyawan?.department ?? '-',
      id: 'department',
      header: 'Departemen',
    },
    {
      accessorKey: 'clockIn',
      header: 'Jam Masuk',
      cell: ({ row }) => row.getValue('clockIn') || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as AttendanceStatus
        const label = attendanceStatusLabel[status]
        let color = 'text-gray-400'
        if (status === AttendanceStatus.TEPAT_WAKTU) color = 'text-emerald-400'
        else if (status === AttendanceStatus.TERLAMBAT) color = 'text-amber-400'
        else if (status === AttendanceStatus.TIDAK_HADIR) color = 'text-orange-300'
        return <span className={`${color} font-medium`}>{label}</span>
      },
    },
    {
      id: 'actions',
      header: 'Detail',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3"
          onClick={() => setSelectedRecord(row.original)}
        >
          Lihat Detail
        </Button>
      ),
    },
  ]

  return (
   <div className="max-w-full px-4 sm:px-4 md:px-6 lg:px-8 mx-auto space-y-5 border-white/10 min-h-screen">
       {!isMobile && <PageHeader />}
        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 w-full overflow-hidden ">
            <StatBox title="Total Karyawan" value={dashboardStats.totalKaryawan} color="blue" Icon={Users} />
            <StatBox title="Tepat Waktu" value={dashboardStats.tepatWaktu} color="green" Icon={CheckCircle2} />
            <StatBox title="Terlambat" value={dashboardStats.terlambat} color="yellow" Icon={Clock} />
            <StatBox title="Tidak Hadir" value={dashboardStats.tidakHadir} color="red" Icon={XCircle} />
        </div>
        
        {/* Grafik Kehadiran */}
      <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow mt-6 w-full overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Grafik Kehadiran Karyawan</h2>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={isMobile ? attendanceDataM  : attendanceDataY }>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#2d3748' }} itemStyle={{ color: '#a0aec0' }} />
                    <Legend />
                    <Bar dataKey="hadir" fill="#48bb78" name="Hadir" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="terlambat" fill="#ecc94b" name="Terlambat" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tidakHadir" fill="#f56565" name="Tidak Hadir" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        </div>

        {/* Tabel Absensi Hari Ini */}
        
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow w-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Absensi Hari Ini</h2>
                <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent border-[#2e2e2e] text-gray-300 hover:bg-[#252525] hover:text-white px-4 py-2 text-sm">
                    Ekspor Data
                </Button>
                <Link href="/dashboard/riwayat-absensi" passHref>
                    <Button variant="outline" className="bg-transparent border-[#2e2e2e] text-gray-300 hover:bg-[#252525] hover:text-white px-4 py-2 text-sm">
                    Lihat Semua
                    </Button>
                </Link>
                </div>
            </div>

          <div className="overflow-x-auto">
            <GenericTable<AttendanceRecord>
            columns={todayAttendanceColumns}
            data={todayAttendance}
            noDataMessage="Tidak ada data absensi hari ini"
            showPagination={todayAttendance.length > 5}
            pageSize={5}
            isLoading={loading}
            />
         </div>
         <AttendanceDetailModal record={selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)} />
        </div>
    </div>
  )
}

function StatBox({ title, value, subtitle, color, Icon }: { title: string; value: number; subtitle?: string; color: 'blue' | 'green' | 'yellow' | 'red'; Icon: React.ElementType }) {
  const colors: Record<'blue' | 'green' | 'yellow' | 'red', string> = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500',
    green: 'text-green-400 bg-green-500/20 border-green-500',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500',
    red: 'text-red-400 bg-red-500/20 border-red-500',
  }

  return (
    <div
      className={`bg-[#1a1a1a] p-4 rounded-lg border-l-4 shadow ${colors[color]} hover:shadow-md hover:shadow-${color}-500/30 transition-shadow duration-300`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm sm:text-base">{title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">{value}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br from-${color}-500/20 to-${color}-600/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
      </div>
    </div>
  )
}
