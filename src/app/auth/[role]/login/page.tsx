"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/services/useAuth"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void
          renderButton: (element: HTMLElement | null, options: any) => void
          prompt: (callback: (notification: GoogleNotification) => void) => void
        }
      }
    }
  }
}

interface GoogleConfig {
  client_id: string
  callback: (response: GoogleResponse) => void
}

interface GoogleResponse {
  credential: string
}

interface GoogleNotification {
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const role = params.role as string
  const { login, googleLogin } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_URL!,
          callback: handleCallbackResponse,
        })
        window.google.accounts.id.renderButton(document.getElementById("signInDiv"), {
          theme: "outline",
          size: "large",
          width: isMobile ? 300 : 400,
        })
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    const loadGoogleScript = () => {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        script.onload = initializeGoogleSignIn
      } else {
        initializeGoogleSignIn()
      }
    }

    loadGoogleScript()
  }, [isMobile])

  const handleCallbackResponse = async (response: GoogleResponse) => {
    setIsLoading(true)
    setError(null)
    try {
      const val=await googleLogin(response.credential, role)
       if (val) {
        window.location.href = `/${role}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const val = await login(email, password, role)
      if (val) {
        window.location.href = `/${role}`
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col">
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 h-[245px] bg-[#B7A6F3] rounded-b-full" />

          <div className="relative pt-8 px-6 flex flex-col items-center">
            <h1 className="text-[#2D2D2D] text-3xl font-bold mb-3">Login</h1>
            <Image
              src="/auth/login_mobile.png"
              alt="Login illustration"
              width={160}
              height={160}
              className="w-40 h-40 object-contain mb-0"
            />

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 px-6">
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gmail.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-gray-600">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#FFF5F5] text-gray-500">or</span>
                </div>
              </div>

              <div id="signInDiv" className="flex justify-center"></div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link href={`/auth/${role}/signup`} className="text-[#7C3AED] font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-[#2D2D2D] text-4xl font-bold mb-8">Welcome Back!!</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-600">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FFF5F5] text-gray-500">or</span>
              </div>
            </div>

            <div id="signInDiv" className="flex justify-center"></div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link href={`/auth/${role}/signup`} className="text-[#7C3AED] font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-[#F5F0FF] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 w-[70%] bg-[#B7A6F3] rounded-t-full -translate-x-[-120px] translate-y-20" />
        </div>
        <Image
          src="/auth/login.png"
          alt="Doctor"
          width={400}
          height={600}
          className="relative w-[30%] h-auto object-contain"
        />
      </div>
    </div>
  )
}
