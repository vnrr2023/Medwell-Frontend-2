"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, AuthTitle, AuthDescription, AuthMessage } from "@/components/auth/auth-components"
import { useAuth } from "@/services/useAuth"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signup, googleLogin, errorMessage, setErrorMessage, checkAuth } = useAuth()
  const params = useParams()
  const role = params.role as string

  useEffect(() => {
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await signup(formData.email, formData.password, formData.confirmPassword, formData.fullName, role)
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

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      // Implement Google signup logic here
      // For now, we'll just call the googleLogin function
      await googleLogin("google_credential", role)
    } finally {
      setIsLoading(false)
    }
  }

  type RoleInfo = {
    title: string;
    description: string;
    image: string;
  };

  const defaultRoleInfo: RoleInfo = {
    title: "Create an account",
    description: "Enter your details to create your patient account",
    image: "/auth/p_signup.jpg",
  };

  const roleInfo: RoleInfo =
    {
      patient: {
        title: "Create an account",
        description: "Enter your details to create your patient account",
        image: "/auth/p_signup.jpg",
      },
      doctor: {
        title: "Doctor Registration",
        description: "Create your medical practitioner account",
        image: "/auth/d_signup.jpg",
      },
      hospital: {
        title: "Hospital Registration",
        description: "Register your hospital in our network",
        image: "/auth/h_signup.jpg",
      },
    }[role] || defaultRoleInfo;

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
              src={roleInfo.image || "/placeholder.svg"}
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
                &quot;Join our network of healthcare providers and patients to experience the future of medical care.&quot;
              </p>
              <footer className="text-sm">Dr. James Wilson</footer>
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
            <AuthTitle>{roleInfo.title}</AuthTitle>
            <AuthDescription>{roleInfo.description}</AuthDescription>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && <div className="text-sm text-red-500 text-center">{errorMessage}</div>}

              <div className="space-y-2">
                <Label htmlFor="fullName">{role === "hospital" ? "Hospital Name" : "Full Name"}</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
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
                    className="pl-10"
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
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
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
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <AuthMessage>
              Already have an account?{" "}
              <Link href={`/auth/${role}/login`} className="text-primary hover:underline underline-offset-4">
                Sign in
              </Link>
            </AuthMessage>
          </AuthCard>
        </motion.div>
      </div>
    </div>
  )
}

