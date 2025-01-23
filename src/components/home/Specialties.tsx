"use client"

import { motion } from "framer-motion"
import { Heart, Brain, Bone, Eye, SmileIcon as Tooth, Baby, Microscope, Pill } from "lucide-react"

const specialties = [
  { icon: Heart, name: "Cardiology" },
  { icon: Brain, name: "Neurology" },
  { icon: Bone, name: "Orthopedics" },
  { icon: Eye, name: "Ophthalmology" },
  { icon: Tooth, name: "Dental" },
  { icon: Baby, name: "Pediatrics" },
  { icon: Microscope, name: "Pathology" },
  { icon: Pill, name: "Medicine" },
]

export default function Specialties() {
  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our consulting specialities</h2>
          <p className="text-xl text-gray-600">
            Talk to doctor online and get quick medical advice for your health queries. Our medical panel consists of
            over 3500+ doctors across 80+ specialities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <specialty.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium">{specialty.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

