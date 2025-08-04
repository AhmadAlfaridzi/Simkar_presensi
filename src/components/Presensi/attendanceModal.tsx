'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, RotateCw, QrCode, User } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

interface AttendanceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  type: 'masuk' | 'pulang'
  userName: string
  attendanceTime: string
  onPhotoTaken: (photo: string) => void
  onSubmit: () => void
  onScanSuccess: (decodedText: string) => void
}

export default function AttendanceModal({
  isOpen,
  onOpenChange,
  type,
  userName,
  attendanceTime,
  onPhotoTaken,
  onSubmit,
  onScanSuccess
}: AttendanceModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  
  const [photo, setPhoto] = useState<string | null>(null)
  const [mode, setMode] = useState<'selfie' | 'qr'>('selfie')
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment')
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // fungsi untuk kamera
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
         await qrScannerRef.current.stop().catch(err => {
      // Abaikan error jika scanner sudah berhenti
      if (!err.message.includes('already stopped') && 
          !err.message.includes('not running')) {
        console.error("Error stopping scanner:", err);
      }
      });
        qrScannerRef.current = null
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
  }

  const cleanupAll = async () => {
    try {
      await cleanupCamera()
      await cleanupScanner()
    } catch (err) {
      console.error("Error during cleanup:", err)
    }
  }

  const startCamera = async () => {
    try {
      await cleanupAll()
      
      const facingMode = (mode === 'qr' && isMobile) 
        ? 'environment' 
        : cameraFacingMode
      
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
        videoRef.current.style.transform = (facingMode === 'user' && mode === 'selfie' && isMobile) 
          ? 'scaleX(-1)' 
          : 'scaleX(1)'
        videoRef.current.style.objectFit = 'cover'
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const takePhoto = () => {
    if (!videoRef.current) return
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      if (cameraFacingMode === 'user' && mode === 'selfie' && isMobile) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const photoData = canvas.toDataURL('image/jpeg')
      setPhoto(photoData)
      onPhotoTaken(photoData)
      cleanupCamera()
    }
  }

  const switchCamera = () => {
    if (isMobile && mode === 'selfie') {
      setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    }
  }

  const retakePhoto = () => {
    setPhoto(null)
    startCamera()
  }

  const handleClose = async () => {
  try {
    await cleanupAll();
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    onOpenChange(false);
  }
};

  const startScanner = async () => {
    try {
      await cleanupAll()
      if (!qrContainerRef.current) return

      const container = qrContainerRef.current
      container.innerHTML = ''
      
      const scanner = new Html5Qrcode(container.id)
      await scanner.start(
        { 
          facingMode: isMobile ? "environment" : "user" 
        }, 
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 4/3
        },
        (decodedText) => { 
          onScanSuccess(decodedText) 
        },
        (errorMessage) => {
          if (!errorMessage.includes('NotFoundException')) {
            console.log("Scan error:", errorMessage)
          }
        }
      )
      qrScannerRef.current = scanner
    } catch (err) {
      console.error("Scanner init error:", err)
      await cleanupScanner()
      setMode('selfie')
    }
  }

  useEffect(() => {
    if (!isOpen) {
      cleanupAll()
      setPhoto(null)
      return
    }

    const init = async () => {
      try {
        if (mode === 'selfie') {
          await startCamera()
        } else {
          await startScanner()
        }
      } catch (err) {
        console.error("Failed to initialize mode:", err)
      }
    }

    init()

    return () => {
      cleanupAll()
    }
  }, [isOpen, mode, cameraFacingMode])

  const handleModeChange = async (newMode: 'selfie' | 'qr') => {
    if (mode === newMode) return
    setMode(newMode)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md bg-[#2a2a2a] border-[#444444] text-white"
        aria-describedby="dialog-description">
        
        <DialogHeader>
          <DialogTitle className="text-white">
            {type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'} - {userName}
          </DialogTitle>
          <p id="dialog-description" className="sr-only">
            {mode === 'selfie' ? 'Ambil foto untuk absensi' : 'Scan QR code untuk absensi'}
          </p>
        </DialogHeader>

        {/* Mode Selector */}
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
          <Button
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
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Waktu Saat Ini</p>
            <p className="text-2xl font-bold text-white">{attendanceTime}</p>
          </div>

          {/* Kamera/Scanner */}
          <div className="space-y-2">
            <p className="text-gray-400">
              {mode === 'selfie' 
                ? (type === 'masuk' ? 'Ambil Foto Masuk' : 'Ambil Foto Pulang') 
                : 'Scan QR Code'} (Wajib)
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
                  <div ref={qrContainerRef} id="qr-scanner-container" className="w-full h-full relative">
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

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="bg-[#333333] border-[#444444] text-white hover:bg-[#444444]">
              Batal
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={!photo && mode === 'selfie'}
              className={type === 'masuk' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}