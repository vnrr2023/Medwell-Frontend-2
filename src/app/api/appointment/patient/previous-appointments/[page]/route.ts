import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "0")

  // Mock previous appointments
  const appointments = Array.from({ length: 5 }, (_, i) => ({
    id: `prev-${i}-${page}`,
    bookedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    status: null,
    appointmentSlot: {
      id: `slot-${i}`,
      timing: `${12 + i}:00`,
      status: "BOOKED",
      date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    patient: {
      id: `${140 + i}`,
      name: `Patient ${i + 1}`,
    },
    doctorServices: {
      id: `service-${i}`,
      serviceName: i % 2 === 0 ? "Follow Up" : "Consultation",
      serviceAmount: `${300 + i * 50}`,
    },
  }))

  return NextResponse.json({
    appointments,
    nextPage: page < 3 ? page + 1 : null,
    totalPages: 4,
    hasNext: page < 3,
    currentPage: page,
  })
}

