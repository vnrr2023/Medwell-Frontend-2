"use client"

import { Brain, Dna, Stethoscope, Lock, Zap, HeartPulse } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const features = [
  {
    Icon: Brain,
    title: "AI Diagnosis",
    description: "Advanced AI algorithms for accurate medical diagnoses",
    color: "#0078D7",
  },
  {
    Icon: Dna,
    title: "Genetic Analysis",
    description: "Comprehensive genetic profiling for personalized treatment",
    color: "#00C6D7",
  },
  {
    Icon: Stethoscope,
    title: "Remote Monitoring",
    description: "24/7 patient monitoring with real-time alerts",
    color: "#4CAF50",
  },
  {
    Icon: Lock,
    title: "Secure Platform",
    description: "Enterprise-grade security for sensitive medical data",
    color: "#FFD700",
  },
  {
    Icon: Zap,
    title: "Instant Insights",
    description: "Real-time data analytics for quick decision making",
    color: "#D72638",
  },
  {
    Icon: HeartPulse,
    title: "Predictive Care",
    description: "AI-powered predictions for preventive healthcare",
    color: "#0078D7",
  },
]

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 px-4 md:px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#0078D7]"
      >
        Our AI-Powered Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <feature.Icon className="h-12 w-12 mb-4" style={{ color: feature.color }} />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-[#1A1A1A]">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

