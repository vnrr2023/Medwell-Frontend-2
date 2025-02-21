"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Users } from "lucide-react"
import Link from "next/link"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

export default function Hero() {
  return (
    <section className="py-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 text-sm text-green-600 mb-4"
          >
            <Users className="h-4 w-4" />
            <span>Trusted by thousands of patients & healthcare providers</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Your Medical History
            <br />
            Simplified with
            <br />
            <span className="text-primary underline decoration-2">MEDWELL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Track your medical history, understand your reports with AI-powered analytics, and access healthcare
            providers remotely - all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <InteractiveHoverButton>
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors duration-300" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </InteractiveHoverButton>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -left-4 top-1/2 space-y-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary"></div>
            <div className="w-8 h-8 rounded-full bg-primary/60"></div>
            <div className="w-8 h-8 rounded-full bg-primary/30"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

