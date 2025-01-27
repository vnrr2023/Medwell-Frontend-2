import { Report } from './types';

export const mockReports: Report[] = [
  {
    id: 1,
    title: "Annual Checkup",
    date: "28 Sept, 2024",
    collectionDate: "25 Sept, 2024",
    doctorName: "Dr. Nishi",
    summary: "Overall health is good. Calcium levels are slightly elevated.",
    elements: {
      calcium: { max: 10.2, min: 8.5, unit: "mg/dL", value: 10.5 },
      hemoglobin: { max: 17.5, min: 13.5, unit: "g/dL", value: 14.5 },
      redBloodCells: { max: 5.9, min: 4.5, unit: "million/µL", value: 5.2 },
      whiteBloodCells: { max: 11000, min: 4500, unit: "/µL", value: 7500 },
    },
    reportUrl: "https://example.com/report1",
  },
  {
    id: 2,
    title: "Lipid Panel",
    date: "15 Oct, 2024",
    collectionDate: "12 Oct, 2024",
    doctorName: "Dr. Rehan",
    summary: "Cholesterol levels are within normal range.",
    elements: {
      totalCholesterol: { max: 200, min: 125, unit: "mg/dL", value: 180 },
      ldlCholesterol: { max: 130, min: 0, unit: "mg/dL", value: 100 },
      hdlCholesterol: { max: 60, min: 40, unit: "mg/dL", value: 50 },
      triglycerides: { max: 150, min: 0, unit: "mg/dL", value: 120 },
    },
    reportUrl: "https://example.com/report2",
  },
  {
    id: 3,
    title: "Nutrient Deficiency Panel",
    date: "15 Nov, 2024",
    collectionDate: "12 Nov, 2024",
    doctorName: "Dr. Vivek",
    summary: "Several nutrient levels are below the normal range, indicating deficiencies in calcium, iron, and vitamin D.",
    elements: {
      calcium: { max: 10.5, min: 8.5, unit: "mg/dL", value: 7.9 },
      iron: { max: 170, min: 60, unit: "µg/dL", value: 50 },
      vitaminD: { max: 100, min: 30, unit: "ng/mL", value: 20 },
      magnesium: { max: 2.6, min: 1.8, unit: "mg/dL", value: -1 },
    },
    reportUrl: "https://example.com/report3",
  },
];
