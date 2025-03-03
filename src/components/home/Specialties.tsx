"use client"

import { motion } from "framer-motion"
import { Heart, Brain, Bone, Eye, Smile, Baby, Microscope, Pill, Stethoscope, TreesIcon as Lungs, BabyIcon as Kidney, Dna } from 'lucide-react'
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const specialties = [
  { icon: Heart, name: "Cardiology" },
  { icon: Brain, name: "Neurology" },
  { icon: Bone, name: "Orthopedics" },
  { icon: Eye, name: "Ophthalmology" },
  { icon: Smile, name: "Dental" },
  { icon: Baby, name: "Pediatrics" },
  { icon: Microscope, name: "Pathology" },
  { icon: Pill, name: "Medicine" },
  { icon: Stethoscope, name: "General Practice" },
  { icon: Lungs, name: "Pulmonology" },
  { icon: Kidney, name: "Nephrology" },
  { icon: Dna, name: "Genetics" },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

export default function Specialties() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-8 px-4 md:px-6 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Expert Care
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 tracking-tight">Our Medical Specialties</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with expert healthcare providers across a wide range of medical specialties
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId={`specialty-bg-${index}`}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:shadow-md transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <specialty.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 mt-3 block">
                  {specialty.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  viewport={{ once: true }}
  className="mt-12 text-center"
>
  <Button
    onClick={() => setIsModalOpen(true)}
    className="px-6 py-3 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 hover:shadow-xl"
    >
    View All Specialties
  </Button>
</motion.div>
</div>
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="bg-white rounded-lg shadow-xl max-w-[90vw] md:max-w-lg p-6 max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800 text-center md:text-left">
        All Medical Specialties
      </DialogTitle>
      <DialogDescription className="text-gray-600 text-center md:text-left">
        Explore our comprehensive range of medical specialties offered at MEDWELL.
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {specialties.map((specialty) => (
        <motion.div
          key={specialty.name}
          className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all duration-300"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <specialty.icon className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-800">{specialty.name}</span>
        </motion.div>
      ))}
    </div>
  </DialogContent>
</Dialog>

    </section>
  )
}