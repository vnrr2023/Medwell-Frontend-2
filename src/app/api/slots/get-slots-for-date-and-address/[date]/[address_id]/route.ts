import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string; address_id: string }> }
) {
  const { date, address_id } = await params;
  console.log(date, address_id);
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer 1234') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slots = [
    {
      "id": "31d1373f-7bea-4b78-8f9b-8a49cf94edbd",
      "timing": "10:00",
      "status": "BOOKED",
      "date": "2025-02-08"
    },
    {
      "id": "94ccdfcd-4b58-4457-8ab0-ec6962434a43",
      "timing": "10:30",
      "status": "Available",
      "date": "2025-02-08"
    },
  ];

  return NextResponse.json(slots);
}