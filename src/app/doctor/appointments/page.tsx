"use client"

import ChatArogya from "@/components/chatbots/ChatArogya"
import PatientAppointments from "@/components/doctor/PatientAppointments"

export default function DoctorAppointmentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PatientAppointments />
      <ChatArogya/>
    </div>
  )
}

