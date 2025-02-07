import { NextResponse, NextRequest } from 'next/server';

export async function GET(req:NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader!=="Bearer 1234") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockPatients = [
        {
            "requested_at": "2024-11-05T00:56:46.972218+05:30",
            "user_info": {
                "id": 69,
                "email": "rohit@gmail.com"
            }
        },
        {
            "requested_at": "2024-11-05T00:40:57.816854+05:30",
            "user_info": {
                "id": 79,
                "email": "rohit@gmail.com"
            }
        },
        {
            "requested_at": "2024-11-05T00:20:03.314123+05:30",
            "user_info": {
                "id": 89,
                "email": "rohit@gmail.com"
            }
        }
    ];

    return NextResponse.json(mockPatients, { status: 200 });
}
