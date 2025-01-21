"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const testimonials = [
  { comment: "The AI-powered health tips have been life-changing!", author: "Vivek" },
  { comment: "Medwell's AI diagnosis caught an issue my doctor missed. Incredible!", author: "Nishi" },
  { comment: "The predictive care feature helped me prevent a major health issue.", author: "Rehan" },
  { comment: "AI-driven mental health insights are spot-on and so helpful.", author: "Rohit" },
  { comment: "Medwell explains complex medical AI in a way anyone can understand.", author: "Azlaan" },
  { comment: "As a fitness enthusiast, the AI-powered nutrition guides are a game-changer.", author: "Shah" },
  { comment: "The AI recommendations have improved my family's health choices.", author: "Lavanya" },
  { comment: "Medwell's AI analysis of medical trends is impressive and reliable.", author: "Bilal" },
  { comment: "I'm amazed at how AI covers all aspects of health and wellness here.", author: "Affan" },
]

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 px-4 md:px-6 bg-[#E0F7FA]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#0078D7]"
      >
        What Our Users Say About AI-Powered Medwell
      </motion.h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-lg mb-4 italic">&quot;{testimonial.comment}&quot;</p>
            <p className="font-bold text-right">- {testimonial.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

