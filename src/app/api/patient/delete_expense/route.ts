import { type NextRequest, NextResponse } from "next/server"

const expenses = [
  { id: "1", type: "medicine", amount: 150 },
  { id: "2", type: "doctor", amount: 500 },
  { id: "3", type: "tests", amount: 1000 },
]

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const body = await request.json()

    if (!body.expense_id) {
      return NextResponse.json({ error: "Missing expense_id" }, { status: 400 })
    }

    const expenseIndex = expenses.findIndex((expense) => expense.id === body.expense_id)

    if (expenseIndex === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 400 })
    }

    expenses.splice(expenseIndex, 1)


    return NextResponse.json({ mssg: "Expense Deleted Successfully..." }, { status: 200 })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

