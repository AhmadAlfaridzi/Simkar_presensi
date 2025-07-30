'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function SmoothTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    if (children !== displayChildren) {
      setDisplayChildren(children)
    }
  }, [children, displayChildren])

  return (
    <div className="transition-container">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setDisplayChildren(children)
        }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-full"
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}