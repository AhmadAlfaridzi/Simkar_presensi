'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AttendanceStatus } from '@/types/user'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { PhotoModal } from './photoModal'
import { useState } from 'react'
import { AttendanceRecord } from '@/types/attendance'
import Image from 'next/image'
import { attendanceStatusColor, attendanceStatusLabel } from '@/lib/proper-text'

interface AttendanceDetailModalProps {
  record: AttendanceRecord | null
  onOpenChange: (open: boolean) => void
}

export function AttendanceDetailModal({ record, onOpenChange }: AttendanceDetailModalProps) {
  const [photoModal, setPhotoModal] = useState({
    open: false,
    url: '',
    title: ''
  })

  if (!record) return null

  return (
    <>
      <Dialog open={!!record} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl bg-[#1a1a1a] border-[#2e2e2e] text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Detail Absensi - {record.karyawan?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Informasi Absensi */}
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#2e2e2e]">
                <h3 className="font-medium text-lg mb-3 text-white">Informasi Absensi</h3>
                <div className="space-y-3 text-sm">
                <p><span className="text-gray-400">Tanggal:</span> {format(new Date(record.date), 'dd MMMM yyyy', { locale: id })}</p>
                  <p><span className="text-gray-400">Jam Masuk:</span> {record.clockIn || '-'}</p>
                  <p><span className="text-gray-400">Jam Pulang:</span> {record.clockOut || '-'}</p>
                  <p>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 ${attendanceStatusColor[record.status as AttendanceStatus]}`}>
                      {attendanceStatusLabel[record.status as AttendanceStatus]}
                    </span>
                  </p>
                  <p><span className="text-gray-400">Departemen:</span> {record.karyawan?.department}</p>
                  <p><span className="text-gray-400">Jabatan:</span> {record.karyawan?.position}</p>
                </div>
              </div>
            </div>

            {/* Foto Absensi */}
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#2e2e2e]">
                <h3 className="font-medium text-lg mb-3 text-white">Bukti Absensi</h3>
                <div>
                    <p className="text-sm text-gray-400 mb-2">Foto Masuk</p>
                    {record.photoIn ? (
                      <div 
                        className="relative w-full h-40 cursor-pointer hover:opacity-90 transition-opacity bg-[#1a1a1a] rounded-md border border-[#2e2e2e] flex items-center justify-center p-2"
                        onClick={() => setPhotoModal({
                          open: true,
                          url: record.photoIn as string,
                          title: `Foto Masuk - ${record.karyawan?.name}`
                        })}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={record.photoIn}
                            alt="Foto Masuk"
                            fill
                            className="object-contain rounded-sm"
                            style={{ backgroundColor: 'transparent' }}
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-[#1a1a1a] rounded-md border border-[#2e2e2e] flex items-center justify-center">
                        <span className="text-gray-400">Tidak ada foto</span>
                      </div>
                    )}
                  </div>
                
                {record.clockOut && (
                <div>
                    <p className="text-sm text-gray-400 mb-2">Foto Pulang</p>
                    {record.photoOut ? (
                    <div 
                        className="relative w-full h-40 cursor-pointer hover:opacity-90 transition-opacity bg-[#1a1a1a] rounded-md border border-[#2e2e2e] flex items-center justify-center p-2"
                        onClick={() => setPhotoModal({
                        open: true,
                        url: record.photoOut as string,
                        title: `Foto Pulang - ${record.karyawan?.name}`
                        })}
                    >
                        <div className="relative w-full h-full">
                        <Image
                            src={record.photoOut}
                            alt="Foto Pulang"
                            fill
                            className="object-contain rounded-sm"
                            style={{ backgroundColor: 'transparent' }}
                            unoptimized
                        />
                        </div>
                    </div>
                    ) : (
                    <div className="w-full h-40 bg-[#1a1a1a] rounded-md border border-[#2e2e2e] flex items-center justify-center">
                        <span className="text-gray-400">Tidak ada foto</span>
                    </div>
                    )}
                </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PhotoModal
        open={photoModal.open}
        onOpenChange={(open) => setPhotoModal(prev => ({ ...prev, open }))}
        imageUrl={photoModal.url}
        title={photoModal.title}
      />
    </>
  )
}