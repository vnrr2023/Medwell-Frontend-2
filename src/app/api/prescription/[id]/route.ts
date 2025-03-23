import { NextResponse } from "next/server"

// Sample prescription data
const samplePrescription = {
  id: "15f71c81-980f-4dc3-8b7c-2127ad984530",
  otherInfo: "Take good Sleep",
  prescription: {
    Medicines: [
      {
        row: "1",
        lunch: 1,
        dinner: 0,
        medicine: "Crocin",
        breakfast: 0
      }
    ],
    Observations: [
      "The patient is having headache.",
      "Not able to work properly"
    ],
    Instructions: [
      "Take medicine after food",
      "Drink plenty of water"
    ]
  },
  appointment: {
    id: "0c4dd8d5-2397-441b-9a9b-28f48ce07ab9",
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
  createdAt: "2025-03-16T19:19:27.884599"
}

export async function GET(
  request: Request
) 
{
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id") 
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return the sample prescription
  return NextResponse.json(samplePrescription)
}
