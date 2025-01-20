import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"
import TechStack from "@/components/TechStack"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#212121]">
      <Navbar />
      <Hero />
      <Features />
      <TechStack />
      <Testimonials />
      <Footer />
      <BackgroundBeams />
    </main>
  )
}

