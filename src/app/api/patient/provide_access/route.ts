import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")
    if (token!=="Bearer 1234") {
      return NextResponse.json({ mssg: "Unauthorized: Missing token" }, { status: 401 })
    }

    const body = await req.json()
    const { enc_data } = body

    if (!enc_data) {
      return NextResponse.json({ mssg: "Bad Request: Missing encrypted data" }, { status: 400 })
    }

    const success = Math.random() < 0.8 

    if (success) {
      return NextResponse.json({ mssg: "Request Granted to Harsh Mehta Successfully..." }, { status: 200 })
    } else {
      return NextResponse.json({ mssg: "Issue Granting Request..Please try again..." }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in provide_access:", error)
    return NextResponse.json({ mssg: "Internal Server Error" }, { status: 500 })
  }
}

