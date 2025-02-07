import { NextRequest, NextResponse } from 'next/server';

const dummyDoctorInfo = {
  name: "Rehan",
  speciality: "General Practitioner",
  email: "Rehan.zooby_dooby@example.com",
  phone_number: "+1234567890",
  profile_pic: './doctorpfp(female).png',
  rating: 4.5,
  services: [
    { name: "Consultation", price: "Rs. 500" },
    { name: "Follow-up", price: "Rs. 300" },
    { name: "Emergency Visit", price: "Rs. 1000" }
  ],
  shortBio: "Experienced general practitioner with over 10 years of practice.",
  registeration_number: 'MED123456',
  verified: true,
  submitted_at: '2023-01-01T00:00:00Z',
  doctor_info: {
    email: "Rehan.zooby_dooby@example.com",
  }
};

export async function GET(request:NextRequest) {
  const token = request.headers.get("Authorization")
  if (token !== "Bearer 1234") {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
  }
  return NextResponse.json(dummyDoctorInfo);
}
