import { NextResponse } from "next/server"

// Mock data for the doctor dashboard
const mockDashboardData = {
  unique_users: "120",
  recurrent_users_count: "30",
  appointments_count: "250",
  patients_per_day: {
    date: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"],
    appointments: [20, 25, 30, 28, 35, 40, 38],
  },
  unique_patients_per_day: {
    date: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"],
    unique_patients: [15, 18, 22, 20, 25, 30, 28],
  },
  visited_count: "200",
  not_visited_count: "50",
  appointments_not_visited: "30",
  unique_users_not_visited: "20",
  todays_appointments_count: 5,
}


export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 500))


  return NextResponse.json(mockDashboardData)
}

