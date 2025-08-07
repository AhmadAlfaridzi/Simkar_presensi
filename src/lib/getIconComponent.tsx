import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Mail,
  Users,
  Box,
  Settings,
  Wrench,
  Package,
  LogIn,
  LogOut
} from 'lucide-react'

const iconComponents = {
  LayoutDashboard,
  CalendarCheck,
  History,
  Mail,
  Users,
  Box,
  Settings,
  Wrench,
  Package,
  LogIn,
  LogOut
}

const colorMapping: Record<string, string> = {
  LayoutDashboard: 'text-blue-400',
  CalendarCheck: 'text-green-400',
  History: 'text-purple-400',
  Mail: 'text-red-400',
  Users: 'text-yellow-400',
  Box: 'text-teal-400',
  Wrench: 'text-teal-400',
  Package: 'text-teal-400',
  Settings: 'text-gray-400',
  LogIn: 'text-blue-400',
  LogOut: 'text-red-400'
}

export const getIconComponent = (iconName: string, isSubItem = false) => {
  const Icon = iconComponents[iconName as keyof typeof iconComponents]
  if (!Icon) return null

  const baseClass = isSubItem ? 'h-4 w-4' : 'h-5 w-5'
  const colorClass = colorMapping[iconName] ?? (isSubItem ? 'text-teal-400' : '')

  return <Icon className={`${baseClass} ${colorClass}`} />
}