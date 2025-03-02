"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2 } from "lucide-react"
// import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "@/components/patient/MobileNav"
import Image from "next/image"

const navItems = [
  { label: "Dashboard", icon: Home, href: "/patient" },
  { label: "Profile", icon: User, href: "/patient/profile" },
  { label: "Health Check", icon: Heart, href: "/patient/health-check" },
  { label: "Reports", icon: FileText, href: "/patient/reports" },
  { label: "Add Report", icon: PlusCircle, href: "/patient/add-report" },
  { label: "Expense Tracker", icon: DollarSign, href: "/patient/expense-tracker" },
  { label: "Appointments", icon: Calendar, href: "/patient/appointments" },
  { label: "Share Doctor", icon: Share2, href: "/patient/share-with-doctor" },
]

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  // const segment = useSelectedLayoutSegment()

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex bg-gradient-to-b from-blue-50 to-white shadow-lg w-64 flex-col h-screen pt-16 sticky top-0 border-r border-blue-100">
        <div className="pt-4 pb-4 flex-row items-center flex px-6 border-b border-blue-100">
          <div className="bg-blue-100 p-2 rounded-full">
            <Image src="/logo.png" alt="MedWell" width={30} height={30} className="h-6 w-6" />
          </div>
          <Link
            href="/"
            className="pl-3 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent text-lg font-bold"
          >
            Welcome Patient
          </Link>
        </div>
        <nav className="flex-grow px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
                  item.href === pathname
                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.href === pathname ? "text-blue-600" : "text-slate-500"}`} />
                <span className="text-sm">{item.label}</span>
                {item.href === pathname && <div className="ml-auto w-1.5 h-5 bg-blue-500 rounded-full"></div>}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-4 mx-4 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-2">YOUR PRIMARY PHYSICIAN</p>
          <div className="flex items-center">
            <Avatar className="border-2 border-white shadow-sm">
              <AvatarImage src="/doctor/pfp.jpg" alt="Doctor" />
              <AvatarFallback className="bg-blue-100 text-blue-700">DR</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-800">Dr. John Doe</p>
              <p className="text-xs text-slate-500">ID: D12345</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav navItems={navItems} />}
    </div>
  )
}

