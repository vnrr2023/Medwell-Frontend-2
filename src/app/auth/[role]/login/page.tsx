"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, AuthTitle, AuthDescription, AuthMessage } from "@/components/auth/auth-components"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "@/services/useAuth"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
          prompt: (callback: (notification: GoogleNotification) => void) => void;
        }
      }
    }
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleResponse) => void;
}

interface GoogleResponse {
  credential: string;
}

interface GoogleNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

const roleInfo = {
  patient: {
    title: "Welcome back!",
    description: "Enter your email to sign in to your account",
    image: "/auth/p_login.jpg",
  },
  doctor: {
    title: "Doctor Login",
    description: "Sign in to access your medical practice",
    image: "/auth/d_login.jpg",
  },
  hospital: {
    title: "Hospital Portal",
    description: "Access your hospital management system",
    image: "/auth/h_login.jpg",
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
  const currentRoleInfo = roleInfo[role as keyof typeof roleInfo] || roleInfo.patient
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    handleResize()
    
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_URL!,
          callback: handleCallbackResponse
        })
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large", width: isMobile ? 300 : 400 }
        )
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    const loadGoogleScript = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
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
    try {
      await googleLogin(response.credential, role)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password, role)
  }

  return (
    <div className="pt-16">
      <div className="container relative min-h-screen flex items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
        >
          <div className="absolute inset-0">
            <Image
              src={currentRoleInfo.image || "/placeholder.svg"}
              alt="Authentication"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-blue-900/50" />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/" className="flex items-center">
              <span className="text-white">Medwell</span>
              <span className="text-blue-300">AI</span>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-20 mt-auto"
          >
            <blockquote className="space-y-2">
              <p className="text-lg">
                &quot;Revolutionizing healthcare with AI-powered solutions, making medical records more accessible and
                secure.&quot;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:p-8"
        >
          <AuthCard>
            <AuthTitle>{currentRoleInfo.title}</AuthTitle>
            <AuthDescription>{currentRoleInfo.description}</AuthDescription>

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
                    className={cn("pl-10")}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full hover:bg-gray-200">
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground"><span className="bg-gray-100 p-2">or</span></span>
              </div>
            </div>

            <div id="signInDiv" className="flex justify-center" />

            <AuthMessage>
              Don&apos;t have an account?{" "}
              <Link href={`/auth/${role}/signup`} className="text-primary hover:underline underline-offset-4">
                Sign up
              </Link>
            </AuthMessage>
          </AuthCard>
        </motion.div>
      </div>
    </div>
  )
}