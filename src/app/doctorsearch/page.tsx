"use client"
import { useState, useCallback, useEffect } from "react"
import type React from "react"

import { MapPin, Search, Stethoscope, Clock, Star, Calendar, Shield } from "lucide-react"
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
  user_id:string
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
  <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden group">
    <CardContent className="p-0">
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl">{doctor.data.name}</h3>
              <p className="font-medium mt-1 text-indigo-100">{doctor.data.speciality || "General Practice"}</p>
            </div>
            {doctor.data.rating && (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-300 fill-current" />
                {doctor.data.rating}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white flex-grow">
          <div className="space-y-3">
            <p className="text-slate-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="line-clamp-1">{doctor.data.address}</span>
            </p>
            {doctor.data.availability && (
              <p className="text-slate-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                {doctor.data.availability}
              </p>
            )}
          </div>

          <Link href={{ pathname: "doctorsearch/appointments", query: { doctor_id: doctor.data.user_id } }} className="block mt-6">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white group-hover:shadow-md transition-all">
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
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
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[url('/bg.svg')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">MedWell Doctor Search</h1>
          </div>
          <p className="text-indigo-100">Find trusted healthcare professionals for personalized care</p>
        </div>
      </div>

      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg mb-8 border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Search className="h-5 w-5" />
              Find Doctors and Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                <TabsTrigger
                  value="search"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Search by Name
                </TabsTrigger>
                <TabsTrigger
                  value="nearby"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
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
                    className="flex-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="nearby">
                <form onSubmit={handleLocationSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <Select value={locationOption} onValueChange={setLocationOption}>
                      <SelectTrigger className="flex-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
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
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      Find Nearby
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <p className="w-full text-sm text-slate-500 mb-2">Filter by specialty:</p>
                    {SPECIALTIES.map((specialty) => (
                      <Button
                        key={specialty}
                        variant={selectedSpecialty === specialty ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={
                          selectedSpecialty === specialty
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "text-slate-700 border-slate-300 hover:bg-slate-100"
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

        <Card className="bg-white shadow-lg border-slate-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {isMobile ? (
                <div className="flex flex-col h-[calc(100vh-300px)]">
                  <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
                      <Stethoscope className="h-5 w-5" />
                      Available Doctors
                    </h2>
                  </div>

                  {/* Mobile view with map and list */}
                  <div className="flex flex-col h-full">
                    <div className="h-[200px] w-full">
                      <DynamicMap center={mapCenter} doctors={doctors} />
                    </div>

                    <div className="flex-grow overflow-y-auto p-4">
                      {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
                      )}

                      <div className="space-y-4">
                        {doctors.length === 0 && !error && !loading ? (
                          <div className="text-center py-8 text-slate-500">
                            <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p>Search for doctors or select a location to find nearby healthcare professionals</p>
                          </div>
                        ) : (
                          doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[calc(100vh-300px)]">
                  <div className="w-1/2 border-r border-slate-200">
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
                        <MapPin className="h-5 w-5" />
                        Doctor Locations
                      </h2>
                    </div>
                    <div className="h-[calc(100%-64px)]">
                      <DynamicMap center={mapCenter} doctors={doctors} />
                    </div>
                  </div>

                  <div className="w-1/2">
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
                        <Stethoscope className="h-5 w-5" />
                        Available Doctors
                      </h2>
                    </div>

                    <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                      {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
                      )}

                      <div className="space-y-4">
                        {doctors.length === 0 && !error && !loading ? (
                          <div className="text-center py-8 text-slate-500">
                            <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p>Search for doctors or select a location to find nearby healthcare professionals</p>
                          </div>
                        ) : (
                          doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-80 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="mt-4 text-indigo-700 font-medium">Searching for doctors...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

