import { type NextRequest, NextResponse } from "next/server"

const mockExpensesData = {
  overall_expense: "12850",
  expenses: [
    {
      id: 4,
      expense_type: "doctor",
      amount: "10000",
      date: "2024-11-03",
    },
    {
      id: 5,
      expense_type: "tests",
      amount: "500",
      date: "2024-11-03",
    },
    {
      id: 6,
      expense_type: "tests",
      amount: "1500",
      date: "2024-11-03",
    },
    {
      id: 7,
      expense_type: "medicine",
      amount: "150",
      date: "2024-11-03",
    },
    {
      id: 8,
      expense_type: "reports",
      amount: "700",
      date: "2024-11-03",
    },
  ],
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const expensesData = mockExpensesData

    return NextResponse.json(expensesData)
  } catch (error) {
    console.error("Error fetching expenses data:", error)

    if (error instanceof Error && error.message.includes("server unavailable")) {
      return NextResponse.json({ error: "Server unavailable" }, { status: 503 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

