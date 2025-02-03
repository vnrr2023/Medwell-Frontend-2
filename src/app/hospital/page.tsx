"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line } from "react-chartjs-2"
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Download, Search } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const staffData = {
  labels: ["Doctors", "Nurses", "Dietitians", "Volunteers", "Pharmacists", "Other Staff"],
  datasets: [
    {
      data: [30, 25, 15, 10, 10, 10],
      backgroundColor: ["#4F46E5", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    },
  ],
}

const lineChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Doctor",
      data: [210, 250, 200, 300, 250, 280, 230],
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
    },
    {
      label: "Nurse",
      data: [150, 200, 150, 250, 180, 200, 160],
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
    },
  ],
}

const roomsData = [
  { name: "VIP Rooms", usage: 35.01, trend: "+5.51%", color: "bg-blue-500" },
  { name: "Private Room", usage: 15.31, trend: "-3.51%", color: "bg-green-500" },
  { name: "General Room", usage: 25.53, trend: "+5.16%", color: "bg-orange-500" },
  { name: "ICU Room", usage: 32.68, trend: "-2.28%", color: "bg-red-500" },
]

const inventoryData = [
  { id: "FLUP12132424", name: "Paracetamol", stock: 23456 },
  { id: "ECG12132424", name: "Panadol", stock: 23456 },
  { id: "FLUPEC0312424", name: "Abacavir", stock: 23456 },
  { id: "FLUPEC0312424", name: "Acarbose", stock: 23456 },
  { id: "FLUPEC0312424", name: "Acetylcysteine", stock: 23456 },
]

export default function DoctorDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-sm text-muted-foreground">This is data statistics for the last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium">Assign Doctor</p>
                <p className="text-2xl font-bold">210</p>
              </div>
              <div>
                <p className="text-sm font-medium">Admit Patient</p>
                <p className="text-2xl font-bold">320</p>
              </div>
              <div>
                <p className="text-sm font-medium">Other Staff</p>
                <p className="text-2xl font-bold">90</p>
              </div>
            </div>
            <div className="h-[300px]">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rooms Analytics Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomsData.map((room) => (
                <div key={room.name} className="flex items-center gap-4">
                  <div className={`w-2 h-8 rounded ${room.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{room.name}</p>
                      <p className="font-bold">{room.usage}%</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Progress value={room.usage} className="flex-1" />
                      <span
                        className={`ml-2 text-xs ${room.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {room.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center relative">
              <Doughnut
                data={staffData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold">06</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hospital Conference</CardTitle>
<div className="w-[200px] relative">
  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search anything here"
    className="w-full pl-8"  // Add padding to avoid overlapping with the icon
  />
</div>

          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>ID Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Total Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="cursor-pointer">
                          View
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          Edit
                        </Badge>
                        <Badge variant="destructive" className="cursor-pointer">
                          Delete
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

