import { type NextRequest, NextResponse } from "next/server"

const mockHealthCheckData = {
  avg_data: {
    avg_hemoglobin: 12.149999999999999,
    avg_rbc_count: 4.47,
    avg_wbc_count: 8125.0,
    avg_platelet_count: 206000.0,
    avg_pcv: 37.025,
    avg_bilirubin: 0.57,
    avg_proteins: 6.18,
    avg_calcium: 8.19,
    avg_blood_urea: 21.0,
    avg_sr_cholestrol: 159.0,
  },
  data: {
    submitted_at: ["2024-11-03", "2024-11-03", "2024-11-03", "2024-11-03"],
    hemoglobin: ["12.6", "12.1", "13.1", "10.8"],
    rbc_count: ["4.46", "4.72", "4.72", "3.98"],
    wbc_count: ["5000", "9700", "12700", "5100"],
    platelet_count: ["152000", "219000", "294000", "159000"],
    pcv: ["37.1", "38", "41", "32"],
    bilirubin: [null, "0.57", null, null],
    proteins: [null, "6.18", null, null],
    calcium: [null, "8.19", null, null],
    blood_urea: [null, "21", null, null],
    sr_cholestrol: ["159", null, null, null],
  },
  status: true,
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if ( authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const processedData = mockHealthCheckData

    if (processedData.data.submitted_at.length < 2) {
      return NextResponse.json(null, { status: 204 })
    }

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Error processing health check:", error)
    return NextResponse.json({ error: "AI server down" }, { status: 503 })
  }
}

