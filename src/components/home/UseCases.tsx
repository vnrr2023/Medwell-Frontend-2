"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const useCases = [
  {
    title: "Patient / Family Members",
    description:
      "The patients can use the interface to accurately track health related problems and if need arises take necessary actions.",
  },
  {
    title: "Doctors",
    description: "Easily check patient records for previous cases and give a diagnosis based on the available data.",
  },
  {
    title: "Insurance Companies",
    description:
      "Insurance companies need to verify the authenticity of the claim before dispersing the money. This process can be sped up using the authenticated data on the platform.",
  },
  {
    title: "Laboratories",
    description:
      "Lab specialist can directly update the patient data and send the report to patient through the interface.",
  },
]

export default function UseCases() {
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
        Use Cases
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {useCases.map((useCase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-[#0078D7]">{useCase.title}</h3>
            <p className="text-[#1A1A1A]">{useCase.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

