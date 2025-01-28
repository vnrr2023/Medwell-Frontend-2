import { type NextRequest, NextResponse } from 'next/server'

type ChatResponse = {
  data: string
}

type ErrorResponse = {
  error: string
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")
    if (token !== "Bearer 1234") {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }

    const body = await req.json()
    const { question } = body

    if (!question) {
      return NextResponse.json({ error: 'Missing required parameter: question' }, { status: 400 })
    }

    const response = "Ae murkh apni chavi sudhar"

    return NextResponse.json({ data: response }, { status: 200 })

  } catch (error) {
    console.error('Error processing chat request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}