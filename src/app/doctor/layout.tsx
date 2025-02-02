"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Users, Calendar, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "@/components/doctor/MobileNav"
import React from "react"; // Added import for React

const navItems = [
  { label: "Dashboard", icon: Home, href: "/doctor" },
  { label: "Profile", icon: User, href: "/doctor/profile" },
  { label: "Patients", icon: Users, href: "/doctor/patients" },
  { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
  { label: "Marketing", icon: Mail, href: "/doctor/marketing" },
]

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex bg-white shadow-lg w-64 flex-col h-screen pt-16 sticky top-0">
        <div className="p-4 bg-blue-100">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            MedWell
          </Link>
        </div>
        <nav className="flex-grow p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-2 rounded-lg mb-2 ${
                item.href === pathname ? "bg-gray-200 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/doctor/pfp.jpg" alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Dr. John Doe</p>
              <p className="text-xs text-gray-500">ID: D12345</p>
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
