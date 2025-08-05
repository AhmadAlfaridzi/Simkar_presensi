'use client'
import { AttendanceStatus } from '@prisma/client'
import { useAuth } from '@/context/authContext'
import { redirect } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GenericTable } from '@/components/Common/genericTable'
import { ColumnDef } from '@tanstack/react-table'
import { dummyAttendance } from '@/data/attendence'
import { isToday } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AttendanceRecord } from '@/types/attendance'
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { AttendanceDetailModal } from '@/components/Common/attendanceDetailModal'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/Common/pageHeader'
import { usePageMetadata } from '@/context/pageMetadataContext'
import { attendanceStatusLabel } from '@/types/proper-text'

const calculateStats = (attendanceData: AttendanceRecord[]) => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = attendanceData.filter(record => record.date.includes(today))
  const uniqueEmployees = new Set(attendanceData.map(record => record.employee.id)).size

  return {
    totalKaryawan: uniqueEmployees,
    tepatWaktu: todayRecords.filter(r => r.status === AttendanceStatus.TEPAT_WAKTU).length,
    terlambat: todayRecords.filter(r => r.status === AttendanceStatus.TERLAMBAT).length,
    tidakHadir: uniqueEmployees - todayRecords.length
  }
}

const attendanceData = [
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

export default function Page() {
  const { user } = useAuth()
  const { setMetadata } = usePageMetadata()
  const dashboardStats = calculateStats(dummyAttendance)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

  useEffect(() => {
    setMetadata({
      title: 'Dashboard',
      breadcrumbs: [
        { label: 'Home', href: '/dashboard' },
        { label: 'Dashboard' }
      ]
    })
  }, [setMetadata])

  if (!user) redirect('/login')

  const todayAttendance = dummyAttendance.filter(record => isToday(new Date(record.date)))

  const todayAttendanceColumns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorFn: (row) => row.employee.name,
      id: 'employeeName',
      header: 'Nama Karyawan',
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>
    },
    {
      accessorFn: (row) => row.employee.department,
      id: 'department',
      header: 'Departemen'
    },
    {
      accessorKey: 'clockIn',
      header: 'Jam Masuk',
      cell: ({ row }) => row.getValue('clockIn') || '-'
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
        else if (status === AttendanceStatus.PULANG_CEPAT) color = 'text-orange-300'
          return <span className={`${color} font-medium`}>{label}</span>
        }
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
      )
    }
  ]
  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox title="Total Karyawan" value={dashboardStats.totalKaryawan} color="blue" Icon={Users} />
        <StatBox title="Tepat Waktu" value={dashboardStats.tepatWaktu} color="green" Icon={CheckCircle2} />
        <StatBox title="Terlambat" value={dashboardStats.terlambat} color="yellow" Icon={Clock} />
        <StatBox title="Tidak Hadir" value={dashboardStats.tidakHadir} color="red" Icon={XCircle} />
      </div>

      {/* Bar chart */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Grafik Kehadiran Karyawan</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
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

      {/* Absensi Hari Ini */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Absensi Hari Ini</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent border-[#2e2e2e] text-gray-300 hover:bg-[#252525] hover:text-white px-4 py-2 text-sm">Ekspor Data</Button>
            <Link href="/dashboard/riwayat-absensi" passHref>
              <Button variant="outline" className="bg-transparent border-[#2e2e2e] text-gray-300 hover:bg-[#252525] hover:text-white px-4 py-2 text-sm">Lihat Semua</Button>
            </Link>
          </div>
        </div>
        <GenericTable<AttendanceRecord>
          columns={todayAttendanceColumns}
          data={todayAttendance}
          noDataMessage="Tidak ada data absensi hari ini"
          showPagination={todayAttendance.length > 5}
          pageSize={5}
        />
        <AttendanceDetailModal
          record={selectedRecord}
          onOpenChange={(open) => !open && setSelectedRecord(null)}
        />
      </div>
    </div>
  )
}

function StatBox({ title, value, subtitle, color, Icon }: { title: string; value: number; subtitle?: string; color: 'blue' | 'green' | 'yellow' | 'red'; Icon: React.ElementType }) {
  const colors: Record<'blue' | 'green' | 'yellow' | 'red', string> = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500',
    green: 'text-green-400 bg-green-500/20 border-green-500',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500',
    red: 'text-red-400 bg-red-500/20 border-red-500'
  }

  return (
    <div className={`bg-[#1a1a1a] p-4 rounded-lg border-l-4 shadow ${colors[color]} hover:shadow-md hover:shadow-${color}-500/30 transition-shadow duration-300`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br from-${color}-500/20 to-${color}-600/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
      </div>
    </div>
  )
}