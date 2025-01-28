"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DaddyAPI from "@/services/api"

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
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<PatientInfo | null>(null)
  const [exchgData, setExchgData] = useState<any>({})  
  
  useEffect(() => {
    const getProfileData = async () => {
      const response = await DaddyAPI.getPatientInfo()
      setFormData(response.data)
    }
    getProfileData()
  }, [])

  if (!formData) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await DaddyAPI.savePatientInfo(exchgData)
    router.push("/patient/profile")
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-primary">Edit Profile</h1>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/patient/profile")}
                className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary">
                    Full Name
                  </Label>
                  <Input id="name" value={formData.name} onChange={(e) => {
                    setExchgData({ ...exchgData, name: e.target.value })
                    setFormData({ ...formData, name: e.target.value })
                  }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-primary">
                    Age
                  </Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={formData.age || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, age: e.target.value ? Number(e.target.value) : null })
                      setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : null })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <Input id="email" value={formData.user_info.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary">
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    value={formData.phone_number || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, phone_number: e.target.value || null })
                      setFormData({ ...formData, phone_number: e.target.value || null })
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_group" className="text-primary">
                    Blood Group
                  </Label>
                  <Input 
                    id="blood_group" 
                    value={formData.blood_group || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, blood_group: e.target.value || null })
                      setFormData({ ...formData, blood_group: e.target.value || null })
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adhaar" className="text-primary">
                    Aadhar Card
                  </Label>
                  <Input 
                    id="adhaar" 
                    value={formData.adhaar_card || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, adhaar_card: e.target.value || null })
                      setFormData({ ...formData, adhaar_card: e.target.value || null })
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-primary">
                    City
                  </Label>
                  <Input 
                    id="city" 
                    value={formData.city || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, city: e.target.value || null })
                      setFormData({ ...formData, city: e.target.value || null })
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-primary">
                    State
                  </Label>
                  <Input 
                    id="state" 
                    value={formData.state || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, state: e.target.value || null })
                      setFormData({ ...formData, state: e.target.value || null })
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-primary">
                    Country
                  </Label>
                  <Input 
                    id="country" 
                    value={formData.country || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, country: e.target.value || null })
                      setFormData({ ...formData, country: e.target.value || null })
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-primary">
                    PIN Code
                  </Label>
                  <Input 
                    id="pin" 
                    value={formData.pin || ""} 
                    onChange={(e) => {
                      setExchgData({ ...exchgData, pin: e.target.value || null })
                      setFormData({ ...formData, pin: e.target.value || null })
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Medical Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-primary">
                    Allergies
                  </Label>
                  <Input 
                    id="allergies" 
                    value={formData.allergies.join(", ")} 
                    onChange={(e) => {
                      const allergiesArray = e.target.value ? e.target.value.split(", ") : []
                      setExchgData({ ...exchgData, allergies: allergiesArray })
                      setFormData({ ...formData, allergies: allergiesArray })
                    }} 
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple allergies with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronic_conditions" className="text-primary">
                    Chronic Conditions
                  </Label>
                  <Input 
                    id="chronic_conditions" 
                    value={formData.chronic_conditions.join(", ")} 
                    onChange={(e) => {
                      const conditionsArray = e.target.value ? e.target.value.split(", ") : []
                      setExchgData({ ...exchgData, chronic_conditions: conditionsArray })
                      setFormData({ ...formData, chronic_conditions: conditionsArray })
                    }} 
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple conditions with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family_history" className="text-primary">
                    Family History
                  </Label>
                  <Input 
                    id="family_history" 
                    value={formData.family_history.join(", ")} 
                    onChange={(e) => {
                      const historyArray = e.target.value ? e.target.value.split(", ") : []
                      setExchgData({ ...exchgData, family_history: historyArray })
                      setFormData({ ...formData, family_history: historyArray })
                    }} 
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple conditions with commas</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}