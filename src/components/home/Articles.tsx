"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const articles = [
  {
    title: "Understanding Your Medical Reports with AI",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0tYkt61APFV8OcGVUBOAc7QvLvza8i.png",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg",
    },
  },
  {
    title: "The Benefits of Digital Health Records",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0tYkt61APFV8OcGVUBOAc7QvLvza8i.png",
    author: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg",
    },
  },
  {
    title: "Remote Healthcare: The Future of Medicine",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0tYkt61APFV8OcGVUBOAc7QvLvza8i.png",
    author: {
      name: "Dr. Emily Williams",
      avatar: "/placeholder.svg",
    },
  },
]

export default function Articles() {
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
          <h2 className="text-3xl font-bold mb-4">Our recent Articles</h2>
          <p className="text-xl text-gray-600">
            Read our latest articles and get up to date with the latest medical trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={article.author.avatar} />
                      <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{article.author.name}</span>
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

