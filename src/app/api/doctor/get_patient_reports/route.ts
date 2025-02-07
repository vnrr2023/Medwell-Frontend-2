import { NextRequest, NextResponse } from 'next/server';

export async function POST(request:NextRequest) {
    
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader!="Bearer 1234") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        if (!body.patient_id) {
            return NextResponse.json({ error: 'Bad Request: Missing patient_id' }, { status: 400 });
        }

        const mockReports = [
            {
                "id": "92868a17-7196-446b-a3f5-2333afdc5cb6",
                "report_file": "/media/user_reports/327969412_4f6395f0-d59a-4db6-99ce-0a57a4e827e5_1_sGTCRd9.pdf",
                "report_type": "blood_report",
                "submitted_at": "2024-11-03",
                "date_of_collection": "14/2/2022",
                "doctor_name": "Dr. SELF",
                "date_of_report": "15/2/2022",
                "summary": "The patient's HbA1c result suggests that he is at risk for Diabetes (Prediabetes)/ well controlled Diabetes in a known Diabetic. The Apolipoprotein B level is within the normal range. The Vitamin D level is sufficient.",
                "reportdetail": {
                    "report_data": {
                        "pcv": { "max": 50, "min": 36, "unit": "%", "value": 47.2 },
                        "iron": { "max": 170, "min": 60, "unit": "μg/dL", "value": -1 },
                        "sodium": { "max": 145, "min": 135, "unit": "mmol/L", "value": 136.1 },
                        "albumin": { "max": 5.0, "min": 3.5, "unit": "g/dL", "value": 4.62 },
                        "calcium": { "max": 10.2, "min": 8.5, "unit": "mg/dL", "value": 10.0 },
                        "chloride": { "max": 107, "min": 98, "unit": "mmol/L", "value": 101.3 },
                        "globulin": { "max": 4.0, "min": 2.0, "unit": "g/dL", "value": -1 },
                        "proteins": { "max": 8.0, "min": 6.0, "unit": "g/dL", "value": 7.84 },
                        "potassium": { "max": 5.0, "min": 3.5, "unit": "mmol/L", "value": 4.58 },
                        "rbc_count": { "max": 5.4, "min": 4.2, "unit": "million cells/μL", "value": 5.35 },
                        "wbc_count": { "max": 11.0, "min": 4.5, "unit": "thousand cells/μL", "value": 7.34 },
                        "blood_urea": { "max": 20, "min": 7, "unit": "mg/dL", "value": 27.1 },
                        "hemoglobin": { "max": 15.5, "min": 12.1, "unit": "g/dL", "value": 15.0 },
                        "phosphorus": { "max": 4.5, "min": 2.5, "unit": "mg/dL", "value": 3.83 },
                        "lymphocytes": { "max": 45, "min": 20, "unit": "%", "value": 2.07 },
                        "neutrophils": { "max": 75, "min": 40, "unit": "%", "value": 4.59 },
                        "s_uric_acid": { "max": 7.2, "min": 3.5, "unit": "mg/dL", "value": 5.03 },
                        "s_creatinine": { "max": 1.2, "min": 0.6, "unit": "mg/dL", "value": 0.77 },
                        "s_phosphorus": { "max": 4.5, "min": 2.5, "unit": "mg/dL", "value": 3.83 },
                        "fasting_sugar": { "max": 100, "min": 70, "unit": "mg/dL", "value": 91.0 },
                        "platelet_count": { "max": 450000, "min": 150000, "unit": "cells/μL", "value": 159.0 },
                        "sr_cholesterol": { "max": 200, "min": 0, "unit": "mg/dL", "value": -1 },
                        "bilirubin_total": { "max": 1.2, "min": 0.1, "unit": "mg/dL", "value": 0.58 },
                        "hdl_cholesterol": { "max": 60, "min": 40, "unit": "mg/dL", "value": -1 },
                        "bilirubin_direct": { "max": 0.3, "min": 0.0, "unit": "mg/dL", "value": 0.16 },
                        "after_lunch_sugar": { "max": 140, "min": 70, "unit": "mg/dL", "value": -1 },
                        "bilirubin_indirect": { "max": 0.8, "min": 0.1, "unit": "mg/dL", "value": 0.42 },
                        "blood_urea_nitrogen": { "max": 20, "min": 7, "unit": "mg/dL", "value": -1 }
                    }
                }
            }
        ];

        return NextResponse.json(mockReports, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
