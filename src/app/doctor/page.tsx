"use client"

import { useState } from "react"
import { Users, Star, MessageSquare, Stethoscope, Bell, CalendarIcon, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { SparkAreaChart } from "@/components/ui/spark-area-chart"

const dashboardData = {
  overview: [
    { label: "Patients", value: 78, icon: Users, color: "bg-blue-500" },
    { label: "Reviews", value: 12, icon: Star, color: "bg-yellow-500" },
    { label: "Appointments", value: 13, icon: MessageSquare, color: "bg-green-500" },
    { label: "Surgeries", value: 1, icon: Stethoscope, color: "bg-red-500" },
  ],
  schedule: [
    { time: "09:00", patientName: "Nishi Twopper", duration: 30 },
    { time: "10:30", patientName: "Nishi Sir", duration: 45 },
    { time: "13:00", patientName: "Nishi Police", duration: 60 },
  ],
  upcomingAppointments: [
    { patientName: "Rahil", reason: "Annual Checkup", date: "2024-10-05" },
    { patientName: "Adnan", reason: "Follow-up", date: "2024-10-06" },
    { patientName: "Bilal", reason: "Consultation", date: "2024-10-07" },
  ],
  notifications: [
    { icon: Bell, message: "New appointment request", time: "5 min ago" },
    { icon: CalendarIcon, message: "Reminder: Team meeting at 2 PM", time: "1 hour ago" },
    { icon: FileText, message: "Lab results for patient #1234 are ready", time: "3 hours ago" },
  ],
  patientTrend: [8, 15, 10, 25, 18, 30, 20],
}

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.overview.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className={cn("h-4 w-4 text-muted-foreground", item.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SparkAreaChart
              data={dashboardData.patientTrend}
              categories={["Patients"]}
              index="day"
              colors={["blue"]}
              className="h-[200px]"
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>You have {dashboardData.schedule.length} appointments today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.schedule.map((appointment, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-[60px] text-sm">{appointment.time}</div>
                  <div className="flex-1 ml-4">
                    <p className="text-sm font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.duration} min</p>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost">View</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src="/avatars/01.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{appointment.patientName}</h4>
                          <p className="text-sm">
                            Appointment at {appointment.time} for {appointment.duration} min
                          </p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">Consultation</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{appointment.patientName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                  </div>
                  <div className="ml-auto font-medium">{appointment.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-4">
                <notification.icon className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

