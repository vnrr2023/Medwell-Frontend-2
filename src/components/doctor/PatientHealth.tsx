import type React from "react"
import { ArrowLeft, Heart, Activity, Weight, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PatientHealthProps {
  patientId: number
  onClose: () => void
}

interface HealthMetric {
  name: string
  value: number
  unit: string
  icon: React.ElementType
  progress: number
}

const dummyHealthData: HealthMetric[] = [
  { name: "Heart Rate", value: 72, unit: "bpm", icon: Heart, progress: 72 },
  { name: "Blood Pressure", value: 120, unit: "mmHg", icon: Activity, progress: 80 },
  { name: "Weight", value: 70, unit: "kg", icon: Weight, progress: 65 },
  { name: "Height", value: 175, unit: "cm", icon: Ruler, progress: 100 },
]

const PatientHealth: React.FC<PatientHealthProps> = ({ patientId, onClose }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onClose} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
      </Button>
      <h1 className="text-3xl font-bold mb-6">Patient Health for Patient {patientId}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyHealthData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value} {metric.unit}
              </div>
              <Progress value={metric.progress} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Health Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Patient reported feeling fatigued and experiencing occasional headaches. Recommended increasing water intake
            and adjusting sleep schedule. Follow-up appointment scheduled in 2 weeks.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button>Schedule Follow-up Appointment</Button>
      </div>
    </div>
  )
}

export default PatientHealth

