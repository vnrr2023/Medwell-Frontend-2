"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Heart, Shield, Brain, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WobbleCard } from "@/components/ui/wobble-card"
import Loader from "@/components/Loader"
import ChatArogya from "@/components/chatbots/ChatArogya"

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

const features = [
  {
    title: "Patient-Centered Care",
    description: "Our AI solutions prioritize patient outcomes and experiences above all else.",
    icon: Heart,
    color: "#7C3AED",
  },
  {
    title: "Data Security",
    description: "We implement industry-leading security measures to protect sensitive medical data.",
    icon: Shield,
    color: "#10B981",
  },
  {
    title: "Advanced AI",
    description: "Our algorithms continuously learn and improve for better healthcare insights.",
    icon: Brain,
    color: "#F59E0B",
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into health trends and treatment effectiveness.",
    icon: Activity,
    color: "#EC4899",
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
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0FF] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#7C3AED]/10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent mb-6"
            >
              About Medwell AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto"
            >
              Revolutionizing healthcare with cutting-edge AI technology to improve patient outcomes and streamline
              medical processes worldwide.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6 text-lg">
              At Medwell AI, we&apos;re on a mission to transform healthcare using advanced artificial intelligence. Our
              platform combines cutting-edge AI algorithms with comprehensive health records to provide unparalleled
              insights for both healthcare providers and patients.
            </p>
            <p className="text-gray-700 text-lg">
              We&apos;re committed to improving patient outcomes, streamlining medical processes, and making healthcare more
              accessible and efficient for everyone.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/mission.jpg"
              alt="Our Mission"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-[#7C3AED]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Sets Us Apart</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our innovative approach to healthcare technology delivers exceptional results through these key features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-t-4 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                    </div>
                    <CardTitle className="text-xl" style={{ color: feature.color }}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            The brilliant minds behind Medwell AI who are passionate about revolutionizing healthcare
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <WobbleCard className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-[#7C3AED]/20">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-[#7C3AED] font-medium mb-4">{member.role}</p>
                  <div className="flex space-x-4 mt-auto">
                    <Link
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#7C3AED] transition-colors duration-300"
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#7C3AED] transition-colors duration-300"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </WobbleCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Join Us in Shaping the Future of Healthcare</h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-8 text-lg">
              We&apos;re always looking for passionate individuals to join our team. If you&apos;re excited about using AI to
              improve healthcare and want to make a real difference in people&apos;s lives, we&apos;d love to hear from you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#7C3AED] font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Career Opportunities
            </motion.button>
          </motion.div>
        </div>
      </div>
      <ChatArogya/>
    </div>
  )
}
