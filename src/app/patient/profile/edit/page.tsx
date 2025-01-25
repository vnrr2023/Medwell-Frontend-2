"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PatientInfo } from "@/types/patient"

// Mock initial data
const initialData: PatientInfo = {
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
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
            {/* Personal Information */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary">
                    Full Name
                  </Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-primary">
                    Age
                  </Label>
                  <Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <Input id="email" defaultValue={formData.user_info.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary">
                    Phone Number
                  </Label>
                  <Input id="phone" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_group" className="text-primary">
                    Blood Group
                  </Label>
                  <Input id="blood_group" value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar" className="text-primary">
                    Aadhar Card
                  </Label>
                  <Input id="aadhar" value={formData.aadhar_card} onChange={(e) => setFormData({ ...formData, aadhar_card: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-primary">
                    Height
                  </Label>
                  <Input id="height" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-primary">
                    Weight
                  </Label>
                  <Input id="weight" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-primary">
                    City
                  </Label>
                  <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-primary">
                    State
                  </Label>
                  <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-primary">
                    Country
                  </Label>
                  <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-primary">
                    PIN Code
                  </Label>
                  <Input id="pin" value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Medical Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-primary">
                    Allergies
                  </Label>
                  <Input id="allergies" value={formData.allergies.join(", ")} onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(", ") })} />
                  <p className="text-sm text-muted-foreground">Separate multiple allergies with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronic_conditions" className="text-primary">
                    Chronic Conditions
                  </Label>
                  <Input id="chronic_conditions" value={formData.chronic_conditions.join(", ")} onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value.split(", ") })} />
                  <p className="text-sm text-muted-foreground">Separate multiple conditions with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family_history" className="text-primary">
                    Family History
                  </Label>
                  <Input id="family_history" value={formData.family_history.join(", ")} onChange={(e) => setFormData({ ...formData, family_history: e.target.value.split(", ") })} />
                  <p className="text-sm text-muted-foreground">Separate multiple conditions with commas</p>
                </div>
              </div>
            </div>

            {/* Health Summary & Diet Plan */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-primary mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="health_summary" className="text-primary">
                    Health Summary
                  </Label>
                  <Textarea id="health_summary" value={formData.health_summary} onChange={(e) => setFormData({ ...formData, health_summary: e.target.value })} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diet_plan" className="text-primary">
                    Diet Plan
                  </Label>
                  <Textarea id="diet_plan" value={formData.diet_plan} onChange={(e) => setFormData({ ...formData, diet_plan: e.target.value })} rows={4} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

