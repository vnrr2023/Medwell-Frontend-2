"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock JSON data for doctors
const initialDoctorsData = [
  { id: 1, name: "Dr. Rehan Sayyed", specialty: "Cardiology", experience: "15 years", image: "/hospital/pfp1.jpg" },
  { id: 2, name: "Dr. Nishikant Raut", specialty: "Pediatrics", experience: "10 years", image: "/hospital/pfp2.jpg" },
  { id: 3, name: "Dr. Vivek Chouhan", specialty: "Neurology", experience: "20 years", image: "/hospital/pfp3.jpg" },
  { id: 4, name: "Dr. Rohit Seshmukh", specialty: "Orthopedics", experience: "12 years", image: "/hospital/pfp4.jpg" },
  { id: 5, name: "Dr. Rohit Deshmukh", specialty: "Dermatology", experience: "8 years", image: "/hospital/pfp5.jpg" },
]

export default function Doctors() {
  const [doctors, setDoctors] = useState(initialDoctorsData)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAdding, setIsAdding] = useState(false)
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", experience: "" })

  const handleAddDoctor = () => {
    setDoctors([...doctors, { ...newDoctor, id: doctors.length + 1, image: "/hospital/default-doctor.jpg" }])
    setNewDoctor({ name: "", specialty: "", experience: "" })
    setIsAdding(false)
  }

  const handleUpdateDoctor = () => {
    setDoctors(doctors.map((doc) => (doc.id === selectedDoctor.id ? selectedDoctor : doc)))
    setSelectedDoctor(null)
  }

  const handleDeleteDoctor = (id: number) => {
    setDoctors(doctors.filter((doc) => doc.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">Doctors Management</h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Doctors List</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                />
                <Input
                  placeholder="Specialty"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                />
                <Input
                  placeholder="Experience"
                  value={newDoctor.experience}
                  onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                />
              </div>
              <Button onClick={handleAddDoctor} className="mt-4">
                Add Doctor
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-black">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-900 mb-2">Experience: {doctor.experience}</p>
                <div className="flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(doctor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Doctor</DialogTitle>
                      </DialogHeader>
                      {selectedDoctor && (
                        <div className="space-y-4">
                          <Input
                            value={selectedDoctor.name}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, name: e.target.value })}
                          />
                          <Input
                            value={selectedDoctor.specialty}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, specialty: e.target.value })}
                          />
                          <Input
                            value={selectedDoctor.experience}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, experience: e.target.value })}
                          />
                        </div>
                      )}
                      <Button onClick={handleUpdateDoctor} className="mt-4">
                        Update Doctor
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteDoctor(doctor.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

