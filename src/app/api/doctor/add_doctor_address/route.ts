import { NextResponse } from 'next/server';
import { z } from 'zod';

const AddAddressSchema = z.object({
  address: z.string(),
  address_type: z.string()
});

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")
    if (token !== "Bearer 1234") {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
    const body = await request.json();
    const validatedData = AddAddressSchema.parse(body);
    
    console.log('New address added:', validatedData);
    
    return NextResponse.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Invalid address data' }, { status: 400 });
  }
}
