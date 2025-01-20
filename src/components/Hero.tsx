"use client"

import { Button } from "@/components/ui/button"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import Image from "next/image"

export default function Hero() {
  const words = [
    { text: "Revolutionizing" },
    { text: "healthcare" },
    { text: "with" },
    { text: "Medwell", className: "text-[#1E88E5] font-bold" },
    { text: "✨" },
  ]

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] to-[#E0F7FA] px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <TypewriterEffect words={words} className="text-4xl md:text-5xl text-left font-bold mb-4" />
          <TextGenerateEffect
            words="Empowering healthcare providers and patients with seamless access to health records and cutting-edge data analytics."
            className="text-xl md:text-2xl text-[#757575] mb-8"
          />
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white text-lg px-8 py-3">Get Started</Button>
        </div>
        <div className="md:w-1/2">
          {/* Add an image of a diverse group of healthcare professionals */}
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image
              src="/doctor-group.jpg"
              alt="Healthcare professionals"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

