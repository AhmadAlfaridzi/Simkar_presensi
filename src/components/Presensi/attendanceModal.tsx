'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, RotateCw,User } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

//import {  QrCode } from 'lucide-react'
interface AttendanceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  type: 'masuk' | 'pulang'
  userName: string
  attendanceTime: string
  onPhotoTaken: (photoData: string, locationText: string | null) => void
  onSubmit: () => void
  
  // onScanSuccess: (decodedText: string) => void
}

const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY
    if (!apiKey) throw new Error('API key OpenCage tidak ditemukan.')
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=id&pretty=1`
    )
    const data = await response.json()
    let formatted = data?.results?.[0]?.formatted || null

    if (formatted?.toLowerCase().startsWith('unnamed road,')) {
      formatted = formatted.replace(/^Unnamed road,\s*/i, '')
    }

    return formatted
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return null
  }
}


export default function AttendanceModal({
  isOpen,
  onOpenChange,
  type,
  userName,
  attendanceTime,
  onPhotoTaken,
  onSubmit,
  // onScanSuccess
}: AttendanceModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  
  const [photo, setPhoto] = useState<string | null>(null)
  const [mode, setMode] = useState<'selfie' | 'qr'>('selfie')
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment')
  const [isMobile, setIsMobile] = useState(false)
  const [isChangingMode, setIsChangingMode] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [locationName, setLocationName] = useState<string | null>(null)
  
  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    )
  }, [])

  const cleanupCamera = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const cleanupScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop()
          const container = qrContainerRef.current
          if (container && container.hasChildNodes()) {
            await qrScannerRef.current.clear()
          }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Scanner error:', err.message)
        } else {
          console.error('Unknown scanner error:', err)
        }
      } finally {
          qrScannerRef.current = null
      }
    }
  }

  const cleanupAll = async () => {
    try {
      await cleanupCamera()
      await cleanupScanner()
    } catch (err) {
      console.error('Error during cleanup:', err)
    }
  }

  const requestLocation = () => {
  if (!navigator.geolocation) {
    console.error('Geolocation tidak didukung.')
    return
  }

  const watcher = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords
      console.log(`Lokasi update: lat=${latitude}, lon=${longitude}, akurasi=${accuracy}m`)


      // hanya jika akurat, baru simpan
      setLocation({ lat: latitude, lng: longitude })

      try {
        const name = await reverseGeocode(latitude, longitude)
        setLocationName(name)
        console.log('📍 Lokasi final:', name)

        // Stop watching setelah dapat lokasi bagus
        navigator.geolocation.clearWatch(watcher)
      } catch (err) {
        console.error('❌ Gagal reverse geocoding:', err)
      }
    },
    (error) => {
      console.error('❌ Gagal mendapatkan lokasi:', error.message)
      alert('Izin lokasi diperlukan untuk absen.')
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  )
}

  const startCamera = useCallback(async () => {
  try {
    await cleanupAll()
    const facingMode = (mode === 'qr' && isMobile) ? 'environment' : cameraFacingMode
    const constraints = {
      video: {
        ...(isMobile && { facingMode }),
        width: { ideal: isMobile ? 1280 : 640 },
        height: { ideal: isMobile ? 720 : 480 }
      }
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.style.transform =
        facingMode === 'user' && mode === 'selfie' && isMobile
          ? 'scaleX(-1)'
          : 'scaleX(1)'
      videoRef.current.style.objectFit = 'cover'
    }
  } catch (err) {
    console.error('Error accessing camera:', err)
  }
}, [cameraFacingMode, isMobile, mode])


  
  const takePhoto = () => {
  const video = videoRef.current
  if (!video || !location) {
    alert('Lokasi belum tersedia. Harap aktifkan GPS atau tunggu beberapa detik.')
    return
  }

  const { lat, lng } = location

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')

  if (ctx) {
    if (cameraFacingMode === 'user' && mode === 'selfie' && isMobile) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '18px sans-serif'
    ctx.fillText(`Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`, 10, canvas.height - 30)
    ctx.fillText(`${locationName || 'Lokasi tidak ditemukan'}`, 10, canvas.height - 10)

    const photoData = canvas.toDataURL('image/jpeg')
    setPhoto(photoData)
    onPhotoTaken(photoData, locationName)

    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }
  }
}


  const switchCamera = useCallback(async () => {
  if (!isMobile || mode !== 'selfie') return

  try {
    // Tentukan facing mode baru
    const newFacingMode = cameraFacingMode === 'user' ? 'environment' : 'user'
    setCameraFacingMode(newFacingMode)

    // Hentikan stream kamera saat ini
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    // Mulai ulang kamera dengan facing mode baru
    const constraints = {
      video: {
        facingMode: newFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.style.transform =
        newFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)'
      videoRef.current.style.objectFit = 'cover'
    }
  } catch (err) {
    console.error('Gagal switch kamera:', err)
  }
}, [cameraFacingMode, isMobile, mode])

  const retakePhoto = () => {
    setPhoto(null)
    startCamera()
  }

  const handleClose = async () => {
    try {
      await cleanupAll()
    } catch (err) {
      console.error('Error during cleanup:', err)
    } finally {
      onOpenChange(false)
    }
  }

  // const startScanner = async () => {
  //   try {
  //     await cleanupAll()
  //     if (!qrContainerRef.current) return

  //     const container = qrContainerRef.current
  //     const scanner = new Html5Qrcode(container.id)
  //     await scanner.start(
  //       {
  //         facingMode: isMobile ? 'environment' : 'user'
  //       },
  //       {
  //         fps: 10,
  //         qrbox: { width: 250, height: 250 },
  //         aspectRatio: 4 / 3
  //       },
  //       decodedText => {
  //         onScanSuccess(decodedText)
  //       },
  //       errorMessage => {
  //         if (!errorMessage.includes('NotFoundException')) {
  //           console.log('Scan error:', errorMessage)
  //         }
  //       }
  //     )
  //     qrScannerRef.current = scanner
  //   } catch (err) {
  //     console.error('Scanner init error:', err)
  //     await cleanupScanner()
  //     setMode('selfie')
  //   }
  // }

  const handleModeChange = async (newMode: 'selfie' | 'qr') => {
    if (mode === newMode || isChangingMode) return

    setIsChangingMode(true)

    try {
      await cleanupAll()
      setMode(newMode)

      if (newMode === 'selfie') {
        await startCamera()
      } 
      // else {
      //   await startScanner()
      // }
    } catch (err) {
      console.error('Error changing mode:', err)
    } finally {
      setIsChangingMode(false)
    }
  }

   useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

useEffect(() => {
  if (!isOpen) {
    setPhoto(null)
    cleanupCamera()
    return
  }

  if (mode === 'selfie') {
    startCamera()
    requestLocation()
  }
      // else if (mode === 'qr') {
      //     await startScanner()
      //   }
  }, [isOpen, mode])

  useEffect(() => {
  if (isOpen) {
    navigator.permissions.query({ name: 'geolocation' as PermissionName }).then(result => {
      console.log('Status izin lokasi:', result.state)
      requestLocation()
    })
  }
}, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-[#2a2a2a] border-[#444444] text-white"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'} - {userName}
          </DialogTitle>
          <p id="dialog-description" className="sr-only">
            {mode === 'selfie' ? 'Ambil foto untuk absensi' : 'Scan QR code untuk absensi'}
          </p>
        </DialogHeader>

        <div className="flex justify-center gap-4 mb-4">
          <Button
            variant={mode === 'selfie' ? 'default' : 'outline'}
            onClick={() => handleModeChange('selfie')}
            className={`flex items-center gap-2 ${
              mode === 'selfie'
                ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white'
                : 'bg-transparent hover:bg-[#3a3a3a] text-gray-300 border-gray-600'
            }`}
          >
            <User className="h-4 w-4" />
            Selfie
          </Button>
          {/* <Button
            variant={mode === 'qr' ? 'default' : 'outline'}
            onClick={() => handleModeChange('qr')}
            className={`flex items-center gap-2 ${
              mode === 'qr'
                ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white'
                : 'bg-transparent hover:bg-[#3a3a3a] text-gray-300 border-gray-600'
            }`}
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </Button> */}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Waktu Saat Ini</p>
            <p className="text-2xl font-bold text-white">{attendanceTime}</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">
              {mode === 'selfie'
                ? type === 'masuk'
                  ? 'Ambil Foto Masuk'
                  : 'Ambil Foto Pulang'
                : 'Scan QR Code'}{' '}
              (Wajib)
            </p>

            <div className="relative bg-[#333333] rounded-lg aspect-[4/3] overflow-hidden">
              {!photo ? (
                mode === 'selfie' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                      {isMobile && (
                        <button
                          onClick={switchCamera}
                          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full"
                        >
                          <RotateCw className="h-6 w-6" />
                        </button>
                      )}
                      <button
                        onClick={takePhoto}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      >
                        <Camera className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={qrContainerRef}
                    id="qr-scanner-container"
                    className="w-full h-full relative"
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-white/30 rounded-lg w-[80%] h-[60%] max-w-[300px] max-h-[300px] relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/50"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/50"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/50"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/50"></div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={photo}
                    alt={`Foto ${type === 'masuk' ? 'masuk' : 'pulang'}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={retakePhoto}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                    >
                      <RotateCw className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-[#333333] border-[#444444] text-white hover:bg-[#444444]"
            >
              Batal
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!photo && mode === 'selfie'}
              className={
                type === 'masuk'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
