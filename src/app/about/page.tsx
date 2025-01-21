"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WobbleCard } from "@/components/ui/wobble-card"
import Loader from "@/components/Loader"

const teamMembers = [
  {
    name: "Vivek Chouhan",
    role: "Backend Developer",
    image: "/team/Vivek.jpg",
    github: "https://github.com/vivi",
    linkedin: "https://linkedin.com/in/vivi",
  },
  {
    name: "Nishikant Raut",
    role: "FullStack Developer",
    image: "/team/Nishi.jpg",
    github: "https://github.com/Nishikant00",
    linkedin: "https://linkedin.com/in/nishi",
  },
  {
    name: "Rehan Sayyed",
    role: "FullStack Developer",
    image: "/team/Rehan.jpg",
    github: "https://github.com/rsayyed591",
    linkedin: "https://linkedin.com/in/rehan42",
  },
  {
    name: "Rohit Deshmukh",
    role: "Full stack Developer",
    image: "/team/Rohit.jpg",
    github: "https://github.com/ardie",
    linkedin: "https://linkedin.com/in/rohit",
  },
]

export default function AboutPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader onLoadingComplete={() => setLoading(false)} />
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
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
              At Medwell AI, we&apos;re on a mission to transform healthcare using advanced artificial intelligence. Our
              platform combines cutting-edge AI algorithms with comprehensive health records to provide unparalleled
              insights for both healthcare providers and patients. We&apos;re committed to improving patient outcomes,
              streamlining medical processes, and making healthcare more accessible and efficient for everyone.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {teamMembers.map((member) => (
            <WobbleCard key={member.name} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex space-x-4">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Github className="h-6 w-6" />
                  </Link>
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Linkedin className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </WobbleCard>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Us in Shaping the Future of Healthcare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We&apos;re always looking for passionate individuals to join our team. If you&apos;re excited about using
              AI to improve healthcare and want to make a real difference in people&apos;s lives, we&apos;d love to hear
              from you. Check out our careers page or reach out to us directly to learn about current opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

