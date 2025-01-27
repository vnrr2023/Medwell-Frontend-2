"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Heart, FileText, PlusCircle, DollarSign, Calendar, Share2 } from "lucide-react"
// import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "@/components/patient/MobileNav"

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

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex md:flex-col bg-white shadow-lg w-64 h-screen pt-16 fixed left-0 top-0 overflow-y-auto">
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
              <AvatarImage src="/patient.png" alt="Patient" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">ID: P12345</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav navItems={navItems} />}
    </div>
  )
}

