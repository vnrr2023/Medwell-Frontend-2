"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AddReportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Add New Report</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Report</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add file upload component here */}
          <Button>Upload Report</Button>
        </CardContent>
      </Card>
    </div>
  )
}

