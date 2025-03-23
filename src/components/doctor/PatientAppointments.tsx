"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import moment from "moment"
import { ChevronLeft, ChevronRight, User, Clock, CalendarDays, FileText, CalendarIcon } from "lucide-react"
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

interface AppointmentSlot {
  id: string
  timing: string
  status: string
  date: string
}

interface Patient {
  id: string
  name: string
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
  doctorServices: DoctorService
}

interface ApiResponse {
  appointments: ApiAppointment[]
  nextPage: number | null
  totalPages: number
  hasNext: boolean
  currentPage: number
}

interface CalendarDay {
  date: string
  appointments: {
    id: string
    timing: string
    patientName: string
    serviceName: string
  }[]
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
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
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

  const fetchUpcomingAppointments = async () => {
    setLoading((prev) => ({ ...prev, upcoming: true }))

    try {
      const formattedDate = currentDate.format("YYYY-MM-DD")

      const response = await DaddyAPI.getDoctorUpcomingAppointments(formattedDate)
      const data = response.data

      const convertedAppointments = data?.appointments?.map(convertApiAppointment)
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
      const data = response.data as CalendarDay[]

      setCalendarData(data)
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


  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <Card
      className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4"
      style={{ borderLeftColor: appointment.color }}
    >
      <CardContent className="p-4">
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
              <h3 className="font-semibold text-lg text-primary">{appointment.title}</h3>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2 text-primary/60" />
                <span>{appointment.patient}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2 text-primary/60" />
                <span>{moment(appointment.start).format("h:mm A")}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-2 text-primary/60" />
                <span>{moment(appointment.start).format("MMM D, YYYY")}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mr-2 text-primary/60" />
                <span className="truncate">{appointment.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AppointmentSkeleton = () => (
    <div className="mb-4 border rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  )

  const getWeeklyAppointments = (): Appointment[] => {
    const weekStart = moment(currentDate).startOf("week")
    const weekEnd = moment(currentDate).endOf("week")

    const weekDays = calendarData.filter((day) => {
      const dayDate = moment(day.date)
      return dayDate.isSameOrAfter(weekStart, "day") && dayDate.isSameOrBefore(weekEnd, "day")
    })

    return weekDays.flatMap((day) =>
      day.appointments?.map((apt, index) => ({
        id: apt.id,
        title: apt.serviceName,
        start: `${day.date}T${apt.timing}`,
        end: moment(`${day.date}T${apt.timing}`).add(30, "minutes").format(),
        patient: apt.patientName,
        notes: apt.serviceName,
        color: serviceColors[apt.serviceName] || serviceColors.default,
      })),
    )
  }

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
                      {appointmentsInSlot?.map((app, appIndex) => (
                        <div
                          key={appIndex}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Previous Appointments
                  </CardTitle>
                  <CardDescription>
                    {loading.previous && previousAppointments?.length === 0
                      ? "Loading appointments..."
                      : `${previousAppointments.length} previous appointments`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {loading.previous && previousAppointments.length === 0 ? (
                      Array.from({ length: 3 })?.map((_, i) => <AppointmentSkeleton key={i} />)
                    ) : previousAppointments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">No previous appointments found</p>
                      </div>
                    ) : (
                      <>
                        {previousAppointments?.map((appointment) => (
                          <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                        {paginationInfo.hasNext && (
                          <div ref={prevAppointmentsRef} className="py-4 text-center">
                            {paginationInfo.loadingMore ? (
                              <div className="flex justify-center items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <span className="text-sm text-muted-foreground">Loading more...</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Scroll for more</span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-green-500" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>
                    {loading.upcoming
                      ? "Loading appointments..."
                      : `${upcomingAppointments?.length} upcoming appointments scheduled`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {loading.upcoming ? (
                      Array.from({ length: 3 })?.map((_, i) => <AppointmentSkeleton key={i} />)
                    ) : upcomingAppointments?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                      </div>
                    ) : (
                      upcomingAppointments?.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </ScrollArea>
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
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

