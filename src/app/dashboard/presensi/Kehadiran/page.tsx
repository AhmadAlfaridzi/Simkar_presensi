'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { motion } from 'framer-motion'
import AttendanceCard from '@/components/Presensi/attendanceCard'
import AttendanceModal from '@/components/Presensi/attendanceModal'
import UserInfo from '@/components/Presensi/userInfo'
import type { LokasiType } from '@/types/location'

export default function AbsenPage() {
  const { user } = useAuth()
  // const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'masuk' | 'pulang'>('masuk')
  const [attendanceTime, setAttendanceTime] = useState('')
  const [attendancePhoto, setAttendancePhoto] = useState<string | null>(null)
  const [attendanceLocation, setAttendanceLocation] = useState<string | null>(null)

  const [geoCoords, setGeoCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [lokasiList, setLokasiList] = useState<LokasiType[]>([])
  const [selectedLokasiId, setSelectedLokasiId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

    //  const handleScanSuccess = (decodedText: string) => {
    //   console.log('QR Code scanned:', decodedText)
    //   handleSubmitAttendance()
    //  

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

  const [todayAttendance, setTodayAttendance] = useState<{ clockIn: string | null, clockOut: string | null } | null>(null)

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


  useEffect(() => {
    const userId = user?.customId
    console.log("🔍 userId:", userId)
    if (!userId) return
  
    async function fetchUserLocations() {
      
      try {
        const izinLokasiRes = await fetch(`/api/user/${userId}/izin-lokasi`)
        console.log("📡 izinLokasi status:", izinLokasiRes.status)
        const izimLokasidata = izinLokasiRes.ok ? await izinLokasiRes.json() : []
        console.log("data lokasi ", izimLokasidata)
        setLokasiList(izimLokasidata.lokasi ?? [])
        if (izimLokasidata.lokasi?.length === 1) setSelectedLokasiId(izimLokasidata.lokasi[0].id)
        setTodayAttendance(izimLokasidata.todayAttendance ?? { clockIn: null, clockOut: null })
      } catch (err) {
        console.error('❌ Error fetch lokasi:', err)
      } finally {
        
      }
    }
      fetchUserLocations()
  }, [user?.customId])

  const requestLocation = (minAccuracy = 30) => {
      return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }
        const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const accuracy = position.coords.accuracy
          if (accuracy <= minAccuracy) {
            navigator.geolocation.clearWatch(watchId)
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          }
        },
          (error) => {
            navigator.geolocation.clearWatch(watchId)
            reject(error)
          },
          { timeout: 15000,
            enableHighAccuracy: true,
            maximumAge: 0
           }
        )
      })
    }

    const getDistanceMeter = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371000 
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }


    const handlePhotoTaken = (photo: string, locationName: string | null) => {
    setAttendancePhoto(photo)
    setAttendanceLocation(locationName)
  }

  const openAttendanceModal = async (type: 'masuk' | 'pulang') => {
    if (!user) return

    setModalType(type)
    setAttendanceTime(
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    )

    try {
      const coords = await requestLocation()
      setGeoCoords(coords)

      const baseLocation = lokasiList.find(l => l.id === selectedLokasiId) || lokasiList[0]
      console.log(coords.latitude, coords.longitude,)
      const jarak = getDistanceMeter(coords.latitude, coords.longitude, baseLocation.latitude, baseLocation.longitude)
      if (jarak <= (baseLocation.radiusMeter || baseLocation.radiusMeter)) {
        setAttendanceLocation(`${baseLocation.nama } (jarak ${Math.round(jarak)} m)`)
        setIsModalOpen(true)
      } else {
        alert(`Anda berada di luar radius presensi di lokasi ${baseLocation.nama }. Jarak: ${Math.round(jarak)} m.`)
      }
    } catch (err) {
      console.error('Gagal mendapatkan lokasi:', err)
      alert('Gagal mendapatkan lokasi, cek izin browser atau ulangi.')
    } finally {
    }
  }

  const handleSubmitAttendance = async () => {
    if (isSubmitting) return   
      setIsSubmitting(true)

    if (!user) return
    try {
      const isMasuk = modalType === 'masuk'
      const payload = {
        userId: user.customId,
        date: new Date().toISOString(),
        clockIn: isMasuk ? attendanceTime : null,
        clockOut: isMasuk ? null : attendanceTime,
        status: 'TEPAT_WAKTU',
        photoIn: isMasuk ? attendancePhoto : null,
        photoOut: isMasuk ? null : attendancePhoto,
        latitude: geoCoords?.latitude ?? null,
        longitude: geoCoords?.longitude ?? null,
        location: attendanceLocation,
        lokasiId: selectedLokasiId
      }

      const res = await fetch('/api/presensi/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Gagal submit presensi')
      }

    } catch (err) {
      console.error('Error submitting attendance:', err)
    } finally {
      setIsModalOpen(false)
      setAttendancePhoto(null)
      setAttendanceLocation(null)
      setGeoCoords(null)
      setSelectedLokasiId(null)
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
        <div>
          <AttendanceCard 
            type="masuk" 
            onClick={() => openAttendanceModal('masuk')} 
            scheduleTime="08:00"
            disabled={todayAttendance?.clockIn !== null}
          />
           {/* {todayAttendance?.clockIn !== null && (
            <p className="text-sm text-gray-400 mt-1">Anda sudah absen masuk hari ini</p>
          )} */}
        </div>
        <div>
          <AttendanceCard 
            type="pulang" 
            onClick={() => openAttendanceModal('pulang')} 
            scheduleTime="17:00"
            disabled={todayAttendance?.clockIn === null || todayAttendance?.clockOut !== null}
          />
          {/* {todayAttendance?.clockIn === null ? (
            <p className="text-sm text-gray-400 mt-1">Anda harus absen masuk dulu</p>
          ) : todayAttendance?.clockOut !== null ? (
            <p className="text-sm text-gray-400 mt-1">Anda sudah absen pulang</p>
          ) : null} */}
        </div>
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