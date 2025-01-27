"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { PlusCircle, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import type { Appointment } from "./types"

const localizer = momentLocalizer(moment)

const initialAppointments: Appointment[] = [
  {
    id: 1,
    title: "Annual Checkup",
    start: new Date(2024, 9, 15, 10, 0),
    end: new Date(2024, 9, 15, 11, 0),
    doctor: "Nishikant",
    notes: "Bring medical history",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Dental Cleaning",
    start: new Date(2024, 9, 18, 14, 30),
    end: new Date(2024, 9, 18, 15, 30),
    doctor: "Vivek",
    notes: "Floss beforehand",
    color: "#10b981",
  },
  {
    id: 3,
    title: "Eye Exam",
    start: new Date(2024, 11, 22, 11, 0),
    end: new Date(2024, 11, 22, 12, 0),
    doctor: "Rehan",
    notes: "Bring current glasses",
    color: "#f59e0b",
  },
]

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: 0,
    title: "",
    start: new Date(),
    end: new Date(),
    doctor: "",
    notes: "",
    color: "#3b82f6",
  })
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1))
//   const [currentView, setCurrentView] = useState(Views.MONTH)

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

      setAppointments((prev) => [...prev, { ...newAppointment, id: Date.now() }])
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

  const handleDeleteAppointment = useCallback((id: number) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
    setSelectedAppointment(null)
  }, [])

  const eventStyleGetter = useCallback((event: Appointment) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: "4px",
        opacity: 0.8,
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto px-4 py-4 lg:py-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/3"
      >
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Appointment
          </motion.button>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appointment) => {
                const daysDiff = getDaysDifference(appointment.start)
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
                      <p className="text-xs lg:text-sm text-gray-600">Dr. {appointment.doctor}</p>
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
          <div className="flex justify-between items-center mb-4 lg:mb-8">
            <button onClick={() => handleNavigate("PREV")} className="p-1 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            <span className="text-lg lg:text-2xl font-medium">{moment(currentDate).format("MMMM YYYY")}</span>
            <button onClick={() => handleNavigate("NEXT")} className="p-1 rounded-full hover:bg-gray-200">
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400, fontSize: "0.8rem" }}
            defaultView={Views.MONTH}
            views={[Views.MONTH]}
            date={currentDate}
            onNavigate={setCurrentDate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            className="rounded-lg border border-gray-200 text-xs lg:text-sm"
            toolbar={false}
          />
        </div>
      </motion.div>
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
                      selected={newAppointment.start}
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
                      selected={newAppointment.end}
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
                  <strong>Start:</strong> {moment(selectedAppointment.start).format("MMMM D, YYYY h:mm A")}
                </p>
                <p>
                  <strong>End:</strong> {moment(selectedAppointment.end).format("MMMM D, YYYY h:mm A")}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedAppointment.notes || "No notes"}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

