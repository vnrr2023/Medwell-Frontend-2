"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>{/* Add list of appointments here */}</CardContent>
      </Card>
    </div>
  )
}

