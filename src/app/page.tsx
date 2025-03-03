"use client"
import { Suspense, lazy, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Loader from "@/components/Loader"
import { motion, AnimatePresence } from "framer-motion"

const Consultation = lazy(() => import("@/components/home/Consultation"))
const Specialties = lazy(() => import("@/components/home/Specialties"))
const Testimonials = lazy(() => import("@/components/home/Testimonials"))
const FAQ = dynamic(() => import("@/components/home/Faqs"), { ssr: false })
const Footer = lazy(() => import("@/components/Footer"))

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
    <AnimatePresence mode="wait">
      <motion.main
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />

        <Hero />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Features />
        </motion.div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <Loader onLoadingComplete={() => {}} />
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Consultation />
          </motion.div>
        </Suspense>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <Loader onLoadingComplete={() => {}} />
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Specialties />
          </motion.div>
        </Suspense>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <Loader onLoadingComplete={() => {}} />
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Testimonials />
          </motion.div>
        </Suspense>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <FAQ />
        </motion.div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-primary">Loading...</div>
            </div>
          }
        >
          <Footer />
        </Suspense>
      </motion.main>
    </AnimatePresence>
  )
}

