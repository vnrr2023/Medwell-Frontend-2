import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AddressSchema = z.object({
  address_type: z.string(),
  address: z.string(),
  lat: z.string(),
  lon: z.string()
});

const AddressesResponseSchema = z.object({
  addresses: z.array(AddressSchema)
});

const dummyAddresses = [
  {
    address_type: "work",
    address: "123 Medical Center, Downtown, City",
    lat: "40.7128",
    lon: "-74.0060",
  },
  {
    address_type: "home",
    address: "456 Residential Ave, Suburb, City",
    lat: "40.7282",
    lon: "-73.7949",
  }
];

export async function GET(request:NextRequest) {
  try {
    const token = request.headers.get("Authorization")
    if (token !== "Bearer 1234") {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
    const validatedData = AddressesResponseSchema.parse({ addresses: dummyAddresses });
    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Invalid addresses data' }, { status: 500 });
  }
}
