import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LoaderProps {
  onLoadingComplete: () => void
}

export default function Loader({ onLoadingComplete }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onLoadingComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="loading"
      >
        <svg width="128" height="96" viewBox="0 0 128 96">
          <polyline
            points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
            className="fill-none stroke-[#ff4d5033] stroke-[6] stroke-round"
          />
          <motion.polyline
            points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
            className="fill-none stroke-[#ff4d4f] stroke-[6] stroke-round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

