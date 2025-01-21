"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import Image from "next/image"

export default function Hero() {
  const words = [
    { text: "Revolutionizing" },
    { text: "healthcare" },
    { text: "with" },
    { text: "Medwell", className: "text-[#0078D7] font-bold" },
    { text: "AI", className: "text-[#00C6D7] font-bold" },
    { text: "✨" },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F4F4]/50 to-[#E0F7FA]/50 px-4 md:px-6 pt-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
        >
          <TypewriterEffect words={words} className="text-3xl md:text-4xl lg:text-5xl font-bold sm:text-left mb-4" />
          <TextGenerateEffect
            words="Empowering healthcare providers and patients with AI-driven health records and cutting-edge data analytics."
            className="text-lg md:text-xl lg:text-2xl text-[#1A1A1A] mb-8"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button className="bg-[#0078D7] hover:bg-[#005a9e] text-white text-lg px-8 py-3">Get Started</Button>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md h-[300px] md:h-[400px] lg:h-[500px]">
            <Image
              src="/bg-home.png"
              alt="AI-assisted healthcare"
              layout="fill"
              objectFit="contain"
              // className="rounded-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

