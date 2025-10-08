import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Interface para os dados do perfil do usuário
export interface UserProfile {
  _id: string
  userId: string
  gender: string
  weight: number
  height: number
  daysPerWeek: number
  timePerDay: number
  // Campos específicos para cada tipo de programa
  painAreas?: string[]
  goal?: string
  fitnessLevel?: string
  dietType?: string
  // Dados de progresso
  progress: {
    caloriesGoal?: number
    caloriesConsumed?: number
    caloriesBurned?: number
    weightChange?: number
    stepsGoal?: number
    stepsToday?: number
    weeklyActivity?: number
    weeklyGoal?: number
    initialPainLevel?: number
    currentPainLevel?: number
    weeklyExercises?: number
    completedExercises?: number
    heartRate?: {
      resting: number
      initial: number
    }
    macros?: {
      protein: number
      carbs: number
      fat: number
    }
  }
  // Exercícios e atividades
  exercises?: Array<{
    _id: string
    name: string
    description: string
    duration: string
    completed: boolean
    date: Date
  }>
  activities?: Array<{
    _id: string
    name: string
    description: string
    duration: string
    completed: boolean
    date: Date
  }>
  workouts?: Array<{
    _id: string
    name: string
    description: string
    duration: string
    caloriesBurned: number
    completed: boolean
    date: Date
  }>
  meals?: Array<{
    _id: string
    name: string
    description: string
    calories: number
    date: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export type ProgramType = "rehabilitation" | "sedentary" | "training-diet"

export function useDashboard() {
  const [programType, setProgramType] = useState<ProgramType | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  const session = useSession()
  const router = useRouter()
  
  // Referência para controlar se já estamos buscando dados
  const isFetchingRef = useRef(false)
  // Referência para controlar se a sessão já foi atualizada
  const sessionUpdatedRef = useRef(false)

  // Função para marcar um exercício como concluído
  const markActivityAsCompleted = async (activityId: string) => {
    try {
      const response = await fetch("/api/activities/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          programType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Atualizar o estado local para refletir a mudança
        fetchUserData()
      } else {
        setError(data.message || "Erro ao marcar atividade como concluída")
      }
    } catch (error) {
      console.error("Erro ao marcar atividade como concluída:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    }
  }

  // Função para buscar dados do usuário
  const fetchUserData = useCallback(async () => {
    // Evitar múltiplas chamadas simultâneas
    if (isFetchingRef.current) {
      console.log("Já existe uma requisição em andamento, ignorando...")
      return
    }

    isFetchingRef.current = true

    try {
      setIsLoading(true)
      setError(null)

      // Verificar o tipo de programa do usuário
      if (!sessionUpdatedRef.current) {
        try {
          const programResponse = await fetch("/api/user/program")
          if (!programResponse.ok) {
            throw new Error("Erro ao buscar programa do usuário")
          }

          const programData = await programResponse.json()

          if (programData.success && programData.program) {
            setProgramType(programData.program)

            // Atualizar a sessão se necessário
            if (session.data?.user && !session.data.user.program) {
              await session.update({
                ...session.data,
                user: {
                  ...session.data.user,
                  program: programData.program,
                },
              })
              sessionUpdatedRef.current = true
            }
          } else {
            console.log("Usuário não tem programa definido")
            router.push("/program-selection")
            return
          }
        } catch (programError) {
          console.error("Erro ao buscar programa:", programError)
          router.push("/program-selection")
          return
        }
      }

      // Determinar o endpoint correto baseado no tipo de programa
      let endpoint = ""
      const currentProgramType = programType || session.data?.user?.program

      if (currentProgramType === "rehabilitation") {
        endpoint = "/api/rehabilitation"
      } else if (currentProgramType === "sedentary") {
        endpoint = "/api/sedentary"
      } else if (currentProgramType === "training-diet") {
        endpoint = "/api/training-diet"
      } else {
        console.log("Tipo de programa não definido")
        router.push("/program-selection")
        return
      }

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setUserProfile(data.data)
        if (!programType) {
          setProgramType(currentProgramType)
        }
      } else {
        setError(data.message || "Erro ao carregar dados do usuário")
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
      isFetchingRef.current = false
    }
  }, [session, router, programType])

  // Effect para buscar dados quando a sessão estiver pronta
  useEffect(() => {
    if (session.status === "authenticated") {
      fetchUserData()
    } else if (session.status === "unauthenticated") {
      router.push("/login")
    }
  }, [session.status, fetchUserData, router])

  return {
    programType,
    date,
    setDate,
    userProfile,
    isLoading,
    error,
    isInitialLoad,
    markActivityAsCompleted,
    fetchUserData,
    setError
  }
}