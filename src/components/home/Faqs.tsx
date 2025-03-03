"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from "lucide-react";

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
  {
    question: "How can I share my medical records with my doctor?",
    answer:
      "MEDWELL makes it easy to share your medical records with healthcare providers. You can generate secure, time-limited access links or directly share specific records with your doctor through our platform, ensuring they have all the information they need for your care.",
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function FAQ() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-8 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gray-800 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about how MEDWELL can help you manage your healthcare journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-2xl shadow-md p-6 md:p-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border-b border-gray-100 py-2">
                  <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact Support Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Still have questions? {" "}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:underline font-medium"
            >
              Contact our support team
            </button>
          </p>
        </motion.div>
      </div>

      {/* Contact Support Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Contact Support</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Have a question? Fill out the form below and we will get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form className="mt-4 space-y-4">
            <Input placeholder="Your Name" className="w-full" required />
            <Input type="email" placeholder="Your Email" className="w-full" required />
            <Textarea placeholder="Describe your issue or question" className="w-full" required />
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
