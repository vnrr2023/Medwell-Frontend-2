import type { Metadata } from "next"
import "./globals.css"
import { Suspense, lazy } from "react"
import { QueryProvider } from "@/components/QueryProvider"

const Navbar = lazy(() => import("@/components/Navbar"))

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
      <body>
        <QueryProvider>
          <div className="min-h-screen bg-[#F5F5F5] text-[#212121] relative">
            <div className="relative z-10">
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
              {children}
              </Suspense>
              
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}