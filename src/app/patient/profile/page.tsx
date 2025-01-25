"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Edit2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PatientInfo } from "@/types/patient"

// Mock patient data based on the interface
const patientInfo: PatientInfo = {
  name: "Natarsha Malana",
  age: 28,
  user_info: {
    email: "natarsha@example.com",
  },
  phone_number: "+44 123 456 7890",
  blood_group: "O+",
  height: "170 cm",
  weight: "65 kg",
  allergies: ["Peanuts", "Penicillin", "Dust"],
  aadhar_card: "XXXX-XXXX-XXXX",
  chronic_conditions: ["Asthma", "Migraine"],
  family_history: ["Diabetes", "Heart Disease"],
  city: "Leeds",
  state: "West Yorkshire",
  country: "United Kingdom",
  pin: "LS1 1QF",
  health_summary: "Generally healthy, regular exercise routine, maintains balanced diet",
  diet_plan: "Low-carb diet, high protein intake, regular meals",
  profile_pic: "/patient/pfp.jpg",
  profile_qr: "/patient/pfp.jpg",
}

export default function ProfilePage() {
  const router = useRouter()
  const [showQR, setShowQR] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={patientInfo.profile_pic} alt={patientInfo.name} />
                <AvatarFallback>{patientInfo.name[0]}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-primary">{patientInfo.name}</h1>
              <p className="text-muted-foreground">
                {patientInfo.city}, {patientInfo.country}
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/patient/profile/edit")} className="bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg border p-4"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Personal Information</h2>
          <div className="space-y-3">
            <InfoItem label="Age" value={`${patientInfo.age} years`} />
            <InfoItem label="Email" value={patientInfo.user_info.email} />
            <InfoItem label="Phone" value={patientInfo.phone_number} />
            <InfoItem label="Blood Group" value={patientInfo.blood_group} />
            <InfoItem label="Height" value={patientInfo.height} />
            <InfoItem label="Weight" value={patientInfo.weight} />
            <InfoItem label="Aadhar Card" value={patientInfo.aadhar_card} />
          </div>
        </motion.section>

        {/* Location Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg border p-4"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Location</h2>
          <div className="space-y-3">
            <InfoItem label="City" value={patientInfo.city} />
            <InfoItem label="State" value={patientInfo.state} />
            <InfoItem label="Country" value={patientInfo.country} />
            <InfoItem label="PIN Code" value={patientInfo.pin} />
          </div>
        </motion.section>

        {/* Medical Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg border p-4 md:col-span-2"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {patientInfo.allergies.map((allergy) => (
                  <span key={allergy} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">Chronic Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {patientInfo.chronic_conditions.map((condition) => (
                  <span key={condition} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">Family History</h3>
              <div className="flex flex-wrap gap-2">
                {patientInfo.family_history.map((history) => (
                  <span key={history} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {history}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Health Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg border p-4 md:col-span-2"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Health Summary</h2>
          <p className="text-gray-700">{patientInfo.health_summary}</p>
        </motion.section>

        {/* Diet Plan */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg border p-4 md:col-span-2"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Diet Plan</h2>
          <p className="text-gray-700">{patientInfo.diet_plan}</p>
        </motion.section>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Profile QR Code</h3>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <img src={patientInfo.profile_qr || "/placeholder.svg"} alt="QR Code" className="w-full h-full" />
            </div>
            <Button className="w-full" variant="outline" onClick={() => setShowQR(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for consistent info display
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-medium text-primary">{label}</p>
      <p className="text-gray-700">{value}</p>
    </div>
  )
}

