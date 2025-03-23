import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Create a response with the submitted data and a generated ID
  const response = {
    id: "15f71c81-980f-4dc3-8b7c-2127ad984530",
    otherInfo: body.otherData,
    prescription: body.prescriptionData,
    appointment: {
      id: body.appointmentId,
      bookedAt: "2025-03-07T18:00:36.561285",
      status: null,
      appointmentSlot: {
        id: "be7fa371-64b9-46fe-942f-3a63273b0528",
        timing: "13:00",
        status: "BOOKED",
        date: "2025-02-08"
      },
      doctor: {
        id: "148",
        name: "Doctor "
      },
      patient: {
        id: "147",
        name: "Customer  "
      },
      doctorServices: {
        id: "53af0956-a1df-4460-97e4-14c791a65f71",
        serviceName: "regular checkup",
        serviceAmount: "500"
      }
    },
    createdAt: new Date().toISOString()
  }
  
  return NextResponse.json(response)
}
