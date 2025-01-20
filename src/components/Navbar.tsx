"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, User, Briefcase, DollarSign, Info, Search, Menu, X } from "lucide-react"
import Link from "next/link"

const Links = [
  { name: "Home", link: "/", icon: Home },
  { name: "Patient", link: "/patient", icon: User },
  { name: "Doctor", link: "/doctor", icon: Briefcase },
  { name: "Hospital", link: "/hospital", icon: Briefcase },
  { name: "Pricing", link: "/pricing", icon: DollarSign },
  { name: "About", link: "/about", icon: Info },
  { name: "DoctorSearch", link: "/doctorsearch", icon: Search },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#1E88E5]">
              Medwell
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {Links.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-gray-600 hover:text-[#1E88E5] px-3 py-2 rounded-md text-sm font-medium"
                >
                  <item.icon className="inline-block w-5 h-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {Links.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-gray-600 hover:text-[#1E88E5] block px-3 py-2 rounded-md text-base font-medium"
              >
                <item.icon className="inline-block w-5 h-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

