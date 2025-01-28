import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { FileText, X, Send } from 'lucide-react'
import DaddyAPI from '@/services/api'
import { AxiosError } from 'axios'

interface Message {
  text: string
  sender: 'user' | 'bot'
}

interface AgentResponse {
  key: string
}

interface ChatResponse {
  data: string
}

export default function ChatReport(){
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [agentKey, setAgentKey] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const cycleRef = useRef<NodeJS.Timeout | null>(null)

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

  const checkAndCreateAgent = async (): Promise<void> => {
    console.log("Checking and creating agent if necessary")
    const storedTimestamp = localStorage.getItem('chatbotTimestamp')
    const storedKey = localStorage.getItem('chatbotKey')
    const currentTime = new Date().getTime()

    if (!storedTimestamp || !storedKey || currentTime - parseInt(storedTimestamp) > 15 * 60 * 1000) {
      try {
        const response = await DaddyAPI.createChatAgent()
        localStorage.setItem('chatbotKey', response.data.key)
        localStorage.setItem('chatbotTimestamp', currentTime.toString())
        setAgentKey(response.data.key)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setError('Unauthorized: Invalid token')
        } else {
          setError('Error creating agent')
        }
      }
    } else {
      setAgentKey(storedKey)
    }
  }

  const toggleChat = async (): Promise<void> => {
    if (!isOpen) {
      await checkAndCreateAgent()
      if (messages.length === 0) {
        setMessages([{
          text: "Hello! I'm MedBuddy, your personal health assistant. I can help you understand your medical reports and health trends. For example, I can explain your hemoglobin trends or interpret other lab results. How can I assist you today?",
          sender: 'bot'
        }])
      }
    }
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value)
  }

  const sendMessageToBackend = async (message: string): Promise<string> => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await DaddyAPI.sendChatMessage({
        key: agentKey,
        question: message
      })
      return response.data.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        throw new Error('Unauthorized: Access expired')
      }
      throw new Error('Error communicating with the server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (inputMessage.trim() && !isLoading) {
      const userMessage: Message = { text: inputMessage, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInputMessage('')

      try {
        const botResponse = await sendMessageToBackend(inputMessage)
        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }])
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
          if (error.message === 'Unauthorized: Access expired') {
            await checkAndCreateAgent()
            if (agentKey) {
              const botResponse = await sendMessageToBackend(inputMessage)
              setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }])
            }
          }
        }
      }
    }
  }

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleChat} />
      )}
      <div className="fixed bottom-20 right-4 z-40">
        {isOpen ? (
          <div 
            ref={chatRef}
            className="bg-white shadow-xl flex flex-col w-full sm:w-[450px] h-[80vh] max-h-[800px] rounded-lg overflow-hidden"
          >
            <div className="bg-green-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">MedBuddy</h2>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}
              {isLoading && (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-green-500 text-white rounded-r-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                aria-label="Send message"
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className={`bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out ${
              isExpanded ? 'px-4 py-3' : 'p-3'
            }`}
            aria-label="Open chat report"
          >
            <div className="flex items-center">
              <FileText size={24} className={isExpanded ? 'mr-2' : ''} />
              <span 
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                Chat with MedBuddy
              </span>
            </div>
          </button>
        )}
      </div>
    </>
  )
}