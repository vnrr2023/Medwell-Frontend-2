"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Loader2,
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

import DaddyAPI from "@/services/api"
import ChatArogya from "@/components/chatbots/ChatArogya"

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
    Instructions: string[]
    Medicines: Medicine[]
  }
  otherData: string
  presId?: string
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
  const { id } = useParams() as { id: string }
  const [loading, setLoading] = useState<boolean>(false)
  // Update the initial state to ensure it follows the required data structure
  const [prescription, setPrescription] = useState<Prescription>({
    prescriptionData: {
      Observations: ["The patient is having headache.", "Not able to work properly"],
      Instructions: ["Take good Sleep"],
      Medicines: [
        {
          row: "1",
          medicine: "Crocin",
          breakfast: 0,
          lunch: 1,
          dinner: 0,
          duration: "7 days",
        },
      ],
    },
    otherData: "Take good Sleep",
  })
  const [activeTab, setActiveTab] = useState<string>("write")
  const [previewDialogOpen, setPreviewDialogOpen] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)
  const [newObservation, setNewObservation] = useState<string>("")
  const [newInstruction, setNewInstruction] = useState<string>("")
  // Add a ref for printing
  const prescriptionPreviewRef = useRef<HTMLDivElement>(null)

  // Update the useEffect to properly handle the data structure when fetching
  useEffect(() => {
    const fetchPrescription = async () => {
      if (id && id !== "new") {
        try {
          setLoading(true)
          const data: any = await DaddyAPI.getPrescriptions(id)

          // Ensure we have the correct data structure
          const transformedData: any = {
            prescriptionData: {
              Observations: data.data.prescription.Observations || [
                "The patient is having headache.",
                "Not able to work properly",
              ],
              Instructions: data.data.otherInfo ? [data.data.otherInfo] : ["Take good Sleep"],
              Medicines:
                data.data.prescription.Medicines && data.data.prescription.Medicines.length > 0
                  ? data.data.prescription.Medicines.map((med: any, index: number) => ({
                      ...med,
                      row: med.row || (index + 1).toString(),
                    }))
                  : [
                      {
                        row: "1",
                        medicine: "Crocin",
                        breakfast: 0,
                        lunch: 1,
                        dinner: 0,
                        duration: "7 days",
                      },
                    ],
            },
            otherData: data.data.otherInfo || "Take good Sleep",
            presId: data.data.id,
          }

          setPrescription(transformedData)
        } catch (error) {
          console.error("Error fetching prescription:", error)
          // Handle error (could show an error message)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPrescription()
  }, [id])

  // Add print functionality - fixed the type error
  const handlePrint = useReactToPrint({
  // @ts-expect-error: Suppress type error for useReactToPrint
  content: () => prescriptionPreviewRef.current,
    documentTitle: `Prescription_${patientInfo.name}_${formatDate(currentDate)}`,
    onBeforeGetContent: () => {
      // Ensure any responsive elements are properly sized before printing
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 250)
      })
    },
  })

  // Add PDF download functionality
  const handleDownloadPDF = async () => {
    if (prescriptionPreviewRef.current) {
      try {
        setLoading(true)

        // Create a new div that will be used for PDF generation
        const printContainer = document.createElement("div")
        printContainer.style.position = "absolute"
        printContainer.style.left = "-9999px"
        printContainer.style.top = "0"
        printContainer.style.width = "800px" // Fixed width for consistent rendering
        printContainer.style.backgroundColor = "white"
        printContainer.style.padding = "20px"
        document.body.appendChild(printContainer)

        // Clone the content
        const contentClone = prescriptionPreviewRef.current.cloneNode(true) as HTMLElement

        // Apply styles to ensure proper rendering
        const styles = document.createElement("style")
        styles.textContent = `
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; }
          th { background-color: #f8fafc; text-align: left; }
        `

        printContainer.appendChild(styles)
        printContainer.appendChild(contentClone)

        // Wait for content to render
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Use html2canvas with higher quality settings
        const canvas = await html2canvas(printContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "white",
          windowWidth: 800,
          height: printContainer.offsetHeight,
        })

        // Remove the temporary container
        document.body.removeChild(printContainer)

        // Create PDF with proper dimensions
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        // Calculate dimensions to fit A4
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add image to PDF, handling multi-page if needed
        let heightLeft = imgHeight
        let position = 0

        // First page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add additional pages if content is longer than one page
        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save(`Prescription_${patientInfo.name}_${formatDate(currentDate)}.pdf`)
      } catch (error) {
        console.error("Error generating PDF:", error)
        // Show error message to user
        alert("Failed to generate PDF. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Update an observation
  // const updateObservation = (index: number, value: string) => {
  //   const updatedObservations = [...prescription.prescriptionData.Observations]
  //   updatedObservations[index] = value

  //   setPrescription((prev) => ({
  //     ...prev,
  //     prescriptionData: {
  //       ...prev.prescriptionData,
  //       Observations: updatedObservations,
  //     },
  //   }))
  // }
  // Add a new observation
  const addObservation = () => {
    if (newObservation.trim()) {
      setPrescription((prev) => ({
        ...prev,
        prescriptionData: {
          ...prev.prescriptionData,
          Observations: [...prev.prescriptionData.Observations, newObservation],
        },
      }))
      setNewObservation("")
    }
  }

  // Remove an observation
  const removeObservation = (index: number) => {
    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Observations: prev.prescriptionData.Observations.filter((_, i) => i !== index),
      },
    }))
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

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setPrescription((prev) => ({
        ...prev,
        prescriptionData: {
          ...prev.prescriptionData,
          Instructions: [...prev.prescriptionData.Instructions, newInstruction],
        },
      }))
      setNewInstruction("")
    }
  }

  // Remove an Instruction
  const removeInstruction = (index: number) => {
    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Instructions: prev.prescriptionData.Instructions.filter((_, i) => i !== index),
      },
    }))
  }

  // Update an Instruction
  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...prescription.prescriptionData.Instructions]
    updatedInstructions[index] = value

    setPrescription((prev) => ({
      ...prev,
      prescriptionData: {
        ...prev.prescriptionData,
        Instructions: updatedInstructions,
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
  const savePrescription = async () => {
    try {
      setLoading(true)
      setSaveSuccess(null)

      // Format the data according to the required structure
      const prescriptionData = {
        prescriptionData: {
          Observations: prescription.prescriptionData.Observations,
          Medicines: prescription.prescriptionData.Medicines.map((med) => ({
            row: med.row,
            medicine: med.medicine,
            breakfast: med.breakfast,
            lunch: med.lunch,
            dinner: med.dinner,
            duration: med.duration || "",
          })),
        },
        otherData:
          prescription.prescriptionData.Instructions.length > 0
            ? prescription.prescriptionData.Instructions[0]
            : "Take good Sleep",
        id: prescription.presId,
      }

      const prescriptionAddData = {
        prescriptionData: {
          Observations: prescription.prescriptionData.Observations,
          Medicines: prescription.prescriptionData.Medicines.map((med) => ({
            row: med.row,
            medicine: med.medicine,
            breakfast: med.breakfast,
            lunch: med.lunch,
            dinner: med.dinner,
            duration: med.duration || "",
          })),
        },
        otherData:
          prescription.prescriptionData.Instructions.length > 0
            ? prescription.prescriptionData.Instructions[0]
            : "Take good Sleep",
        appointmentId: id,
      }

      let response: any
      if (prescription.presId) {
        response = await DaddyAPI.updatePrescription(prescriptionData)
      } else {
        response = await DaddyAPI.addPrescription(prescriptionAddData)
      }

      console.log("Prescription saved:", response)
      setSaveSuccess(true)
      router.push("/doctor/appointments")
      if (id === "new" && response.id) {
        setTimeout(() => {
          router.push(`/prescription/${response.id}`)
        }, 1500)
      }
    } catch (error) {
      console.error("Error saving prescription:", error)
      setSaveSuccess(false)
    } finally {
      setLoading(false)

      if (setSaveSuccess) {
        setTimeout(() => {
          setSaveSuccess(null)
        }, 3000)
      }
    }
  }

  if (loading && !prescription.prescriptionData.Observations.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-lg text-slate-600">Loading prescription data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[url('/bg.svg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="text-white mb-4 hover:bg-white/20" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">
              {id && id !== "new" ? "Edit Prescription" : "Write Prescription"}
            </h1>
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
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={savePrescription}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Prescription
                      </>
                    )}
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
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeObservation(index)}
                              className="border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Input
                          value={newObservation}
                          onChange={(e) => setNewObservation(e.target.value)}
                          placeholder="Add new observation"
                          className="flex-1 border-slate-300 focus:border-indigo-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addObservation()
                            }
                          }}
                        />
                        <Button onClick={addObservation} className="bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
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

                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="text-left p-2 border border-slate-200 w-[5%]">No.</th>
                                <th className="text-left p-2 border border-slate-200 w-[35%]">Medicine Name</th>
                                <th className="text-center p-2 border border-slate-200">B</th>
                                <th className="text-center p-2 border border-slate-200">L</th>
                                <th className="text-center p-2 border border-slate-200">D</th>
                                <th className="text-left p-2 border border-slate-200 w-[15%]">Duration</th>
                                <th className="text-center p-2 border border-slate-200 w-[5%]"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {prescription.prescriptionData.Medicines.map((medicine) => (
                                <tr key={medicine.row}>
                                  <td className="p-2 border border-slate-200 font-medium">{medicine.row}</td>
                                  <td className="p-2 border border-slate-200">
                                    <Input
                                      value={medicine.medicine}
                                      onChange={(e) => updateMedicineName(medicine.row, e.target.value)}
                                      placeholder="Medicine name"
                                      className="border-slate-300 focus:border-indigo-500"
                                    />
                                  </td>
                                  <td className="p-2 border border-slate-200 text-center">
                                    <Checkbox
                                      checked={medicine.breakfast === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "breakfast", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </td>
                                  <td className="p-2 border border-slate-200 text-center">
                                    <Checkbox
                                      checked={medicine.lunch === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "lunch", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </td>
                                  <td className="p-2 border border-slate-200 text-center">
                                    <Checkbox
                                      checked={medicine.dinner === 1}
                                      onCheckedChange={(checked) =>
                                        updateMedicineTiming(medicine.row, "dinner", checked ? 1 : 0)
                                      }
                                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                  </td>
                                  <td className="p-2 border border-slate-200">
                                    <Input
                                      value={medicine.duration || ""}
                                      onChange={(e) => updateMedicineDuration(medicine.row, e.target.value)}
                                      placeholder="e.g. 7 days"
                                      className="border-slate-300 focus:border-indigo-500"
                                    />
                                  </td>
                                  <td className="p-2 border border-slate-200 text-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeMedicine(medicine.row)}
                                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Instructions</h3>

                      <div className="space-y-4">
                        {prescription.prescriptionData.Instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Textarea
                              value={instruction}
                              onChange={(e) => updateInstruction(index, e.target.value)}
                              placeholder="Enter instruction"
                              className="flex-1 border-slate-300 focus:border-indigo-500"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeInstruction(index)}
                              className="border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Input
                          value={newInstruction}
                          onChange={(e) => setNewInstruction(e.target.value)}
                          placeholder="Add new instruction"
                          className="flex-1 border-slate-300 focus:border-indigo-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addInstruction()
                            }
                          }}
                        />
                        <Button onClick={addInstruction} className="bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
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
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                  onClick={savePrescription}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Prescription
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Prescription Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 sm:p-6">
          <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
            <DialogTitle className="text-indigo-700 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prescription Preview
            </DialogTitle>
            <DialogDescription>Review the prescription before saving</DialogDescription>
          </DialogHeader>

          <div className="py-4 px-4 sm:px-0">
            <div className="border rounded-lg p-4 sm:p-6 bg-white" ref={prescriptionPreviewRef}>
              {/* Doctor Info */}
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

              {/* Patient Info */}
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

              {/* Observations */}
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

              {/* Medicines - Using standard HTML table for better PDF rendering */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-indigo-700 mb-2">Medicines</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ backgroundColor: "#f8fafc" }}>
                      <tr>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", width: "5%" }}>
                          No.
                        </th>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", width: "40%" }}>
                          Medicine
                        </th>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>Morning</th>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>Afternoon</th>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>Evening</th>
                        <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.prescriptionData.Medicines.map(
                        (medicine) =>
                          medicine.medicine && (
                            <tr key={medicine.row}>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px" }}>{medicine.row}</td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px", fontWeight: "500" }}>
                                {medicine.medicine}
                              </td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>
                                {medicine.breakfast === 1 ? "✓" : "-"}
                              </td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>
                                {medicine.lunch === 1 ? "✓" : "-"}
                              </td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center" }}>
                                {medicine.dinner === 1 ? "✓" : "-"}
                              </td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "8px" }}>
                                {medicine.duration || "As directed"}
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructions */}
              {prescription.prescriptionData.Instructions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-indigo-700 mb-2">Instructions</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {prescription.prescriptionData.Instructions.map(
                      (instruction, index) =>
                        instruction.trim() && (
                          <li key={index} className="text-slate-700">
                            {instruction}
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              )}

              {/* Signature */}
              <div className="mt-8 pt-4 border-t text-right">
                <p className="font-medium text-slate-800">{doctorInfo.name}</p>
                <p className="text-sm text-slate-600">{doctorInfo.specialty}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 mt-4 px-4 pb-4 sm:px-0 sm:pb-0">
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
              disabled={loading}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ChatArogya/>
    </div>
  )
}

