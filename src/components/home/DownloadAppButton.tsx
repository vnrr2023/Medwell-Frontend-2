"use client"

import { motion } from "framer-motion"
import { Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DownloadAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-4"
    >
      <Link href="/app-download">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download App
        </Button>
      </Link>
    </motion.div>
  )
}

