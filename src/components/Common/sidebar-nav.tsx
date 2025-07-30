'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { 
  ChevronDownIcon,
  LayoutDashboard,
  CalendarCheck,
  History,
  Mail,
  Users,
  Box,
  Settings,
  LogOut,
  Wrench,
  Package,
  LogIn
} from 'lucide-react';
import { User } from '@/types/user';
import { menuItems } from '@/data/menu-items';
import { roleToTitleCase } from '@/types/roles';

interface SidebarNavProps {
  user: User | null;
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  logout: () => void;
}

const iconComponents = {
  LayoutDashboard: LayoutDashboard,
  CalendarCheck: CalendarCheck,
  History: History,
  Mail: Mail,
  Users: Users,
  Box: Box,
  Settings: Settings,
  Wrench: Wrench,
  Package: Package,
  LogIn: LogIn
};

const getIconComponent = (iconName: string, isSubItem = false) => {
  const Icon = iconComponents[iconName as keyof typeof iconComponents];
  if (!Icon) return <div className={`${isSubItem ? 'h-4 w-4' : 'h-5 w-5'}`} />; // Fallback
  
  const baseClass = isSubItem ? "h-4 w-4" : "h-5 w-5";

  // Warna untuk semua kemungkinan icon baik menu utama maupun sub-menu
  const colorMapping = {
    // Menu Utama
    'LayoutDashboard': 'text-blue-400',
    'CalendarCheck': 'text-green-400',
    'History': isSubItem ? 'text-green-400' : 'text-purple-400', 
    'Mail': 'text-red-400',
    'Users': 'text-yellow-400',
    'Box': 'text-teal-400',
    'Wrench': 'text-teal-400',
    'Package': 'text-teal-400',
    'Settings': 'text-gray-400',
    'LogIn': 'text-blue-400' 
  };

  const colorClass = colorMapping[iconName as keyof typeof colorMapping] || 
                    (isSubItem ? 'text-teal-400' : '');

  return <Icon className={`${baseClass} ${colorClass}`} />;
};

export const SidebarNav = ({ 
  user, 
  isMobile = false, 
  isMobileMenuOpen = false, 
  setIsMobileMenuOpen = () => {},
  logout 
}: SidebarNavProps) => {
  const pathname = usePathname();

  const activeMenu = (() => {
    if (!pathname) return 'Dashboard';
    const currentPath = pathname.split('/dashboard/')[1]?.split('/')[0] || '';
    
    const foundItem = menuItems.find(item => 
      item.href.includes(currentPath) || 
      item.items.some(subItem => subItem.href.includes(currentPath))
    );
    return foundItem?.name || 'Dashboard';
  })();

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
            {filteredMenuItems.map((item) => (
              <div key={item.name}>
                {item.items.length > 0 ? (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
                          activeMenu === item.name ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          {getIconComponent(item.icon || '')}
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4 text-current" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      {item.items.map((subItem) => (
                        <motion.div
                          key={subItem.name}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Link href={subItem.href}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-1 ${
                                pathname === subItem.href ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                              }`}
                            >
                              {getIconComponent(subItem.icon || '')}
                              <span className="ml-2">{subItem.name}</span>
                            </Button>
                          </Link>
                        </motion.div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
                          activeMenu === item.name ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                        }`}
                      >
                        {getIconComponent(item.icon || '')}
                        <span className="ml-2">{item.name}</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-[#333]">
            <Button 
              variant="ghost"
              className="w-full justify-start hover:bg-[#1a1a1a] hover:text-white text-gray-400 px-3 py-2"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </motion.aside>
      ) : isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-80"
          onClick={() => setIsMobileMenuOpen(false)}
        >
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
              {filteredMenuItems.map((item) => (
                <div key={item.name}>
                  {item.items.length > 0 ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-between hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
                            activeMenu === item.name ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            {getIconComponent(item.icon || '')}
                            <span className="ml-2">{item.name}</span>
                          </div>
                          <ChevronDownIcon className="h-4 w-4 text-current" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-6 space-y-1">
                        {item.items.map((subItem) => (
                          <motion.div
                            key={subItem.name}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Link href={subItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-1 ${
                                  pathname === subItem.href ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                                }`}
                              >
                                {getIconComponent(subItem.icon || '')}
                                <span className="ml-2">{subItem.name}</span>
                              </Button>
                            </Link>
                          </motion.div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
                            activeMenu === item.name ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                          }`}
                        >
                          {getIconComponent(item.icon || '')}
                          <span className="ml-2">{item.name}</span>
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-[#333]">
              <Button 
                variant="ghost"
                className="w-full justify-start hover:bg-[#1a1a1a] hover:text-white text-gray-400 px-3 py-2"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};