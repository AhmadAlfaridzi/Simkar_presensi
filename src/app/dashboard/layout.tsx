'use client'

import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'
import { SidebarNav } from '@/components/Common/sidebar-nav'
import { UserNav } from '@/components/Common/userNav'
import { SmoothTransition } from '@/components/ui/smooth-transition'
import { Menu } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'
import { PageMetadataProvider } from '@/context/pageMetadataContext' 

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const isMobile = useMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
  const router = useRouter()

  useEffect(() => {
    setIsSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading || !user) return null

  return (
    <div className="flex h-dvh bg-[#121212] text-white overflow-hidden">
      {/* Sidebar Desktop */}
      {!isMobile && (
        <div
          className={`transition-all duration-300 h-full ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <SidebarNav user={user} logout={logout} />
        </div>
      )}

      {/* Sidebar Mobile (Drawer) */}
      {isMobile && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1a1a1a] shadow-lg transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarNav
            user={user}
            logout={logout}
            isMobile
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <header className="border-b border-[#2e2e2e] bg-[#1a1a1a] shadow-sm ">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-2 hover:bg-gray-700 rounded"
              aria-label="Toggle sidebar"
            >
              <Menu className="text-white w-6 h-6" />
            </button>

            <UserNav />
          </div>
        </header>

        {/* Page content with context */}
        <main className="flex-1 overflow-auto  h-full pt-4 md:pt-4 lg:pt-0  pb-4">
          <PageMetadataProvider>
                <SmoothTransition>{children}</SmoothTransition>
          </PageMetadataProvider>
        </main>
      </div>
    </div>
  )
}