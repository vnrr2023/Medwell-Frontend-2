"use client"

import { useEffect, useState } from "react"
import { Users, Star, MessageSquare, Stethoscope, Bell, CalendarIcon, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import DaddyAPI from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define types for our API response
interface DashboardData {
  unique_users: string
  recurrent_users_count: string
  appointments_count: string
  patients_per_day: {
    date: string[]
    appointments: number[]
  }
  unique_patients_per_day: {
    date: string[]
    unique_patients: number[]
  }
  visited_count: string
  not_visited_count: string
  appointments_not_visited: string
  unique_users_not_visited: string
  todays_appointments_count: number
}

// Sample appointments data - in a real app, this would come from the API too
const sampleAppointments = [
  { time: "09:00", patientName: "John Doe", duration: 30 },
  { time: "10:30", patientName: "Jane Smith", duration: 45 },
  { time: "13:00", patientName: "Robert Johnson", duration: 60 },
]

const sampleNotifications = [
  { icon: Bell, message: "New appointment request", time: "5 min ago" },
  { icon: CalendarIcon, message: "Reminder: Team meeting at 2 PM", time: "1 hour ago" },
  { icon: FileText, message: "Lab results for patient #1234 are ready", time: "3 hours ago" },
]

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await DaddyAPI.getDoctorDashboard()
        setDashboardData(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Overview cards data based on API response
  const overviewData = dashboardData
    ? [
        {
          label: "Patients",
          value: Number.parseInt(dashboardData.unique_users),
          icon: Users,
          color: "text-blue-500",
        },
        {
          label: "Appointments",
          value: Number.parseInt(dashboardData.appointments_count),
          icon: MessageSquare,
          color: "text-green-500",
        },
        {
          label: "Visited",
          value: Number.parseInt(dashboardData.visited_count),
          icon: Star,
          color: "text-yellow-500",
        },
        {
          label: "Not Visited",
          value: Number.parseInt(dashboardData.not_visited_count),
          icon: Stethoscope,
          color: "text-red-500",
        },
      ]
    : []

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <div className="flex items-center w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Download Report</Button>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {overviewData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{item.label}</CardTitle>
              <item.icon className={cn("h-3 w-3 sm:h-4 sm:w-4", item.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{item.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {item.label === "Patients" &&
                  dashboardData?.recurrent_users_count &&
                  `${dashboardData.recurrent_users_count} returning patients`}
                {item.label === "Appointments" && `${dashboardData?.todays_appointments_count || 0} today`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Patient Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 sm:pl-2 p-2 sm:p-4">
            <PatientTrendChart
              dates={dashboardData?.patients_per_day.date || []}
              appointments={dashboardData?.patients_per_day.appointments || []}
              isMobile={isMobile}
            />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Upcoming Schedule</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              You have {dashboardData?.todays_appointments_count || 0} appointments today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ScrollArea className="h-[150px] sm:h-auto">
              <div className="space-y-2 sm:space-y-4">
                {sampleAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-[40px] sm:w-[60px] text-xs sm:text-sm">{appointment.time}</div>
                    <div className="flex-1 ml-2 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium">{appointment.patientName}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{appointment.duration} min</p>
                    </div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">
                          View
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64 sm:w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage src="/avatars/01.png" />
                            <AvatarFallback>{appointment.patientName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{appointment.patientName}</h4>
                            <p className="text-xs sm:text-sm">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Appointment Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="space-y-2 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Appointments</h3>
                  <p className="text-lg sm:text-2xl font-bold">{dashboardData?.appointments_count}</p>
                </div>
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Missed Appointments</h3>
                  <p className="text-lg sm:text-2xl font-bold">{dashboardData?.appointments_not_visited}</p>
                </div>
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Unique Patients</h3>
                  <p className="text-lg sm:text-2xl font-bold">{dashboardData?.unique_users}</p>
                </div>
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">No-show Patients</h3>
                  <p className="text-lg sm:text-2xl font-bold">{dashboardData?.unique_users_not_visited}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Calendar</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              classNames={{
                day_today: "bg-primary text-primary-foreground",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                day: "h-7 w-7 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100",
                caption: "text-xs sm:text-sm",
                caption_label: "text-xs sm:text-sm",
                nav_button: "h-6 w-6 sm:h-7 sm:w-7",
                table: "w-full border-collapse space-y-1",
                head_cell: "text-muted-foreground rounded-md w-7 sm:w-9 font-normal text-[0.6rem] sm:text-xs",
                cell: "text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                row: "flex w-full mt-1",
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="space-y-2 sm:space-y-4">
            {sampleNotifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-4">
                <notification.icon className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Patient Trend Chart Component
function PatientTrendChart({
  dates,
  appointments,
  isMobile,
}: { dates: string[]; appointments: number[]; isMobile: boolean }) {
  if (dates.length === 0 || appointments.length === 0) {
    return <div className="h-[150px] sm:h-[200px] flex items-center justify-center">No data available</div>
  }

  // Format dates for display
  const formattedDates = dates.map((date) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })

  return (
    <div className="h-[150px] sm:h-[200px]">
      <div className="flex h-full items-end space-x-1 sm:space-x-2 justify-center">
        {appointments.map((count, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="bg-blue-500 w-6 sm:w-12 rounded-t-md"
              style={{ height: `${(count / Math.max(...appointments)) * (isMobile ? 100 : 150)}px` }}
            ></div>
            <div className="text-[8px] sm:text-xs mt-1 sm:mt-2">{formattedDates[index]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
        <Skeleton className="h-8 sm:h-10 w-full sm:w-36" />
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-1 sm:pb-2">
              <Skeleton className="h-4 sm:h-5 w-16 sm:w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1 sm:mb-2" />
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="p-3 sm:p-4">
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[150px] sm:h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="p-3 sm:p-4">
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-1 sm:mb-2" />
            <Skeleton className="h-3 sm:h-4 w-40 sm:w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-3 sm:h-4 w-8 sm:w-12" />
                  <div className="flex-1 ml-2 sm:ml-4">
                    <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-1 sm:mb-2" />
                    <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                  </div>
                  <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

