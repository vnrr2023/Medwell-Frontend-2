"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export const WobbleCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const maxDistance = Math.min(rect.width, rect.height) / 2
      const normalizedX = distanceX / maxDistance
      const normalizedY = distanceY / maxDistance
      x.set(normalizedX * 10)
      y.set(normalizedY * 10)
    }

    if (hovered) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hovered, x, y])

  return (
    <motion.div
      ref={ref}
      className={`${className} relative overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        x.set(0)
        y.set(0)
      }}
      style={{
        rotateX: xSpring,
        rotateY: ySpring,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  )
}

