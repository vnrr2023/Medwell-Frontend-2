"use client"

import ChatArogya from "@/components/chatbots/ChatArogya"
import { DoctorProfile } from "@/components/doctor/DoctorProfile"

export default function DoctorProfilePage() {
  return (<>
    <DoctorProfile />
    <ChatArogya/>
  </>)
}

