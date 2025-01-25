"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>{/* Add profile information here */}</CardContent>
      </Card>
    </div>
  )
}

