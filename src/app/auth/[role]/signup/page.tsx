"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, Mail, Lock, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, AuthTitle, AuthDescription, AuthMessage } from "@/components/auth/auth-components"
import { useAuth } from "@/services/useAuth"
import { cn } from "@/lib/utils"
import Image from "next/image"
interface GoogleResponse {
  credential: string;
}
interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const roleInfo = {
  patient: {
    title: "Create Patient Account",
    description: "Join our healthcare platform to manage your medical journey",
    image: "/auth/p_signup.jpg",
    gradient: "from-blue-600 to-indigo-600",
  },
  doctor: {
    title: "Doctor Registration",
    description: "Create your professional medical practice account",
    image: "/auth/d_signup.jpg",
    gradient: "from-indigo-600 to-purple-600",
  },
  hospital: {
    title: "Hospital Registration",
    description: "Set up your hospital's digital presence",
    image: "/auth/h_signup.jpg",
    gradient: "from-purple-600 to-blue-600",
  },
}

export default function SignupPage() {
  const { role } = useParams()
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signup, googleLogin, errorMessage, setErrorMessage, checkAuth } = useAuth()

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_URL!,
          callback: handleCallbackResponse
        })
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large", width: window.innerWidth < 768 ? 300 : 400 }
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
  }, [])
  

  const handleCallbackResponse = async (response: GoogleResponse) => {
    setIsLoading(true)
    try {
      if (typeof role === 'string') {
        await googleLogin(response.credential, role)
      } else {
        setErrorMessage("Invalid role.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      if (typeof role === 'string') {
        const val=await signup(formData.email, formData.password, formData.confirmPassword, formData.fullName, role)
        if(val){
          window.location.href = `/${role}`
        }
      } else {
        setErrorMessage("Invalid role.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return false
    }
    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return false
    }
    return true
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container relative flex-1 flex items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
              className="object-cover"
              priority
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-20 mt-auto"
          >
            <blockquote className="space-y-2">
              <p className="text-xl text-black">
                &quot;Join our network of healthcare providers and patients to experience the future of medical
                care.&quot;
              </p>
              <footer className="text-sm text-blue-700">Dr. James Wilson - Chief Medical Officer</footer>
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

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{role === "hospital" ? "Hospital Name" : "Full Name"}</Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={cn(
                        "pl-10",
                        "border-input/50 bg-white/50 backdrop-blur-sm",
                        "focus:bg-white focus:border-blue-500",
                      )}
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
                  {isLoading ? "Creating Account..." : "Create Account"}
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

              <div id="signInDiv" className="flex justify-center" />

              <AuthMessage>
                Already have an account?{" "}
                <Link
                  href={`/auth/${role}/login`}
                  className={cn(
                    "font-medium transition-colors",
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    roleInfo[role as keyof typeof roleInfo]?.gradient || "from-blue-600 to-indigo-600",
                  )}
                >
                  Sign in
                </Link>
              </AuthMessage>
            </AuthCard>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

