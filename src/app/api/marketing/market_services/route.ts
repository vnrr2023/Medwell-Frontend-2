import { NextResponse, NextRequest } from 'next/server';

export async function POST(req:NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader!=="Bearer 1234") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data_mock = {
        mssg:"Email sent successfully"
    }

    return NextResponse.json(data_mock, { status: 200 });
}
