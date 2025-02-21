"use client"

import { motion } from "framer-motion"
import { History, FileText, Video, Brain } from "lucide-react"

const features = [
  {
    icon: History,
    title: "Lifetime Medical History",
    description: "Keep track of your medical history spanning decades in one secure, easily accessible platform.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    description: "Advanced data analytics to help you understand your medical reports and make informed decisions.",
  },
  {
    icon: Video,
    title: "Remote Healthcare",
    description: "Access healthcare providers remotely through secure video consultations and chat support.",
  },
  {
    icon: FileText,
    title: "Smart Report Analysis",
    description: "Get simplified, easy-to-understand interpretations of your medical reports and test results.",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose MEDWELL?</h2>
          <p className="text-xl text-gray-600">Revolutionizing healthcare management with technology</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

