"use client"

import { motion } from "framer-motion"
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Smile,
  Baby,
  Microscope,
  Pill,
  Stethoscope,
  TreesIcon as Lungs,
  BabyIcon as Kidney,
  Dna,
} from "lucide-react"

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

export default function Specialties() {
  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Medical Specialties</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with expert healthcare providers across a wide range of medical specialties
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors duration-300 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <specialty.icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">
                {specialty.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600">
            Can&apos;t find your specialty?{" "}
            <a href="https://www.google.com/search?q=medical+specialties&oq=medical+spec&gs_lcrp=EgZjaHJvbWUqBwgAEAAYgAQyBwgAEAAYgAQyBwgBEAAYgAQyBggCEEUYOTIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDINCAcQLhjHARjRAxiABDIHCAgQABiABDIHCAkQABiABNIBCDM1NDhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8" className="text-primary hover:underline">
              View all specialties
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

