"use client"

import ChatArogya from "@/components/chatbots/ChatArogya"
import { DoctorProfile } from "@/components/doctor/DoctorProfile"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorProfilePage() {
  const router=useRouter();
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="patient"){
      alert("You cannot access logged in as doctor")
      router.push("/doctor")
      return
    }
  }, []);
  return (<>
    <DoctorProfile />
    <ChatArogya/>
  </>)
}

