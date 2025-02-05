"use client"
import { useState, useCallback } from "react"
import { useMediaQuery } from "react-responsive"
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin, Search, Stethoscope, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DaddyAPI from "@/services/api"

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

interface MapUpdaterProps {
  center: [number, number]
}

interface DummyCoordinates {
  [key: string]: [number, number]
}

declare module "leaflet" {
  interface Layer {
    _leaflet_id?: number
  }
}

const DoctorIcon: L.Icon = new L.Icon({
  iconUrl: "/logo.png",
  iconAnchor: [40, 60],
  popupAnchor: [0, -60],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  iconSize: [80, 100],
})

interface MapContainerProps extends L.MapOptions {
  center: L.LatLngExpression
  zoom: number
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
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

function MapUpdater({ center }: MapUpdaterProps) {
  const map = useMap()
  map.setView(center, 13)
  return null
}

export default function DoctorSearch() {
  const [loading, setLoading] = useState<boolean>(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [locationOption, setLocationOption] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("No Specialty")

  const isMobile = useMediaQuery({ maxWidth: 767 })

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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 pt-20">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-teal-800 mb-4">Your Home for Health</h1>
            <p className="text-xl text-teal-600">Find the right doctor, right now</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Search className="h-5 w-5" />
                Find Doctors and Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg pb-4">
                  <TabsTrigger
                    value="search"
                    className="py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-md data-[state=active]:border-b-2 data-[state=active]:border-teal-500"
                  >
                    Search
                  </TabsTrigger>
                  <TabsTrigger
                    value="nearby"
                    className="py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-md data-[state=active]:border-b-2 data-[state=active]:border-teal-500"
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
                      className="flex-1 border-teal-200 focus:border-teal-400"
                    />
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="nearby">
                  <form onSubmit={handleLocationSearch} className="space-y-4">
                    <div className="flex gap-4">
                      <Select value={locationOption} onValueChange={setLocationOption}>
                        <SelectTrigger className="flex-1 border-teal-200 focus:border-teal-400">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Use current location</SelectItem>
                          {DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="submit" variant="secondary" className="bg-teal-100 text-teal-700 hover:bg-teal-200">
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
                              ? "bg-teal-500 hover:bg-teal-600 text-white"
                              : "text-teal-700 border-teal-200 hover:bg-teal-100"
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

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="relative">
                {isMobile ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-700">
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
                        <MapContainer
                          center={mapCenter}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                          className="z-0"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <MapUpdater center={mapCenter} />
                          {doctors.map((doctor) => (
                            <Marker
                              key={doctor.id}
                              position={[doctor.data.location.lat, doctor.data.location.lon]}
                              icon={DoctorIcon}
                            >
                              <Tooltip
                                direction="top"
                                offset={[0, -60]}
                                opacity={1}
                                permanent={false}
                                className="custom-tooltip"
                              >
                                <div className="p-2 bg-white rounded-lg shadow-md">
                                  <h3 className="font-bold text-teal-800">{doctor.data.name}</h3>
                                  <p className="text-sm text-teal-600">{doctor.data.speciality}</p>
                                  <p className="text-xs text-gray-600">{doctor.data.address}</p>
                                </div>
                              </Tooltip>
                            </Marker>
                          ))}
                          {doctors.length === 0 && (
                            <Marker position={mapCenter} icon={DoctorIcon}>
                              <Tooltip
                                direction="top"
                                offset={[0, -60]}
                                opacity={1}
                                permanent={false}
                                className="custom-tooltip"
                              >
                                <div className="p-2 bg-white rounded-lg shadow-md">
                                  <h3 className="font-bold text-teal-800">No doctors found</h3>
                                  <p className="text-sm text-teal-600">Try adjusting your search criteria</p>
                                </div>
                              </Tooltip>
                            </Marker>
                          )}
                        </MapContainer>
                      </div>
                    </div>

                    <div className="w-1/2">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-700">
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
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
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

interface DoctorCardProps {
  doctor: Doctor
}

const DoctorCard = ({ doctor }: DoctorCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-xl text-teal-800">{doctor.data.name}</h3>
        <p className="text-teal-600 font-medium mt-1">{doctor.data.speciality || "General Practice"}</p>
      </div>
      {doctor.data.rating && (
        <div className="bg-teal-50 px-3 py-1 rounded-full text-teal-700 font-medium">★ {doctor.data.rating}</div>
      )}
    </div>

    <div className="mt-4 space-y-2">
      <p className="text-gray-600 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-teal-500" />
        {doctor.data.address}
      </p>
      {doctor.data.availability && (
        <p className="text-gray-600 flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-500" />
          {doctor.data.availability}
        </p>
      )}
    </div>

    <Link href="/doctorsearch/appointment" className="block mt-6">
      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Book Appointment</Button>
    </Link>
  </div>
)

