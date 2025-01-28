import { type NextRequest, NextResponse } from "next/server"

function generateUniqueKey(userId: string): string {
  const randomString = Math.random().toString(36).substring(2, 8)
  return `report_chatbot_${userId}_${randomString}`
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")
    if (token!="Bearer 1234") {
      return NextResponse.json({ mssg: "Unauthorized: Missing token" }, { status: 401 })
    }

    const userId = "user" + Math.floor(Math.random() * 1000)

    if (Math.random() < 0.1) {
      return NextResponse.json({ mssg: "Error creating agent" }, { status: 400 })
    }

    const agentKey = generateUniqueKey(userId)

    return NextResponse.json(
      {
        mssg: "Agent Created",
        key: agentKey,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in create_agent:", error)
    return NextResponse.json({ mssg: "Internal Server Error" }, { status: 500 })
  }
}

