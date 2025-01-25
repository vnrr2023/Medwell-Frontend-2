"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface CircularMetricProps {
  value: number
  max: number
  label: string
  icon: LucideIcon
  color: string
}

export function CircularMetric({ value, max, label, icon: Icon, color }: CircularMetricProps) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 38 // radius is 38

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="38" stroke="#e6e6e6" strokeWidth="6" fill="none" />
          <motion.circle
            cx="48"
            cy="48"
            r="38"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold" style={{ color }}>
          {value}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}

