"use client"
import CombinedChat from "@/components/chatbots/ChatCombined";
import Patients from "@/components/doctor/Patients";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorReportsPage() {
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
  return(<>
  <Patients />
  <CombinedChat/>
  </> )
}

