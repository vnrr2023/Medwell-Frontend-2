import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { year: string; month: string } }) {
  const { year, month } = params

  if (!year || !month) {
    return NextResponse.json({ error: "Year and month parameters are required" }, { status: 400 })
  }

  const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate()
  const calendarData = Array.from({ length: daysInMonth }, (_, i) => {
    // Only add appointments to some days
    const hasAppointments = Math.random() > 0.6
    const appointmentsCount = hasAppointments ? Math.floor(Math.random() * 3) + 1 : 0

    return {
      date: `${year}-${month.padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}`,
      appointments: Array.from({ length: appointmentsCount }, (_, j) => ({
        id: `cal-${i}-${j}`,
        timing: `${9 + j}:00`,
        patientName: `Calendar Patient ${j + 1}`,
        serviceName: j % 2 === 0 ? "Checkup" : "Consultation",
      })),
    }
  })

  return NextResponse.json(calendarData)
}

