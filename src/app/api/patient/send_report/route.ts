import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const formData = await request.formData()
    const file = formData.get("report") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Only PDF files are accepted." }, { status: 400 })
    }

    const tenMB = 10 * 1024 * 1024
    if (file.size > tenMB) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 })
    }

    const taskId ="fd8d3c85-6519-4d6e-8d53-9de2afd4056d"

    return NextResponse.json({ task_id: taskId }, { status: 200 })
  } catch (error) {
    console.error("Error processing report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
