"use client"

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react"
import {
  X,
  Send,
  Mic,
  Copy,
  RotateCcw,
  Heart,
  Paperclip,
  ImageIcon,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  Settings,
} from "lucide-react"
import DaddyAPI from "@/services/api"
import type { AxiosError } from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"

// Move these declarations inside the component
interface Message {
  text: string
  sender: "user" | "bot"
  isTyping?: boolean
}

interface ChatResponse {
  data: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechGrammarList: any
    webkitSpeechGrammarList: any
  }
}

export default function ChatArogya() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)

  // Add refs for speech APIs
  const speechRecognitionRef = useRef<any>(null)
  const synthesisRef = useRef<any>(null)

  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const cycleRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Initialize browser APIs safely
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

      if (SpeechRecognition) {
        speechRecognitionRef.current = new SpeechRecognition()
        speechRecognitionRef.current.continuous = false
        speechRecognitionRef.current.interimResults = true
        speechRecognitionRef.current.lang = "en-US"
      }

      synthesisRef.current = window.speechSynthesis
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

  const toggleChat = async (): Promise<void> => {
    if (!isOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            text: "Hello! I'm ArogyaBot, your personal Ayurvedic wellness assistant. I can help you understand holistic health practices and provide guidance on natural remedies. How can I support your wellness journey today?",
            sender: "bot",
            isTyping: true,
          },
        ])
      }
    }
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value)
  }

  const sendMessageToBackend = async (message: string): Promise<string> => {
    setIsLoading(true)
    setError("")

    try {
      const response = await DaddyAPI.sendChatMessage2({
        question: message,
      })
      return response.data.response
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        throw new Error("Unauthorized: Access expired")
      }
      throw new Error("Error communicating with the server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (inputMessage.trim() && !isLoading) {
      const userMessage: Message = { text: inputMessage, sender: "user" }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInputMessage("")

      try {
        const botResponse = await sendMessageToBackend(inputMessage)
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot", isTyping: true }])
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && !isFullscreen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFullscreen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show a temporary tooltip or notification
    const tempToast = document.createElement("div")
    tempToast.className = "fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-2 rounded shadow-lg z-50"
    tempToast.textContent = "Copied to clipboard!"
    document.body.appendChild(tempToast)

    setTimeout(() => {
      document.body.removeChild(tempToast)
    }, 2000)
  }

  const handleRetry = (text: string) => {
    setInputMessage(text)
  }

  const toggleMicInput = () => {
    if (!speechRecognitionRef.current) {
      setError("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      speechRecognitionRef.current.stop()
      setIsListening(false)
    } else {
      setError("")
      setIsListening(true)

      speechRecognitionRef.current.start()

      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setInputMessage(transcript)
      }

      speechRecognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setError("Error with speech recognition: " + event.error)
        setIsListening(false)
      }

      speechRecognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }

  const toggleSpeakMessage = (text: string) => {
    if (!synthesisRef.current) {
      setError("Text-to-speech is not supported in your browser")
      return
    }

    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    if (!soundEnabled) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setError("Error with text-to-speech")
      setIsSpeaking(false)
    }

    setIsSpeaking(true)
    synthesisRef.current.speak(utterance)
  }

  useEffect(() => {
    return () => {
      if (synthesisRef.current?.speaking) {
        synthesisRef.current.cancel()
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort()
      }
    }
  }, [])

  // Typewriter effect for bot messages
  const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)
    const speed = 10 // milliseconds per character

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex(currentIndex + 1)
        }, speed)

        return () => clearTimeout(timer)
      } else if (onComplete) {
        onComplete()
      }
    }, [currentIndex, text, onComplete])

    return <>{displayText}</>
  }

  // Update messages when typing is complete
  useEffect(() => {
    const typingMessage = messages.find((m) => m.isTyping)
    if (typingMessage) {
      const index = messages.indexOf(typingMessage)
      // This will be called when typing is complete
      const updateMessageTypingStatus = () => {
        setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, isTyping: false } : msg)))
      }

      // We don't need to do anything here as the TypewriterText component
      // will handle the animation and call updateMessageTypingStatus when done
    }
  }, [messages])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (isSpeaking && !soundEnabled) {
      synthesisRef.current?.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <>
      {isOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 z-30"
    onClick={toggleChat}
  />
)}

<div className="fixed bottom-20 md:bottom-4 right-4 z-40">
  {isOpen ? (
    <div
      ref={chatRef}
      className="bg-white shadow-xl flex flex-col w-[350px] sm:w-[450px] md:w-[450px] h-[60vh] max-h-[760px] rounded-lg overflow-hidden"
    >

            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-3 sm:p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">ArogyaBot</h2>
                  <p className="text-xs text-teal-100">Your Ayurvedic wellness assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleSound}
                        className="text-white hover:bg-teal-600 p-1.5 rounded-full transition-colors"
                        aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                      >
                        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{soundEnabled ? "Disable sound" : "Enable sound"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-teal-600 p-1.5 rounded-full transition-colors"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleChat}
                        className="text-white hover:bg-teal-600 p-1.5 rounded-full transition-colors"
                        aria-label="Close chat"
                      >
                        <X size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-teal-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {message.sender === "bot" && (
                    <div className="relative w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shadow-sm">
                      <Heart className="w-4 h-4 text-teal-500" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-3 shadow-sm",
                      message.sender === "user"
                        ? "bg-teal-500 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none",
                    )}
                  >
                    {message.isTyping ? (
                      <TypewriterText
                        text={message.text}
                        onComplete={() => {
                          setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, isTyping: false } : msg)))
                        }}
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              message.sender === "user" ? handleRetry(message.text) : handleCopyMessage(message.text)
                            }
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={message.sender === "user" ? "Retry message" : "Copy message"}
                          >
                            {message.sender === "user" ? (
                              <RotateCcw className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{message.sender === "user" ? "Retry" : "Copy"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {message.sender === "bot" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleSpeakMessage(message.text)}
                              className={cn(
                                "p-1 hover:bg-gray-100 rounded-full transition-colors",
                                isSpeaking && "text-teal-500 animate-pulse",
                              )}
                              aria-label="Speak message"
                              disabled={!soundEnabled}
                            >
                              <Mic className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isSpeaking ? "Stop speaking" : "Speak"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
              {error && (
                <div className="text-red-500 text-center p-2 bg-red-50 rounded-lg border border-red-200">{error}</div>
              )}
              {isLoading && (
                <div className="flex justify-center items-center p-4">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="border-t p-3 sm:p-4 flex gap-2 bg-white">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="w-full border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={toggleMicInput}
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            isListening
                              ? "text-teal-500 animate-pulse bg-teal-50"
                              : "text-gray-400 hover:text-teal-500 hover:bg-gray-100",
                          )}
                          aria-label="Toggle microphone"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isListening ? "Stop listening" : "Voice input"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      className={cn(
                        "rounded-full w-10 h-10 flex items-center justify-center p-0 bg-teal-500 hover:bg-teal-600",
                        isLoading && "opacity-50 cursor-not-allowed",
                      )}
                      aria-label="Send message"
                      disabled={isLoading}
                    >
                      <Send size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className={cn(
              "bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out",
              isExpanded ? "px-4 py-3" : "p-3",
            )}
            aria-label="Open chat report"
          >
            <div className="flex items-center z-30">
              <Heart size={24} className={cn("transition-all", isExpanded ? "mr-2" : "")} />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0",
                )}
              >
                Chat with ArogyaBot
              </span>
            </div>
          </button>
        )}
      </div>
    </>
  )
}
