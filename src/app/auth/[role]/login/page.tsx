"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, AuthTitle, AuthDescription, AuthMessage } from "@/components/auth/auth-components"
import { cn } from "@/lib/utils"
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

const roleInfo = {
  patient: {
    title: "Welcome back!",
    description: "Enter your email to sign in to your account",
    image: "/auth/p_login.jpg",
    gradient: "from-blue-600 to-indigo-600",
  },
  doctor: {
    title: "Doctor Login",
    description: "Sign in to access your medical practice",
    image: "/auth/d_login.jpg",
    gradient: "from-indigo-600 to-purple-600",
  },
  hospital: {
    title: "Hospital Portal",
    description: "Access your hospital management system",
    image: "/auth/h_login.jpg",
    gradient: "from-purple-600 to-blue-600",
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const params = useParams()
  const role = params.role as string
  const { login, googleLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // const currentRoleInfo = roleInfo[role as keyof typeof roleInfo] || roleInfo.patient
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
          width: isMobile ? Math.min(280, window.innerWidth - 60) : 320,
          text: "signin_with",
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
      await googleLogin(response.credential, role)
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container relative flex-1 flex items-center justify-center py-8 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative hidden h-full flex-col p-10 text-white lg:flex",
            "before:absolute before:inset-0 before:bg-gradient-to-b",
            `before:${roleInfo[role as keyof typeof roleInfo]?.gradient || "from-blue-600 to-indigo-600"}`,
            "before:opacity-90 before:mix-blend-multiply",
          )}
        >
          <div className="absolute inset-0 bg-zinc-900/10">
            <Image
              src={roleInfo[role as keyof typeof roleInfo]?.image || "/placeholder.svg"}
              alt="Authentication"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-20 mt-auto"
          >
            <blockquote className="space-y-2 text-black">
              <p className="text-xl">
                &quot;Revolutionizing healthcare with AI-powered solutions, making medical records more accessible and
                secure.&quot;
              </p>
              <footer className="text-sm text-blue-700">Sofia Davis - Healthcare Technology Specialist</footer>
            </blockquote>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:p-8"
        >
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]">
            <AuthCard className="bg-white/95 backdrop-blur-sm">
              <AuthTitle>{roleInfo[role as keyof typeof roleInfo]?.title}</AuthTitle>
              <AuthDescription>{roleInfo[role as keyof typeof roleInfo]?.description}</AuthDescription>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "pl-10",
                        "border-input/50 bg-white/50 backdrop-blur-sm",
                        "focus:bg-white focus:border-blue-500",
                      )}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "pl-10",
                        "border-input/50 bg-white/50 backdrop-blur-sm",
                        "focus:bg-white focus:border-blue-500",
                      )}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className={cn(
                    "w-full text-white",
                    "bg-gradient-to-r shadow-lg transition-all duration-300",
                    roleInfo[role as keyof typeof roleInfo]?.gradient || "from-blue-600 to-indigo-600",
                    "hover:shadow-blue-500/25 hover:translate-y-[-1px]",
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div id="signInDiv" className="flex justify-center w-full px-2" />

              <AuthMessage>
                Don&apos;t have an account?{" "}
                <Link
                  href={`/auth/${role}/signup`}
                  className={cn(
                    "font-medium transition-colors",
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    roleInfo[role as keyof typeof roleInfo]?.gradient || "from-blue-600 to-indigo-600",
                  )}
                >
                  Sign up
                </Link>
              </AuthMessage>
            </AuthCard>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

