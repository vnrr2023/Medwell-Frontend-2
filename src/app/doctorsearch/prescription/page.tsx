"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  ClipboardList,
  Pill,
  MessageSquareText,
  Save,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useReactToPrint } from "react-to-print"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
interface Medicine {
  row: string
  medicine: string
  breakfast: number
  lunch: number
  dinner: number
  duration?: string
}

interface Prescription {
  prescriptionData: {
    Observations: string[]
    Medicines: Medicine[]
  }
  otherData: string
}

interface PatientInfo {
  id: string
  name: string
  age: number
  gender: string
  contact: string
  image?: string
}

// Sample patient data
const patientInfo: PatientInfo = {
  id: "PT-12345",
  name: "Rahul Sharma",
  age: 32,
  gender: "Male",
  contact: "+91 9876543210",
  image: "/placeholder.svg?height=200&width=200",
}

// Doctor info
const doctorInfo = {
  name: "Dr. Sarah Smith",
  specialty: "Cardiologist",
  registration: "MCI-12345",
  clinic: "MedWell Heart Center",
  address: "123 Healthcare Avenue, Mumbai, 400001",
  image: "/placeholder.svg?height=200&width=200",
}

// Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function PrescriptionPage() {
  const router = useRouter()
  const [currentDate] = useState<Date>(new Date())
  const [prescription, setPrescription] = useState<Prescription>({
    prescriptionData: {
      Observations: ["The patient is having headache.", "Not able to work properly"],
      Medicines: [
        {
          row: "1",
          medicine: "",
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          duration: "",
        },
      ],
    },
    otherData: "",
  })
  const [activeTab, setActiveTab] = useState<string>("write")
  const [previewDialogOpen, setPreviewDialogOpen] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)

  // Add a ref for printing
  const prescriptionPreviewRef = useRef<HTMLDivElement>(null)

  // Add print functionality - fixed the type error
  const handlePrint = useReactToPrint({
    // documentRef: prescriptionPreviewRef,
    documentTitle: `Prescription_${patientInfo.name}_${formatDate(currentDate)}`,
  })

  // Add PDF download functionality
  const handleDownloadPDF = async () => {
    if (prescriptionPreviewRef.current) {
      const canvas = await html2canvas(prescriptionPreviewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Prescription_${patientInfo.name}_${formatDate(currentDate)}.pdf`)
    }
  }

  // Update an observation
  const updateObservation = (index: number, value: string) => {
    const updatedObservations = [...prescription.prescriptionData.Observations]
    updatedObservations[index] = value

    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Observations: updatedObservations,
      },
    }))
  }

  // Add a new medicine row
  const addMedicine = () => {
    setPrescription((prev) => {
      const newRow = (prev.prescriptionData.Medicines.length + 1).toString()
      return {
        ...prev,
        prescriptionData: {
          ...prev.prescriptionData,
          Medicines: [
            ...prev.prescriptionData.Medicines,
            {
              row: newRow,
              medicine: "",
              breakfast: 0,
              lunch: 0,
              dinner: 0,
              duration: "",
            },
          ],
        },
      }
    })
  }

  // Remove a medicine
  const removeMedicine = (rowToRemove: string) => {
    setPrescription((prev) => {
      const filteredMedicines = prev.prescriptionData.Medicines.filter((med) => med.row !== rowToRemove)
      // Reindex the rows
      const reindexedMedicines = filteredMedicines.map((med, index) => ({
        ...med,
        row: (index + 1).toString(),
      }))

      return {
        ...prev,
        prescriptionData: {
          ...prev.prescriptionData,
          Medicines: reindexedMedicines,
        },
      }
    })
  }

  // Update medicine name
  const updateMedicineName = (row: string, value: string) => {
    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Medicines: prev.prescriptionData.Medicines.map((med) => (med.row === row ? { ...med, medicine: value } : med)),
      },
    }))
  }

  // Update medicine timing
  const updateMedicineTiming = (row: string, meal: "breakfast" | "lunch" | "dinner", value: number) => {
    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Medicines: prev.prescriptionData.Medicines.map((med) => (med.row === row ? { ...med, [meal]: value } : med)),
      },
    }))
  }

  // Update medicine duration
  const updateMedicineDuration = (row: string, value: string) => {
    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Medicines: prev.prescriptionData.Medicines.map((med) => (med.row === row ? { ...med, duration: value } : med)),
      },
    }))
  }

  // Update other data
  const updateOtherData = (value: string) => {
    setPrescription((prev) => ({
      ...prev,
      otherData: value,
    }))
  }

  // Save prescription
  const savePrescription = () => {
    // Here you would typically send the data to your backend
    console.log("Saving prescription:", prescription)

    // Simulate API call
    setTimeout(() => {
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[url('/bg.svg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="text-white mb-4 hover:bg-white/20" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Write Prescription</h1>
          </div>
          <p className="text-indigo-100">Create a detailed prescription for your patient</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8">
          {/* Patient Info Card */}
          <div className="order-2 lg:order-1">
            <Card className="border-indigo-100 shadow-lg sticky top-24">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="text-indigo-700">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-indigo-100">
                    <AvatarImage src={patientInfo.image} alt={patientInfo.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                      {patientInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-slate-800">{patientInfo.name}</h3>
                  <p className="text-indigo-600">Patient ID: {patientInfo.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {patientInfo.age} years
                    </Badge>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {patientInfo.gender}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">CONTACT</h4>
                    <p className="text-slate-800">{patientInfo.contact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">APPOINTMENT DATE</h4>
                    <p className="text-slate-800">{formatDate(currentDate)}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => setPreviewDialogOpen(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Preview Prescription
                  </Button>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={savePrescription}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Prescription
                  </Button>
                </div>

                {saveSuccess !== null && (
                  <Alert
                    className={`mt-4 ${saveSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                  >
                    {saveSuccess ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertTitle className={saveSuccess ? "text-green-700" : "text-red-700"}>
                      {saveSuccess ? "Prescription Saved" : "Error Saving"}
                    </AlertTitle>
                    <AlertDescription className={saveSuccess ? "text-green-600" : "text-red-600"}>
                      {saveSuccess
                        ? "Prescription has been saved successfully."
                        : "There was an error saving the prescription. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prescription Form */}
          <div className="order-1 lg:order-2">
            <Card className="border-indigo-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-indigo-700">Prescription Details</CardTitle>
                  <div className="text-sm text-slate-500">Date: {formatDate(currentDate)}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="write" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
                    <TabsTrigger
                      value="write"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Observations</span>
                      <span className="sm:hidden">Obs</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="medicines"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <Pill className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Medicines</span>
                      <span className="sm:hidden">Meds</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="instructions"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <MessageSquareText className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Instructions</span>
                      <span className="sm:hidden">Instr</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Observations Tab */}
                  <TabsContent value="write" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Patient Observations</h3>

                      <div className="space-y-4">
                        {prescription.prescriptionData.Observations.map((observation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Textarea
                              value={observation}
                              onChange={(e) => updateObservation(index, e.target.value)}
                              placeholder="Enter observation"
                              className="flex-1 border-slate-300 focus:border-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Medicines Tab */}
                  <TabsContent value="medicines" className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Prescribed Medicines</h3>
                        <Button onClick={addMedicine} className="bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Add Medicine</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      </div>

                      <div className="border rounded-lg overflow-x-auto">
                        <div className="min-w-[650px]">
                          <Table>
                            <TableHeader className="bg-slate-50">
                              <TableRow>
                                <TableHead className="w-[5%]">No.</TableHead>
                                <TableHead className="w-[35%]">Medicine Name</TableHead>
                                <TableHead className="text-center">B</TableHead>
                                <TableHead className="text-center">L</TableHead>
                                <TableHead className="text-center">D</TableHead>
                                <TableHead className="w-[15%]">Duration</TableHead>
                                <TableHead className="w-[5%]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {prescription.prescriptionData.Medicines.map((medicine) => (
                                <TableRow key={medicine.row}>
                                  <TableCell className="font-medium">{medicine.row}</TableCell>
                                  <TableCell>
                                    <Input
                                      value={medicine.medicine}
                                      onChange={(e) => updateMedicineName(medicine.row, e.target.value)}
                                      placeholder="Medicine name"
                                      className="border-slate-300 focus:border-indigo-500"
                                    />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={medicine.breakfast === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "breakfast", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={medicine.lunch === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "lunch", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={medicine.dinner === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "dinner", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={medicine.duration || ""}
                                      onChange={(e) => updateMedicineDuration(medicine.row, e.target.value)}
                                      placeholder="e.g. 7 days"
                                      className="border-slate-300 focus:border-indigo-500"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeMedicine(medicine.row)}
                                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        <span className="inline-block mr-4">B = Breakfast</span>
                        <span className="inline-block mr-4">L = Lunch</span>
                        <span className="inline-block">D = Dinner</span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Instructions Tab */}
                  <TabsContent value="instructions" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Instructions</h3>

                      <Textarea
                        value={prescription.otherData}
                        onChange={(e) => updateOtherData(e.target.value)}
                        placeholder="Enter additional instructions, lifestyle recommendations, or follow-up details"
                        className="min-h-[200px] border-slate-300 focus:border-indigo-500"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between bg-slate-50 border-t p-6 gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 sm:flex-none"
                    onClick={() => {
                      const prevTab =
                        activeTab === "write" ? "instructions" : activeTab === "medicines" ? "write" : "medicines"
                      setActiveTab(prevTab)
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 sm:flex-none"
                    onClick={() => {
                      const nextTab =
                        activeTab === "write" ? "medicines" : activeTab === "medicines" ? "instructions" : "write"
                      setActiveTab(nextTab)
                    }}
                  >
                    Next
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto" onClick={savePrescription}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Prescription
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Prescription Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="w-[95vw] md:max-w-4xl max-w-sm max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-indigo-700 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prescription Preview
            </DialogTitle>
            <DialogDescription>Review the prescription before saving</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="border rounded-lg p-4 sm:p-6 bg-white max-w-80 md:max-w-full" ref={prescriptionPreviewRef}>
              <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-4 mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-indigo-100">
                    <AvatarImage src={doctorInfo.image} alt={doctorInfo.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                      {doctorInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-700">{doctorInfo.name}</h3>
                    <p className="text-slate-600">{doctorInfo.specialty}</p>
                    <p className="text-sm text-slate-500">Reg. No: {doctorInfo.registration}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="font-medium text-slate-700">{doctorInfo.clinic}</p>
                  <p className="text-sm text-slate-500">{doctorInfo.address}</p>
                  <p className="text-sm text-slate-500 mt-2">Date: {formatDate(currentDate)}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-start border-b pb-4 mb-4 gap-4">
                <div className="w-full sm:w-auto">
                  <p className="text-sm text-slate-500">Patient Name:</p>
                  <p className="font-medium text-slate-800">{patientInfo.name}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <p className="text-sm text-slate-500">Patient ID:</p>
                  <p className="font-medium text-slate-800">{patientInfo.id}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <p className="text-sm text-slate-500">Age/Gender:</p>
                  <p className="font-medium text-slate-800">
                    {patientInfo.age} years, {patientInfo.gender}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-indigo-700 mb-2">Observations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {prescription.prescriptionData.Observations.map(
                    (observation, index) =>
                      observation.trim() && (
                        <li key={index} className="text-slate-700">
                          {observation}
                        </li>
                      ),
                  )}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-indigo-700 mb-2">Medicines</h4>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[5%]">No.</TableHead>
                          <TableHead className="w-[40%]">Medicine</TableHead>
                          <TableHead className="text-center">Morning</TableHead>
                          <TableHead className="text-center">Afternoon</TableHead>
                          <TableHead className="text-center">Evening</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.prescriptionData.Medicines.map(
                          (medicine) =>
                            medicine.medicine && (
                              <TableRow key={medicine.row}>
                                <TableCell>{medicine.row}</TableCell>
                                <TableCell className="font-medium">{medicine.medicine}</TableCell>
                                <TableCell className="text-center">{medicine.breakfast === 1 ? "✓" : "-"}</TableCell>
                                <TableCell className="text-center">{medicine.lunch === 1 ? "✓" : "-"}</TableCell>
                                <TableCell className="text-center">{medicine.dinner === 1 ? "✓" : "-"}</TableCell>
                                <TableCell>{medicine.duration || "As directed"}</TableCell>
                              </TableRow>
                            ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {prescription.otherData && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-indigo-700 mb-2">Additional Instructions</h4>
                  <p className="text-slate-700 whitespace-pre-line">{prescription.otherData}</p>
                </div>
              )}

              <div className="mt-8 pt-4 border-t text-right">
                <p className="font-medium text-slate-800">{doctorInfo.name}</p>
                <p className="text-sm text-slate-600">{doctorInfo.specialty}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 mt-4 md:max-w-4xl max-w-sm">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 w-full sm:w-auto"
              onClick={() => setPreviewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
              onClick={() => handlePrint()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

