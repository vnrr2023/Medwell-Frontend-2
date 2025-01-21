"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#0078D7]">Medwell</span>
              <span className="text-[#00C6D7]">AI</span>
            </Link>
          </motion.div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {Links.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.link}
                    className={`text-[#1A1A1A] hover:text-[#0078D7] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="inline-block w-5 h-5 mr-1" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#1A1A1A] hover:text-[#0078D7] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0078D7]"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {Links.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-[#1A1A1A] hover:text-[#0078D7] hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                >
                  <item.icon className="inline-block w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

