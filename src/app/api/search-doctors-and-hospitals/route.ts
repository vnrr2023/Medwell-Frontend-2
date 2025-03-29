import { type NextRequest, NextResponse } from "next/server"

const mockDoctorsAndHospitals = [
  {
    data: {
      user_id: 75,
      name: "Harsh Mehta",
      role: "doctor",
      speciality: "Cardiologist",
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
      speciality: "Cardiologist",
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
      user_id: 76,
      name: "Priya Sharma",
      role: "doctor",
      speciality: "Pediatrician",
      address: "Children's Hospital, Bandra, Mumbai",
      phone_number: "",
      location: {
        lat: 19.0596,
        lon: 72.8295,
      },
    },
    id: "4",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: "Missing required parameter: query" }, { status: 400 })
    }

    const searchTerms = query.toLowerCase().split(" ")
    const filteredResults = mockDoctorsAndHospitals.filter((item) => {
      const searchableText = `${item.data.name} ${item.data.speciality} ${item.data.address}`.toLowerCase()
      return searchTerms.every((term:any) => searchableText.includes(term))
    })

    return NextResponse.json({ data: filteredResults }, { status: 200 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 400 })
  }
}

