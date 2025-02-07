import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")
    if (token !== "Bearer 1234") {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
  const body = await request.json();
  console.log('Doctor info updated:', body);
  return NextResponse.json({ success: true, message: 'Doctor info updated successfully' });
}
