"use client"

import type React from "react"
import { useState } from "react"
import {
  Mail,
  Phone,
  Edit2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  PhoneCall,
  Camera,
  PlusCircle,
  X,
  Trash2,
  Plus,
} from "lucide-react"
import  useDocData from "@/services/useDocData"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Address {
  address: string
  address_type: string
  lat: string
  lon: string
}

interface Service {
  id: string
  serviceName: string
  price: string
}

interface DoctorInfo {
  name: string
  specialization: string
  addresses: Address[]
  email: string
  phone: string
  profilePicture: string
  rating: number
  services: Service[]
  shortBio: string
  additionalComments: string
  registrationNumber: string
  verified: boolean
  submittedAt: string
}

export function DoctorProfile() {
  const {
    doctorInfo,
    addresses,
    services,
    loading,
    addressesLoading,
    servicesLoading,
    addNewAddress,
    updateDoctorInfo,
    uploadMultimedia,
    addService,
    updateService,
    deleteService,
  } = useDocData()

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState("")
  const [newAddressType, setNewAddressType] = useState("work")

  const [files, setFiles] = useState<{
    profile: File | null
    registration: File | null
    aadhar: File | null
    passport: File | null
  }>({
    profile: null,
    registration: null,
    aadhar: null,
    passport: null,
  })

  // Add state for service management
  const [newServiceName, setNewServiceName] = useState("")
  const [newServicePrice, setNewServicePrice] = useState("")
  const [editingService, setEditingService] = useState<Service | null>(null)

  const defaultDoctorInfo: DoctorInfo = {
    name: "",
    specialization: "",
    addresses: [],
    email: "",
    phone: "",
    profilePicture: "",
    rating: 0,
    services: [],
    shortBio: "",
    additionalComments: "",
    registrationNumber: "",
    verified: false,
    submittedAt: "",
  }

  const doctor: DoctorInfo = (doctorInfo as DoctorInfo) || defaultDoctorInfo

  // Add a function to handle service form submission
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      updateService(editingService.id, newServiceName, newServicePrice)
      setEditingService(null)
    } else {
      addService(newServiceName, newServicePrice)
    }
    setNewServiceName("")
    setNewServicePrice("")
  }

  // Add a function to set up service editing
  const handleEditService = (service: Service) => {
    setEditingService(service)
    setNewServiceName(service.serviceName)
    setNewServicePrice(service.price)
  }

  // Add a function to cancel service editing
  const handleCancelEdit = () => {
    setEditingService(null)
    setNewServiceName("")
    setNewServicePrice("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result as string)
        console.log("Profile picture updated:", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (type: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [type]: file,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    try {
      if (activeTab === "personal") {
        const updatedInfo = Object.fromEntries(formData.entries())
        console.log("Updating doctor info:", updatedInfo)
        await updateDoctorInfo({
          name: updatedInfo.name as string,
          email: updatedInfo.email as string,
          phone_number: updatedInfo.phone as string,
          specialty: updatedInfo.specialization as string,
          registeration_number: updatedInfo.registrationNumber as string,
        })
      }

      if (activeTab === "multimedia" && (files.profile || files.registration || files.aadhar || files.passport)) {
        console.log("Uploading multimedia files:", files)
        await uploadMultimedia(files)
      }

      setIsEditing(false)
      console.log("Profile updated successfully")
    } catch (error) {
      console.error("Error updating doctor info:", error)
    }
  }

  // Update the renderEditForm function to include services tab
  const renderEditForm = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className="space-y-6">
            <form onSubmit={handleServiceSubmit} className="flex items-center space-x-2 mb-6">
              <Input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Service name"
                className="flex-grow"
                required
              />
              <Input
                type="text"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                placeholder="Price"
                className="w-[120px]"
                required
              />
              <Button type="submit">{editingService ? "Update" : <Plus className="w-5 h-5" />}</Button>
              {editingService && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </form>

            {servicesLoading ? (
              <div className="text-center py-4">Loading services...</div>
            ) : (
              <div className="space-y-3">
                {services.map((service: Service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{service.serviceName}</p>
                      <p className="text-sm text-gray-500">₹{service.price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteService(service.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {services.length === 0 && <div className="text-center py-4 text-gray-500">No services added yet</div>}
              </div>
            )}
          </div>
        )
      case "address":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter full address"
                className="flex-grow"
              />
              <Select value={newAddressType} onValueChange={setNewAddressType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => addNewAddress({newAddress,newAddressType})}>
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
            {addressesLoading ? (
              <div className="text-center py-4">Loading addresses...</div>
            ) : (
              addresses.map((addr: Address, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {addr.address}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {addr.address_type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )
      case "personal":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={doctor.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={doctor.email} />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={doctor.phone} />
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input id="registrationNumber" name="registrationNumber" defaultValue={doctor.registrationNumber} />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" name="specialization" defaultValue={doctor.specialization} />
            </div>

            <div>
              <Label htmlFor="shortBio">Short Bio (Optional)</Label>
              <Textarea
                id="shortBio"
                name="shortBio"
                defaultValue={doctor.shortBio}
                placeholder="Enter your bio or leave empty for auto-generated bio"
              />
            </div>
          </>
        )
      case "multimedia":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={tempImage || doctor.profilePicture} alt="Profile" />
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="profilePicture"
                    className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Change Picture
                    <Input
                      id="profilePicture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="registrationCard">Registration Card</Label>
                <Label
                  htmlFor="registrationCard"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload registration card</p>
                  </div>
                  <Input
                    id="registrationCard"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("registration", e)}
                  />
                </Label>
              </div>

              <div>
                <Label htmlFor="aadharCard">Aadhar Card</Label>
                <Label
                  htmlFor="aadharCard"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload Aadhar card</p>
                  </div>
                  <Input
                    id="aadharCard"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("aadhar", e)}
                  />
                </Label>
              </div>

              <div>
                <Label htmlFor="passportPhoto">Passport Size Photo</Label>
                <Label
                  htmlFor="passportPhoto"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload passport photo</p>
                  </div>
                  <Input
                    id="passportPhoto"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("passport", e)}
                  />
                </Label>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    )
  }

  // Update the Tabs component to include services tab
  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 relative">
      {!isEditing ? (
        <Card className="relative z-10">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={doctor.profilePicture} alt={`Dr. ${doctor.name}`} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl font-semibold">Dr. {doctor.name}</h1>
                  <p className="text-gray-500 text-sm">{doctor.specialization}</p>
                  {doctor.verified && <Badge variant="default">Verified</Badge>}
                  <p className="text-gray-500 text-sm">Registration Number: {doctor.registrationNumber}</p>
                  <p className="text-gray-500 text-sm">Submitted At: {new Date(doctor.submittedAt).toLocaleString()}</p>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <div className="flex gap-2 mt-2">
                  <h3 className="text-sm font-medium mr-2">Social Media</h3>
                  <div className="flex gap-2">
                    {[
                      { Icon: Facebook, href: "#", color: "text-blue-600" },
                      { Icon: Instagram, href: "#", color: "text-pink-600" },
                      { Icon: Twitter, href: "#", color: "text-blue-400" },
                      { Icon: MessageCircle, href: "#", color: "text-blue-500" },
                      { Icon: PhoneCall, href: "#", color: "text-green-500" },
                      { Icon: Linkedin, href: "#", color: "text-blue-700" },
                    ].map(({ Icon, href, color }, index) => (
                      <a
                        key={index}
                        href={href}
                        className={cn("w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80", color)}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-3">Short Bio</h2>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    {doctor.shortBio ||
                      `I am ${doctor.name}, a dedicated ${doctor.specialization.toLowerCase()} with multiple practice locations. My practice combines evidence-based medicine with a patient-centered approach to ensure the best possible outcomes for my patients.`}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">$</span>
                    </span>
                    <h2 className="text-lg font-semibold">Services and price list</h2>
                  </div>
                  <div className="space-y-3 text-sm">
                    {servicesLoading ? (
                      <div className="text-center py-4">Loading services...</div>
                    ) : services.length > 0 ? (
                      services.map((service: Service) => (
                        <div key={service.id} className="flex justify-between items-center">
                          <span className="text-gray-600">{service.serviceName}</span>
                          <span className="font-medium">₹{service.price}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No services added yet</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Locations</h2>
                {addressesLoading ? (
                  <div className="text-center py-4">Loading addresses...</div>
                ) : (addresses || []).length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((addr: Address, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="capitalize">
                              {addr.address_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            <span>Lat: {addr.lat}, </span>
                            <span>Lon: {addr.lon}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No addresses found</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative z-10">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">Edit Profile</h2>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Basic Information</TabsTrigger>
                <TabsTrigger value="address">Address Information</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia Information</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSave} className="space-y-6">
                <TabsContent value={activeTab}>{renderEditForm()}</TabsContent>

                {activeTab !== "services" && (
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

