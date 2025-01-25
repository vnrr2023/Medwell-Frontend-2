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
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularMetric } from "@/components/patient/CircularMetric"
import { healthMetricsData } from "./../data"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const metrics = Object.values(healthMetricsData)

export default function HealthCheck() {
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
                  <metric.icon className="w-4 h-4 mr-2" style={{ color: metric.color }} />
                  {metric.label} Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <Line
                    data={{
                      labels: Array.from({ length: metric.data.length }, (_, i) => `Day ${i + 1}`),
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
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            display: false,
                          },
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

      
    </div>
  )
}

