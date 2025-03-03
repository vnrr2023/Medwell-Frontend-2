"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    feedback: "This platform has completely transformed how I manage my health. It's intuitive and reliable!",
    image: "/hero/t1.jpg",
    rating: 5,
    user: {
      name: "John Doe",
      avatar: "/hero/u1.jpg",
      title: "Patient",
    },
  },
  {
    feedback: "I love the features and how seamlessly everything works. Highly recommended!",
    image: "/hero/t2.jpg",
    rating: 5,
    user: {
      name: "Jane Smith",
      avatar: "/hero/u2.jpg",
      title: "Healthcare Provider",
    },
  },
  {
    feedback: "The best decision I made was to switch to this service. It has made healthcare so convenient!",
    image: "/hero/t3.jpg",
    rating: 4,
    user: {
      name: "Alice Johnson",
      avatar: "/hero/u3.jpg",
      title: "Patient",
    },
  },
]

// Additional testimonials for the modal
const moreTestimonials = [
  {
    feedback:
      "MEDWELL has revolutionized how I manage my patients' records. It's a game-changer for healthcare providers.",
    rating: 5,
    user: {
      name: "Dr. Michael Brown",
      title: "Cardiologist",
    },
  },
  {
    feedback:
      "As someone with a chronic condition, having all my medical information in one place has been invaluable.",
    rating: 5,
    user: {
      name: "Sarah Thompson",
      title: "Patient",
    },
  },
  {
    feedback: "The AI-powered insights have helped me make more informed decisions about my health. Truly impressive!",
    rating: 4,
    user: {
      name: "David Wilson",
      title: "Patient",
    },
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-8 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-40 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="absolute bottom-40 right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 tracking-tight">What Our Users Say</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our users about their experiences and how we&apos;ve helped them manage their healthcare journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.user.name}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 },
              }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-none">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.user.name}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardHeader className="relative -mt-6 bg-white rounded-t-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex -space-x-1">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      {Array(5 - testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                    </div>
                  </div>
                  <CardTitle className="text-base font-medium text-gray-800 line-clamp-3">
                    &ldquo;{testimonial.feedback}&rdquo;
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="border-2 border-white shadow-md">
                      <AvatarImage src={testimonial.user.avatar} />
                      <AvatarFallback>{testimonial.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-800">{testimonial.user.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.user.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
  onClick={() => setIsModalOpen(true)}
  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
>
  View More Testimonials
</Button>

        </motion.div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
    <DialogHeader>
      <DialogTitle className="text-lg font-bold text-gray-900">
        More User Testimonials
      </DialogTitle>
      <DialogDescription className="text-sm text-gray-600">
        Discover what more of our users have to say about their experience with MEDWELL.
      </DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      {[...testimonials, ...moreTestimonials].map((testimonial, index) => (
        <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex -space-x-1 mb-2">
              {Array(testimonial.rating)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              {Array(5 - testimonial.rating)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
            </div>
            <CardTitle className="text-base font-medium text-gray-800">
              &ldquo;{testimonial.feedback}&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-white shadow-md">
                <AvatarFallback>{testimonial.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-800">{testimonial.user.name}</div>
                <div className="text-sm text-gray-500">{testimonial.user.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </DialogContent>
</Dialog>


    </section>
  )
}

