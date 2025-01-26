"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

interface MobileNavProps {
  navItems: NavItem[]
}

export function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const mainNavItems = useMemo(() => navItems.slice(0, 4), [navItems])
  const moreNavItems = useMemo(() => navItems.slice(4), [navItems])

  const toggleShowMore = useCallback(() => setShowMore((prev) => !prev), [])

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50">
      <nav className="flex items-center justify-around">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2 text-sm">
              <item.icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-gray-600"}`} />
              <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-600"}`}>{item.label}</span>
            </Link>
          )
        })}
        <button onClick={toggleShowMore} className="flex flex-col items-center gap-1 p-2 text-sm">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">More</span>
        </button>
      </nav>
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-full left-0 right-0 bg-white border-t shadow-lg"
          >
            <nav className="grid grid-cols-4 gap-4 p-4">
              {moreNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2 text-sm">
                    <item.icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-gray-600"}`} />
                    <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-600"}`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

