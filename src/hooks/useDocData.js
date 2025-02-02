import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL

const dummyDoctorInfo = {
  name: "Dr. Rehan",
  specialization: "General Practitioner",
  email: "Rehan.zooby_dooby@example.com",
  phone: "+1234567890",
  profilePicture: './doctorpfp(female).png',
  rating: 4.5,
  services: [
    { name: "Consultation", price: "Rs. 500" },
    { name: "Follow-up", price: "Rs. 300" },
    { name: "Emergency Visit", price: "Rs. 1000" }
  ],
  shortBio: "Experienced general practitioner with over 10 years of practice.",
  registrationNumber: 'MED123456',
  verified: true,
  submittedAt: '2023-01-01T00:00:00Z'
};

const dummyAddresses = [
  {
    address_type: "work",
    address: "123 Medical Center, Downtown, City",
    lat: "40.7128",
    lon: "-74.0060",
  },
  {
    address_type: "home",
    address: "456 Residential Ave, Suburb, City",
    lat: "40.7282",
    lon: "-73.7949",
  }
];

export function useDocData() {
  const [doctorInfo, setDoctorInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const fetchDoctorInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const response = await axios.get(`${API_URL}doctor/get_doctor_info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      const { doctor_info, ...otherData } = response.data;

      setDoctorInfo({
        name: otherData.name || "",
        email: doctor_info.email || "",
        phone: otherData.phone_number || "",
        specialization: otherData.speciality || "",
        profilePicture: ngrok_url+otherData.profile_pic || './doctorpfp(female).png',
        registrationNumber: otherData.registeration_number || '',
        verified: otherData.verified || false,
        submittedAt: otherData.submitted_at || '',
      });
      console.log("Doctor info fetched successfully:", doctorInfo);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      setDoctorInfo(dummyDoctorInfo);
      console.log("Using dummy doctor info:", dummyDoctorInfo);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("Token");
      const response = await axios.get(`${API_URL}doctor/get_doctor_addresses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      setAddresses(response.data.addresses || []);
      console.log("Addresses fetched successfully:", response.data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses(dummyAddresses);
      console.log("Using dummy addresses:", dummyAddresses);
    } finally {
      setAddressesLoading(false);
    }
  };

  const addNewAddress = async (newAddress, newAddressType) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.post(`${API_URL}doctor/add_doctor_address/`, {
        address: newAddress,
        address_type: newAddressType
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setAddresses(prev => [...prev, {
        address_type: newAddressType,
        address: newAddress,
        lat: "0",
        lon: "0"
      }]);
    }
  };

  const updateDoctorInfo = async (updatedInfo) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.post(`${API_URL}doctor/save_doctor_data/`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      await fetchDoctorInfo();
    } catch (error) {
      console.error('Error updating doctor info:', error);
    }
  };

  const uploadMultimedia = async (files) => {
    try {
      const token = localStorage.getItem("Token");
      const formData = new FormData();
      
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append('file', files[key]);
          formData.append('mm_type', key);
        }
      });

      await axios.post(`${ngrok_url}doctor/save_doctor_multi_media_data/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchDoctorInfo();
    } catch (error) {
      console.error('Error uploading multimedia:', error);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
    fetchAddresses();
  }, []);

  return {
    doctorInfo,
    addresses,
    loading,
    addressesLoading,
    fetchDoctorInfo,
    fetchAddresses,
    addNewAddress,
    updateDoctorInfo,
    uploadMultimedia,
  };
}

