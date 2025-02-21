"use client"

import { motion } from "framer-motion"
import { History, FileText, Video, Brain, Shield, UserPlus, Zap, Smartphone } from "lucide-react"

const features = [
  {
    icon: History,
    title: "Lifetime Medical History",
    description: "Securely store and access your complete medical history in one place.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    description: "Get intelligent insights and personalized health recommendations.",
  },
  {
    icon: Video,
    title: "Remote Consultations",
    description: "Connect with healthcare providers through secure video calls.",
  },
  {
    icon: FileText,
    title: "Smart Report Analysis",
    description: "Understand your medical reports with easy-to-read interpretations.",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your health data is protected with enterprise-grade encryption.",
  },
  {
    icon: UserPlus,
    title: "Family Health Management",
    description: "Manage health records for your entire family in one account.",
  },
  {
    icon: Zap,
    title: "Quick Emergency Access",
    description: "Provide critical health information to emergency responders instantly.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Access your health information on-the-go with our mobile app.",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose MEDWELL?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of healthcare management with our innovative features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

