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

export default function Consultation() {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Access Healthcare Anywhere, Anytime</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your medical reports, get AI-powered insights, and consult with healthcare providers through multiple
            channels. Our platform makes healthcare accessible from the comfort of your home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="/hero/img1.jpg"
              alt="Doctor Chat"
              width={500}
              height={500}
              className="rounded-2xl"
            />
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg">
              <div className="space-y-4">
                {consultationMethods.map((method) => (
                  <Button key={method.label} variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <method.icon className="w-4 h-4" />
                    {method.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-600">Hello! I&apos;m suffering from fever since 2 days.</p>
                  <p className="text-sm text-gray-400">Patient</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-600">I can help you with that. What other symptoms do you have?</p>
                  <p className="text-sm text-gray-400">Doctor</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}