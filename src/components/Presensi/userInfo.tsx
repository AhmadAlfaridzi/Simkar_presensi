'use client'
import { motion } from 'framer-motion'
import { Clock, Calendar, User as UserIcon, Briefcase, Building } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/user'

interface UserInfoProps {
  user: User
  realTime: string
  currentDate: string
}

export default function UserInfo({ user, realTime, currentDate }: UserInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[#2a2a2a] border-[#333333] mb-6">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <Badge variant="outline" className="border-blue-400 text-blue-400">
                  {user.role}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm">@{user.username}</span>
              </div>
              
              {user.position && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.position}</span>
                </div>
              )}
              
              {user.department && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">{user.department}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center bg-[#333333] px-3 py-2 rounded-md">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-lg font-mono text-white">{realTime}</span>
              </div>
              
              <div className="flex items-center bg-[#333333] px-3 py-2 rounded-md">
                <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-gray-400">{currentDate}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}