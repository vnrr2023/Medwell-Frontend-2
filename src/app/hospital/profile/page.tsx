"use client"

import type React from "react"
import { useState } from "react"
import { Building, Mail, Phone, MapPin, Edit, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HospitalData {
  name: string
  email: string
  phone: string
  address: string
  description: string
  specializations: string[]
  departments: string[]
}

const hospitalData: HospitalData = {
  name: "MedWell General Hospital",
  email: "info@medwell.com",
  phone: "+1 (555) 123-4567",
  address: "123 Health Avenue, Wellness City, MC 12345",
  description:
    "MedWell General Hospital is a state-of-the-art medical facility committed to providing exceptional healthcare services to our community. With a team of highly skilled professionals and cutting-edge technology, we strive to deliver compassionate care and promote overall well-being.",
  specializations: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology"],
  departments: ["Emergency", "Surgery", "Intensive Care", "Radiology", "Laboratory"],
}

export default function HospitalProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<HospitalData>(hospitalData)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    console.log("Saving data:", editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(hospitalData)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">Hospital Profile</CardTitle>
          {!isEditing && (
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <Input type="text" id="name" name="name" value={editedData.name} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input type="email" id="email" name="email" value={editedData.email} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input type="tel" id="phone" name="phone" value={editedData.phone} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input type="text" id="address" name="address" value={editedData.address} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={editedData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">{hospitalData.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{hospitalData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{hospitalData.phone}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                <span className="text-sm">{hospitalData.address}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Us</h3>
                <p className="text-sm text-gray-600">{hospitalData.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Departments</h3>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.departments.map((dept, index) => (
                    <Badge key={index} variant="outline" className="text-gray-600">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

