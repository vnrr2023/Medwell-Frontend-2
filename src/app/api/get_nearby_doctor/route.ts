import { type NextRequest, NextResponse } from "next/server"

const mockDoctors = [
  {
    data: {
      user_id: 75,
      name: "Harsh Mehta",
      role: "doctor",
      speciality: null,
      address: "Saifee Hospital, Girgaon ,Charni Road,Mumbai",
      phone_number: "",
      location: {
        lat: 18.95249,
        lon: 72.818234,
      },
    },
    id: "1",
  },
  {
    data: {
      user_id: 75,
      name: "Harsh Mehta",
      role: "doctor",
      speciality: null,
      address: "Reliance Hospital, Girgaon ,Charni Road,Mumbai",
      phone_number: "",
      location: {
        lat: 18.956782,
        lon: 72.81906,
      },
    },
    id: "3",
  },
  {
    data: {
      user_id: 75,
      name: "Harsh Mehta",
      role: "doctor",
      speciality: "Cardiologist",
      address: "Shreedhar Clinic ,Dadar west ,dadar,Mumbai",
      phone_number: "",
      location: {
        lat: 19.019535,
        lon: 72.833726,
      },
    },
    id: "4",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lat, lon, km, speciality } = body

    if (!lat || !lon || !km) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let filteredDoctors = mockDoctors
    if (speciality) {
      filteredDoctors = mockDoctors.filter((doctor) => doctor.data.speciality === speciality)
    }


    return NextResponse.json({ data: filteredDoctors }, { status: 200 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 400 })
  }
}

