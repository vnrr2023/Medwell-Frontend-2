"use client"

import React from "react"
import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useFetch } from "@/hooks/useFetch"
// import { FileText } from 'lucide-react'

export default function Reports() {
  // const { data: reports, loading, error } = useFetch("/api/patient/reports")

  // if (loading) return <div>Loading...</div>
  // if (error) return <div>Error: {error}</div>
  // if (!reports) return <div>No reports available</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Medical Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {reports.map((report: any) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Date: {report.date}</p>
              <Button>View Report</Button>
            </CardContent>
          </Card>
        ))} */}
      </div>
    </motion.div>
  )
}