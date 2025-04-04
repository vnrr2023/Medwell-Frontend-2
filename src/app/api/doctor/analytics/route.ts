import { NextResponse } from "next/server"
const mockDashboardData = {
    "amount_per_service": {
        "service_name": [
            "Follow Up",
            "regular checkup"
        ],
        "amount_generated": [
            300,
            1000
        ]
    },
    "total_amount_generated": 1300,
    "amount_per_month": {
        "month": [
            "2025-02",
            "2025-03"
        ],
        "amount_generated": [
            800,
            500
        ]
    },
    "most_used_services": {
        "service_name": [
            "Follow Up",
            "regular checkup"
        ],
        "appointment_count": [
            8,
            2
        ]
    },
    "revenue_per_address": {
        "address_id": [
            "Colaba",
            "Lal Baug",
            "JJ Hospital"
        ],
        "revenue": [
            500,
            500,
            300
        ]
    },
    "appointments_per_day": {
        "date": [
            "2025-02-08",
            "2025-03-17"
        ],
        "appointments_booked": [
            8,
            2
        ]
    },
    "appointments_per_month": {
        "month": [
            "2025-02",
            "2025-03"
        ],
        "appointments_booked": [
            8,
            2
        ]
    },
    "visited_per_day": {
        "date": [
            "2025-02-08",
            "2025-03-17"
        ],
        "visited_count": [
            2,
            1
        ]
    },
    "not_visited_per_day": {
        "date": [
            "2025-02-08",
            "2025-03-17"
        ],
        "not_visited_count": [
            3,
            1
        ]
    },
    "booked_per_day": {
        "date": [
            "2025-02-08",
            "2025-03-17"
        ],
        "booked_count": [
            8,
            2
        ]
    },
    "slots_cancelled_per_day": {
        "date": [],
        "cancelled_slots": []
    },
    "slots_cancelled_per_month": {
        "month": [],
        "cancelled_slots": []
    }
}

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 500))


  return NextResponse.json(mockDashboardData)
}

