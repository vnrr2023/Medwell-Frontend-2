"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Line, Doughnut } from "react-chartjs-2"
import { Download, Search, MoreVertical, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const staffData = {
  labels: ["Doctors", "Nurses", "Dietitians", "Volunteers", "Pharmacists", "Other Staff"],
  datasets: [
    {
      data: [30, 25, 15, 10, 10, 10],
      backgroundColor: ["#0EA5E9", "#22C55E", "#14B8A6", "#F59E0B", "#06B6D4", "#8B5CF6"],
      borderWidth: 0,
    },
  ],
}

const lineChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Doctor",
      data: [210, 250, 200, 300, 250, 280, 230],
      borderColor: "#14B8A6",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Nurse",
      data: [150, 200, 150, 250, 180, 200, 160],
      borderColor: "#0EA5E9",
      backgroundColor: "rgba(14, 165, 233, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
}

const roomsData = [
  { name: "VIP Rooms", usage: 35.01, trend: "+5.51%", color: "bg-blue-500" },
  { name: "Private Room", usage: 15.31, trend: "-3.51%", color: "bg-teal-500" },
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

export default function HospitalDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4 md:gap-6">
  <div className="relative w-[200px] md:w-[300px]">
    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search anything here"
      className="w-full pl-8" 
    />
  </div>
</div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bv6uFX5qhtbTwEEHcM7MiLjOZyB3Xb.png"
              alt="Alexandro"
            />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
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
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hospital Report</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assign Doctor</p>
                  <p className="text-2xl font-bold text-gray-900">210</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admit Patient</p>
                  <p className="text-2xl font-bold text-gray-900">320</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Other Staff</p>
                  <p className="text-2xl font-bold text-gray-900">90</p>
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
        align: "end",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rooms Analytics Sessions</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roomsData.map((room) => (
                  <div key={room.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-8 rounded ${room.color}`} />
                        <div>
                          <p className="font-medium text-sm">{room.name}</p>
                          <p className="text-xs text-muted-foreground">Average usage of {room.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{room.usage}%</p>
                        <p className={`text-xs ${room.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                          {room.trend}
                        </p>
                      </div>
                    </div>
                    <Progress value={room.usage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Department</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center relative">
                <Doughnut
                  data={staffData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "75%",
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          boxWidth: 10,
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900">06</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hospital Conference</CardTitle>
              <div className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">No.</TableHead>
                      <TableHead>ID Code</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Total Stock</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.stock.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                              View
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                              Edit
                            </Badge>
                            <Badge variant="destructive" className="cursor-pointer hover:bg-destructive/90">
                              Delete
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

