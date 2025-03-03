"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, UserRound, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const roles = [
  {
    title: "Patient",
    icon: Users,
    description: "Access your medical records, book appointments, and manage your healthcare journey",
    image: "/auth/patient.jpg",
    link: "/auth/patient/login",
    color: "#4361ee",
  },
  {
    title: "Doctor",
    icon: UserRound,
    description: "Manage your practice, access patient records, and provide remote consultations",
    image: "/auth/doctor.jpg",
    link: "/auth/doctor/login",
    color: "#3f37c9",
  },
  {
    title: "Hospital",
    icon: Building2,
    description: "Streamline hospital operations and enhance patient care with our comprehensive system",
    image: "/auth/hospital.jpg",
    link: "/auth/hospital/login",
    color: "#3a0ca3",
  },
]

export default function UserSelect() {
  return (
    <div className="min-h-screen isolate pt-24 pb-12 px-4 bg-gradient-to-b from-blue-50 via-indigo-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
          >
            Welcome to Medwell
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-muted-foreground"
          >
            Choose your role to continue
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              className="w-full sm:w-auto"
            >
              <Card
                className="relative group overflow-hidden hover:shadow-xl transition-all duration-300 w-full sm:w-80 border-t-4"
                style={{ borderTopColor: role.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="text-center pb-4 relative">
                  <div
                    className="mx-auto mb-4 p-3 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: `${role.color}10` }}
                  >
                    <role.icon className="w-8 h-8" style={{ color: role.color }} />
                  </div>
                  <CardTitle className="text-2xl font-bold" style={{ color: role.color }}>
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center relative">
                  <div className="mb-6">
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={role.image || "/placeholder.svg"}
                        alt={role.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardDescription className="text-muted-foreground mb-6">{role.description}</CardDescription>
                  </div>
                  <Button
                    className="w-full text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={
                      {
                        backgroundColor: role.color,
                        "--hover-color": `${role.color}90`,
                      } as React.CSSProperties
                    }
                    asChild
                  >
                    <Link href={role.link}>Login as {role.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Don&apos;t have an account?</p>
          <div className="flex flex-wrap justify-center gap-4">
            {roles.map((role, index) => (
              <Link
                key={role.title}
                href={role.link.replace("login", "signup")}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                Sign up as {role.title}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

