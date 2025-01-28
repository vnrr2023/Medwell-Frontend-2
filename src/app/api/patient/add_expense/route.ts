import { type NextRequest, NextResponse } from "next/server"

async function processNaturalLanguage(query: string): Promise<{ expense_type: string; amount: number } | null> {
  const words = query.toLowerCase().split(" ")
  const amount = Number.parseFloat(words.find((word) => !isNaN(Number.parseFloat(word))) || "0")
  const expenseTypes = ["medicine", "doctor", "tests", "reports"]
  const expense_type = expenseTypes.find((type) => words.includes(type)) || "other"

  return { expense_type, amount }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const body = await request.json()

    if (!body.query_type) {
      return NextResponse.json({ error: "Missing query_type" }, { status: 400 })
    }

    let expense_type: string
    let amount: number

    if (body.query_type === "natural_language") {
      if (!body.query) {
        return NextResponse.json({ error: "Missing query for natural language processing" }, { status: 400 })
      }

      try {
        const result = await processNaturalLanguage(body.query)
        if (!result) {
          return NextResponse.json({ error: "Failed to process natural language query" }, { status: 400 })
        }
        ;({ expense_type, amount } = result)
      } catch (error) {
        console.error("Error processing natural language:", error)
        return NextResponse.json({ error: "AI server unavailable" }, { status: 503 })
      }
    } else if (body.query_type === "normal") {
      if (!body.expense_type || !body.amount) {
        return NextResponse.json({ error: "Missing expense_type or amount for normal query" }, { status: 400 })
      }
      expense_type = body.expense_type
      amount = Number.parseFloat(body.amount)
    } else {
      return NextResponse.json({ error: "Invalid query_type" }, { status: 400 })
    }

    const validExpenseTypes = ["medicine", "doctor", "tests", "reports", "other"]
    if (!validExpenseTypes.includes(expense_type)) {
      return NextResponse.json({ error: "Invalid expense_type" }, { status: 400 })
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }


    return NextResponse.json({ message: "Expense Added Successfully..." }, { status: 200 })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

