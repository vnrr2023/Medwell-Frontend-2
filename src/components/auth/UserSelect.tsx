"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, UserRound, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const roles = [
  {
    title: "Patient",
    icon: Users,
    description: "Access your medical records, book appointments, and manage your healthcare journey",
    image: "/auth/patient.jpg",
    link: "/auth/patient/login",
  },
  {
    title: "Doctor",
    icon: UserRound,
    description: "Manage your practice, access patient records, and provide remote consultations",
    image: "/auth/doctor.jpg",
    link: "/auth/doctor/login",
  },
  {
    title: "Hospital",
    icon: Building2,
    description: "Streamline hospital operations and enhance patient care with our comprehensive system",
    image: "/auth/hospital.jpg",
    link: "/auth/hospital/login",
  },
];

export default function UserSelect() {
  return (
    <div className="min-h-screen isolate pt-24 pb-12 px-4 bg-gradient-to-b from-[#E8F4FE] to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0078D7] mb-4">Welcome to Medwell</h1>
          <p className="text-xl text-gray-600">Choose your role to continue</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {roles.map((role) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full sm:w-auto"
            >
              <Card className="relative group overflow-hidden hover:shadow-lg transition-shadow w-full sm:w-80">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-[#0078D7]/10">
                    <role.icon className="w-8 h-8 text-[#0078D7]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#0078D7]">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <Image
                      src={role.image || "/placeholder.svg"}
                      alt={role.title}
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg mb-4"
                    />
                    <CardDescription className="text-gray-600 mb-6">{role.description}</CardDescription>
                  </div>
                  <Button className="w-full bg-[#0078D7] hover:bg-[#0078D7]/90 text-white" asChild>
                    <Link href={role.link}>Login as {role.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Don&apos;t have an account?</p>
          <div className="flex flex-wrap justify-center gap-4">
            {roles.map((role) => (
              <Link
                key={role.title}
                href={role.link.replace("login", "signup")}
                className="text-[#0078D7] hover:underline"
              >
                Sign up as {role.title}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
