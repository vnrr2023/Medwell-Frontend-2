import { NextResponse, NextRequest } from 'next/server';

export async function POST(req:NextRequest) {

    const mock_data = {
        body: "Hello, this is a sample email body"
    }

    return NextResponse.json(mock_data, { status: 200 });
}
