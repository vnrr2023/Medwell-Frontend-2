import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  // Mock upcoming appointments
  const appointments = Array.from({ length: 3 }, (_, i) => ({
    id: `upcoming-${i}`,
    bookedAt: new Date().toISOString(),
    status: null,
    appointmentSlot: {
      id: `slot-up-${i}`,
      timing: time || `${9 + i}:00`,
      status: "BOOKED",
      date: date,
    },
    patient: {
      id: `${150 + i}`,
      name: `Future Patient ${i + 1}`,
    },
    doctorServices: {
      id: `service-up-${i}`,
      serviceName: i % 2 === 0 ? "Checkup" : "Consultation",
      serviceAmount: `${250 + i * 50}`,
    },
  }))

  return NextResponse.json({ appointments })
}

