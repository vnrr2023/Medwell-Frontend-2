"use client"

import { DollarSign, Calendar, FileText, Activity, Lock, MessageCircle } from "lucide-react"
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover"

const features = [
  { Icon: DollarSign, title: "Cost Tracking", description: "Monitor and manage your healthcare expenses efficiently" },
  { Icon: Calendar, title: "Smart Scheduling", description: "Book and manage appointments with ease" },
  { Icon: FileText, title: "Digital Records", description: "Access your medical history anytime, anywhere" },
  { Icon: Activity, title: "Health Monitoring", description: "Track your vital signs and health metrics" },
  { Icon: Lock, title: "Secure Platform", description: "Your data is protected with enterprise-grade security" },
  { Icon: MessageCircle, title: "24/7 Support", description: "Get help whenever you need it" },
]

export default function Features() {
  return (
    <section className="py-20 px-4 md:px-6 bg-[#E3F2FD]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#1E88E5]">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <DirectionAwareHover
            key={index}
            imageUrl="/placeholder.svg" // Replace with feature-specific images
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex flex-col items-center text-center">
              <feature.Icon className="h-12 w-12 text-[#1E88E5] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#757575]">{feature.description}</p>
            </div>
          </DirectionAwareHover>
        ))}
      </div>
    </section>
  )
}

