"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Users, ArrowLeft, CheckCircle2, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Import Chat component
// import Chat from "../Chatbots/Chat"

// Types
interface TimeSlot {
  time: string
  available: boolean
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

// Sample data
const timeSlots: TimeSlots = {
  morning: [
    { time: "9:00 AM", available: true },
    { time: "9:10 AM", available: true },
    { time: "9:20 AM", available: true },
    { time: "9:30 AM", available: true },
    { time: "9:40 AM", available: false },
    { time: "9:50 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:10 AM", available: true },
    { time: "10:20 AM", available: true },
    { time: "10:30 AM", available: true },
  ],
  evening: [
    { time: "5:00 PM", available: true },
    { time: "5:10 PM", available: false },
    { time: "5:20 PM", available: true },
    { time: "5:30 PM", available: true },
    { time: "5:40 PM", available: true },
    { time: "5:50 PM", available: true },
    { time: "6:00 PM", available: true },
    { time: "6:10 PM", available: false },
    { time: "6:20 PM", available: true },
  ],
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

export default function AppointmentPage() {
  const router = useRouter()
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [appointmentConfirmed, setAppointmentConfirmed] = useState<boolean>(false)

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
  }

  const handleConfirmAppointment = () => {
    if (selectedSlot) {
      setAppointmentConfirmed(true)
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

              <Card className="border-indigo-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Time Slot
                  </CardTitle>
                  <CardDescription>{formatDate(selectedDate)}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                        <div className="flex flex-wrap gap-2">
                          {timeSlots.morning.map((slot) => (
                            <TooltipProvider key={slot.time}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={selectedSlot === slot.time ? "default" : "outline"}
                                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                                    disabled={!slot.available}
                                    className={`px-4 py-2 h-auto
                                      ${
                                        selectedSlot === slot.time
                                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                          : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                                      }
                                      ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    {slot.time}
                                  </Button>
                                </TooltipTrigger>
                                {!slot.available && (
                                  <TooltipContent>
                                    <p>This slot is already booked</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
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
                        <div className="flex flex-wrap gap-2">
                          {timeSlots.evening.map((slot) => (
                            <TooltipProvider key={slot.time}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={selectedSlot === slot.time ? "default" : "outline"}
                                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                                    disabled={!slot.available}
                                    className={`px-4 py-2 h-auto
                                      ${
                                        selectedSlot === slot.time
                                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                          : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                                      }
                                      ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    {slot.time}
                                  </Button>
                                </TooltipTrigger>
                                {!slot.available && (
                                  <TooltipContent>
                                    <p>This slot is already booked</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                      </span>
                      <span className="font-medium">Waiting List</span>
                      <span className="text-sm text-slate-500">Join if preferred slots are unavailable</span>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-8 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-slate-500">No patients in waiting list</p>
                      <Button variant="outline" className="mt-4 border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Wait List
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-slate-50 border-t p-6">
                  <Button
                    size="lg"
                    disabled={!selectedSlot}
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

        {/* Chat component would go here */}
        {/* <div className="mt-8">
          <Chat />
        </div> */}
      </div>
    </div>
  )
}

