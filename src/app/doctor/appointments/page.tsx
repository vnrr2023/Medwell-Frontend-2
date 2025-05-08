"use client"

import ChatArogya from "@/components/chatbots/ChatArogya"
import PatientAppointments from "@/components/doctor/PatientAppointments"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorAppointmentPage() {
  const router = useRouter();
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="doctor"){
      alert("You cannot access logged in as patient")
      router.push("/patient")
      return
    }
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PatientAppointments />
      <ChatArogya/>
    </div>
  )
}

