import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  console.log(id);
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer 1234') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const addresses = [
    {
      "id": 36,
      "addressType": "home",
      "address": "222, Swami Vivekananda Rd, near Suburbia Movie Theatre, Bandra West, Mumbai, Maharashtra 400050, India",
      "lat": 19.0607435,
      "lon": 72.8369031,
      "doctor": {
        "id": "121"
      },
      "timings": {
        "end": "18:00",
        "start": "10:00"
      }
    }
  ];

  return NextResponse.json(addresses);
}