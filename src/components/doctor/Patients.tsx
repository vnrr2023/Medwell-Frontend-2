"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { FileText, Stethoscope, Search } from "lucide-react"
import PatientReports from "./PatientReports"
import PatientHealth from "./PatientHealth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Patient {
  requested_at: string
  user_info: {
    id: number
    email: string
  }
}

const patientData: Patient[] = [
  {
    requested_at: "2024-11-05T00:56:46.972218+05:30",
    user_info: {
      id: 69,
      email: "rohit@gmail.com",
    },
  },
  {
    requested_at: "2024-11-05T00:40:57.816854+05:30",
    user_info: {
      id: 70,
      email: "amit@gmail.com",
    },
  },
  {
    requested_at: "2024-11-05T00:20:03.314123+05:30",
    user_info: {
      id: 71,
      email: "priya@gmail.com",
    },
  },
]

const PatientCard = ({
  patient,
  onViewReports,
  onViewHealth,
}: { patient: Patient; onViewReports: (id: number) => void; onViewHealth: (id: number) => void }) => {
  const formattedDate = new Date(patient.requested_at).toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center mb-2">
        <Avatar className="w-10 h-10 mr-4 bg-purple-200">
          <AvatarFallback>{patient.user_info.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Patient {patient.user_info.id}</h3>
          <p className="text-sm text-gray-600">{patient.user_info.email}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">Last Request: {formattedDate}</p>
      <div className="flex justify-between items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewReports(patient.user_info.id)}
          className="text-green-700"
        >
          <FileText className="w-4 h-4 mr-1" />
          View Reports
        </Button>
        <Button variant="outline" size="sm" onClick={() => onViewHealth(patient.user_info.id)} className="text-red-700">
          <Stethoscope className="w-4 h-4 mr-1" />
          View Health
        </Button>
      </div>
    </motion.div>
  )
}

export const Patients: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"reports" | "health" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const sortedPatients = useMemo(() => {
    return [...patientData].sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime())
  }, [])

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return sortedPatients.filter(
      (patient) =>
        patient.user_info.email.toLowerCase().includes(term) || patient.user_info.id.toString().includes(term),
    )
  }, [sortedPatients, searchTerm])

  const handleViewReports = useCallback((patientId: number) => {
    setSelectedPatientId(patientId)
    setViewMode("reports")
  }, [])

  const handleViewHealth = useCallback((patientId: number) => {
    setSelectedPatientId(patientId)
    setViewMode("health")
  }, [])

  const handleBackToPatients = useCallback(() => {
    setSelectedPatientId(null)
    setViewMode(null)
  }, [])

  if (selectedPatientId) {
    if (viewMode === "reports") {
      return <PatientReports patientId={selectedPatientId} onClose={handleBackToPatients} />
    } else if (viewMode === "health") {
      return <PatientHealth patientId={selectedPatientId} onClose={handleBackToPatients} />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">All Patients</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="relative w-full max-w-xs">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
                className={cn(
                  "w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                )}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <p className="text-center text-gray-600">No patients found matching your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.user_info.id}
                  patient={patient}
                  onViewReports={handleViewReports}
                  onViewHealth={handleViewHealth}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Patients;