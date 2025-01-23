"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does MEDWELL help manage medical history?",
    answer:
      "MEDWELL provides a secure digital platform to store and organize your entire medical history, including reports, prescriptions, and consultations. Our AI-powered system helps categorize and analyze this information for easy access and understanding.",
  },
  {
    question: "How does the AI report analysis work?",
    answer:
      "Our AI system analyzes your medical reports and presents the information in an easy-to-understand format. It highlights key findings, explains medical terminology, and provides contextual information to help you better understand your health status.",
  },
  {
    question: "Is my medical data secure on MEDWELL?",
    answer:
      "Yes, MEDWELL implements enterprise-grade security measures and follows HIPAA compliance guidelines to ensure your medical data is fully protected. We use end-to-end encryption and secure servers to safeguard your information.",
  },
  {
    question: "Can I consult doctors remotely through MEDWELL?",
    answer:
      "Yes, MEDWELL offers multiple ways to connect with healthcare providers remotely, including video consultations, chat support, and phone calls. You can easily schedule appointments and get professional medical advice from the comfort of your home.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Learn more about how MEDWELL can help you manage your healthcare journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

