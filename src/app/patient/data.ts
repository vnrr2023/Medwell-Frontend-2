import { Heart, Activity, Droplet, Thermometer, User, Brain } from "lucide-react"

export const healthMetricsData = {
  hemoglobin: {
    label: "Hemoglobin",
    color: "#ff6b6b",
    icon: Heart,
    data: [14.2, 13.8, 14.5, 13.9, 14.1, 14.3, 14.0, 13.7, 14.4],
    avg: 14.1,
  },
  rbcCount: {
    label: "RBC Count",
    color: "#4ecdc4",
    icon: Activity,
    data: [5.2, 5.1, 5.3, 5.0, 5.4, 5.2, 5.1, 5.3, 5.2],
    avg: 5.2,
  },
  wbcCount: {
    label: "WBC Count",
    color: "#45aaf2",
    icon: Droplet,
    data: [7.8, 7.5, 7.9, 7.6, 7.7, 7.8, 7.6, 7.9, 7.7],
    avg: 7.7,
  },
  plateletCount: {
    label: "Platelet Count",
    color: "#fed330",
    icon: Thermometer,
    data: [250, 245, 255, 248, 252, 247, 253, 249, 251],
    avg: 250,
  },
  pcv: {
    label: "PCV",
    color: "#26de81",
    icon: User,
    data: [42, 41, 43, 40, 42, 41, 43, 42, 41],
    avg: 41.7,
  },
  bilirubin: {
    label: "Bilirubin",
    color: "#a55eea",
    icon: Brain,
    data: [0.8, 0.7, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7],
    avg: 0.8,
  },
  proteins: {
    label: "Proteins",
    color: "#fd9644",
    icon: Thermometer,
    data: [7.2, 7.0, 7.3, 7.1, 7.2, 7.0, 7.3, 7.1, 7.2],
    avg: 7.16,
  },
  calcium: {
    label: "Calcium",
    color: "#2bcbba",
    icon: User,
    data: [9.5, 9.3, 9.6, 9.4, 9.5, 9.3, 9.6, 9.4, 9.5],
    avg: 9.46,
  },
  bloodUrea: {
    label: "Blood Urea",
    color: "#eb3b5a",
    icon: Brain,
    data: [15, 14, 16, 15, 14, 15, 16, 15, 14],
    avg: 14.89,
  },
}

export const dashboardData = {
  totalReports: 156,
  monthlyExpense: 2500,
  upcomingAppointment: {
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-28",
    time: "10:30 AM",
    type: "Regular Checkup",
  },
  healthAlerts: [
    {
      id: 1,
      type: "High Blood Pressure",
      severity: "moderate",
      date: "2024-01-24",
    },
    {
      id: 2,
      type: "Elevated Cholesterol",
      severity: "mild",
      date: "2024-01-22",
    },
  ],
  recentReports: [
    {
      id: 1,
      type: "Blood Test",
      date: "2024-01-20",
      doctor: "Dr. Michael Chen",
    },
    {
      id: 2,
      type: "X-Ray",
      date: "2024-01-18",
      doctor: "Dr. Emily Williams",
    },
    {
      id: 3,
      type: "ECG",
      date: "2024-01-15",
      doctor: "Dr. James Wilson",
    },
    {
      id: 4,
      type: "MRI",
      date: "2024-01-10",
      doctor: "Dr. Lisa Anderson",
    },
    {
      id: 5,
      type: "Urine Analysis",
      date: "2024-01-05",
      doctor: "Dr. Robert Brown",
    },
  ],
  monthlyHealthTrend: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Blood Pressure",
        data: [120, 122, 119, 121, 120, 118, 122, 121, 119],
      },
      {
        label: "Heart Rate",
        data: [72, 74, 71, 73, 72, 70, 74, 73, 71],
      },
    ],
  },
}

