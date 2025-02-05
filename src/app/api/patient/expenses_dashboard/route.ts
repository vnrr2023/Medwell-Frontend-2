import { type NextRequest, NextResponse } from "next/server"

const mockExpensesDashboard = {
  expenses_per_type: {
    expense_type: ["doctor", "medicine", "reports", "tests"],
    total: [10000.0, 150.0, 700.0, 2000.0],
  },
  expense_trend: {
    expenses: [10000.0, 500.0, 1500.0, 150.0, 700.0],
  },
  expenses_per_month: {
    month_name: ["November "],
    expenses: [12850.0],
  },
  expenses_per_year: {
    year: [2024.0],
    expenses: [12850.0],
  },
  expenses_per_month_per_type: [
    {
      month: 11.0,
      data: {
        expense_type: ["doctor", "medicine", "reports", "tests"],
        expenses: [10000.0, 150.0, 700.0, 2000.0],
      },
    },
  ],
  expenses_per_year_per_type: [
    {
      month: 2024.0,
      data: {
        expense_type: ["doctor", "medicine", "reports", "tests"],
        expenses: [10000.0, 150.0, 700.0, 2000.0],
      },
    },
  ],
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const expensesDashboard = mockExpensesDashboard

    return NextResponse.json(expensesDashboard)
  } catch (error) {
    console.error("Error processing expenses dashboard:", error)

    if (error instanceof Error && error.message.includes("AI service unavailable")) {
      return NextResponse.json({ error: "AI server unavailable" }, { status: 503 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

