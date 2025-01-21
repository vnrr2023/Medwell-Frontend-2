"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiAmazon,
  SiPython,
  SiDjango,
  SiMysql,
  SiPandas,
} from "react-icons/si"
import { FaDatabase, FaRobot } from "react-icons/fa"

const techStack = [
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "AWS", Icon: SiAmazon, color: "#FF9900" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "Django", Icon: SiDjango, color: "#092E20" },
  { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  { name: "Pandas", Icon: SiPandas, color: "#150458" },
  { name: "LangChain", Icon: FaRobot, color: "#00A67E" },
  { name: "And More", Icon: FaDatabase, color: "#6C63FF" },
]

export default function TechStack() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 px-4 md:px-6 bg-[#FAFAFA]/50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#0078D7]"
      >
        Our Tech Stack
      </motion.h2>
      <div className="flex flex-wrap justify-center items-center gap-8 max-w-6xl mx-auto">
        {techStack.map(({ name, Icon, color }, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <Icon className="w-16 h-16 mb-2" style={{ color }} />
            <span className="text-lg font-semibold">{name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

