import { type NextRequest, NextResponse } from "next/server"

const mockDashboardData = {
  overall_expense: "12850",
  avg_health_data: {
    avg_hemoglobin: 12.15,
    avg_rbc_count: 4.47,
    avg_wbc_count: 8125.0,
  },
  reports: [
    {
      id: "eea5e099-ad12-4b7a-b48f-4507a7080ed9",
      report_file: "user_reports/Tanaji_Yadav_FYJti40.pdf",
      doctor_name: "Tushar D.Rege",
      submitted_at: "2024-11-03",
      report_type: "blood_report",
      processed: true,
      report_date: "2022-09-06",
    },
    {
      id: "46821e22-bbbc-4870-b3e2-d5b91ba1efb4",
      report_file: "user_reports/Soni_Parveen__4RtAx3V.pdf",
      doctor_name: "Khan Mohammed Arif",
      submitted_at: "2024-11-03",
      report_type: "blood_report",
      processed: true,
      report_date: "2022-09-11",
    },
    {
      id: "4e3ce42c-bc2a-4f93-8694-b1b047e193af",
      report_file: "user_reports/MyPathTest-4.pdf",
      doctor_name: "Ayesha Ansari",
      submitted_at: "2024-11-03",
      report_type: "blood_report",
      processed: true,
      report_date: "2023-06-15",
    },
    {
      id: "2a9725a4-50f5-4f09-b95f-1b273a199eef",
      report_file: "user_reports/test2_4rfASht.pdf",
      doctor_name: "Raihan Ahmed Siddiqui",
      submitted_at: "2024-11-03",
      report_type: "blood_report",
      processed: true,
      report_date: "2024-08-03",
    },
    {
      id: "023029bf-a3e3-41b8-9878-f0a8c1435e17",
      report_file: "user_reports/test3.pdf",
      doctor_name: null,
      submitted_at: "2024-11-03",
      report_type: null,
      processed: false,
      report_date: "None",
    },
  ],
  graph_data: {
    submitted_at: ["2024-11-03", "2024-11-03", "2024-11-03", "2024-11-03"],
    hemoglobin: ["12.6", "12.1", "13.1", "10.8"],
    rbc_count: ["4.46", "4.72", "4.72", "3.98"],
    wbc_count: ["5000", "9700", "12700", "5100"],
  },
  appointment: {
    id: 1,
    doctor_name: "Dr Zahir Kazi",
    date: "6/9/69",
  },
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const dashboardData = mockDashboardData

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)

    if (error instanceof Error && error.message.includes("server unavailable")) {
      return NextResponse.json({ error: "Server unavailable" }, { status: 503 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

