import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useValidate = (token: string) => {
  const [status, setStatus] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validate = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/validate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Checking: "OK" }),
        })
        const data = await response.json()
        setStatus(data.status)
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }
    validate()
  }, [token])

  return { error, isLoading, status }
}

