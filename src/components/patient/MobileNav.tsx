"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from 'lucide-react'
import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  primary?: boolean
}

interface MobileNavProps {
  navItems: NavItem[]
}

export function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  // Find the primary item (if any)
  const primaryItemIndex = navItems.findIndex((item) => item.primary)

  // Determine which items go in the main nav vs more menu
  const visibleItems = useMemo(() => {
    // If we have a primary item, we want 2 items on each side
    if (primaryItemIndex !== -1) {
      const maxMainItems = 5 // Total of 5 items including primary
      const itemsBeforePrimary = Math.min(2, primaryItemIndex)
      const itemsAfterPrimary = Math.min(2, navItems.length - primaryItemIndex - 1)

      // If we have less than max items, show all
      if (navItems.length <= maxMainItems) {
        return { mainNavItems: navItems, moreNavItems: [] }
      }

      // Otherwise, distribute items around the primary item
      const mainNavItems = [
        ...navItems.slice(primaryItemIndex - itemsBeforePrimary, primaryItemIndex),
        navItems[primaryItemIndex],
        ...navItems.slice(primaryItemIndex + 1, primaryItemIndex + 1 + itemsAfterPrimary),
      ]

      // Remaining items go in the more menu
      const moreNavItems = [
        ...navItems.slice(0, primaryItemIndex - itemsBeforePrimary),
        ...navItems.slice(primaryItemIndex + 1 + itemsAfterPrimary),
      ]

      return { mainNavItems, moreNavItems }
    } else {
      // No primary item, just take the first 4 items
      const mainNavItems = navItems.slice(0, 4)
      const moreNavItems = navItems.slice(4)
      return { mainNavItems, moreNavItems }
    }
  }, [navItems, primaryItemIndex])

  const toggleShowMore = useCallback(() => setShowMore((prev) => !prev), [])

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 px-4">
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 left-0 right-0 bg-white rounded-lg shadow-md mx-4"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
              {visibleItems.moreNavItems.slice(0, 4).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center p-2"
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        isActive ? "text-primary" : "text-gray-500"
                      )}
                    />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                );
              })}
              </div>
              
              {visibleItems.moreNavItems.length > 4 && (
                <div className="flex justify-between items-start mt-6">
                  {visibleItems.moreNavItems.slice(4, 8).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center p-2"
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-colors duration-200",
                            isActive ? "text-primary" : "text-gray-500"
                          )}
                        />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex items-center justify-between bg-white rounded-full py-2 px-6 shadow-md">
        {visibleItems.mainNavItems.map((item) => {
          const isActive = pathname === item.href

          // If this is the primary item, render it with special styling
          if (item.primary) {
            return (
              <Link key={item.href} href={item.href} className="flex items-center justify-center">
                <div className="bg-primary rounded-full p-3 shadow-sm">
                  <item.icon className="w-5 h-5 text-white" />
                  <span className="sr-only">{item.label}</span>
                </div>
              </Link>
            )
          }

          // Regular nav items
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center p-2">
              <item.icon
                className={cn("w-5 h-5 transition-colors duration-200", isActive ? "text-primary" : "text-gray-500")}
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          )
        })}

        {visibleItems.moreNavItems.length > 0 && (
          <button
            onClick={toggleShowMore}
            className="flex flex-col items-center p-2 relative"
            aria-label="More options"
            aria-expanded={showMore}
          >
            <MoreHorizontal
              className={cn("w-5 h-5 transition-colors duration-200", showMore ? "text-blue-500" : "text-gray-500")}
            />
            <span className="sr-only">More</span>
            {showMore && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        )}
      </nav>
    </div>
  )
}
