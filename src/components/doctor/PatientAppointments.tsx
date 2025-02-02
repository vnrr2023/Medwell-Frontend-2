"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import moment from "moment"
import { ChevronLeft, ChevronRight, User, Clock, CalendarDays, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Appointment {
  id: number
  title: string
  start: Date
  end: Date
  patient: string
  notes: string
  color: string
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    title: "Annual Checkup",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    patient: "Rehan Sayyed",
    notes: "Review medical history",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Follow-up Consultation",
    start: new Date(new Date().setHours(new Date().getHours() + 24)),
    end: new Date(new Date().setHours(new Date().getHours() + 25)),
    patient: "Rehan Shaikh",
    notes: "Discuss test results",
    color: "#10b981",
  },
  {
    id: 3,
    title: "New Patient Consultation",
    start: new Date(new Date().setHours(new Date().getHours() + 48)),
    end: new Date(new Date().setHours(new Date().getHours() + 49)),
    patient: "Rehan Khan",
    notes: "Initial assessment",
    color: "#f59e0b",
  },
]

export default function PatientAppointments() {
  const [appointments] = useState<Appointment[]>(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<"list" | "calendar">("list")

  useEffect(() => {
    updateDisplayedAppointments()
  }, [])

  const updateDisplayedAppointments = () => {
    const today = moment().startOf("day")
    const todayApps = appointments.filter((app) => moment(app.start).isSame(today, "day"))
    const futureApps = appointments
      .filter((app) => moment(app.start).isAfter(today))
      .sort((a, b) => moment(a.start).diff(moment(b.start)))

    setTodayAppointments(todayApps)
    setFutureAppointments(futureApps)
  }

  const handleSelectEvent = useCallback((event: Appointment) => {
    setSelectedAppointment(event)
  }, [])

  const handleNavigate = useCallback((action: "PREV" | "NEXT" | "TODAY") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (action === "PREV") {
        newDate.setDate(newDate.getDate() - 7)
      } else if (action === "NEXT") {
        newDate.setDate(newDate.getDate() + 7)
      } else if (action === "TODAY") {
        return new Date()
      }
      return newDate
    })
  }, [])

  const formatDateRange = (date: Date) => {
    const start = moment(date).startOf("week")
    const end = moment(date).endOf("week")
    return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`
  }

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.patient}`}
              alt={appointment.patient}
            />
            <AvatarFallback>
              {appointment.patient
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{appointment.title}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <User className="w-4 h-4 mr-2" />
                <span>{appointment.patient}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span>{moment(appointment.start).format("h:mm A")}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span>{moment(appointment.start).format("MMM D, YYYY")}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <FileText className="w-4 h-4 mr-2" />
                <span className="truncate">{appointment.notes}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="ml-2" style={{ backgroundColor: appointment.color, color: "#fff" }}>
            {moment(appointment.start).format("h:mm A")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const WeeklyCalendar: React.FC = () => {
    const weekStart = moment(currentDate).startOf("week")
    const weekDays = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days"))
    const timeSlots = Array.from({ length: 24 }, (_, i) => moment().startOf("day").add(i, "hours"))

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-muted sticky left-0 z-10"></th>
              {weekDays.map((day, index) => (
                <th key={index} className="p-2 border bg-muted min-w-[100px] lg:min-w-[150px]">
                  {day.format("ddd, MMM D")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => (
              <tr key={timeIndex}>
                <td className="p-2 border text-center font-semibold sticky left-0 bg-muted z-10">
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
                      className="p-2 border relative min-h-[50px] hover:bg-muted/50 transition-colors duration-200"
                    >
                      {appointmentsInSlot.map((app, appIndex) => (
                        <div
                          key={appIndex}
                          className="absolute inset-0 flex items-center justify-center text-xs cursor-pointer text-white rounded-md"
                          style={{ backgroundColor: app.color }}
                          onClick={() => handleSelectEvent(app)}
                        >
                          {app.title}
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Patient Appointments</h1>

      <Tabs value={view} onValueChange={(value) => setView(value as "list" | "calendar")} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground">No appointments scheduled for today</p>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {futureAppointments.length === 0 ? (
                    <p className="text-muted-foreground">No upcoming appointments scheduled</p>
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
        <Card className="md:max-w-[900px] mx-auto overflow-x-auto max-w-[300px]">
  <CardHeader>
    <div className="flex justify-between items-center relative"> 
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => handleNavigate("PREV")} 
        className="absolute left-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <CardTitle className="mx-auto">{formatDateRange(currentDate)}</CardTitle>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => handleNavigate("NEXT")} 
        className="absolute right-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    <ScrollArea className="h-[600px] w-[1200px]">
      <WeeklyCalendar />
    </ScrollArea>
  </CardContent>
</Card>

        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAppointment?.title}</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Patient:</span>
                <span>{selectedAppointment.patient}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Start:</span>
                <span>{moment(selectedAppointment.start).format("MMMM D, YYYY h:mm A")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">End:</span>
                <span>{moment(selectedAppointment.end).format("MMMM D, YYYY h:mm A")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Notes:</span>
                <span>{selectedAppointment.notes || "No notes"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

