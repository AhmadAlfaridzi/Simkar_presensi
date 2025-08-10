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
    <div className="flex h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      {!isMobile && user && (
        <div
          className={`transition-all duration-300  h-full ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <SidebarNav user={user} logout={logout} />
        </div>
      )}
       
      {isMobile && isSidebarOpen && user && (
        <SidebarNav
          user={user}
          logout={logout}
          isMobile
          isMobileMenuOpen={isSidebarOpen}
          setIsMobileMenuOpen={setIsSidebarOpen}
        />
      )}

      <div className="flex flex-col flex-1 ">
        {/* Navbar */}
        <header className="border-b border-[#2e2e2e] bg-[#1a1a1a] px-2 sm:px-4 md:px-6 py-4 shadow-sm flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <Menu className="text-white w-6 h-6" />
          </button>
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>

        {/* Page content with context */}
        <main className="flex-1 overflow-auto w-full h-full pt-4 md:pt-4 lg:pt-0">
          <PageMetadataProvider>
                <SmoothTransition>{children}</SmoothTransition>
          </PageMetadataProvider>
        </main>
      </div>
    </div>
  )
}