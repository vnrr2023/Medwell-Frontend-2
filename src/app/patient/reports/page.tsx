export interface ReportElement {
  max: number
  min: number
  unit: string
  value: number
}

export interface ReportDetail {
  report_data: {
    [key: string]: ReportElement
  }
}

export interface Report {
  id: string
  report_file: string
  report_type: string
  submitted_at: string
  date_of_collection: string
  doctor_name: string
  date_of_report: string
  summary: string
  reportdetail: ReportDetail
}

"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, FileText, AlertCircle, ExternalLink, Download, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Report as MedReport } from "./types"
import DaddyAPI from "@/services/api"
import CombinedChat from "@/components/chatbots/ChatCombined"

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<MedReport | null>(null)
  const [reports, setReports] = useState<MedReport[]>([])
  const [globalSearch, setGlobalSearch] = useState("")

  useEffect(() => {
    const getReports = async () => {
      const response = await DaddyAPI.getReports()
      setReports(response.data?.reports || [])
    }
    getReports()
  }, [])

  const handleReportClick = useCallback((report: Report) => {
    setSelectedReport(report)
  }, [])

  const handleBackClick = useCallback(() => {
    setSelectedReport(null)
  }, [])

  const handleViewReport = useCallback(() => {
    if (selectedReport?.report_file) {
      window.open(selectedReport.report_file, "_blank")
    }
  }, [selectedReport])

  const handleDownloadPDF = useCallback((report: Report) => {
    import("jspdf").then((jsPDFModule) => {
      const jsPDF = jsPDFModule.default
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.setTextColor(128, 0, 128)
      doc.text("MEDWELL", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Report Type: ${report.report_type}`, 20, 30)
      doc.text(`Date: ${report.date_of_report}`, 20, 40)
      doc.text(`Doctor: ${report.doctor_name}`, 20, 50)
      doc.text(`Summary: ${report.summary}`, 20, 60)

      const tableData = Object.entries(report.reportdetail.report_data).map(([name, data]) => [
        name.replace(/_/g, " ").toUpperCase(),
        data.value === -1 ? "N/A" : `${data.value} ${data.unit}`,
        `${data.min} - ${data.max} ${data.unit}`,
      ])

      import("jspdf-autotable").then((autoTableModule) => {
        autoTableModule.default(doc, {
          startY: 70,
          head: [["Test", "Value", "Normal Range"]],
          body: tableData,
        })

        doc.save(`${report.report_type}_${report.date_of_report.replace(/\//g, "-")}.pdf`)
      })
    })
  }, [])

  const handleGlobalSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearch(e.target.value)
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchTerm = globalSearch.toLowerCase()
      return (
        report.report_type?.toLowerCase().includes(searchTerm) ||
        report.doctor_name?.toLowerCase().includes(searchTerm) ||
        report.summary?.toLowerCase()?.includes(searchTerm) ||
        Object?.entries(report.reportdetail?.report_data || {}).some(
          ([key, value]) =>
            key?.toLowerCase().includes(searchTerm) ||
            (value.value !== -1 && value.value.toString().includes(searchTerm)),
        )
      )
    })
  }, [reports, globalSearch])

  const ReportCard: React.FC<{ report: Report; onClick: (report: Report) => void; index: number }> = React.memo(
    ({ report, onClick, index }) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(report)}
      >
        <Card className="cursor-pointer h-full">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="capitalize text-base sm:text-lg">{report.report_type.replace(/_/g, " ")}</CardTitle>
            <CardDescription>{report.submitted_at}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-sm text-muted-foreground">Dr. {report.doctor_name}</p>
          </CardContent>
        </Card>
      </motion.div>
    ),
  )

  ReportCard.displayName = "ReportCard"

  const DetailedReport: React.FC<{ report: Report }> = ({ report }) => {
    const [localSearch, setLocalSearch] = useState("")
    const [localRangeFilter, setLocalRangeFilter] = useState("all")

    const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value)
    }

    const handleLocalRangeFilterChange = (value: string) => {
      setLocalRangeFilter(value)
    }

    const filteredElements = useMemo(() => {
      return Object.entries(report.reportdetail.report_data).filter(([name, data]) => {
        const isValuePresent = data.value !== -1
        const isInRange = isValuePresent && data.value >= data.min && data.value <= data.max
        const matchesSearch =
          localSearch?.toLowerCase() === "" ||
          name.toLowerCase()?.includes(localSearch.toLowerCase()) ||
          (data.value !== -1 && data.value.toString()?.includes(localSearch.toLowerCase()))

        let matchesRangeFilter = true
        switch (localRangeFilter) {
          case "inRange":
            matchesRangeFilter = isInRange
            break
          case "outOfRange":
            matchesRangeFilter = !isInRange && isValuePresent
            break
          case "notAvailable":
            matchesRangeFilter = !isValuePresent
            break
        }

        return matchesSearch && matchesRangeFilter
      })
    }, [report.reportdetail.report_data, localSearch, localRangeFilter])

    const sortedElements = useMemo(() => {
      return filteredElements.sort(([, a], [, b]) => {
        if (a.value === -1 && b.value !== -1) return 1
        if (a.value !== -1 && b.value === -1) return -1
        return 0
      })
    }, [filteredElements])

    return (
      <Card className="mb-12 md:mb-0">
        <CardHeader>
          <CardTitle className="capitalize">{report?.report_type.replace(/_/g, " ")}</CardTitle>
          <CardDescription>{report?.submitted_at}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" onClick={handleBackClick} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Collection Date</p>
              <p className="font-medium">{report?.date_of_collection}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{report?.doctor_name}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p>{report?.summary}</p>
          </div>
          <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
          <div className="mb-4 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search test names or values"
                value={localSearch}
                onChange={handleLocalSearchChange}
                className="pl-8"
              />
            </div>
            <Select value={localRangeFilter} onValueChange={handleLocalRangeFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue placeholder="Filter results" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="inRange">In Range</SelectItem>
                <SelectItem value="outOfRange">Out of Range</SelectItem>
                <SelectItem value="notAvailable">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedElements?.map(([name, data]) => {
                const isValuePresent = data.value !== -1
                const isInRange = isValuePresent && data.value >= data.min && data.value <= data.max
                return (
                  <Card
                    key={name}
                    className={isValuePresent ? (isInRange ? "bg-green-50" : "bg-red-50") : "bg-gray-50"}
                  >
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base capitalize">{name.replace(/_/g, " ")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      {isValuePresent ? (
                        <>
                          <p className="text-xl sm:text-2xl font-bold">
                            {data.value} {data.unit}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Range: {data.min} - {data.max} {data.unit}
                          </p>
                          {!isInRange && (
                            <Badge variant="destructive" className="mt-2">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Out of range
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="secondary" className="mt-2">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Not available
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
          <Button variant="outline" onClick={() => handleDownloadPDF(report)} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {report.report_file && (
            <Button onClick={handleViewReport} className="w-full sm:w-auto">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  DetailedReport.displayName = "DetailedReport"

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <motion.div
            key="detailed-report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DetailedReport report={selectedReport} />
          </motion.div>
        ) : (
          <motion.div
            key="report-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <FileText className="w-8 h-8 mr-2" />
              Your Reports
            </h1>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search across all reports"
                value={globalSearch}
                onChange={handleGlobalSearchChange}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredReports.map((report, index) => (
                <ReportCard key={report.id} report={report} onClick={handleReportClick} index={index} />
              ))}
            </div>
            {filteredReports.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">No reports found matching your search.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <CombinedChat />
    </div>
  )
}

export default Reports
