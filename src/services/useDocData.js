'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ngrok_url2, ngrok_url_m } from './api';
import { mToken as Token } from './api';
const API_URL = ngrok_url_m+"/"
export function useDocData() {
  const token=Token
  const [doctorInfo, setDoctorInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const fetchDoctorInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}doctor/data/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      const { doctor_info, ...otherData } = response.data;

      setDoctorInfo({
        name: otherData.name || "",
        email: doctor_info?.email || "",
        phone: otherData.phone_number || "",
        specialization: otherData.speciality || "",
        profilePicture: API_URL + otherData.profile_pic || './doctorpfp(female).png',
        registrationNumber: otherData.registeration_number || '',
        verified: otherData.verified || false,
        submittedAt: otherData.submitted_at || '',
      });
      console.log("Doctor info fetched successfully:", doctorInfo);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await axios.get(`${API_URL}doctor/data/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      setAddresses(response.data.addresses || []);
      console.log("Addresses fetched successfully:", response.data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const addNewAddress = async (newAddress, newAddressType) => {
    try {
      await axios.post(`${API_URL}doctor/add_doctor_address`, {
        address: newAddress,
        address_type: newAddressType,
        "timings":{
          "end":"18:00",
          "start":"09:00"
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const updateDoctorInfo = async (updatedInfo) => {
    try {
      await axios.post(`${API_URL}doctor/save_doctor_data`, updatedInfo, {
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
      const formData = new FormData();
      
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append('file', files[key]);
          formData.append('mm_type', key);
        }
      });

      await axios.post(`${API_URL}doctor/save_doctor_multi_media_data`, formData, {
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
