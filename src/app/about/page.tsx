"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"

const teamMembers = [
  {
    name: "Vivek Chouhan",
    role: "Backend Developer",
    image: "/Vivek.jpg",
    github: "https://github.com/vivi",
    linkedin: "https://linkedin.com/in/vivi",
  },
  {
    name: "Nishikant Raut",
    role: "FullStack Developer",
    image: "/Nishi.jpg",
    github: "https://github.com/Nishikant00",
    linkedin: "https://linkedin.com/in/nishi",
  },
  {
    name: "Rehan Sayyed",
    role: "FullStack Developer",
    image: "/Rehan.jpg",
    github: "https://github.com/rsayyed591",
    linkedin: "https://linkedin.com/in/rehan42",
  },
  {
    name: "Rohit Deshmukh",
    role: "Full stack Developer",
    image: "/Rohit.jpg",
    github: "https://github.com/ardie",
    linkedin: "https://linkedin.com/in/rohit",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-[#E0F7FA] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Medwell AI</h1>
          <p className="text-xl text-gray-600 mb-8">Revolutionizing healthcare with cutting-edge AI technology</p>
        </motion.div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Empowering healthcare through innovation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              At Medwell AI, we're on a mission to transform healthcare using advanced artificial intelligence. Our
              platform combines cutting-edge AI algorithms with comprehensive health records to provide unparalleled
              insights for both healthcare providers and patients. We're committed to improving patient outcomes,
              streamlining medical processes, and making healthcare more accessible and efficient for everyone.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>

        <BentoGrid className="max-w-4xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <BentoGridItem
              key={member.name}
              title={member.name}
              description={member.role}
              header={
                <div className="flex justify-center items-center w-full h-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              }
              icon={
                <div className="flex space-x-2">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              }
              className={index === 3 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        <Card>
          <CardHeader>
            <CardTitle>Join Us in Shaping the Future of Healthcare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We're always looking for passionate individuals to join our team. If you're excited about using AI to
              improve healthcare and want to make a real difference in people's lives, we'd love to hear from you. Check
              out our careers page or reach out to us directly to learn about current opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

