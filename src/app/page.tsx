"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import UseCases from "@/components/home/UseCases"
import TechStack from "@/components/home/TechStack"
import SystemDesign from "@/components/home/SystemDesign"
import Testimonials from "@/components/home/Testimonials"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Loader from "@/components/Loader"

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader onLoadingComplete={() => setLoading(false)} />
  }

  return (
    <main className="relative overflow-hidden">
      <BackgroundBeams className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <Hero />
        <Features />
        <UseCases />
        <TechStack />
        <SystemDesign />
        <Testimonials />
      </div>
    </main>
  )
}

