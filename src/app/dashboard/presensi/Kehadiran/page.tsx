'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import AttendanceCard from '@/components/Presensi/attendanceCard'
import AttendanceModal from '@/components/Presensi/attendanceModal'
import UserInfo from '@/components/Presensi/userInfo'

export default function AbsenPage() {
  const { user } = useAuth()
  // const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'masuk' | 'pulang'>('masuk')
  const [attendanceTime, setAttendanceTime] = useState('')
  const [attendancePhoto, setAttendancePhoto] = useState<string | null>(null)
  const [attendanceLocation, setAttendanceLocation] = useState<string | null>(null)

    const handlePhotoTaken = (photo: string, locationName: string | null) => {
      setAttendancePhoto(photo)
      setAttendanceLocation(locationName)
    }

    //  const handleScanSuccess = (decodedText: string) => {
    //   console.log('QR Code scanned:', decodedText)
    //   handleSubmitAttendance()
    //  }

  const [currentDate] = useState(new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }))

  const [realTime, setRealTime] = useState(
    new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const openAttendanceModal = (type: 'masuk' | 'pulang') => {
    setModalType(type)
    setAttendanceTime(new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }))
    setIsModalOpen(true)
  }

  const handleSubmitAttendance = async () => {
  if (!user) return

  try {
    const isMasuk = modalType === 'masuk'

    const updateFields = isMasuk
      ? {
          date: new Date().toISOString().split('T')[0], // format: YYYY-MM-DD
          clockIn: attendanceTime,
          photoIn: attendancePhoto,
          latitude: null, 
          longitude: null,
          location: attendanceLocation,
          status: 'TEPAT_WAKTU', 
        }
      : {
          clockOut: attendanceTime,
          photoOut: attendancePhoto,
          location: attendanceLocation,
        }

    const { data: existing, error: fetchError } = await supabase
      .from('Attendance')
      .select('id_at')
      .eq('userId', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existing) {
      // update clockOut jika record sudah ada (absen pulang)
      const { error: updateError } = await supabase
        .from('Attendance')
        .update(updateFields)
        .eq('id_at', existing.id_at)

      if (updateError) throw updateError
    } else {
      // insert baru jika record belum ada (absen masuk)
      const { error: insertError } = await supabase.from('Attendance').insert({
        id_at: crypto.randomUUID(), // atau biarkan Supabase generate otomatis jika pakai default
        userId: user.customId,
        ...updateFields
      })

      if (insertError) throw insertError
    }
  } catch (err: unknown) {
     if (err instanceof Error) {
    console.error('Login error:', err.message)
  } else {
    console.error('Unknown error:', err)
  }
  } finally {
    setIsModalOpen(false)
    setAttendancePhoto(null)
    setAttendanceLocation(null)
  }
}

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FBF991]" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6 bg-[#1a1a1a]  text-white"
    >

      <UserInfo 
        user={user} 
        realTime={realTime} 
        currentDate={currentDate} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AttendanceCard 
          type="masuk" 
          onClick={() => openAttendanceModal('masuk')} 
          scheduleTime="08:00"
        />
        <AttendanceCard 
          type="pulang" 
          onClick={() => openAttendanceModal('pulang')} 
          scheduleTime="17:00"
        />
      </div>

      <AttendanceModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        type={modalType}
        userName={user.name}
        attendanceTime={attendanceTime}
        onPhotoTaken={handlePhotoTaken}
        onSubmit={handleSubmitAttendance}
        // onScanSuccess={handleScanSuccess}
      />
    </motion.div>
  )
}