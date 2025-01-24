"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    feedback: "This platform has completely transformed how I manage my health. It's intuitive and reliable!",
    image: "/hero/t1.jpg",
    user: {
      name: "John Doe",
      avatar: "/hero/u1.jpg",
    },
  },
  {
    feedback: "I love the features and how seamlessly everything works. Highly recommended!",
    image: "/hero/t2.jpg",
    user: {
      name: "Jane Smith",
      avatar: "/hero/u2.jpg",
    },
  },
  {
    feedback: "The best decision I made was to switch to this service. It has made healthcare so convenient!",
    image: "/hero/t3.jpg",
    user: {
      name: "Alice Johnson",
      avatar: "/hero/u3.jpg",
    },
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600">
            Hear from our users about their experiences and how we&apos;ve helped them
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.user.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.user.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="line-clamp-3 text-sm text-gray-700">
                    &ldquo;{testimonial.feedback}&rdquo;
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={testimonial.user.avatar} />
                      <AvatarFallback>{testimonial.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{testimonial.user.name}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
