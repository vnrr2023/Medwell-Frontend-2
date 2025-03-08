"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Shield,
  MapPin,
  Stethoscope,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import DaddyAPI from "@/services/api"

// Types
interface TimeSlot {
  id: string
  timing: string
  status: boolean
  date: string
}

interface TimeSlots {
  morning: TimeSlot[]
  evening: TimeSlot[]
}

interface DoctorInfo {
  id: string
  name: string
  specialty: string
  image?: string
  rating: number
  experience: string
}

interface ClinicLocation {
  id: number
  addressType: string
  address: string
  lat: number
  lon: number
  doctor: {
    id: string
  }
  timings: {
    end: string
    start: string
  }
}

interface ServiceType {
  id: string
  serviceName: string
  serviceAmount: string
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Sample doctor data
const doctorInfo: DoctorInfo = {
  id: "dr-smith-123",
  name: "Dr. Sarah Smith",
  specialty: "Cardiologist",
  image: "/placeholder.svg?height=200&width=200",
  rating: 4.8,
  experience: "15+ years",
}

export default function AppointmentContent() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [appointmentConfirmed, setAppointmentConfirmed] = useState<boolean>(false)
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({ morning: [], evening: [] })
  const [clinicLocations, setClinicLocations] = useState<ClinicLocation[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])

  // Properly import and use useSearchParams
  const searchParams = useSearchParams()
  const doctor_id = searchParams.get("doctor_id")

  const router = useRouter()

  useEffect(() => {
    const fetchDoctorAddresses = async () => {
      try {
        setLoading(true)
        const response = await DaddyAPI.getaddressess(doctor_id || "121")
        if (response.data) {
          setClinicLocations(response.data)
        }
      } catch (error) {
        console.error("Error fetching doctor addresses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorAddresses()
  }, [selectedDate, doctor_id])

  const fetchTimeSlotsAndServices = async () => {
    if (!selectedLocation) return

    try {
      setLoading(true)
      const formattedDate = selectedDate.toISOString().split("T")[0]

      const slotsResponse = await DaddyAPI.getSlots(formattedDate, selectedLocation)

      if (slotsResponse.data) {
        const morning: TimeSlot[] = []
        const evening: TimeSlot[] = []

        slotsResponse.data.forEach((slot: any) => {
          const timeObj = {
            id: slot.id,
            timing: slot.timing,
            status: slot.status.toLowerCase() === "available",
            date: slot.date,
          }

          const hour = Number.parseInt(slot.timing.split(":")[0])
          if (hour < 12) {
            morning.push(timeObj)
          } else {
            evening.push(timeObj)
          }
        })

        setTimeSlots({ morning, evening })
      }

      const servicesResponse = await DaddyAPI.getservices(doctor_id || "121")
      if (servicesResponse.data) {
        setServiceTypes(
          servicesResponse.data.map((service: any) => ({
            id: service.id,
            serviceName: service.serviceName,
            description: "Medical service",
            duration: "30 min",
            price: `₹${service.serviceAmount}`,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setTimeSlots({ morning: [], evening: [] })
    } finally {
      setLoading(false)
    }
  }

  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeek(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeek(newDate)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setLocationModalOpen(true)
  }

  const handleLocationSelect = (locationId: string) => {
    const location = clinicLocations.find((loc) => loc.id.toString() === locationId)
    setSelectedLocation(locationId)
    setLocationModalOpen(false)
    fetchTimeSlotsAndServices()
  }

  const handleConfirmAppointment = async () => {
    if (selectedSlot && selectedLocation && selectedService) {
      try {
        setLoading(true)
        const selectedTimeSlot = [...timeSlots.morning, ...timeSlots.evening].find(
          (slot) => slot.timing === selectedSlot,
        )

        if (!selectedTimeSlot) {
          console.error("Selected time slot not found")
          return
        }

        const appointmentData = {
          slot_id: selectedTimeSlot.id,
          service_id: selectedService,
        }

        const response = await DaddyAPI.createAppointment(appointmentData)

        if (response.data && response.data.mssg) {
          setAppointmentConfirmed(true)
        }
      } catch (error) {
        console.error("Error creating appointment:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getSelectedLocationDetails = (): ClinicLocation | undefined => {
    return clinicLocations.find((loc) => loc.id.toString() === selectedLocation)
  }

  const getSelectedServiceDetails = (): any => {
    return serviceTypes.find((service) => service.id === selectedService)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[url('/bg.svg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="text-white mb-4 hover:bg-white/20" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Schedule Appointment</h1>
          </div>
          <p className="text-indigo-100">Book your appointment with our healthcare professionals</p>
        </div>
      </div>

      {/* Location Selection Modal */}
      <Dialog open={locationModalOpen} onOpenChange={setLocationModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-indigo-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Clinic Location
            </DialogTitle>
            <DialogDescription>
              Choose a clinic location for your appointment on {formatDate(selectedDate)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 ">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <RadioGroup value={selectedLocation || ""} onValueChange={setSelectedLocation}>
                {clinicLocations.length > 0 ? (
                  clinicLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50"
                    >
                      <RadioGroupItem value={location.id.toString()} id={location.id.toString()} className="mt-1" />
                      <Label htmlFor={location.id.toString()} className="flex-1 cursor-pointer">
                        <div className="font-medium text-indigo-700">{location.addressType}</div>
                        <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {location.address}
                        </div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">No locations available</div>
                )}
              </RadioGroup>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => handleLocationSelect(selectedLocation || "")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appointmentConfirmed ? (
          <Card className="border-indigo-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <CardTitle className="text-indigo-700 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                Appointment Confirmed
              </CardTitle>
              <CardDescription>Your appointment has been successfully scheduled</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-indigo-100">
                    <AvatarImage src={doctorInfo.image} alt={doctorInfo.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                      {doctorInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{doctorInfo.name}</h3>
                    <p className="text-indigo-600">{doctorInfo.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {doctorInfo.experience}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        ★ {doctorInfo.rating}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">APPOINTMENT DATE</h4>
                    <p className="text-lg font-medium text-slate-800">{formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">APPOINTMENT TIME</h4>
                    <p className="text-lg font-medium text-slate-800">{selectedSlot}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">CLINIC LOCATION</h4>
                    <p className="text-lg font-medium text-slate-800">{getSelectedLocationDetails()?.addressType}</p>
                    <p className="text-sm text-slate-600">{getSelectedLocationDetails()?.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">SERVICE TYPE</h4>
                    <p className="text-lg font-medium text-slate-800">{getSelectedServiceDetails()?.name}</p>
                    <p className="text-sm text-slate-600">30 min • {getSelectedServiceDetails()?.price}</p>
                  </div>
                </div>

                <Alert className="bg-indigo-50 border-indigo-100">
                  <Shield className="h-4 w-4 text-indigo-600" />
                  <AlertTitle className="text-indigo-700">Appointment Instructions</AlertTitle>
                  <AlertDescription className="text-slate-600">
                    Please arrive 15 minutes before your appointment time. Bring your ID and insurance card.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 bg-slate-50 border-t">
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">Add to Calendar</Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Reschedule Appointment
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Doctor Info Card */}
            <div className="order-2 lg:order-1">
              <Card className="border-indigo-100 shadow-lg sticky top-24">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-indigo-700">Doctor Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-indigo-100">
                      <AvatarImage src={doctorInfo.image} alt={doctorInfo.name} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                        {doctorInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-slate-800">{doctorInfo.name}</h3>
                    <p className="text-indigo-600">{doctorInfo.specialty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {doctorInfo.experience}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        ★ {doctorInfo.rating}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">CONSULTATION FEE</h4>
                      <p className="text-lg font-medium text-slate-800">₹800</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">LANGUAGES</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-50">
                          English
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50">
                          Hindi
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">SERVICES</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-50">
                          Cardiology
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50">
                          ECG
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50">
                          Heart Surgery
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedLocation && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-2">SELECTED LOCATION</h4>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-700">{getSelectedLocationDetails()?.addressType}</p>
                          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {getSelectedLocationDetails()?.address}
                          </p>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-indigo-600 mt-2"
                            onClick={() => setLocationModalOpen(true)}
                          >
                            Change location
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Time Slots */}
            <div className="order-1 lg:order-2">
              <Card className="border-indigo-100 shadow-lg mb-8">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {currentWeek.toLocaleString("default", { month: "long", year: "numeric" })}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevWeek}
                        className="h-8 w-8 rounded-full border-slate-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous week</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextWeek}
                        className="h-8 w-8 rounded-full border-slate-200"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next week</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="h-8 flex items-center justify-center text-xs font-medium text-slate-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date) => {
                      const isSelected = date.toDateString() === selectedDate.toDateString()
                      const isToday = date.toDateString() === new Date().toDateString()
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

                      return (
                        <Button
                          key={date.toISOString()}
                          onClick={() => !isPast && handleDateSelect(date)}
                          disabled={isPast}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-16 w-full rounded-lg flex flex-col items-center justify-center p-1
                            ${isSelected ? "bg-indigo-600 text-white hover:bg-indigo-700" : "hover:bg-indigo-50 border-slate-200"}
                            ${isToday && !isSelected ? "border-indigo-300" : ""}
                            ${isPast ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span className="text-xs">{date.toLocaleString("default", { month: "short" })}</span>
                          <span className="font-semibold text-lg">{date.getDate()}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {selectedLocation && (
                <Card className="border-indigo-100 shadow-lg mb-8">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                    <CardTitle className="text-indigo-700 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Select Time Slot
                    </CardTitle>
                    <CardDescription>
                      {formatDate(selectedDate)} at {getSelectedLocationDetails()?.addressType}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : (
                      <Tabs defaultValue="morning" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                          <TabsTrigger
                            value="morning"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                          >
                            Morning
                          </TabsTrigger>
                          <TabsTrigger
                            value="evening"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                          >
                            Evening
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="morning" className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-orange-400" />
                            </span>
                            <span className="font-medium">Morning</span>
                            <span className="text-sm text-slate-500">9:00 AM to 12:00 PM</span>
                          </div>

                          <ScrollArea className="border border-slate-200 rounded-lg p-4 h-48">
                            {timeSlots.morning.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {timeSlots.morning.map((slot) => (
                                  <TooltipProvider key={slot.id}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant={selectedSlot === slot.timing ? "default" : "outline"}
                                          onClick={() => slot.status && setSelectedSlot(slot.timing)}
                                          disabled={!slot.status}
                                          className={`px-4 py-2 h-auto
                                            ${
                                              selectedSlot === slot.timing
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                                            }
                                            ${!slot.status ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                          {slot.timing}
                                        </Button>
                                      </TooltipTrigger>
                                      {!slot.status && (
                                        <TooltipContent>
                                          <p>This slot is already booked</p>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-slate-500">
                                No morning slots available
                              </div>
                            )}
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="evening" className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-blue-400" />
                            </span>
                            <span className="font-medium">Evening</span>
                            <span className="text-sm text-slate-500">5:00 PM to 8:00 PM</span>
                          </div>

                          <ScrollArea className="border border-slate-200 rounded-lg p-4 h-48">
                            {timeSlots.evening.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {timeSlots.evening.map((slot) => (
                                  <TooltipProvider key={slot.id}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant={selectedSlot === slot.timing ? "default" : "outline"}
                                          onClick={() => slot.status && setSelectedSlot(slot.timing)}
                                          disabled={!slot.status}
                                          className={`px-4 py-2 h-auto
                                            ${
                                              selectedSlot === slot.timing
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                                            }
                                            ${!slot.status ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                          {slot.timing}
                                        </Button>
                                      </TooltipTrigger>
                                      {!slot.status && (
                                        <TooltipContent>
                                          <p>This slot is already booked</p>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-slate-500">
                                No evening slots available
                              </div>
                            )}
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Service Types (Replacing Waiting List) */}
              <Card className="border-indigo-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Select Service Type
                  </CardTitle>
                  <CardDescription>Choose the type of medical service you need</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup value={selectedService || ""} onValueChange={setSelectedService}>
                    {serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50"
                      >
                        <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                        <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                          <div className="font-medium text-indigo-700">{service.serviceName}</div>
                          <div className="text-sm text-slate-600 mt-1">Medical service</div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              30 min
                            </Badge>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              ₹{service.serviceAmount}
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-end bg-slate-50 border-t p-6">
                  <Button
                    size="lg"
                    disabled={!selectedSlot || !selectedLocation || !selectedService}
                    onClick={handleConfirmAppointment}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Confirm Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

