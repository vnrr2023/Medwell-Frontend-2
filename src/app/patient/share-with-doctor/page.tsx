"use client"

import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { motion } from 'framer-motion';
import { Camera, Link, Shield, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { AxiosError } from 'axios';
import DaddyAPI from '@/services/api';
import Chat from '@/components/chatbots/Chat';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ChatArogya from '@/components/chatbots/ChatArogya';

interface StatusState {
  type: 'success' | 'error' | null;
  message: string;
}

export default function ShareWithDoctor() {
  const [scanResult, setScanResult] = useState<string>('');
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusState>({
    type: null,
    message: ''
  });
  const [inputData, setInputData] = useState<string>('');

  const handleScan = async (result: string | null) => {
    if (result) {
      setScanResult(result);
      setIsScannerVisible(false);
      await handleProvideAccess(result);
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    setStatus({
      type: 'error',
      message: 'Failed to access camera. Please ensure camera permissions are granted.'
    });
  };

  const handleProvideAccess = async (encData: string): Promise<void> => {
    setStatus({ type: null, message: '' });

    try {
      const response = await DaddyAPI.provideAccess({ enc_data: encData });
      
      setStatus({
        type: 'success',
        message: response.data.mssg
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ mssg: string }>;
      setStatus({
        type: 'error',
        message: axiosError.response?.data?.mssg || 
                'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputData) {
      await handleProvideAccess(inputData);
      setScanResult(inputData);
      setInputData('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-blue-100"
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6 text-center"
            >
              Share Information with Your Doctor
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg text-blue-600 mb-6 sm:mb-8 text-center"
            >
              Scan a QR code OR enter encoded data to share your medical information securely with your healthcare provider.
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center mb-6 sm:mb-8"
            >
              <div className="flex flex-col items-center justify-center gap-4 mb-4">
                <Button
                  onClick={() => setIsScannerVisible(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <Camera className="mr-2" />
                  Scan QR Code
                </Button>
                <span className="text-blue-600 font-bold">OR</span>
                <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter encoded data"
                    value={inputData}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />
                  <Button type="submit" variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </form>
              </div>
              {isScannerVisible && (
                <div className="w-full max-w-sm">
                  <QrReader
                    constraints={{
                      facingMode: 'environment'
                    }}
                    onResult={(result, error) => {
                      if (result) {
                        handleScan(result.getText());
                      }
                      if (error) {
                        handleError(error);
                      }
                    }}
                    className="rounded-lg overflow-hidden"
                    containerStyle={{ borderRadius: '0.5rem' }}
                    videoStyle={{ borderRadius: '0.5rem' }}
                  />
                </div>
              )}
            </motion.div>

            {scanResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-6 bg-blue-50 p-4 rounded-lg"
              >
                <p className="text-lg font-semibold mb-2 text-blue-800">Encoded Data:</p>
                <p className="text-blue-600 break-all flex items-center justify-center">
                  <Link className="mr-2" />
                  {scanResult}
                </p>
              </motion.div>
            )}

            {status.type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mt-4 p-4 rounded-md ${
                  status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {status.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{status.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-center text-blue-600 bg-blue-50 p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-center mb-2">
            <Shield className="text-blue-500 mr-2" />
            <p className="text-lg font-semibold">Secure Information Sharing</p>
          </div>
          <p className="text-sm sm:text-base">
            Sharing your medical information has never been easier or more secure.
            <br className="hidden sm:inline" />
            Your privacy is our top priority.
          </p>
        </motion.div>
      </div>
      <div className="mt-8">
        <ChatArogya/>
      </div>
    </div>
  );
}