import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")
    if (token !== "Bearer 1234") {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
  const formData = await request.formData();
  console.log('Multimedia uploaded:', formData);
  return NextResponse.json({ success: true, message: 'Multimedia uploaded successfully' });
}
