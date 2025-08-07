import { UserNav } from '@/components/Common/userNav'
import { Menu } from 'lucide-react'
import { UserAccount } from '@/types/user'

interface NavbarProps {
  isMobile: boolean
  toggleMobileMenu: () => void
  pageTitle: string
  user: UserAccount
}

export function Navbar({ isMobile, toggleMobileMenu, pageTitle }: NavbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#0d0d0d]">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="text-xl font-semibold">{pageTitle}</div>
      </div>
      <div className="flex items-center space-x-4">
        <UserNav />
      </div>
    </div>
  )
}
