"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2 } from "lucide-react"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/patient",
      color: "text-sky-500",
    },
    {
      label: "Profile",
      icon: User,
      href: "/patient/profile",
      color: "text-violet-500",
    },
    {
      label: "Health Check",
      icon: Heart,
      color: "text-pink-700",
      href: "/patient/health-check",
    },
    {
      label: "Reports",
      icon: FileText,
      color: "text-orange-700",
      href: "/patient/reports",
    },
    {
      label: "Add Report",
      icon: PlusCircle,
      color: "text-emerald-500",
      href: "/patient/add-report",
    },
    {
      label: "Expense Tracker",
      icon: DollarSign,
      color: "text-green-700",
      href: "/patient/expense-tracker",
    },
    {
      label: "Appointments",
      icon: Calendar,
      color: "text-blue-700",
      href: "/patient/appointments",
    },
    {
      label: "Share with Doctor",
      icon: Share2,
      color: "text-indigo-500",
      href: "/patient/share-with-doctor",
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Patient Dashboard</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent" : "transparent",
                  route.color,
                )}
              >
                <route.icon className={cn("mr-2 h-4 w-4")} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

