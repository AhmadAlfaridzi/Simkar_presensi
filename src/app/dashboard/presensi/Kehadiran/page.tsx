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

const [todayAttendance, setTodayAttendance] = useState<
  { lokasiId: string; clockIn: string | null; clockOut: string | null }[]
>([])

const hasPendingClockOut = todayAttendance.some(a => a.clockIn && !a.clockOut)
const selectedAttendance = selectedLokasiId
  ? todayAttendance.find(a => a.lokasiId === selectedLokasiId)
  : undefined


const disableMasuk  = hasPendingClockOut || (selectedAttendance ? selectedAttendance.clockIn !== null : false)
const disablePulang = selectedAttendance ? (selectedAttendance.clockIn === null || selectedAttendance.clockOut !== null) : true

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
  // console.log("🔍 userId:", userId)
  if (!userId) return

  async function fetchUserLocations() {
    try {
      const izinLokasiRes = await fetch(`/api/user/${userId}/izin-lokasi`)
      // console.log("📡 izinLokasi status:", izinLokasiRes.status)

      if (!izinLokasiRes.ok) {
        console.warn("⚠️ Gagal fetch izin lokasi, status:", izinLokasiRes.status)
        setLokasiList([])
        setTodayAttendance([])
        return
      }

      const izinLokasiData = await izinLokasiRes.json()
      console.log("📡 API Response:", izinLokasiData)
      console.log("📡 Raw todayAttendance dari API:", izinLokasiData.todayAttendance)


      const lokasiArray = Array.isArray(izinLokasiData.lokasi) ? izinLokasiData.lokasi : []
      setLokasiList(lokasiArray)

      const firstId = lokasiArray[0]?.id ?? null
      setSelectedLokasiId(firstId)
      console.log("🎯 selectedLokasiId:", firstId)

      const raw = izinLokasiData.todayAttendance
      const mapped = Array.isArray(raw)
        ? raw.map((r: typeof raw[number]) => ({
            lokasiId: r.lokasiId ?? r.kantorId ?? firstId, 
            clockIn: r.clockIn ?? null,
            clockOut: r.clockOut ?? null,
          }))
        : raw
          ? [{
              lokasiId: raw.lokasiId ?? raw.kantorId ?? firstId,
              clockIn: raw.clockIn ?? null,
              clockOut: raw.clockOut ?? null,
            }]
          : (firstId ? [{ lokasiId: firstId, clockIn: null, clockOut: null }] : [])
          
          console.log("📌 Mapped todayAttendance:", mapped)
          setTodayAttendance(mapped)
    } catch (err) {
      console.error('❌ Error fetch lokasi:', err)
      setLokasiList([])
      setSelectedLokasiId(null)
      setTodayAttendance([])
    }
  }

  fetchUserLocations()
}, [user?.customId])

useEffect(() => {
    if (!user) return
    requestLocation()
      .then(coords => {
        console.log("📍 Lokasi diterima saat page dibuka:", coords)
        setGeoCoords(coords)
        if (lokasiList.length > 0) {
          let nearest = lokasiList[0]
          let minDistance = getDistanceMeter(
            coords.latitude,
            coords.longitude,
            nearest.latitude,
            nearest.longitude
          )

          lokasiList.forEach((loc) => {
            const d = getDistanceMeter(
              coords.latitude,
              coords.longitude,
              loc.latitude,
              loc.longitude
            )
            if (d < minDistance) {
              minDistance = d
              nearest = loc
            }
          })

          setSelectedLokasiId(nearest.id)
          console.log("🎯 Selected lokasi terdekat otomatis:", nearest.nama)
        }
      })
      .catch(err => {
        console.error("❌ Gagal mendapatkan lokasi:", err)
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diizinkan di browser.")
      })
  }, [user, lokasiList])

  const requestLocation = (minAccuracy = 30, maxRetry = 3) => {
    return new Promise<{ latitude: number; longitude: number; accuracy: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      let attempts = 0
      const getPosition = () => {
        attempts++
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            console.log(`📍 Dapat posisi ke-${attempts}: lat=${position.coords.latitude}, lon=${position.coords.longitude}, akurasi=${position.coords.accuracy} m`)
            if (position.coords.accuracy <= minAccuracy || attempts >= maxRetry) {
              navigator.geolocation.clearWatch(watchId)
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              })
            }
          },
          (error) => {
            navigator.geolocation.clearWatch(watchId)
            reject(error)
          },
          { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
        )
      }
      getPosition()
    })
  }

  const getDistanceMeter = ( lat1: number, lon1: number, lat2: number, lon2: number,
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
    const baseLocation =
      (selectedLokasiId && lokasiList.find(l => l.id === selectedLokasiId)) ||
      lokasiList[0]

    if (!baseLocation) {
      alert('Lokasi belum siap. Coba lagi setelah data lokasi termuat.')
      return
    }
    
    
    if (!user) return

    setModalType(type)
    setAttendanceTime(
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    )

    try {
      // console.log("📍 Meminta lokasi dari browser... ")
      const coords = await requestLocation()
      // console.log("✅ Lokasi diterima:", coords)
      setGeoCoords(coords)

      const baseLocation = lokasiList.find(l => l.id === selectedLokasiId) || lokasiList[0]
      // console.log("🏢 Lokasi kantor:", baseLocation)
      const jarak = getDistanceMeter(coords.latitude, coords.longitude, baseLocation.latitude, baseLocation.longitude)
      if (jarak <= (baseLocation.radiusMeter )) {
        setAttendanceLocation(`${baseLocation.nama } (jarak ${Math.round(jarak)} m)`)
        console.log(`📏 Jarak ke lokasi: ${jarak} meter, batas radius: ${baseLocation.radiusMeter} meter`)
        setIsModalOpen(true)
        console.log("✅ Dalam radius, buka modal presensi.")
      } else {
        //  console.warn(`❌ Di luar radius. Jarak: ${Math.round(jarak)} m`)
        alert(`Anda berada di luar radius presensi di lokasi ${baseLocation.nama }. Jarak: ${Math.round(jarak)} m.`)
      }
    } catch (err) {
      console.error('Gagal mendapatkan lokasi:', err)
      alert('Gagal mendapatkan lokasi, cek izin browser atau ulangi.')
    } finally {
    }
  }

  const handleSubmitAttendance = async () => {
     if (isSubmitting || !user || !selectedLokasiId) return
      setIsSubmitting(true)

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

      console.log('📝 Payload sebelum submit:', payload)

      const res = await fetch('/api/presensi/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Gagal submit presensi')
      }

      if (selectedLokasiId) {
        setTodayAttendance(prev => {
          const idx = prev.findIndex(a => a.lokasiId === selectedLokasiId)
          if (idx === -1) {
            return [
              ...prev,
              {
                lokasiId: selectedLokasiId,
                clockIn: isMasuk ? attendanceTime : null,
                clockOut: isMasuk ? null : attendanceTime
              }
            ]
          }
          const copy = [...prev]
          copy[idx] = {
            ...copy[idx],
            clockIn: isMasuk ? attendanceTime : copy[idx].clockIn,
            clockOut: isMasuk ? copy[idx].clockOut : attendanceTime
          }
          return copy
        })
      }

    } catch (err) {
      console.error('Error submitting attendance:', err)
    } finally {
      setIsModalOpen(false)
      setAttendancePhoto(null)
      setAttendanceLocation(null)
      setGeoCoords(null)
      setIsSubmitting(false)
      // setSelectedLokasiId(null)
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
            disabled={disableMasuk}
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
             disabled={disablePulang}
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