import type { Metadata } from "next"
import "./globals.css"
import { Suspense, lazy } from "react"
import { Inter } from "next/font/google"
// import { BackgroundBeams } from "@/components/ui/background-beams"
import { QueryProvider } from "@/components/QueryProvider"

const Navbar = lazy(() => import("@/components/Navbar"))

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
        <QueryProvider>
          <div className="min-h-screen bg-[#F5F5F5] text-[#212121] relative">
           /* <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none" /> */
            <div className="relative z-10">
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
              </Suspense>
              {children}
              
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}