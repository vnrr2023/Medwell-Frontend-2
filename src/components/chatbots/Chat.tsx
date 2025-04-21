import React, { useState, useEffect, useRef } from 'react'
import { Bot, X } from 'lucide-react'

interface ChatProps {
  // Add any props if needed in the future
}

export default function Chat({}: ChatProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false)
  
  const chatRef = useRef<HTMLDivElement | null>(null)
  const cycleRef = useRef<NodeJS.Timeout | null>(null)

  const toggleChat = (): void => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIframeLoaded(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIframeLoaded(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const expandCycle = (): void => {
      setIsExpanded(true)
      setTimeout(() => {
        setIsExpanded(false)
      }, 7000)
    }

    const startCycle = (): void => {
      expandCycle()
      cycleRef.current = setInterval(() => {
        expandCycle()
      }, 17000)
    }

    if (!isOpen) {
      startCycle()
    }

    return () => {
      if (cycleRef.current) {
        clearInterval(cycleRef.current)
      }
    }
  }, [isOpen])

  return (
    <div className="fixed bottom-20 right-4 z-50" ref={chatRef}>
      {isOpen ? (
        <div className="bg-blue-400 rounded-lg shadow-xl w-[350px] h-[430px] flex flex-col overflow-hidden">
          <div className="bg-blue-500 text-white p-2 flex justify-end items-center">
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <iframe
              allow="microphone;"
              width="100%"
              height="100%"
              src="https://console.dialogflow.com/api-client/demo/embedded/23f22ced-19cc-4886-832d-3f7ca260a6c6"
              className={`w-full h-full ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIframeLoaded(true)}
              title="Agasthya"
            ></iframe>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden h-12 ${
            isExpanded ? 'w-48' : 'w-12'
          }`}
          aria-label="Open chat"
        >
          {isExpanded ? (
            <>
              <Bot size={24} className="mr-2" />
              <span className="whitespace-nowrap transition-opacity duration-300">
                Chat with Agasthya
              </span>
            </>
          ) : (
            <Bot size={24} />
          )}
        </button>
      )}
    </div>
  )
}