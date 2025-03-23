import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(id);
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer 1234') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = [
    {
      "id": "027af629-3069-4d59-ae5a-fe72509b7bfb",
      "serviceName": "Follow Up",
      "serviceAmount": "300"
    },
    {
      "id": "bf5aff6f-712b-429b-9a72-6b2453f672a8",
      "serviceName": "Regular Checkup",
      "serviceAmount": "750"
    }
  ];

  return NextResponse.json(services);
}