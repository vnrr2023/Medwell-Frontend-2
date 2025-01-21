import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BackgroundBeams } from "@/components/ui/background-beams"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medwell AI - Revolutionizing Healthcare",
  description:
    "Empowering healthcare providers and patients with AI-driven health records and cutting-edge data analytics.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#F5F5F5] text-[#212121] relative">
          <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none" />
          <div className="relative z-10">
            <Navbar />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}

