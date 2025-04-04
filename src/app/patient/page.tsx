"use client"

import { motion } from "framer-motion"
import {  Calendar, FileText, DollarSign, Bell, Router} from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import DaddyAPI from "@/services/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function PatientDashboard() {
  const [dashboardData, setDashboardData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
  const router=useRouter()
  
  useEffect(() => {
 
    const getPatientDashboardData = async () => {
      try {
        const response = await DaddyAPI.getPatientDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    getPatientDashboardData();
  }, []);
 
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
    }
    if(role!=="patient"){
      alert("You cannot access logged in as doctor")
      router.push("/doctor")
      return
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-t-transparent border-solid rounded-full animate-spin border-4 border-blue-500 h-16 w-16"></div>
      </div>
    );
  }



  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Dashboard
      </motion.h1>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.reports?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total reports</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dashboardData?.overall_expense || 0}</div>
              <p className="text-xs text-muted-foreground">Overall expense</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.appointment?.date || "No appointment"}</div>
              <p className="text-xs text-muted-foreground">{dashboardData?.appointment?.doctor_name || ""}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">No active alerts</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Health Trends */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={{
                  labels: dashboardData?.graph_data?.submitted_at || [],
                  datasets: [
                    {
                      label: "Hemoglobin",
                      data: dashboardData?.graph_data?.hemoglobin || [],
                      borderColor: "#ff6b6b",
                      tension: 0.4,
                    },
                    {
                      label: "RBC Count",
                      data: dashboardData?.graph_data?.rbc_count || [],
                      borderColor: "#4ecdc4",
                      tension: 0.4,
                    },
                    {
                      label: "WBC Count",
                      data: dashboardData?.graph_data?.wbc_count || [],
                      borderColor: "#45b7d1",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.reports?.slice(0, 5).map((report:any) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{report.report_type || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{report.doctor_name || "Unknown"}</p>
                  </div>
                  <Badge variant="secondary">{report.report_date}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

