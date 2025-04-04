"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Download,
  Star,
  Smartphone,
  Shield,
  Zap,
  Clock,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

const apps = [
  {
    id: "medwell",
    name: "MedWell App",
    version: "2.4.0",
    description:
      "Your complete healthcare companion for managing medical records, scheduling appointments, and accessing healthcare services.",
    image: "/assests/medwell.png",
    apkFile: "/apk/medwell.apk",
    fileSize: "24.5 MB",
    features: [
      { icon: Smartphone, title: "User-friendly Interface", description: "Intuitive design for easy navigation" },
      { icon: Shield, title: "Secure Data Storage", description: "End-to-end encryption for your medical data" },
      { icon: Zap, title: "Quick Access", description: "Instant access to your medical records" },
      { icon: Clock, title: "Appointment Scheduling", description: "Book and manage appointments with ease" },
    ],
    ratings: 4.8,
    reviews: [
      {
        name: "Rahul S.",
        rating: 5,
        comment: "This app has made it so easy to track my health reports. Totally impressed!",
      },
      {
        name: "Priya M.",
        rating: 5,
        comment: "The design is clean and user-friendly. Everything I need is right there.",
      },
      {
        name: "Ankit R.",
        rating: 4,
        comment: "Very useful app! Just wish there were a few more options to personalize the dashboard.",
      },
    ],
    whatsNew: [
      "Added dark mode support",
      "Improved report visualization",
      "Enhanced security features",
      "Bug fixes and performance improvements",
    ],
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
  {
    id: "ambulance",
    name: "MedWell Ambulance Service",
    version: "1.8.5",
    description:
      "Emergency medical services at your fingertips. Request ambulances, track their location, and share critical medical information.",
    image: "/assests/ambulance.png",
    apkFile: "/apk/EMSapp.apk",
    fileSize: "88.0 MB",
    features: [
      { icon: MapPin, title: "Real-time Tracking", description: "Track ambulance location in real-time" },
      { icon: Bell, title: "Emergency Alerts", description: "Quick SOS alerts with location sharing" },
      { icon: Shield, title: "Medical Info Sharing", description: "Share critical health information with responders" },
      { icon: Clock, title: "Rapid Response", description: "Optimized for fastest possible response times" },
    ],
    ratings: 4.9,
    reviews: [
      {
        name: "Rohit",
        rating: 5,
        comment: "This app saved my father's life with its quick response time!",
      },
      {
        name: "Rehan",
        rating: 5,
        comment: "The tracking feature gives peace of mind during emergencies.",
      },
      {
        name: "Vivek",
        rating: 5,
        comment: "Incredibly reliable service when every second counts.",
      },
    ],    
    whatsNew: [
      "Improved location accuracy",
      "Added support for multiple emergency contacts",
      "Enhanced UI for emergency situations",
      "Optimized battery usage during tracking",
    ],
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
]

export default function AppDownloadPage() {
  const [activeApp, setActiveApp] = useState(apps[0])
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0)

  const handleDownload = (appId: string) => {
    setIsDownloading(true)
    setDownloadProgress(0)

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsDownloading(false)
            setDownloadProgress(0)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((prev) => (prev === activeApp.screenshots.length - 1 ? 0 : prev + 1))
  }

  const prevScreenshot = () => {
    setCurrentScreenshotIndex((prev) => (prev === 0 ? activeApp.screenshots.length - 1 : prev - 1))
  }

  return (
    <main className="relative overflow-hidden pt-20">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-16 px-4 md:px-6 max-w-7xl mx-auto text-center"
      >
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
          Mobile Applications
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 tracking-tight">Download Our Mobile Apps</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access MedWell services on the go with our mobile applications designed for patients and emergency services.
        </p>
      </motion.section>

      {/* App Selection Tabs */}
      <section className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <Tabs
          defaultValue={apps[0].id}
          className="w-full"
          onValueChange={(value) => setActiveApp(apps.find((app) => app.id === value) || apps[0])}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            {apps.map((app) => (
              <TabsTrigger key={app.id} value={app.id} className="text-base py-3">
                {app.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {apps.map((app) => (
            <TabsContent key={app.id} value={app.id} className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                {/* App Preview Section */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl transform -translate-x-4 translate-y-4" />

                  <div className="bg-white p-8 rounded-2xl shadow-xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg"
                      >
                        <Image
                          src={app.image || "/placeholder.svg"}
                          alt={app.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{app.name}</h2>
                        <div className="flex items-center justify-center md:justify-start mt-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(app.ratings) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {app.ratings} ({app.reviews.length} reviews)
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Version {app.version}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-8">{app.description}</p>

                    {/* QR Code */}
                    <div className="flex flex-col items-center mb-8">
                      <p className="text-sm text-gray-500 mb-3">Scan to download</p>
                      <div className="bg-white p-3 rounded-lg shadow-md">
                        <Image
                          src="/placeholder.svg?height=150&width=150"
                          alt="QR Code"
                          width={150}
                          height={150}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="space-y-4">
                      {isDownloading ? (
                        <div className="space-y-2">
                          <Progress value={downloadProgress} className="h-2" />
                          <p className="text-sm text-center text-gray-600">Downloading... {downloadProgress}%</p>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleDownload(app.id)}
                          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download APK ({app.fileSize})
                        </Button>
                      )}

                      <Button variant="outline" onClick={() => setShowWhatsNewModal(true)} className="w-full">
                        What's New in v{app.version}
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* App Details Section */}
                <div className="space-y-8">
                  {/* Features */}
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {app.features.map((feature, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-primary/10 rounded-full">
                              <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Screenshots Gallery */}
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">App Screenshots</h3>
                    <div className="relative">
                      <div className="overflow-hidden rounded-lg shadow-md">
                        <div className="relative h-[500px] w-full">
                          <Image
                            src={activeApp.screenshots[currentScreenshotIndex] || "/placeholder.svg"}
                            alt={`${activeApp.name} screenshot ${currentScreenshotIndex + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevScreenshot}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextScreenshot}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>

                      <div className="flex justify-center mt-4 gap-2">
                        {activeApp.screenshots.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${currentScreenshotIndex === index ? "bg-primary" : "bg-gray-300"}`}
                            onClick={() => setCurrentScreenshotIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Reviews */}
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">User Reviews</h3>
                    <div className="space-y-4">
                      {app.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-800">{review.name}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* What's New Modal */}
      <Dialog open={showWhatsNewModal} onOpenChange={setShowWhatsNewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              What's New in {activeApp.name} v{activeApp.version}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <ul className="space-y-2">
              {activeApp.whatsNew.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 min-w-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      {/* Back to Home Link */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  )
}

