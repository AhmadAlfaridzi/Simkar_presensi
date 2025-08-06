'use client'

import { motion } from 'framer-motion'
import { roleToTitleCase } from '@/types/roles'
import { SidebarItem } from './sidebarItem'
import { menuItems } from '@/data/menu-items'
import { UserAccount } from '@/types/user'
import { usePathname } from 'next/navigation'
import { getIconComponent } from '@/lib/getIconComponent'

interface SidebarNavProps {
  user: UserAccount | null;
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  logout: () => void;
}

export const SidebarNav = ({ 
  user, 
  isMobile = false, 
  isMobileMenuOpen = false, 
  setIsMobileMenuOpen = () => {},
  logout 
}: SidebarNavProps) => {
  const pathname = usePathname();

  const activeMenu = pathname;

  const filteredMenuItems = menuItems
    .filter(item => item.allowedRoles.includes(user?.role || 'KARYAWAN'))
    .map(item => ({
      ...item,
      items: item.items.filter(subItem => 
        subItem.allowedRoles?.includes(user?.role || 'KARYAWAN') ?? true
      )
    }));

  if (!user) return null;

  return (
    <>
      {!isMobile ? (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="w-64 bg-[#0d0d0d] border-r border-[#333] flex flex-col"
        >
          <div className="p-4 border-b border-[#333]">
            <h2 className="text-lg font-bold text-white">{roleToTitleCase[user.role] || user.role} Dashboard</h2>
            <div className="mt-2">
              <p className="text-sm text-blue-400">@{user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map(item => (
              <SidebarItem 
                key={item.name} 
                item={item} 
                activeMenu={pathname}
                onItemClick={() => setIsMobileMenuOpen(false)} 
              />
            ))}
          </nav>

          <div className="p-4 border-t border-[#333]">
            <button 
              className="w-full text-left hover:bg-[#1a1a1a] text-gray-400 px-3 py-2 flex items-center"
              onClick={logout}
            >
              <span className="mr-2">{getIconComponent('LogOut')}</span>
              Logout
            </button>
          </div>
        </motion.aside>
      ) : isMobileMenuOpen && (
        <motion.div className="fixed inset-0 z-50 bg-black bg-opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.aside
            className="w-full max-w-xs bg-[#0d0d0d] border-r border-[#333] h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="p-4 border-b border-[#333]">
              <h2 className="text-lg font-bold text-white">{roleToTitleCase[user.role] || user.role} Dashboard</h2>
              <div className="mt-2">
                <p className="text-sm text-blue-400">@{user.username}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {filteredMenuItems.map(item => (
                <SidebarItem 
                  key={item.name} 
                  item={item} 
                  activeMenu={activeMenu} 
                  isMobile 
                  onItemClick={() => setIsMobileMenuOpen(false)} 
                />
              ))}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};