"use client"

import { useState } from "react"
import { FileText, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

// Types
interface Profile {
  id: number
  name: string
  age: number
  type: "doctor" | "patient"
  reportsCount: number
  image: string
}

interface Report {
  id: number
  title: string
  date: string
  status: string
}

interface ReportDetails {
  patientName: string
  doctorName: string
  date: string
  diagnosis: string
  prescription: string
  notes: string
}

// Mock data
const profilesData: Profile[] = [
  { id: 1, name: "Dr. Rehan Sayyed", age: 18, type: "doctor", reportsCount: 3, image: "/hospital/pfp1.jpg" },
  { id: 2, name: "Dr. Rohit Deshmukh", age: 38, type: "doctor", reportsCount: 5, image: "/hospital/pfp2.jpg" },
  { id: 3, name: "Dr. Vivi Chauhan", age: 52, type: "doctor", reportsCount: 3, image: "/hospital/pfp3.jpg" },
  { id: 4, name: "Dr. Nishi Raut", age: 41, type: "doctor", reportsCount: 5, image: "/hospital/pfp4.jpg" },
  { id: 5, name: "Dr. Rahil Sir", age: 36, type: "doctor", reportsCount: 3, image: "/hospital/pfp5.jpg" },
  { id: 6, name: "Adnan Broker", age: 28, type: "patient", reportsCount: 5, image: "/hospital/pfp4.jpg" },
  { id: 7, name: "Rehan Shah", age: 35, type: "patient", reportsCount: 3, image: "/hospital/pfp3.jpg" },
  { id: 8, name: "Bilal Shaikh", age: 45, type: "patient", reportsCount: 5, image: "/hospital/pfp2.jpg" },
  { id: 9, name: "L1a2v3a4n5y6a7", age: 52, type: "patient", reportsCount: 3, image: "/hospital/pfp1.jpg" },
  { id: 10, name: "Azlaan Shaikh", age: 30, type: "patient", reportsCount: 5, image: "/hospital/pfp5.jpg" },
]

const reportsData: { [key: number]: Report[] } = {
  1: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
  ],
  2: [
    { id: 1, title: "Annual Checkup", date: "2023-05-15", status: "Completed" },
    { id: 2, title: "Follow-up", date: "2023-06-20", status: "Scheduled" },
    { id: 3, title: "Lab Results", date: "2023-04-10", status: "Reviewed" },
    { id: 4, title: "Dental Checkup", date: "2023-07-05", status: "Completed" },
    { id: 5, title: "Vaccination", date: "2023-08-15", status: "Scheduled" },
  ],
  // ... (repeat for other profile IDs)
}

const generateReportDetails = (profileId: number, reportId: number): ReportDetails => {
  const profile = profilesData.find((p) => p.id === profileId)
  const report = reportsData[profileId].find((r) => r.id === reportId)

  return {
    patientName: profile?.name || "",
    doctorName: "Dr. John Doe",
    date: report?.date || "",
    diagnosis: "Healthy",
    prescription: "N/A",
    notes: "Patient is in good health. Recommended regular exercise and balanced diet.",
  }
}

export default function PatientRecords() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile)
    setSelectedReport(null)
  }

  const handleReportClick = (report: Report) => {
    setSelectedReport(report)
  }

  const handleBack = () => {
    if (selectedReport) {
      setSelectedReport(null)
    } else if (selectedProfile) {
      setSelectedProfile(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {(selectedProfile || selectedReport) && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-4 flex items-center text-teal-600 hover:text-teal-700"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {selectedReport
            ? "Report Details"
            : selectedProfile
              ? `${selectedProfile.name}'s Reports`
              : "Patient Records"}
        </h1>
      </div>

      {!selectedProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profilesData.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProfileClick(profile)}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={profile.image} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{profile.name}</h2>
                    <Badge variant="secondary">{profile.type === "doctor" ? "Doctor" : "Patient"}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Age: {profile.age}</p>
                <p className="text-sm text-gray-600">Reports: {profile.reportsCount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedProfile && !selectedReport && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reportsData[selectedProfile.id].map((report) => (
            <Card
              key={report.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleReportClick(report)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">{report.title}</h2>
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <p className="text-sm text-gray-600">Date: {report.date}</p>
                <Badge variant="outline" className="mt-2">
                  {report.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedReport.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(generateReportDetails(selectedProfile!.id, selectedReport.id)).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

