'use client'

import Link from 'next/link'
import { ChevronDownIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { getIconComponent } from '@/lib/getIconComponent'
import { MenuItem } from '@/data/menu-items'

interface SidebarItemProps {
  item: MenuItem;
  activeMenu: string;
  isMobile?: boolean;
  onItemClick: () => void;
}

export const SidebarItem = ({ item, activeMenu, onItemClick }: SidebarItemProps) => {
  return item.items.length > 0 ? (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
            activeMenu.startsWith(item.href) ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
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
          <motion.div key={subItem.name} whileHover={{ scale: 1.02 }}>
            <Link href={subItem.href} onClick={onItemClick}>
              <Button
                variant="ghost"
                className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-1 ${
                  activeMenu.startsWith(subItem.href) ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
                }`}
              >
                {getIconComponent(subItem.icon || '', true)}
                <span className="ml-2">{subItem.name}</span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link href={item.href} onClick={onItemClick}>
        <Button
          variant="ghost"
          className={`w-full justify-start hover:bg-[#1a1a1a] hover:text-white px-3 py-2 ${
            item.href === location.pathname ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
          }`}
        >
          {getIconComponent(item.icon || '')}
          <span className="ml-2">{item.name}</span>
        </Button>
      </Link>
    </motion.div>
  );
};
