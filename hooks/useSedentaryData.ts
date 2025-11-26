import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface SedentaryProfile {
  age: number
  gender: string
  motivation: string
  primaryGoal: string
  currentActivityLevel: string
  availableTime: string
  preferredActivities: string[]
}

interface SedentaryData {
  profile: SedentaryProfile | null
  aiProgram: string | null
}

export function useSedentaryData() {
  const { data: session } = useSession()
  const [data, setData] = useState<SedentaryData>({ profile: null, aiProgram: null })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!session) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/sedentary", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        setData({
          profile: result.data.profile,
          aiProgram: result.data.aiProgram
        })
      } else {
        setError(result.message || "Erro ao carregar dados")
      }
    } catch (err) {
      console.error("Erro ao buscar dados sedentários:", err)
      setError("Erro ao conectar com o servidor")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}