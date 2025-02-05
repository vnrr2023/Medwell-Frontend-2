import { type NextRequest, NextResponse } from "next/server"

const mockReports = {
    "reports": [
        {
            "id": "eea5e099-ad12-4b7a-b48f-4507a7080ed9",
            "report_file": "/media/user_reports/Tanaji_Yadav_FYJti40.pdf",
            "report_type": "blood_report",
            "submitted_at": "2024-11-03",
            "date_of_collection": "6/9/22",
            "doctor_name": "Tushar D.Rege",
            "date_of_report": "6/9/22",
            "summary": "Haemoglobin is borderline low, Platelet Count is normal, RBC Count is low, Pcv is low, Neutrophils are normal, Lymphocytes are normal, Fasting Sugar is normal, Postprandial Sugar is slightly high, Sr. Cholesterol is normal",
            "reportdetail": {
                "report_data": {
                    "pcv": {
                        "max": 50,
                        "min": 36,
                        "unit": "%",
                        "value": 37.1
                    },
                    "iron": {
                        "max": 170,
                        "min": 60,
                        "unit": "μg/dL",
                        "value": -1
                    },
                    "sodium": {
                        "max": 145,
                        "min": 135,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "albumin": {
                        "max": 5.0,
                        "min": 3.5,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "calcium": {
                        "max": 10.2,
                        "min": 8.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "chloride": {
                        "max": 107,
                        "min": 98,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "globulin": {
                        "max": 4.0,
                        "min": 2.0,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "proteins": {
                        "max": 8.0,
                        "min": 6.0,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "potassium": {
                        "max": 5.0,
                        "min": 3.5,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "rbc_count": {
                        "max": 5.4,
                        "min": 4.2,
                        "unit": "million cells/μL",
                        "value": 4.46
                    },
                    "wbc_count": {
                        "max": 11.0,
                        "min": 4.5,
                        "unit": "thousand cells/μL",
                        "value": 5000
                    },
                    "blood_urea": {
                        "max": 20,
                        "min": 7,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "hemoglobin": {
                        "max": 15.5,
                        "min": 12.1,
                        "unit": "g/dL",
                        "value": 12.6
                    },
                    "phosphorus": {
                        "max": 4.5,
                        "min": 2.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "lymphocytes": {
                        "max": 45,
                        "min": 20,
                        "unit": "%",
                        "value": 45
                    },
                    "neutrophils": {
                        "max": 75,
                        "min": 40,
                        "unit": "%",
                        "value": 50
                    },
                    "s_uric_acid": {
                        "max": 7.2,
                        "min": 3.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "s_creatinine": {
                        "max": 1.2,
                        "min": 0.6,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "s_phosphorus": {
                        "max": 4.5,
                        "min": 2.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "fasting_sugar": {
                        "max": 100,
                        "min": 70,
                        "unit": "mg/dL",
                        "value": 89
                    },
                    "platelet_count": {
                        "max": 450000,
                        "min": 150000,
                        "unit": "cells/μL",
                        "value": 152000
                    },
                    "sr_cholesterol": {
                        "max": 200,
                        "min": 0,
                        "unit": "mg/dL",
                        "value": 159
                    },
                    "bilirubin_total": {
                        "max": 1.2,
                        "min": 0.1,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "hdl_cholesterol": {
                        "max": 60,
                        "min": 40,
                        "unit": "mg/dL",
                        "value": 64
                    },
                    "bilirubin_direct": {
                        "max": 0.3,
                        "min": 0.0,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "after_lunch_sugar": {
                        "max": 140,
                        "min": 70,
                        "unit": "mg/dL",
                        "value": 127
                    },
                    "bilirubin_indirect": {
                        "max": 0.8,
                        "min": 0.1,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "blood_urea_nitrogen": {
                        "max": 20,
                        "min": 7,
                        "unit": "mg/dL",
                        "value": -1
                    }
                }
            }
        },
        {
            "id": "eea5e099-ad12-4b7a-b48f-4507a7080ed1",
            "report_file": "/media/user_reports/Tanaji_Yadav_FYJti40.pdf",
            "report_type": "blood_report",
            "submitted_at": "2024-11-03",
            "date_of_collection": "6/9/22",
            "doctor_name": "Tushar D.Rege",
            "date_of_report": "6/9/22",
            "summary": "Haemoglobin is borderline low, Platelet Count is normal, RBC Count is low, Pcv is low, Neutrophils are normal, Lymphocytes are normal, Fasting Sugar is normal, Postprandial Sugar is slightly high, Sr. Cholesterol is normal",
            "reportdetail": {
                "report_data": {
                    "pcv": {
                        "max": 50,
                        "min": 36,
                        "unit": "%",
                        "value": 37.1
                    },
                    "iron": {
                        "max": 170,
                        "min": 60,
                        "unit": "μg/dL",
                        "value": -1
                    },
                    "sodium": {
                        "max": 145,
                        "min": 135,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "albumin": {
                        "max": 5.0,
                        "min": 3.5,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "calcium": {
                        "max": 10.2,
                        "min": 8.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "chloride": {
                        "max": 107,
                        "min": 98,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "globulin": {
                        "max": 4.0,
                        "min": 2.0,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "proteins": {
                        "max": 8.0,
                        "min": 6.0,
                        "unit": "g/dL",
                        "value": -1
                    },
                    "potassium": {
                        "max": 5.0,
                        "min": 3.5,
                        "unit": "mmol/L",
                        "value": -1
                    },
                    "rbc_count": {
                        "max": 5.4,
                        "min": 4.2,
                        "unit": "million cells/μL",
                        "value": 4.46
                    },
                    "wbc_count": {
                        "max": 11.0,
                        "min": 4.5,
                        "unit": "thousand cells/μL",
                        "value": 5000
                    },
                    "blood_urea": {
                        "max": 20,
                        "min": 7,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "hemoglobin": {
                        "max": 15.5,
                        "min": 12.1,
                        "unit": "g/dL",
                        "value": 12.6
                    },
                    "phosphorus": {
                        "max": 4.5,
                        "min": 2.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "lymphocytes": {
                        "max": 45,
                        "min": 20,
                        "unit": "%",
                        "value": 45
                    },
                    "neutrophils": {
                        "max": 75,
                        "min": 40,
                        "unit": "%",
                        "value": 50
                    },
                    "s_uric_acid": {
                        "max": 7.2,
                        "min": 3.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "s_creatinine": {
                        "max": 1.2,
                        "min": 0.6,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "s_phosphorus": {
                        "max": 4.5,
                        "min": 2.5,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "fasting_sugar": {
                        "max": 100,
                        "min": 70,
                        "unit": "mg/dL",
                        "value": 89
                    },
                    "platelet_count": {
                        "max": 450000,
                        "min": 150000,
                        "unit": "cells/μL",
                        "value": 152000
                    },
                    "sr_cholesterol": {
                        "max": 200,
                        "min": 0,
                        "unit": "mg/dL",
                        "value": 159
                    },
                    "bilirubin_total": {
                        "max": 1.2,
                        "min": 0.1,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "hdl_cholesterol": {
                        "max": 60,
                        "min": 40,
                        "unit": "mg/dL",
                        "value": 64
                    },
                    "bilirubin_direct": {
                        "max": 0.3,
                        "min": 0.0,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "after_lunch_sugar": {
                        "max": 140,
                        "min": 70,
                        "unit": "mg/dL",
                        "value": 127
                    },
                    "bilirubin_indirect": {
                        "max": 0.8,
                        "min": 0.1,
                        "unit": "mg/dL",
                        "value": -1
                    },
                    "blood_urea_nitrogen": {
                        "max": 20,
                        "min": 7,
                        "unit": "mg/dL",
                        "value": -1
                    }
                }
            }
        }
    ],
    "count": 2
}


export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader!=="Bearer 1234") {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
  }


  if (mockReports.reports.length === 0) {
    return NextResponse.json(null, { status: 204 })
  }

  return NextResponse.json(mockReports)
}

