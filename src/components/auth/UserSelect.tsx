"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { User, Building2, Stethoscope, ArrowRight } from "lucide-react"

const userTypes = [
  {
    id: "patient",
    title: "Patient",
    description: "Access your medical records and appointments",
    icon: User,
    image: "/auth/patient.jpg",
    color: "#7C3AED",
    gradient: "from-[#7C3AED] to-[#9F7AEA]",
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Manage your practice and patient care",
    icon: Stethoscope,
    image: "/auth/doctor.jpg",
    color: "#10B981",
    gradient: "from-[#10B981] to-[#34D399]",
  },
  {
    id: "hospital",
    title: "Hospital",
    description: "Administer your healthcare facility",
    icon: Building2,
    image: "/auth/hospital.jpg",
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
  },
]

export default function UserSelect() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-white flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="pt-16 text-3xl md:text-4xl font-bold text-gray-800 mb-3">Welcome to MedWell</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Please select your user type to continue with the appropriate experience
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            variants={cardVariants}
            className="relative"
            onMouseEnter={() => setHoveredCard(type.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCard(type.id)}
          >
            <motion.div
              className={`
                h-full w-full rounded-2xl overflow-hidden cursor-pointer
                border-2 transition-all duration-300 shadow-lg
                ${selectedCard === type.id ? `border-${type.color}` : "border-transparent"}
                ${hoveredCard === type.id ? "shadow-xl transform -translate-y-1" : ""}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-90`}></div>
                  <Image
                    src={type.image || "/placeholder.svg"}
                    alt={type.title}
                    fill
                    className="object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <type.icon className="h-16 w-16 text-white" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{type.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{type.description}</p>

                  <Link href={`/auth/${type.id}/login`} className="w-full">
                    <motion.button
                      className={`
                        w-full py-3 px-4 rounded-full flex items-center justify-center
                        text-white font-medium transition-all duration-300
                        bg-gradient-to-r ${type.gradient}
                      `}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>Continue</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-center text-gray-500 text-sm"
      >
        <p>
          Need help?{" "}
          <a href="#" className="text-[#7C3AED] hover:underline">
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  )
}
