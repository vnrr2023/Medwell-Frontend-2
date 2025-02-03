import type React from "react"
import { ArrowLeft, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PatientReportsProps {
  patientId: number
  onClose: () => void
}

interface Report {
  id: number
  date: string
  type: string
  doctor: string
  status: "Normal" | "Abnormal" | "Critical"
}

const dummyReports: Report[] = [
  { id: 1, date: "2024-03-15", type: "Blood Test", doctor: "Dr. Smith", status: "Normal" },
  { id: 2, date: "2024-02-28", type: "X-Ray", doctor: "Dr. Johnson", status: "Abnormal" },
  { id: 3, date: "2024-01-10", type: "MRI", doctor: "Dr. Williams", status: "Normal" },
  { id: 4, date: "2023-12-05", type: "ECG", doctor: "Dr. Brown", status: "Critical" },
  { id: 5, date: "2023-11-20", type: "Ultrasound", doctor: "Dr. Davis", status: "Normal" },
]

const PatientReports: React.FC<PatientReportsProps> = ({ patientId, onClose }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onClose} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
      </Button>
      <h1 className="text-3xl font-bold mb-6">Patient Reports for Patient {patientId}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.doctor}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === "Normal"
                          ? "bg-green-100 text-green-800"
                          : report.status === "Abnormal"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download All Reports
        </Button>
      </div>
    </div>
  )
}

export default PatientReports

