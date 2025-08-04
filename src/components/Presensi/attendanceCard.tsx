'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, LogOut } from 'lucide-react'

type AttendanceCardProps = {
  type: 'masuk' | 'pulang'
  onClick: () => void
  scheduleTime: string
}

export default function AttendanceCard({ type, onClick, scheduleTime }: AttendanceCardProps) {
  const isClockIn = type === 'masuk'
  const icon = isClockIn ? <LogIn className="h-5 w-5 mr-2 text-green-500" /> : <LogOut className="h-5 w-5 mr-2 text-blue-500" />
  const borderColor = isClockIn ? 'border-green-500' : 'border-blue-500'
  const title = isClockIn ? 'Absen Masuk' : 'Absen Pulang'
  const description = isClockIn ? 'Klik untuk melakukan absen masuk' : 'Klik untuk melakukan absen pulang'

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Card 
        className={`border-l-4 ${borderColor} cursor-pointer bg-[#2a2a2a] border-[#333333]`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center text-white">
                {icon}
                {title}
              </h2>
              <p className="text-gray-400 mt-2">{description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{scheduleTime}</p>
              <p className="text-sm text-gray-400">Jam {isClockIn ? 'Masuk' : 'Pulang'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
