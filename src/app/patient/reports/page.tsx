"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Download, ExternalLink, Search, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from "jspdf"
import { Report } from "@/types/report";
import { ReportElement } from "@/types/report";


// Mock data based on the provided structure
const mockReports: Report[] = [
  {
    id: 1,
    title: "Annual Checkup",
    date: "28 Sept, 2024",
    collectionDate: "25 Sept, 2024",
    doctorName: "Dr. Nishi",
    summary: "Overall health is good. Calcium levels are slightly elevated.",
    elements: {
      calcium: { max: 10.2, min: 8.5, unit: "mg/dL", value: 10.5 },
      hemoglobin: { max: 17.5, min: 13.5, unit: "g/dL", value: 14.5 },
      redBloodCells: { max: 5.9, min: 4.5, unit: "million/µL", value: 5.2 },
      whiteBloodCells: { max: 11000, min: 4500, unit: "/µL", value: 7500 },
    },
    reportUrl: "https://example.com/report1",
  },
  {
    id: 2,
    title: "Lipid Panel",
    date: "15 Oct, 2024",
    collectionDate: "12 Oct, 2024",
    doctorName: "Dr. Rehan",
    summary: "Cholesterol levels are within normal range.",
    elements: {
      totalCholesterol: { max: 200, min: 125, unit: "mg/dL", value: 180 },
      ldlCholesterol: { max: 130, min: 0, unit: "mg/dL", value: 100 },
      hdlCholesterol: { max: 60, min: 40, unit: "mg/dL", value: 50 },
      triglycerides: { max: 150, min: 0, unit: "mg/dL", value: 120 },
    },
    reportUrl: "https://example.com/report2",
  },
  {
    id: 3,
    title: "Nutrient Deficiency Panel",
    date: "15 Nov, 2024",
    collectionDate: "12 Nov, 2024",
    doctorName: "Dr. Vivek",
    summary:
      "Several nutrient levels are below the normal range, indicating deficiencies in calcium, iron, and vitamin D.",
    elements: {
      calcium: { max: 10.5, min: 8.5, unit: "mg/dL", value: 7.9 },
      iron: { max: 170, min: 60, unit: "µg/dL", value: 50 },
      vitaminD: { max: 100, min: 30, unit: "ng/mL", value: 20 },
      magnesium: { max: 2.6, min: 1.8, unit: "mg/dL", value: 2.2 },
    },
    reportUrl: "https://example.com/report3",
  },
]

export default function Reports() {
  const [reports, setReports] = useState(mockReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setReports(mockReports)
  }, [])

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2 text-primary">
          <FileText className="h-8 w-8" />
          Your Medical Reports
        </h1>
        <p className="text-muted-foreground mb-6">View and manage all your medical reports in one place.</p>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} onSelect={() => setSelectedReport(report)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <p className="text-muted-foreground">Recent reports will be displayed here.</p>
        </TabsContent>
        <TabsContent value="flagged">
          <p className="text-muted-foreground">Flagged reports will be displayed here.</p>
        </TabsContent>
      </Tabs>

      {selectedReport && <ReportDetails report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  )
}

function ReportCard({ report, onSelect }: { report: Report; onSelect: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50"
        onClick={onSelect}
      >
        <CardHeader>
          <CardTitle className="text-primary">{report.title}</CardTitle>
          <CardDescription>{report.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Dr. {report.doctorName}</p>
          <p className="text-sm">{report.summary}</p>
        </CardContent>
        <CardFooter>
          <Badge variant={getReportStatus(report)} className="text-xs">
            {getReportStatusText(report)}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function ReportDetails({ report, onClose }: { report: Report; onClose: () => void }) {
  const handleDownload = () => {
    const doc = new jsPDF()

    // Add Medwell header
    doc.setFontSize(24)
    doc.setTextColor(128, 0, 128)
    doc.text("MEDWELL", 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text("Empowering Health Through Innovation", 20, 30)

    // Add report details
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text(report.title, 20, 50)

    doc.setFontSize(12)
    doc.text(`Date: ${report.date}`, 20, 60)
    doc.text(`Doctor: ${report.doctorName}`, 20, 70)
    doc.text(`Summary: ${report.summary}`, 20, 80)

    // Add test results
    doc.setFontSize(14)
    doc.text("Test Results", 20, 100)

    let yPos = 110
    Object.entries(report.elements).forEach(([key, value]) => {
      const status = getElementStatus(value)
      doc.setFontSize(12)
      doc.text(`${key}: ${(value as ReportElement).value} ${(value as ReportElement).unit} (${status})`, 30, yPos)
      yPos += 10
    })

    // Save the PDF
    doc.save(`${report.title.replace(/\s+/g, "_")}_Report.pdf`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white md:max-h-[80vh]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
        <CardTitle className="text-primary">{report.title}</CardTitle>
        <CardDescription>{report.date}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
        <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <ScrollArea className="h-[40vh] md:h-[50vh]">
          <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary">Summary</h3>
            <p>{report.summary}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">Test Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(report.elements).map(([key, value]) => (
            <div key={key} className={`p-3 rounded-md ${getElementColorClass(value)}`}>
              <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p>
            {value.value} {value.unit}
              </p>
              <p className="text-sm">
            Range: {value.min} - {value.max} {value.unit}
              </p>
              <Badge variant={getElementBadgeVariant(value)}>{getElementStatus(value)}</Badge>
            </div>
          ))}
            </div>
          </div>
        </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex justify-between flex-wrap">
          <div className="flex space-x-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          View Full Report
        </Button>
          </div>
          <Button variant="outline" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function getReportStatus(report: Report) {
  const hasAbnormalValues = Object.values(report.elements).some(
    (element) => (element as ReportElement).value < (element as ReportElement).min || (element as ReportElement).value > (element as ReportElement).max,
  )
  return hasAbnormalValues ? "destructive" : "secondary"
}

function getReportStatusText(report: Report) {
  const hasAbnormalValues = Object.values(report.elements).some(
    (element) => (element as ReportElement).value < (element as ReportElement).min || (element as ReportElement).value > (element as ReportElement).max,
  )
  return hasAbnormalValues ? "Needs Attention" : "Normal"
}

function getElementStatus(element: ReportElement) {
  if (element.value < element.min) return "Low"
  if (element.value > element.max) return "High"
  return "Normal"
}

function getElementColorClass(element: ReportElement) {
  const status = getElementStatus(element)
  switch (status) {
    case "Low":
      return "bg-red-100"
    case "High":
      return "bg-yellow-100"
    case "Normal":
      return "bg-green-100"
    default:
      return "bg-gray-100"
  }
}

function getElementBadgeVariant(element: ReportElement): "outline" | "default" | "destructive" | "secondary" {
  const status = getElementStatus(element);
  switch (status) {
    case "Low":
      return "destructive";
    case "High":
      return "secondary";
    case "Normal":
      return "default";
    default:
      return "outline";
  }
}