"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ngrok_url2, ngrok_url, ngrok_url_appointment } from "./api"
import { Token as token } from "./api"
const API_URL = ngrok_url_appointment+"/"
const API_URL2 = ngrok_url_main+"/"

const useDocData = () => {

  const [doctorInfo, setDoctorInfo] = useState({})
  const [addresses, setAddresses] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(true)

  const fetchDoctorInfo = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}doctor/data/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })

      const data = response.data

      setDoctorInfo({
        name: data.name || "",
        email: data.user?.email || "",
        phone: data.phoneNumber || "",
        speciality: data.speciality || "",
        profilePicture: data.profilePic ? API_URL + data.profilePic : "./doctorpfp(female).png",
        registrationNumber: data.registerationNumber || "",
        verified: data.verified || false,
        submittedAt: data.submittedAt || "",
        education: data.education || "",
        profileQr:data.profileQr
      })
      console.log("Doctor info fetched successfully:", data)
    } catch (error) {
      console.error("Error fetching doctor info:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true)
      const response = await axios.get(`${API_URL}doctor/data/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })

      setAddresses(response.data || [])
      console.log("Addresses fetched successfully:", response.data)
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setAddressesLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      setServicesLoading(true)
      const response = await axios.get(`${API_URL}doctor/data/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })

      setServices(response.data || [])
      console.log("Services fetched successfully:", response.data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setServicesLoading(false)
    }
  }

  const addNewAddress = async (addressData) => {
    try {
      await axios.post(`${API_URL}doctor/data/addresses`, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })
      fetchAddresses()
    } catch (error) {
      console.error("Error adding new address:", error)
    }
  }

  const updateDoctorInfo = async (doctorInfo) => {
    try {
      await axios.post(`${API_URL2}doctor/save_doctor_data`, doctorInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })
      fetchDoctorInfo()
    } catch (error) {
      console.error("Error updating doctor info:", error)
    }
  }

  const uploadMultimedia = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}doctor/data/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "69420",
        },
      })
      fetchDoctorInfo()
      return response.data
    } catch (error) {
      console.error("Error uploading multimedia:", error)
      throw error
    }
  }

  const addService = async (serviceName, amount) => {
    try {
      await axios.post(
        `${API_URL}doctor_service/add_service`,
        {
          service_name: serviceName,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      )

      await fetchServices()
    } catch (error) {
      console.error("Error adding service:", error)
    }
  }

  const updateService = async (serviceId, serviceName, amount) => {
    try {
      await axios.post(
        `${API_URL}doctor_service/update_service`,
        {
          service_id: serviceId,
          service_name: serviceName,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      )

      await fetchServices()
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  const deleteService = async (serviceId) => {
    try {
      await axios.post(
        `${API_URL}doctor_service/delete_service`,
        {
          service_id: serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      )

      await fetchServices()
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  useEffect(() => {
    fetchDoctorInfo()
    fetchAddresses()
    fetchServices()
  }, [])

  return {
    doctorInfo,
    addresses,
    services,
    loading,
    addressesLoading,
    servicesLoading,
    fetchDoctorInfo,
    fetchAddresses,
    fetchServices,
    addNewAddress,
    updateDoctorInfo,
    uploadMultimedia,
    addService,
    updateService,
    deleteService,
  }
}

export default useDocData

