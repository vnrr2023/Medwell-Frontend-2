import { Diameter } from "lucide-react"
import { type NextRequest, NextResponse } from "next/server"

const mockPatientInfo = {
  id: "8349431f-32fe-418b-868c-a7e7700e7988",
  name: "Rohit Deshmukh",
  age: 12,
  phone_number: 9999999999,
  user_info: {
    id: 69,
    email: "rohit@gmail.com",
  },
  blood_group: "A+",
  city: "Mumbai",
  country: "India",
  state: "Maharashtra",
  pin: 400001,
  profile_pic: "/media/profile_pics/default_pp.jpg",
  profile_qr: "/media/qr_codes/rohit28414.png",
  adhaar_card: 123412341234,
  allergies: ["Shellfish", "Pollen", "Peanuts"],
  chronic_conditions: ["Diabetes", "Hypertension"],
  family_history: ["Sugar is high", "Heart disease"],
  health_summary:
    "Based on the blood reports, there are some areas of concern that need attention. Red blood cell count and hemoglobin levels have been fluctuating, with a notable drop in the 11/09/22 report. This could be indicative of anemia. White blood cell count has been consistently high, which may suggest an ongoing infection or inflammation. The platelet count has been varying, with a high value in the 15/6/23 report. The lipid profile shows a slightly high total cholesterol level. Additionally, the report dated 03/08/24 shows low levels of albumin and calcium. The overall health status is compromised, and it is essential to address these concerns through dietary changes and medical interventions. \n\nNotable trends and patterns include: \n- Hemoglobin levels have been decreasing over time, which may indicate anemia.\n- White blood cell count has been consistently high, indicating ongoing infection or inflammation.\n- Platelet count has been varying, with a high value in one report.\n- The lipid profile shows a slightly high total cholesterol level.\n- Albumin and calcium levels were low in the 03/08/24 report.",
  diet_plan:
    "To address the health concerns, a personalized diet and nutrition plan is recommended. This plan should include:\n\n- Iron-rich foods like red meat, poultry, and fish to combat anemia.\n- A balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins to support overall health.\n- Foods rich in vitamin D and calcium, such as dairy products, leafy greens, and fortified cereals, to improve calcium levels.\n- Incorporating healthy fats like avocados, nuts, and olive oil to support heart health.\n- Foods high in fiber and antioxidants, like berries, leafy greens, and other fruits, to combat inflammation.\n- Hydration is essential, and adequate water intake should be maintained.\n\nGeneral advice includes:\n- Maintaining a healthy weight through a balanced diet and regular exercise.\n- Reducing sodium intake to promote heart health.\n- Avoiding excessive sugar consumption to regulate blood sugar levels.\n- Practicing stress-reducing techniques, like meditation or yoga, to manage stress and promote overall well-being.",
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  try {
    const patientInfo = mockPatientInfo

    return NextResponse.json(patientInfo)
  } catch (error) {
    console.error("Error fetching patient information:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

