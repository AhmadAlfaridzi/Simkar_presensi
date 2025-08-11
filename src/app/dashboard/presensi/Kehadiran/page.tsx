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
  const [attendanceLocation, setAttendanceLocation] = useState<string | null>(null)

  const [geoCoords, setGeoCoords] = useState<{latitude: number, longitude: number} | null>(null)

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

  const requestLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        { timeout: 10000 } 
      )
    })
  }
  
  const openAttendanceModal = async (type: 'masuk' | 'pulang') => {
    setModalType(type)
    setAttendanceTime(new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }))

    try {
      const coords = await requestLocation()
      setGeoCoords(coords)
      setAttendanceLocation(`Lat: ${coords.latitude.toFixed(5)}, Lon: ${coords.longitude.toFixed(5)}`)
    } catch (error) {
          setGeoCoords(null)
      setAttendanceLocation(null)
      console.warn('Failed to get location:', error)
    }

    setIsModalOpen(true)
  }

  const handleSubmitAttendance = async () => {
    if (!user) return;

    try {
      const isMasuk = modalType === 'masuk';

      const attendancePayload = isMasuk
        ? {
            userId: user.customId,
            date: new Date().toISOString(),
            clockIn: attendanceTime,
            clockOut: null,
            status: 'TEPAT_WAKTU',
            photoIn: attendancePhoto,
            photoOut: null,
            latitude: geoCoords?.latitude ?? null,
            longitude: geoCoords?.longitude ?? null,
            location: attendanceLocation,
          }
        : {
            userId: user.customId,
            date: new Date().toISOString(),
            clockIn: null,
            clockOut: attendanceTime,
            status: 'TEPAT_WAKTU',
            photoIn: null,
            photoOut: attendancePhoto,
            latitude: geoCoords?.latitude ?? null,
            longitude: geoCoords?.longitude ?? null,
            location: attendanceLocation,
          };
          const response = await fetch('/api/presensi/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendancePayload),
          });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit attendance');
      }

      const result = await response.json();
      console.log('Attendance saved:', result);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error submitting attendance:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    } finally {
      setIsModalOpen(false);
      setAttendancePhoto(null);
      setAttendanceLocation(null);
      setGeoCoords(null)
    }
  };


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
        userName={user.username}
        attendanceTime={attendanceTime}
        onPhotoTaken={handlePhotoTaken}
        onSubmit={handleSubmitAttendance}
        // onScanSuccess={handleScanSuccess}
      />
    </motion.div>
  )
}