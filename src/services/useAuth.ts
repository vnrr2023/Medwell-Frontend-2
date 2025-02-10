import { useState } from "react"
import { useRouter } from "next/navigation"

export const API_URL = "https://084f-2402-3a80-166a-df3a-65ad-a0fe-41d4-96ff.ngrok-free.app"

export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const notifyAuthStateChange = () => {
    window.dispatchEvent(new Event("authStateChange"))
  }

  const login = async (email: string, password: string, role: string) => {
    setErrorMessage("")
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const response = await fetch(`${API_URL}/auth/login_user/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.mssg === "Incorrect Credentials" && data.status === 0) {
        setErrorMessage("Incorrect email or password. Please try again.")
        return false
      } else {
        localStorage.setItem("Token", data.access_token)
        localStorage.setItem("Role", role)
        notifyAuthStateChange()
        router.push("/patient")
        return true
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.")
      return false
    }
  }

  const signup = async (email: string, password: string, confirmPassword: string, fullName: string, role: string) => {
    setErrorMessage("")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password1", password)
    formData.append("password2", confirmPassword)
    formData.append("role", role)
    formData.append("name", fullName)

    try {
      const response = await fetch(`${API_URL}/auth/register_user/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.status === false) {
        setErrorMessage(data.mssg)
        return false
      } else {
        localStorage.setItem("Token", data.access_token)
        localStorage.setItem("Role", role)
        notifyAuthStateChange()
        router.push("/patient")
        return true
      }
    } catch {
      setErrorMessage("An error occurred during sign-up. Please try again.")
      return false
    }
  }

  const googleLogin = async (credentials:string, role: string) => {
    setErrorMessage("")
    const formData = new FormData()
    formData.append("token", credentials)
    formData.append("role", role)

    try {
      const response = await fetch(`${API_URL}/auth/google_login/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      localStorage.setItem("Token", data.access)
      localStorage.setItem("Role", role)
      notifyAuthStateChange()
      router.push("/patient")
      return true
    } catch {
      setErrorMessage("An error occurred during Google login. Please try again.")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    notifyAuthStateChange()
    router.push("/auth")

  }

  const checkAuth = () => {
    const token = localStorage.getItem("Token")
    if (token) {
      router.push("/patient")
      return true
    }
    return false
  }

  return {
    login,
    signup,
    googleLogin,
    logout,
    checkAuth,
    errorMessage,
    setErrorMessage,
  }
}

