"use client"
import { useState, useCallback, useEffect } from "react"
import type React from "react"

import { MapPin, Search, Stethoscope, Clock, Star } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DaddyAPI from "@/services/api"
import DynamicMap from "@/components/DynamicMap"

// Types
interface Location {
  lat: number
  lon: number
}

interface DoctorData {
  name: string
  speciality: string
  address: string
  location: Location
  rating?: number
  availability?: string
}

interface Doctor {
  id: string
  data: DoctorData
}

interface DummyCoordinates {
  [key: string]: [number, number]
}

const DISTRICTS: string[] = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
]

const SPECIALTIES: string[] = [
  "No Specialty",
  "General Physician",
  "Pediatrician",
  "Gynecologist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Cardiologist",
  "Neurologist",
]

const DUMMY_COORDINATES: DummyCoordinates = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
}

interface DoctorCardProps {
  doctor: Doctor
}

const DoctorCard = ({ doctor }: DoctorCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-100">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl text-blue-800">{doctor.data.name}</h3>
          <p className="text-blue-600 font-medium mt-1">{doctor.data.speciality || "General Practice"}</p>
        </div>
        {doctor.data.rating && (
          <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-medium flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
            {doctor.data.rating}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-gray-600 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          {doctor.data.address}
        </p>
        {doctor.data.availability && (
          <p className="text-gray-600 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            {doctor.data.availability}
          </p>
        )}
      </div>

      <Link href="/doctorsearch/appointment" className="block mt-6">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Book Appointment</Button>
      </Link>
    </CardContent>
  </Card>
)

export default function DoctorSearch() {
  const [loading, setLoading] = useState<boolean>(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [locationOption, setLocationOption] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("No Specialty")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const searchNearbyDoctors = useCallback(
    async (lat: number, lon: number) => {
      setLoading(true)
      setError(null)
      try {
        const payload = {
          lat,
          lon,
          km: 10,
          ...(selectedSpecialty !== "No Specialty" && { specialty: selectedSpecialty }),
        }
        const response = await DaddyAPI.doctorSearchSpecialty(payload)
        if (response.data?.data) {
          setDoctors(response.data.data)
        } else {
          setDoctors([])
          setError("No doctors found in this location.")
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setError("Failed to fetch nearby doctors. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [selectedSpecialty],
  )

  const handleNormalSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    setLoading(true)
    setError(null)
    try {
      const response = await DaddyAPI.doctorSearchQuery({ query: searchQuery })
      if (response.data?.data) {
        setDoctors(response.data.data)
        if (response.data.data.length > 0) {
          const firstDoctor = response.data.data[0].data
          setMapCenter([firstDoctor.location.lat, firstDoctor.location.lon])
        }
      } else {
        setDoctors([])
        setError("No doctors found matching your search.")
      }
    } catch (error) {
      console.error("Error searching doctors:", error)
      setError("Failed to search doctors. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!locationOption) {
      setError("Please select a location to find nearby doctors.")
      return
    }

    if (locationOption === "current") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          searchNearbyDoctors(latitude, longitude)
        },
        (error) => {
          console.error("Error getting current location:", error)
          setError("Failed to get your current location. Please ensure location services are enabled.")
        },
      )
    } else {
      const [latitude, longitude] = DUMMY_COORDINATES[locationOption] || [20.5937, 78.9629]
      setMapCenter([latitude, longitude])
      searchNearbyDoctors(latitude, longitude)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-800 mb-4">Your Trusted Healthcare Partner</h1>
            <p className="text-xl text-blue-600">
              Connecting you with expert medical professionals for personalized care
            </p>
          </div>

          <Card className="bg-white shadow-xl mb-8 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Search className="h-5 w-5" />
                Find Doctors and Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="search"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    Search
                  </TabsTrigger>
                  <TabsTrigger
                    value="nearby"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    Find Nearby
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="search">
                  <form onSubmit={handleNormalSearch} className="flex gap-4">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search doctors, clinics, hospitals, etc."
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="nearby">
                  <form onSubmit={handleLocationSearch} className="space-y-4">
                    <div className="flex gap-4">
                      <Select value={locationOption} onValueChange={setLocationOption}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={5} className="w-[200px] bg-white">
                        <SelectItem value="current">Use current location</SelectItem>
                          {DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="submit" variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <Search className="h-4 w-4 mr-2" />
                        Find Nearby
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((specialty) => (
                        <Button
                          key={specialty}
                          variant={selectedSpecialty === specialty ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSpecialty(specialty)}
                          className={
                            selectedSpecialty === specialty
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "text-blue-700 border-blue-200 hover:bg-blue-100"
                          }
                        >
                          {specialty}
                        </Button>
                      ))}
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-blue-100">
            <CardContent className="p-6">
              <div className="relative">
                {isMobile ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                      <Stethoscope className="h-6 w-6" />
                      Available Doctors
                    </h2>
                    {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                    <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto">
                      {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-8">
                    <div className="w-1/2">
                      <div className="h-[calc(100vh-300px)] rounded-xl overflow-hidden shadow-xl">
                        <DynamicMap center={mapCenter} doctors={doctors} />
                      </div>
                    </div>

                    <div className="w-1/2">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                        <Stethoscope className="h-6 w-6" />
                        Available Doctors
                      </h2>
                      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                      <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto pr-4">
                        {doctors.map((doctor) => (
                          <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-75 backdrop-blur-sm rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

