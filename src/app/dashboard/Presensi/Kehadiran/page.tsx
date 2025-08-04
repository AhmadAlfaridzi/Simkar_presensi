'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext'

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

  const handlePhotoTaken = (photo: string) => {
      setAttendancePhoto(photo)
    }
     const handleScanSuccess = (decodedText: string) => {
    console.log('QR Code scanned:', decodedText)
      handleSubmitAttendance()
     }

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

  const handleSubmitAttendance = () => {
    console.log({
      userId: user?.id,
      type: modalType,
      time: attendanceTime,
      photo: attendancePhoto,
      date: new Date().toISOString()
    })
    setIsModalOpen(false)
    setAttendancePhoto(null)
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
        onScanSuccess={handleScanSuccess}
      />
    </motion.div>
  )
}