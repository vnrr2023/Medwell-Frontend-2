"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"

export default function SystemDesign() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 px-4 md:px-6 bg-white/50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#0078D7]"
      >
        System Design
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <Image src="/system-design.jpg" alt="System Design" layout="fill" objectFit="contain" className="rounded-lg" />
        </div>
      </motion.div>
    </section>
  )
}

