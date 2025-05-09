"use client"

import type React from "react"
import Link from "next/link"

import { useState, useCallback, useEffect, useRef } from "react"
import moment from "moment"
import { ChevronLeft, ChevronRight, Clock, CalendarDays, FileText, CalendarIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import DaddyAPI from "@/services/api"

// Import the date picker components at the top of the file
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface AppointmentSlot {
  id: string
  timing: string
  status: string
  date: string
}

interface Doctor {
  id: string
  name: string
  email: string
}

interface Patient {
  id: string
  name: string
  email: string
}

interface DoctorService {
  id: string
  serviceName: string
  serviceAmount: string
}

interface ApiAppointment {
  id: string
  bookedAt: string
  status: string | null
  appointmentSlot: AppointmentSlot
  patient: Patient
  doctor: Doctor
  doctorServices: DoctorService
}

interface ApiResponse {
  appointments: ApiAppointment[]
  nextPage: number | null
  totalPages: number
  hasNext: boolean
  currentPage: number
}

// Updated to match the API response structure
interface CalendarDay {
  date?: string
  appointments?: ApiAppointment[]
}

interface Appointment {
  id: string
  title: string
  start: string
  end: string
  patient: string
  notes: string
  color: string
  serviceAmount?: string
}

const serviceColors: Record<string, string> = {
  "Follow Up": "#22c55e",
  Consultation: "#ef4444",
  Checkup: "#6366f1",
  "Regular Checkup": "#3b82f6", // Added color for Regular Checkup
  Surgery: "#fb923c",
  default: "#eab308",
}

const convertApiAppointment = (apiAppointment: ApiAppointment): Appointment => {
  const { id, appointmentSlot, patient, doctorServices } = apiAppointment
  const startTime = `${appointmentSlot.date}T${appointmentSlot.timing}`

  const startMoment = moment(startTime)
  const endMoment = startMoment.clone().add(30, "minutes")

  return {
    id,
    title: doctorServices.serviceName,
    start: startMoment.format(),
    end: endMoment.format(),
    patient: patient.name,
    notes: `${doctorServices.serviceName} - $${doctorServices.serviceAmount}`,
    color: serviceColors[doctorServices.serviceName] || serviceColors.default,
    serviceAmount: doctorServices.serviceAmount,
  }
}

export default function PatientAppointments() {
  const [previousAppointments, setPreviousAppointments] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [calendarData, setCalendarData] = useState<ApiAppointment[]>([])
  const [currentDate, setCurrentDate] = useState(moment())
  const [view, setView] = useState("list")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState({
    previous: true,
    upcoming: true,
    calendar: true,
  })
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    hasNext: false,
    loadingMore: false,
  })
  const [isPrevModalOpen, setIsPrevModalOpen] = useState(false)

  // Add this after the existing state declarations in the PatientAppointments component
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const prevAppointmentsRef = useRef<HTMLDivElement>(null)

  const fetchPreviousAppointments = async (page = 0, append = false) => {
    if (paginationInfo.loadingMore) return

    if (append) {
      setPaginationInfo((prev) => ({ ...prev, loadingMore: true }))
    } else {
      setLoading((prev) => ({ ...prev, previous: true }))
    }

    try {
      const response = await DaddyAPI.getDoctorPrevAppointments(page)
      const data = response.data as ApiResponse

      const convertedAppointments = data.appointments?.map(convertApiAppointment)

      if (append) {
        setPreviousAppointments((prev) => [...prev, ...convertedAppointments])
      } else {
        setPreviousAppointments(convertedAppointments)
      }

      setPaginationInfo({
        currentPage: data.currentPage,
        hasNext: data.hasNext,
        loadingMore: false,
      })
    } catch (error) {
      console.error("Error fetching previous appointments:", error)
    } finally {
      setLoading((prev) => ({ ...prev, previous: false }))
      if (append) {
        setPaginationInfo((prev) => ({ ...prev, loadingMore: false }))
      }
    }
  }

  // Update the fetchUpcomingAppointments function to use the selected date
  const fetchUpcomingAppointments = async () => {
    setLoading((prev) => ({ ...prev, upcoming: true }))

    try {
      // Use the selected date if available, otherwise use currentDate
      const dateToUse = selectedDate ? new Date(selectedDate) : currentDate.toDate()
      const formattedDate = moment(dateToUse).format("YYYY-MM-DD")

      const response = await DaddyAPI.getDoctorUpcomingAppointments(formattedDate)
      const data = response.data

      // Check if data is an array (direct appointments) or has an appointments property
      const appointmentsArray = Array.isArray(data) ? data : data?.appointments || []
      const convertedAppointments = appointmentsArray.map(convertApiAppointment)
      setUpcomingAppointments(convertedAppointments)
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error)
    } finally {
      setLoading((prev) => ({ ...prev, upcoming: false }))
    }
  }

  const fetchCalendarData = async () => {
    setLoading((prev) => ({ ...prev, calendar: true }))

    try {
      const year = currentDate.year()
      const month = currentDate.month() + 1

      const response = await DaddyAPI.getDocCalendar(year, month)
      // Check if data is an array or has a specific structure
      const calendarAppointments = Array.isArray(response.data) ? response.data : response.data?.appointments || []
      setCalendarData(calendarAppointments)
    } catch (error) {
      console.error("Error fetching calendar data:", error)
    } finally {
      setLoading((prev) => ({ ...prev, calendar: false }))
    }
  }

  useEffect(() => {
    fetchPreviousAppointments()
    fetchUpcomingAppointments()
    fetchCalendarData()
  }, [])

  useEffect(() => {
    fetchUpcomingAppointments()
    fetchCalendarData()
  }, [currentDate])

  // Add this effect to refetch appointments when the selected date changes
  useEffect(() => {
    fetchUpcomingAppointments()
  }, [selectedDate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginationInfo.hasNext && !paginationInfo.loadingMore) {
          fetchPreviousAppointments(paginationInfo.currentPage + 1, true)
        }
      },
      { threshold: 0.5 },
    )

    const currentRef = prevAppointmentsRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [paginationInfo.currentPage, paginationInfo.hasNext, paginationInfo.loadingMore])

  const handleSelectEvent = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment)
  }, [])

  const handleNavigate = useCallback((direction: "PREV" | "NEXT" | "TODAY") => {
    if (direction === "PREV") {
      setCurrentDate((prev) => prev.clone().subtract(1, "week"))
    } else if (direction === "NEXT") {
      setCurrentDate((prev) => prev.clone().add(1, "week"))
    } else {
      setCurrentDate(moment())
    }
  }, [])

  const formatDateRange = (date: moment.Moment) => {
    const startOfWeek = date.clone().startOf("week")
    const endOfWeek = date.clone().endOf("week")
    return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("MMM D, YYYY")}`
  }

  // Convert API appointments to the format expected by WeeklyCalendar
  const getWeeklyAppointments = (): Appointment[] => {
    if (!calendarData || !Array.isArray(calendarData)) return []

    const weekStart = moment(currentDate).startOf("week")
    const weekEnd = moment(currentDate).endOf("week")

    // Filter appointments that fall within the current week
    const weeklyAppointments = calendarData.filter((appointment) => {
      if (!appointment?.appointmentSlot?.date) return false
      const appointmentDate = moment(appointment.appointmentSlot.date)
      return appointmentDate.isSameOrAfter(weekStart, "day") && appointmentDate.isSameOrBefore(weekEnd, "day")
    })

    // Convert to the Appointment format
    return weeklyAppointments.map((appointment) => {
      const startTime = `${appointment.appointmentSlot.date}T${appointment.appointmentSlot.timing}`
      const startMoment = moment(startTime)
      const endMoment = startMoment.clone().add(30, "minutes")

      return {
        id: appointment.id,
        title: appointment.doctorServices.serviceName,
        start: startMoment.format(),
        end: endMoment.format(),
        patient: appointment.patient.name,
        notes: `${appointment.doctorServices.serviceName} - $${appointment.doctorServices.serviceAmount}`,
        color: serviceColors[appointment.doctorServices.serviceName] || serviceColors.default,
        serviceAmount: appointment.doctorServices.serviceAmount,
      }
    })
  }

  // Update the AppointmentCard component to make it more visually appealing
  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <Link href={`/doctor/prescription/${appointment.id}`} passHref>
      <Card
        className="hover:shadow-lg transition-all duration-200 border-l-4 cursor-pointer overflow-hidden group"
        style={{ borderLeftColor: appointment.color }}
      >
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2 h-2 md:h-auto" style={{ backgroundColor: appointment.color }}></div>
            <div className="p-4 flex-1">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.patient}`}
                    alt={appointment.patient}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {appointment.patient
                      .split(" ")
                      ?.map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                        {appointment.title}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground">{appointment.patient}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-2 shadow-sm"
                      style={{
                        backgroundColor: `${appointment.color}15`,
                        color: appointment.color,
                        border: `1px solid ${appointment.color}30`,
                      }}
                    >
                      {moment(appointment.start).format("h:mm A")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 text-primary/60" />
                      <span>
                        {moment(appointment.start).format("h:mm A - ") + moment(appointment.end).format("h:mm A")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4 mr-2 text-primary/60" />
                      <span>{moment(appointment.start).format("MMM D, YYYY")}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground md:col-span-2">
                      <FileText className="w-4 h-4 mr-2 text-primary/60" />
                      <span className="truncate">{appointment.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  // Update the AppointmentSkeleton to match the new design
  const AppointmentSkeleton = () => (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2 h-2 md:h-auto bg-muted"></div>
        <div className="p-4 flex-1">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full md:col-span-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const WeeklyCalendar: React.FC = () => {
    const weekStart = moment(currentDate).startOf("week")
    const weekDays = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days"))
    const timeSlots = Array.from({ length: 12 }, (_, i) =>
      moment()
        .startOf("day")
        .add(i + 8, "hours"),
    )
    const weeklyAppointments = getWeeklyAppointments()

    return (
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b bg-muted/30 sticky left-0 z-10"></th>
              {weekDays?.map((day, index) => (
                <th key={index} className="p-3 border-b bg-muted/30 min-w-[110px] text-sm font-medium">
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground">{day.format("ddd")}</span>
                    <span className="text-lg font-semibold">{day.format("D")}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots?.map((time, timeIndex) => (
              <tr key={timeIndex} className="group">
                <td className="p-2 border-r text-center text-sm font-medium sticky left-0 bg-muted/30 z-10 text-muted-foreground">
                  {time.format("h:mm A")}
                </td>
                {weekDays?.map((day, dayIndex) => {
                  const cellDateTime = moment(day).set({
                    hour: time.get("hour"),
                    minute: time.get("minute"),
                  })
                  const appointmentsInSlot = weeklyAppointments?.filter((app) =>
                    moment(app?.start).isSame(cellDateTime, "hour"),
                  )
                  return (
                    <td
                      key={dayIndex}
                      className="p-2 border-r border-b relative h-16 group-hover:bg-muted/5 transition-colors duration-200"
                    >
                      {appointmentsInSlot?.map((app) => (
                        <div
                          key={app.id}
                          className="absolute inset-1 flex items-center justify-center text-xs cursor-pointer rounded-md shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
                          style={{
                            backgroundColor: `${app?.color}15`,
                            color: app?.color,
                            border: `1px solid ${app?.color}30`,
                          }}
                          onClick={() => handleSelectEvent(app)}
                        >
                          <span className="font-medium">{app?.title}</span>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Patient Appointments</h1>
          <p className="text-muted-foreground">Manage and view your scheduled appointments</p>
        </div>

        <Tabs value={view} onValueChange={(value) => setView(value as "list" | "calendar")} className="w-full mb-6">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("TODAY")}>
              Today
            </Button>
          </div>

          <TabsContent value="list" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="w-full max-w-[700px] flex justify-end mb-4">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsPrevModalOpen(true)}>
                  <Clock className="w-4 h-4 text-blue-500" />
                  Previous Appointments
                </Button>
              </div>
              <Card className="border-t-4 border-t-green-500 overflow-hidden max-w-[700px]">
                {/* Update the CardHeader in the upcoming appointments section to include the date picker */}
                {/* Replace the existing CardHeader with this: */}
                <CardHeader className="bg-green-50 dark:bg-green-900/10 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-green-500" />
                      Upcoming Appointments
                    </CardTitle>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 h-8 px-2 border-dashed">
                          <CalendarIcon className="h-4 w-4" />
                          {selectedDate ? (
                            <span className="text-xs font-normal">{format(selectedDate, "PPP")}</span>
                          ) : (
                            <span className="text-xs font-normal">Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date)
                            setIsCalendarOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <CardDescription>
                    {loading.upcoming
                      ? "Loading appointments..."
                      : `${upcomingAppointments?.length} upcoming appointments ${selectedDate ? `for ${format(selectedDate, "MMMM d, yyyy")}` : "scheduled"}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loading.upcoming ? (
                    <div className="px-4 pt-4">
                      {Array.from({ length: 3 })?.map((_, i) => (
                        <AppointmentSkeleton key={i} />
                      ))}
                    </div>
                  ) : upcomingAppointments?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                      <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Your upcoming appointments will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {upcomingAppointments?.map((appointment, index) => (
                        <div key={appointment.id} className={`px-4 py-3 ${index % 2 === 0 ? "bg-muted/5" : ""}`}>
                          <AppointmentCard appointment={appointment} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card className="md:max-w-4xl max-w-xs mx-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="icon" onClick={() => handleNavigate("PREV")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-lg font-semibold">{formatDateRange(currentDate)}</CardTitle>
                  <Button variant="outline" size="icon" onClick={() => handleNavigate("NEXT")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.calendar ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="space-y-4 w-full">
                      <Skeleton className="h-8 w-full" />
                      {Array.from({ length: 5 })?.map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] w-full" type="always">
                    <div className="min-w-[800px]">
                      <WeeklyCalendar />
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary">{selectedAppointment?.title}</DialogTitle>
              <DialogDescription>Appointment details and information</DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedAppointment.patient}`}
                      alt={selectedAppointment.patient}
                    />
                    <AvatarFallback>
                      {selectedAppointment.patient
                        .split(" ")
                        ?.map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedAppointment.patient}</h4>
                    <p className="text-sm text-muted-foreground">Patient</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-sm font-medium">Start Time</p>
                      <p className="text-sm text-muted-foreground">
                        {moment(selectedAppointment.start).format("MMMM D, YYYY h:mm A")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-sm font-medium">End Time</p>
                      <p className="text-sm text-muted-foreground">
                        {moment(selectedAppointment.end).format("MMMM D, YYYY h:mm A")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <FileText className="w-5 h-5 text-primary/60 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.notes || "No notes available"}
                      </p>
                      <Link href={`/doctor/prescription/${selectedAppointment.id}`} passHref>
                        <Button variant="outline" className="mt-2 p-2">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={isPrevModalOpen} onOpenChange={setIsPrevModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden bg-white">
            <DialogHeader>
              <DialogTitle>Previous Appointments</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              {loading.previous && previousAppointments.length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : previousAppointments.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No previous appointments found</div>
              ) : (
                <div className="space-y-4">
                  {previousAppointments.map((appointment) => (
                    <Link key={appointment.id} href={`/doctor/prescription/${appointment.id}`} passHref>
                      <Card
                        className="border-l-4 hover:shadow-md transition-all duration-200 overflow-hidden group"
                        style={{ borderLeftColor: appointment.color }}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div
                              className="w-full md:w-2 h-2 md:h-auto"
                              style={{ backgroundColor: appointment.color }}
                            ></div>
                            <div className="p-4 flex-1">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.patient}`}
                                    alt={appointment.patient}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {appointment.patient
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                                        {appointment.title}
                                      </h3>
                                      <p className="text-sm font-medium text-muted-foreground">{appointment.patient}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <Badge
                                        variant="secondary"
                                        className="shadow-sm"
                                        style={{
                                          backgroundColor: `${appointment.color}15`,
                                          color: appointment.color,
                                          border: `1px solid ${appointment.color}30`,
                                        }}
                                      >
                                        {moment(appointment.start).format("h:mm A")}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {moment(appointment.start).format("MMM D, YYYY")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <FileText className="w-4 h-4 mr-2 text-primary/60 flex-shrink-0" />
                                    <span className="truncate">{appointment.notes}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}

                  {/* Pagination loading indicator with bounce effect */}
                  {paginationInfo.hasNext && (
                    <div
                      ref={prevAppointmentsRef}
                      className={`py-4 text-center transition-all duration-300 ${
                        paginationInfo.loadingMore ? "translate-y-2" : "translate-y-0"
                      }`}
                    >
                      {paginationInfo.loadingMore ? (
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="text-sm text-muted-foreground">Loading more...</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Scroll for more</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
