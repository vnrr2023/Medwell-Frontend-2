"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

interface MobileNavProps {
  navItems: NavItem[]
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

  const mainNavItems = navItems.slice(0, 4)
  const additionalNavItems = navItems.slice(4)

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-screen-sm z-50"
    >
      <nav className="bg-white border border-gray-200 rounded-full shadow-lg px-6 py-2">
        <ul className="flex items-center space-x-6">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} className="flex flex-col items-center gap-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-gray-500"}`} />
                  </motion.div>
                  <span className={`text-xs font-medium ${isActive ? "text-blue-500" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
          <li className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-col items-center gap-1"
            >
              <div className="p-2 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-500">More</span>
            </motion.button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <ul className="py-2">
                    {additionalNavItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>
    </motion.div>
  )
}

