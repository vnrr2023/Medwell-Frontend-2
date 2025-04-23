"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Edit2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DaddyAPI from "@/services/api"
import Chat from "@/components/chatbots/Chat"
import ChatArogya from "@/components/chatbots/ChatArogya"

type PatientInfo = {
  id: string
  name: string
  age: number | null
  phone_number: string | null
  user_info: {
    id: number
    email: string
  }
  blood_group: string | null
  city: string | null
  country: string | null
  state: string | null
  pin: string | null
  profile_pic: string
  profile_qr: string
  adhaar_card: string | null
  allergies: string[]
  chronic_conditions: string[]
  family_history: string[]
  health_summary: string
  diet_plan: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [showQR, setShowQR] = useState(false)
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)

  useEffect(() => {
    const getProfileData = async () => {
      const response = await DaddyAPI.getPatientInfo()
      setPatientInfo(response.data)
    }
    getProfileData()
  }, [])

  if (!patientInfo) return null

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
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
                {patientInfo.city && patientInfo.country ? `${patientInfo.city}, ${patientInfo.country}` : "Location not set"}
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/patient/profile/edit")} className="bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg border p-4"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Personal Information</h2>
          <div className="space-y-3">
            <InfoItem label="Age" value={patientInfo.age ? `${patientInfo.age} years` : "Not set"} />
            <InfoItem label="Email" value={patientInfo.user_info.email} />
            <InfoItem label="Phone" value={patientInfo.phone_number || "Not set"} />
            <InfoItem label="Blood Group" value={patientInfo.blood_group || "Not set"} />
            <InfoItem label="Aadhar Card" value={"1234 1234 1234"} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg border p-4"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Location</h2>
          <div className="space-y-3">
            <InfoItem label="City" value={patientInfo.city || "Not set"} />
            <InfoItem label="State" value={patientInfo.state || "Not set"} />
            <InfoItem label="Country" value={patientInfo.country || "Not set"} />
            <InfoItem label="PIN Code" value={patientInfo.pin || "Not set"} />
          </div>
        </motion.section>

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
                {patientInfo.allergies.length > 0 ? (
                  patientInfo.allergies.map((allergy) => (
                    <span key={allergy} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No allergies recorded</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">Chronic Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {patientInfo.chronic_conditions.length > 0 ? (
                  patientInfo.chronic_conditions.map((condition) => (
                    <span key={condition} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                      {condition}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No chronic conditions recorded</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">Family History</h3>
              <div className="flex flex-wrap gap-2">
                {patientInfo.family_history.length > 0 ? (
                  patientInfo.family_history.map((history) => (
                    <span key={history} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {history}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No family history recorded</span>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg border p-4 md:col-span-2"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Health Summary</h2>
          <p className="text-gray-700 whitespace-pre-line">{patientInfo.health_summary}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg border p-4 md:col-span-2"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">Diet Plan</h2>
          <p className="text-gray-700 whitespace-pre-line">{patientInfo.diet_plan}</p>
        </motion.section>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Profile QR Code</h3>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <img src={patientInfo.profile_qr} alt="QR Code" className="w-full h-full" />
            </div>
            <Button className="w-full" variant="outline" onClick={() => setShowQR(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
      {/* <div className="pb-20"></div> */}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-medium text-primary">{label}</p>
      <p className="text-gray-700">{value}</p>
      <ChatArogya/>
    </div>
  )
}