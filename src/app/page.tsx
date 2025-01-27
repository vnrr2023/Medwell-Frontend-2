"use client"
import { Suspense, lazy } from "react"
import dynamic from "next/dynamic"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Loader from "@/components/Loader"

const Consultation = lazy(() => import("@/components/home/Consultation"))
const Specialties = lazy(() => import("@/components/home/Specialties"))
const Testimonials = lazy(() => import("@/components/home/Testimonials"))
const FAQ = dynamic(() => import("@/components/home/Faqs"), { ssr: false })
const Footer = lazy(() => import("@/components/Footer"))

export default function Home() {
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false)
  //   }, 2000)

  //   return () => clearTimeout(timer)
  // }, [])

  // if (loading) {
  //   return <Loader onLoadingComplete={() => setLoading(false)} />
  // }

  return (
    <main className="relative">
      <Hero />
      <Features />
      <Suspense fallback={<Loader onLoadingComplete={() => {}} />}>
        <Consultation />
      </Suspense>
      <Suspense fallback={<Loader onLoadingComplete={() => {}} />}>
        <Specialties />
      </Suspense>
      <Suspense fallback={<Loader onLoadingComplete={() => {}} />}>
        <Testimonials />
      </Suspense>
      <FAQ />
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </main>
  )
}
