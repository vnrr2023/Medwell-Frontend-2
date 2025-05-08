"use client"

import { motion } from "framer-motion"
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
  Filler
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularMetric } from "@/components/patient/CircularMetric"
import DaddyAPI from "@/services/api"
import { useEffect, useState } from "react"
import { Activity, Heart, Droplet, ThermometerSun, PlusCircle } from "lucide-react"
import { LucideIcon } from "lucide-react"
import Chat from "@/components/chatbots/Chat"
import ChatArogya from "@/components/chatbots/ChatArogya"
import { useRouter } from "next/navigation"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface HealthData {
  avg_data: {
    avg_hemoglobin?: number;
    avg_rbc_count?: number;
    avg_wbc_count?: number;
    avg_platelet_count?: number;
    avg_pcv?: number;
    avg_bilirubin?: number;
    avg_proteins?: number;
    avg_calcium?: number;
    avg_blood_urea?: number;
    avg_sr_cholestrol?: number;
  };
  data: {
    submitted_at?: string[];
    hemoglobin?: string[];
    rbc_count?: string[];
    wbc_count?: string[];
    platelet_count?: string[];
    pcv?: string[];
    bilirubin?: (string | null)[];
    proteins?: (string | null)[];
    calcium?: (string | null)[];
    blood_urea?: (string | null)[];
    sr_cholestrol?: (string | null)[];
  };
  status?: boolean;
}

interface MetricConfig {
  label: string;
  color: string;
  icon: LucideIcon;
  data: number[];
  avg: number;
}

const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return value.toFixed(1);
}

const createMetricConfig = (
  label: string,
  color: string,
  icon: LucideIcon,
  data: (string | null)[],
  avg: number
): MetricConfig => ({
  label,
  color,
  icon,
  data: data.filter((val): val is string => val !== null)
           .map(val => parseFloat(val)),
  avg: parseFloat(avg.toFixed(1))
})

export default function HealthCheck() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const router=useRouter();
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="patient"){
      alert("You cannot access logged in as doctor")
      router.push("/doctor")
      return
    }
  }, []);
  useEffect(() => {
    const getHealthCheckData = async () => {
      try {
        const response = await DaddyAPI.getHealthCheck()
        setHealthData(response.data)
      } catch (error) {
        console.error("Failed to fetch health check data:", error)
      }
    }
    getHealthCheckData()
  }, [])

  if (!healthData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-t-transparent border-solid rounded-full animate-spin border-4 border-blue-500 h-16 w-16"></div>
      </div>
    );
  }

  const metrics = [
    createMetricConfig(
      "Hemoglobin",
      "#ff6b6b",
      Heart,
      healthData.data?.hemoglobin || [],
      healthData.avg_data?.avg_hemoglobin || 0
    ),
    createMetricConfig(
      "RBC Count",
      "#4ecdc4",
      Droplet,
      healthData.data?.rbc_count || [],
      healthData.avg_data?.avg_rbc_count || 0
    ),
    createMetricConfig(
      "WBC Count",
      "#45b7d1",
      Activity,
      healthData.data?.wbc_count || [],
      healthData.avg_data?.avg_wbc_count || 0
    ),
    createMetricConfig(
      "Platelet Count",
      "#96ceb4",
      PlusCircle,
      healthData.data?.platelet_count || [],
      healthData.avg_data?.avg_platelet_count || 0
    ),
    createMetricConfig(
      "PCV",
      "#88d8b0",
      ThermometerSun,
      healthData.data?.pcv || [],
      healthData.avg_data?.avg_pcv || 0
    )
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Line Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm font-medium">
                  <metric.icon className="w-4 h-4 mr-2" />
                  {metric.label} Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <Line
                    data={{
                      labels: healthData.data?.submitted_at || [],
                      datasets: [
                        {
                          label: metric.label,
                          data: metric.data,
                          borderColor: metric.color,
                          backgroundColor: `${metric.color}33`,
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const value = context.raw as number;
                              return `${metric.label}: ${formatNumber(value)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            callback: (value) => formatNumber(value as number)
                          }
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Circular Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <CircularMetric
                  value={metric.avg}
                  max={Math.max(...metric.data)}
                  label={metric.label}
                  icon={metric.icon}
                  color={metric.color}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <ChatArogya/>
    </div>
  )
}