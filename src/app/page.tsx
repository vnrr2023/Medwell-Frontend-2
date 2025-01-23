"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Consultation from "@/components/home/Consultation"
import Specialties from "@/components/home/Specialties"
import Articles from "@/components/home/Articles"
import Faqs from "@/components/home/Faqs"
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
    <main className="relative">
      <Hero />
      <Features />
      <Consultation />
      <Specialties />
      <Articles />
      <Faqs />
    </main>
  )
}

