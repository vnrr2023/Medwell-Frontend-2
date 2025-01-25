"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ShareWithDoctorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Share with Doctor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Share Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add QR code scanner component here */}
          <Button>Scan QR Code</Button>
        </CardContent>
      </Card>
    </div>
  )
}

