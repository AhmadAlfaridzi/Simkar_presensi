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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isMobile = useMobile()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading || !user) return null

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      {!isMobile && user && <SidebarNav user={user} logout={logout} />}
      {isMobile && isSidebarOpen && user && (
        <SidebarNav
          user={user}
          logout={logout}
          isMobile
          isMobileMenuOpen={isSidebarOpen}
          setIsMobileMenuOpen={setIsSidebarOpen}
        />
      )}

      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="border-b border-[#2e2e2e] bg-[#1a1a1a] px-6 py-4 shadow-sm flex justify-between items-center">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
              <Menu className="text-white w-6 h-6" />
            </button>
          )}
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>

        {/* Page content with context */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <PageMetadataProvider>
            <SmoothTransition>{children}</SmoothTransition>
          </PageMetadataProvider>
        </main>
      </div>
    </div>
  )
}