import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { QueryProvider } from "@/components/QueryProvider"

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
      <body className="font-sans">
        <QueryProvider>
          <div className="min-h-screen bg-[#F5F5F5] text-[#212121] relative">
            <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none" />
            <div className="relative z-10">
              <Navbar />
              {children}
              <Footer />
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
