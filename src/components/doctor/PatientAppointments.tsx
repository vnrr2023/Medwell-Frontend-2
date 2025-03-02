"use client"

import type React from "react"
import { useState, useCallback } from "react"
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

interface Appointment {
  id: string
  title: string
  start: string
  end: string
  patient: string
  notes: string
  color: string
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "Checkup",
    start: "2025-03-02T22:00",
    end: "2025-03-02T22:30",
    patient: "John Doe",
    notes: "General checkup",
    color: "#22c55e",
  },
  {
    id: "2",
    title: "Consultation",
    start: "2025-03-15T14:00",
    end: "2025-03-15T14:30",
    patient: "Jane Smith",
    notes: "Discuss treatment plan",
    color: "#ef4444",
  },
  {
    id: "3",
    title: "Follow-up",
    start: "2025-03-16T09:00",
    end: "2025-03-16T09:30",
    patient: "Peter Jones",
    notes: "Review test results",
    color: "#eab308",
  },
  {
    id: "4",
    title: "Surgery",
    start: "2025-03-18T11:00",
    end: "2025-03-18T13:00",
    patient: "Mary Brown",
    notes: "Minor surgery",
    color: "#6366f1",
  },
  {
    id: "5",
    title: "Consultation",
    start: "2025-03-20T15:00",
    end: "2025-03-20T15:30",
    patient: "David Lee",
    notes: "Discuss medication",
    color: "#fb923c",
  },
]

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [currentDate, setCurrentDate] = useState(moment())
  const [view, setView] = useState("list")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const todayAppointments = appointments.filter((appointment) => moment(appointment.start).isSame(currentDate, "day"))
  const futureAppointments = appointments.filter((appointment) => moment(appointment.start).isAfter(currentDate, "day"))

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
                .map((n) => n[0])
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

  const WeeklyCalendar: React.FC = () => {
    const weekStart = moment(currentDate).startOf("week")
    const weekDays = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days"))
    const timeSlots = Array.from({ length: 24 }, (_, i) => moment().startOf("day").add(i, "hours"))

    return (
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b bg-muted/30 sticky left-0 z-10"></th>
              {weekDays.map((day, index) => (
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
            {timeSlots.map((time, timeIndex) => (
              <tr key={timeIndex} className="group">
                <td className="p-2 border-r text-center text-sm font-medium sticky left-0 bg-muted/30 z-10 text-muted-foreground">
                  {time.format("h:mm A")}
                </td>
                {weekDays.map((day, dayIndex) => {
                  const cellDateTime = moment(day).set({
                    hour: time.get("hour"),
                    minute: time.get("minute"),
                  })
                  const appointmentsInSlot = appointments.filter((app) =>
                    moment(app.start).isSame(cellDateTime, "hour"),
                  )
                  return (
                    <td
                      key={dayIndex}
                      className="p-2 border-r border-b relative h-16 group-hover:bg-muted/5 transition-colors duration-200"
                    >
                      {appointmentsInSlot.map((app, appIndex) => (
                        <div
                          key={appIndex}
                          className="absolute inset-1 flex items-center justify-center text-xs cursor-pointer rounded-md shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
                          style={{
                            backgroundColor: `${app.color}15`,
                            color: app.color,
                            border: `1px solid ${app.color}30`,
                          }}
                          onClick={() => handleSelectEvent(app)}
                        >
                          <span className="font-medium">{app.title}</span>
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
                    Today&apos;s Appointments
                  </CardTitle>
                  <CardDescription>{todayAppointments.length} appointments scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {todayAppointments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">No appointments scheduled for today</p>
                      </div>
                    ) : (
                      todayAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
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
                  <CardDescription>{futureAppointments.length} upcoming appointments scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {futureAppointments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                      </div>
                    ) : (
                      futureAppointments.map((appointment) => (
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
                <ScrollArea className="h-[600px] w-full" type="always">
                  <div className="min-w-[800px]">
                    <WeeklyCalendar />
                  </div>
                </ScrollArea>
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
                        .map((n) => n[0])
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

