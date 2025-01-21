import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import UseCases from "@/components/home/UseCases"
import TechStack from "@/components/home/TechStack"
import SystemDesign from "@/components/home/SystemDesign"
import Testimonials from "@/components/home/Testimonials"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function Home() {
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

