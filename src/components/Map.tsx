import { MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

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

interface MapProps {
  center: [number, number]
  doctors: Doctor[]
}

const DoctorIcon = new L.Icon({
  iconUrl: "/logo.png",
  iconAnchor: [40, 60],
  popupAnchor: [0, -60],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  iconSize: [80, 100],
})

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, 13)
  return null
}

export default function Map({ center, doctors }: MapProps) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} className="z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater center={center} />
      {doctors.map((doctor) => (
        <Marker key={doctor.id} position={[doctor.data.location.lat, doctor.data.location.lon]} icon={DoctorIcon}>
          <Tooltip direction="top" offset={[0, -60]} opacity={1} permanent={false} className="custom-tooltip">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800">{doctor.data.name}</h3>
              <p className="text-sm text-teal-600">{doctor.data.speciality}</p>
              <p className="text-xs text-gray-600">{doctor.data.address}</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
      {doctors.length === 0 && (
        <Marker position={center} icon={DoctorIcon}>
          <Tooltip direction="top" offset={[0, -60]} opacity={1} permanent={false} className="custom-tooltip">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800">No doctors found</h3>
              <p className="text-sm text-teal-600">Try adjusting your search criteria</p>
            </div>
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  )
}

