"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Users, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

// Text animation variants
// const textVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08,
//       delayChildren: 0.5,
//     },
//   },
// }

// const letterVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// }

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-full w-fit mb-6"
          >
            <Users className="h-4 w-4" />
            <span>Trusted by thousands of patients & providers</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Medical History
            <br />
            Simplified with
            <br />
            <motion.span className="relative inline-block">
  {/* Animated background expanding behind text */}
  <motion.div
    className="absolute -z-10 inset-0 rounded-lg"
    initial={{ width: 0 }}
    animate={{ width: "100%" }}
    transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
  />

  {/* Typing effect on text */}
  <motion.div
    initial={{ clipPath: "inset(0 100% 0 0)" }}
    animate={{ clipPath: "inset(0 0% 0 0)" }}
    transition={{
      duration: 3.5,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "reverse",
    }}
    className="bg-gradient-to-r from-red-500 to-blue-500 text-transparent bg-clip-text font-extrabold"
  >
    MEDWELL...
  </motion.div>
</motion.span>

          </motion.h1>

          <motion.p variants={itemVariants} className="text-gray-600 mb-8 text-lg max-w-xl">
            Track your medical history, understand your reports with AI-powered analytics, and access healthcare
            providers remotely - all in one secure platform.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
  size="lg"
  className="relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg border border-white/10 transition-all duration-300 group overflow-hidden"
  asChild
>

  <Link href="/auth" className="flex items-center gap-2 px-6 py-3">
    Get Started
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
    {/* Subtle glowing effect */}
    <span className="absolute inset-0 bg-white opacity-10 blur-lg group-hover:opacity-20 transition-opacity"></span>
  </Link>
</Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                >
                  {i}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">Join thousands of satisfied users</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative"
        >
          <motion.div
            className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/5 blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            className="relative z-10 rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/hero/img3.png"
              alt="Doctor"
              width={600}
              height={600}
              className="rounded-2xl"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute -left-4 top-1/2 space-y-2"
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-primary"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <motion.div
              className="w-8 h-8 rounded-full bg-primary/60"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: 0.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <motion.div
              className="w-8 h-8 rounded-full bg-primary/30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute -right-4 -bottom-4 bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">24/7 Support Available</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg p-6">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
        Learn More About <span className="text-primary">MEDWELL</span>
      </DialogTitle>
      <DialogDescription className="text-gray-600 dark:text-gray-300">
        MEDWELL is a comprehensive healthcare management platform designed to simplify your medical journey.
        Here&apos;s what you can expect:
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <p><strong>🔒 Secure Medical History:</strong> Store and access your complete medical records in one place.</p>
      <p><strong>🤖 AI-Powered Insights:</strong> Get personalized health recommendations based on your medical data.</p>
      <p><strong>📞 Remote Consultations:</strong> Connect with healthcare providers via video calls, chat, or phone.</p>
      <p><strong>📊 Smart Report Analysis:</strong> Understand your medical reports with easy-to-read insights.</p>
      <p><strong>👨‍👩‍👧‍👦 Family Health Management:</strong> Manage health records for your entire family in one account.</p>
      <p><strong>🚨 Emergency Access:</strong> Provide critical health information to emergency responders instantly.</p>
    </div>
  </DialogContent>
</Dialog>
    </section>
  )
}