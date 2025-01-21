import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import UseCases from "@/components/UseCases"
import TechStack from "@/components/TechStack"
import SystemDesign from "@/components/SystemDesign"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#212121] relative">
      <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <UseCases />
        <TechStack />
        <SystemDesign />
        <Testimonials />
        <Footer />
      </div>
    </main>
  )
}

