"use client"

import { motion } from "framer-motion"
import { History, FileText, Video, Brain, Shield, UserPlus, Zap, Smartphone } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Features() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-8 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10" />

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Why Choose MEDWELL?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 tracking-tight">
            Experience the Future of Healthcare
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Our innovative features make managing your health easier than ever before
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId={`feature-bg-${index}`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.3 }}
  className="mt-12 flex justify-center"
>
  <motion.button
    onClick={() => setIsModalOpen(true)}
    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md border border-white/20 transition-all duration-300"
    whileHover={{ 
      scale: 1.05, 
      boxShadow: "0px 0px 18px rgba(100, 149, 237, 0.5)", 
      background: "linear-gradient(to right, #6a5acd, #8a2be2)" 
    }}
    whileTap={{ scale: 0.98 }}
  >
    View All Features
  </motion.button>
</motion.div>
</div>
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="bg-white rounded-lg shadow-xl max-w-[95vw] md:max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800 text-center md:text-left">
        All MEDWELL Features
      </DialogTitle>
      <DialogDescription className="text-gray-600 text-center md:text-left">
        Explore the full range of features that MEDWELL offers to enhance your healthcare experience.
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 shadow-sm transition-all duration-300"
          whileHover={{ scale: 1.03, boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <feature.icon className="w-5 h-5 mr-2 text-blue-500" />
            {feature.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </DialogContent>
</Dialog>


    </section>
  )
}

