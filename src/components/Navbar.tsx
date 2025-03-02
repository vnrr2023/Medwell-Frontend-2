"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Briefcase, DollarSign, Info, Search, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useAuth } from "@/services/useAuth"

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
  const [token, setToken] = useState<string | null>(null)

  const { logout } = useAuth()

  useEffect(() => {
    const updateToken = () => {
      setToken(localStorage.getItem("Token"))
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    updateToken()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="text-2xl font-bold text-text-dark hover:text-primary transition-colors duration-300"
            >
              <span className="text-[#50b0fe]">Medwell</span>
              <span className="text-[#ff7070]">AI</span>
            </Link>
          </motion.div>
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {Links.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.link}
                    className={`text-text-dark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group flex items-center ${
                      scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-1.5" />
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </Link>
                </motion.div>
              ))}
              {token && (
                <Button variant="outline" className="ml-2 hover:bg-gray-200 text-text-dark" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-dark hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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
            className="lg:hidden bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden"
          >
            <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4">
              {Links.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-text-dark hover:text-primary hover:bg-gray-50 block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-300 relative group flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="inline-block w-5 h-5 mr-2.5 text-gray-500" />
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
              {token && (
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-50 text-text-dark mt-2"
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="w-5 h-5 mr-2.5 text-gray-500" />
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
