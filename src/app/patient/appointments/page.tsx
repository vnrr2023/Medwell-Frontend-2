"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X, ChevronLeft, ChevronRight, Trash2, History, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DaddyAPI from "@/services/api"
import ChatArogya from "@/components/chatbots/ChatArogya"
import { useRouter } from "next/navigation"

// Define interfaces for API responses
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

// Update the interface for ApiAppointment to include doctor
interface ApiAppointment {
  id: string
  bookedAt: string
  status: string | null
  appointmentSlot: AppointmentSlot
  patient: Patient
  doctorServices: DoctorService
  doctor?: {
    id: string
    name: string
    email: string
  }
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

// Interface for our component's appointment format
interface Appointment {
  id: string | number
  title: string
  start: Date | string
  end: Date | string
  doctor: string
  notes: string
  color: string
  serviceAmount?: string
  isPrevious?: boolean
}

const localizer = momentLocalizer(moment)

// Update the serviceColors to include "Regular Checkup"
const serviceColors: Record<string, string> = {
  "Follow Up": "#22c55e",
  "Regular Checkup": "#6366f1",
  Consultation: "#ef4444",
  Checkup: "#6366f1",
  Surgery: "#fb923c",
  default: "#eab308",
}

// Update the convertApiAppointment function to use the doctor's name from the API data
const convertApiAppointment = (apiAppointment: ApiAppointment, isPrevious = false): Appointment => {
  const { id, appointmentSlot, doctorServices, doctor } = apiAppointment
  const startTime = `${appointmentSlot.date}T${appointmentSlot.timing}`

  // Calculate end time (assuming 30 min appointments)
  const startMoment = moment(startTime)
  const endMoment = startMoment.clone().add(30, "minutes")

  return {
    id,
    title: doctorServices.serviceName,
    start: startMoment.toDate(),
    end: endMoment.toDate(),
    doctor: doctor?.name || "Dr. Smith", // Use doctor name from API data if available
    notes: `${doctorServices.serviceName} - $${doctorServices.serviceAmount}`,
    color: serviceColors[doctorServices.serviceName] || serviceColors.default,
    serviceAmount: doctorServices.serviceAmount,
    isPrevious,
  }
}

export default function PatientAppointments() {
  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [previousAppointments, setPreviousAppointments] = useState<Appointment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrevModalOpen, setIsPrevModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const router=useRouter();
  const [loading, setLoading] = useState({
    previous: false,
    upcoming: false,
    calendar: false,
  })
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    hasNext: false,
    loadingMore: false,
    scrollLock: false,
  })

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: 0,
    title: "",
    start: new Date(),
    end: new Date(),
    doctor: "",
    notes: "",
    color: "#3b82f6",
  })
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="patient"){
      alert("You cannot access logged in as doctor")
      router.push("/doctor")
      return
    }
  }, []);
  // Ref for infinite scroll
  const prevAppointmentsRef = useRef<HTMLDivElement>(null)

  // Fetch previous appointments
  const fetchPreviousAppointments = async (page = 0, append = false) => {
    if (paginationInfo.loadingMore || paginationInfo.scrollLock) return

    if (append) {
      setPaginationInfo((prev) => ({ ...prev, loadingMore: true }))
    } else {
      setLoading((prev) => ({ ...prev, previous: true }))
    }

    try {
      // Use mock API for development, replace with real API in production
      const response = await DaddyAPI.getPatientPrevAppointments(page)
      const data = response.data as ApiResponse

      const convertedAppointments = data.appointments.map((app) => convertApiAppointment(app, true))

      if (append) {
        setPreviousAppointments((prev) => [...prev, ...convertedAppointments])
      } else {
        setPreviousAppointments(convertedAppointments)
      }

      setPaginationInfo({
        currentPage: data.currentPage,
        hasNext: data.hasNext,
        loadingMore: false,
        scrollLock: false,
      })

      // Add previous appointments to calendar if it's the first page
      if (page === 0 && !append) {
        setAppointments((prev) => {
          // Filter out any existing previous appointments
          const upcomingOnly = prev.filter((app) => !app.isPrevious)
          return [...upcomingOnly, ...convertedAppointments]
        })
      }
    } catch (error) {
      console.error("Error fetching previous appointments:", error)
    } finally {
      setLoading((prev) => ({ ...prev, previous: false }))
      if (append) {
        setPaginationInfo((prev) => ({ ...prev, loadingMore: false }))
      }
    }
  }

  // Update the fetchUpcomingAppointments function to use the provided appointment data
  const fetchUpcomingAppointments = async () => {
    setLoading((prev) => ({ ...prev, upcoming: true }))

    try {
      // Format date as YYYY-MM-DD
      const formattedDate = moment(currentDate).format("YYYY-MM-DD")

      // For demo purposes, use the provided appointment data
      // In production, this would be replaced with the API call
      const mockAppointments = [
        {
          id: "f019c611-3a10-4e17-a118-dad21e54b7df",
          bookedAt: "2025-04-23T06:54:38.168282",
          status: "BOOKED",
          appointmentSlot: {
            id: "2244f5b6-6675-4184-8973-fc0b3e18e525",
            timing: "10:00",
            status: "BOOKED",
            date: "2025-04-28",
          },
          doctor: {
            id: "121",
            name: "Dr. Anand A Shroff",
            email: "anand@shroffeye.org",
          },
          patient: {
            id: "147",
            name: "Customer",
            email: "customer@gmail.com",
          },
          doctorServices: {
            id: "bf5aff6f-712b-429b-9a72-6b2453f672a8",
            serviceName: "Regular Checkup",
            serviceAmount: "750",
          },
        },
        {
          id: "4447995b-9b4b-45ea-864e-ad879988ec1e",
          bookedAt: "2025-04-23T09:34:21.47441",
          status: "BOOKED",
          appointmentSlot: {
            id: "6644d256-9dd7-4521-96e2-8a8ad017650e",
            timing: "12:30",
            status: "BOOKED",
            date: "2025-04-28",
          },
          doctor: {
            id: "121",
            name: "Dr. Anand A Shroff",
            email: "anand@shroffeye.org",
          },
          patient: {
            id: "147",
            name: "Customer",
            email: "customer@gmail.com",
          },
          doctorServices: {
            id: "027af629-3069-4d59-ae5a-fe72509b7bfb",
            serviceName: "Follow Up",
            serviceAmount: "300",
          },
        },
      ]

      // Filter appointments for the selected date
      const filteredAppointments = mockAppointments.filter((app) => app.appointmentSlot.date === formattedDate)

      // Use the API call for production
      // const response = await DaddyAPI.getPatientUpcomingAppointments(formattedDate)
      // const data = response.data

      // For demo, use our filtered mock data
      const convertedAppointments = filteredAppointments.map((app) => convertApiAppointment(app))

      // Update appointments, keeping previous ones
      setAppointments((prev) => {
        // Filter out any existing upcoming appointments
        const previousOnly = prev.filter((app) => app.isPrevious)
        return [...previousOnly, ...convertedAppointments]
      })
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error)
    } finally {
      setLoading((prev) => ({ ...prev, upcoming: false }))
    }
  }

  // Fetch calendar data
  const fetchCalendarData = async () => {
    setLoading((prev) => ({ ...prev, calendar: true }))

    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1 // Moment months are 0-indexed

      // Use mock API for development, replace with real API in production
      const response = await DaddyAPI.getPatCalendar(year, month)
      const data = response.data as CalendarDay[]

      // Process calendar data if needed
      // This could be used to add additional appointments to the calendar view
    } catch (error) {
      console.error("Error fetching calendar data:", error)
    } finally {
      setLoading((prev) => ({ ...prev, calendar: false }))
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPreviousAppointments()
    fetchUpcomingAppointments()
    fetchCalendarData()
  }, [])

  // Refetch when date changes
  useEffect(() => {
    fetchUpcomingAppointments()
    fetchCalendarData()
  }, [currentDate])

  // Infinite scroll for previous appointments with bounce effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          paginationInfo.hasNext &&
          !paginationInfo.loadingMore &&
          !paginationInfo.scrollLock
        ) {
          // Set scroll lock to prevent multiple triggers
          setPaginationInfo((prev) => ({ ...prev, scrollLock: true }))

          // Fetch next page after a small delay to create the bounce effect
          setTimeout(() => {
            fetchPreviousAppointments(paginationInfo.currentPage + 1, true)
          }, 300)
        }
      },
      { threshold: 0.5 },
    )

    const currentRef = prevAppointmentsRef.current
    if (currentRef && isPrevModalOpen) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [
    paginationInfo.currentPage,
    paginationInfo.hasNext,
    paginationInfo.loadingMore,
    paginationInfo.scrollLock,
    isPrevModalOpen,
  ])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAppointment((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleDateChange = useCallback((date: Date | null, name: string) => {
    if (date) {
      setNewAppointment((prev) => ({ ...prev, [name]: date }))
    }
  }, [])

  const handleAddAppointment = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newAppointment.title || !newAppointment.doctor) return

      const newAppointmentWithId = {
        ...newAppointment,
        id: `new-${Date.now()}`,
      }

      setAppointments((prev) => [...prev, newAppointmentWithId])
      setNewAppointment({
        id: 0,
        title: "",
        start: new Date(),
        end: new Date(),
        doctor: "",
        notes: "",
        color: "#3b82f6",
      })
      setIsModalOpen(false)
    },
    [newAppointment],
  )

  const handleSelectEvent = useCallback((event: Appointment) => {
    setSelectedAppointment(event)
  }, [])

  const handleNavigate = useCallback((action: "PREV" | "NEXT") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (action === "PREV") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (action === "NEXT") {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }, [])

  const handleDeleteAppointment = useCallback((id: string | number) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
    setSelectedAppointment(null)
  }, [])

  const eventStyleGetter = useCallback((event: Appointment) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: "4px",
        opacity: event.isPrevious ? 0.6 : 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }, [])

  const getDaysDifference = (date: Date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const openPreviousAppointmentsModal = () => {
    setIsPrevModalOpen(true)
    // Reset pagination if needed
    if (previousAppointments.length === 0) {
      fetchPreviousAppointments()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto px-4 py-4 lg:py-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/3"
      >
        {/* Update the Upcoming Appointments section to show the currently selected date */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">
            Upcoming Appointments
            <span className="text-sm font-normal text-gray-500 ml-2">{moment(currentDate).format("MMMM D, YYYY")}</span>
          </h2>

          {loading.upcoming ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : appointments.filter((app) => !app.isPrevious).length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No upcoming appointments for {moment(currentDate).format("MMMM D, YYYY")}
            </p>
          ) : (
            <ul className="space-y-4">
              {appointments
                .filter((appointment) => !appointment.isPrevious)
                .map((appointment) => {
                  const daysDiff = getDaysDifference(appointment.start as Date)
                  let statusText = ""
                  let statusColor = ""

                  if (daysDiff < 0) {
                    statusText = `Missed by ${Math.abs(daysDiff)} days`
                    statusColor = "text-red-600"
                  } else if (daysDiff === 0) {
                    statusText = "Today"
                    statusColor = "text-green-600"
                  } else {
                    statusText = `In ${daysDiff} days`
                    statusColor = "text-blue-600"
                  }

                  return (
                    <li
                      key={appointment.id}
                      className="bg-gray-50 p-3 lg:p-4 rounded-md flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-semibold text-sm lg:text-base">{appointment.title}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">{appointment.doctor}</p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          {moment(appointment.start).format("MMM D, YYYY h:mm A")}
                        </p>
                        <p className={`text-xs lg:text-sm ${statusColor} font-medium mt-1`}>{statusText}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-2/3"
      >
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <div className="flex items-center gap-2">
              <button onClick={() => handleNavigate("PREV")} className="p-1 rounded-full hover:bg-gray-200">
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
              <span className="text-lg lg:text-2xl font-medium">{moment(currentDate).format("MMMM YYYY")}</span>
              <button onClick={() => handleNavigate("NEXT")} className="p-1 rounded-full hover:bg-gray-200">
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={openPreviousAppointmentsModal}
              className="flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              <span>Previous Appointments</span>
            </Button>
          </div>

          {loading.calendar && appointments.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, fontSize: "0.8rem" }}
              defaultView={Views.MONTH}
              views={[Views.MONTH]}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              className="rounded-lg border border-gray-200 text-xs lg:text-sm"
              toolbar={false}
            />
          )}

          <div className="mt-4 flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 opacity-80"></div>
              <span className="text-xs text-gray-600">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 opacity-60"></div>
              <span className="text-xs text-gray-600">Previous</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add New Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-4 lg:p-6 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl lg:text-2xl font-semibold">Add New Appointment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddAppointment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newAppointment.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                    <input
                      type="text"
                      name="doctor"
                      value={newAppointment.doctor}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <DatePicker
                      selected={newAppointment.start as any}
                      onChange={(date) => handleDateChange(date, "start")}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <DatePicker
                      selected={newAppointment.end as any}
                      onChange={(date) => handleDateChange(date, "end")}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      name="notes"
                      value={newAppointment.notes}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="color"
                      name="color"
                      value={newAppointment.color}
                      onChange={handleInputChange}
                      className="mt-1 block w-full h-10 p-0 border-0 rounded-md shadow-sm"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View Appointment Details Modal */}
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-4 lg:p-6 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl lg:text-2xl font-semibold">{selectedAppointment.title}</h2>
                <button onClick={() => setSelectedAppointment(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Doctor:</strong> {selectedAppointment.doctor}
                </p>
                <p>
                  <strong>Date:</strong> {moment(selectedAppointment.start).format("MMMM D, YYYY")}
                </p>
                <p>
                  <strong>Time:</strong> {moment(selectedAppointment.start).format("h:mm A")} -{" "}
                  {moment(selectedAppointment.end).format("h:mm A")}
                </p>
                <p>
                  <strong>Service:</strong> {selectedAppointment.title}
                </p>
                {selectedAppointment.serviceAmount && (
                  <p>
                    <strong>Service Amount:</strong> ₹{selectedAppointment.serviceAmount}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={selectedAppointment.isPrevious ? "text-gray-600" : "text-green-600"}>
                    {selectedAppointment.isPrevious ? "Completed" : "Upcoming"}
                  </span>
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Selected date: {moment(currentDate).format("MMMM D, YYYY")}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                {!selectedAppointment.isPrevious && (
                  <button
                    onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Appointment
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Previous Appointments Modal */}
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
                    <Card key={appointment.id} className="border-l-4" style={{ borderLeftColor: appointment.color }}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`}
                              alt={appointment.doctor}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {appointment.doctor
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
                                <span>Dr. {appointment.doctor}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>{moment(appointment.start).format("MMM D, YYYY")}</span>
                              </div>
                              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                                <span className="truncate">{appointment.notes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
        <ChatArogya/>
      </AnimatePresence>
    </div>
  )
}
