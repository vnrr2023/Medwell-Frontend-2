"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MessageSquare, Phone, Video, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const consultationMethods = [
  { icon: FileText, label: "Upload Reports" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Phone, label: "Phone" },
  { icon: Video, label: "Video" },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const chatVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

export default function Consultation() {
  return (
    <section className="py-8 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Remote Healthcare
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gray-800 tracking-tight">Access Healthcare Anywhere, Anytime</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your medical reports, get AI-powered insights, and consult with healthcare providers through multiple
            channels. Our platform makes healthcare accessible from the comfort of your home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl transform -translate-x-4 translate-y-4" />

            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src="/hero/img1.jpg"
                  alt="Doctor Chat"
                  width={500}
                  height={500}
                  className="rounded-2xl"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                />
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg"
              >
                <div className="space-y-3">
                  {consultationMethods.map((method, index) => (
                    <motion.div
                      key={method.label}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 justify-start hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all duration-300"
                      >
                        <method.icon className="w-4 h-4" />
                        {method.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.div
              variants={chatVariants}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform-gpu"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-700 mb-1">Hello! I&apos;m suffering from fever since 2 days.</p>
                  <p className="text-sm text-gray-500">Patient • 10:30 AM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={chatVariants}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform-gpu"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-700 mb-1">
                    I can help you with that. What other symptoms do you have? Any headache or body pain?
                  </p>
                  <p className="text-sm text-gray-500">Dr. Sarah • 10:32 AM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={chatVariants}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform-gpu"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-700 mb-1">Yes, I have a mild headache and my temperature is 101°F.</p>
                  <p className="text-sm text-gray-500">Patient • 10:35 AM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg shadow-primary/20 font-medium transition-all duration-300"
              >
                Start a Consultation
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

