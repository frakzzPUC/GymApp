import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export interface UserProfile {
  name: string
  email: string
  phone: string
  birthdate: string
  height: string
  weight: string
  program: string
  programName: string
  goal: string
  goalName: string
  gender: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

export interface UserStats {
  daysActive: number
  workoutsCompleted: number
  streakDays: number
  weightLost: number
  startDate: string
}

interface UseProfileReturn {
  userData: UserProfile
  userStats: UserStats
  isEditing: boolean
  isLoading: boolean
  successMessage: string
  handleToggleEdit: () => void
  handleSave: () => void
  handleDataChange: (data: Partial<UserProfile>) => void
  handlePhotoChange: () => void
}

export function useProfile(): UseProfileReturn {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dados do usuário (inicial com valores padrão)
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    height: "",
    weight: "",
    program: "",
    programName: "",
    goal: "",
    goalName: "",
    gender: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  })

  // Estatísticas do usuário (simuladas - seriam vindas da API)
  const stats: UserStats = {
    daysActive: 45,
    workoutsCompleted: 38,
    streakDays: 12,
    weightLost: 3.5,
    startDate: "15/02/2023",
  }

  // Funções auxiliares para conversão de dados
  const getProgramName = (program: string): string => {
    const programNames: Record<string, string> = {
      rehabilitation: "Reabilitação",
      sedentary: "Saindo do Sedentarismo",
      "training-diet": "Treino + Dieta"
    }
    return programNames[program] || ""
  }

  const getGoalName = (goal: string): string => {
    const goalNames: Record<string, string> = {
      "lose-weight": "Emagrecer",
      "gain-muscle": "Ganhar Massa Muscular",
      "maintain": "Manter Forma Física"
    }
    return goalNames[goal] || ""
  }

  // Buscar dados do usuário
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (data.success) {
        const user = data.user
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split("T")[0] : "",
          height: user.programData?.height?.toString() || "",
          weight: user.programData?.weight?.toString() || "",
          program: user.program || "",
          programName: getProgramName(user.program),
          goal: user.programData?.goal || "",
          goalName: getGoalName(user.programData?.goal),
          gender: user.programData?.gender || "",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        })
      } else {
        setError("Erro ao carregar dados do perfil")
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      setError("Erro ao conectar com o servidor")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar perfil
  const handleSaveProfile = async () => {
    try {
      setError(null)
      
      // Em uma aplicação real, aqui seria feita a chamada à API para salvar os dados
      // const response = await fetch("/api/user/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(userData)
      // })
      
      setIsEditing(false)
      setShowSuccessAlert(true)

      // Esconde o alerta após 3 segundos
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      setError("Erro ao salvar alterações")
    }
  }

  // Logout
  const handleLogout = () => {
    // Em uma aplicação real, aqui seria feito o logout
    router.push("/")
  }

  // Atualizar programa e objetivo com nomes formatados
  const updateUserData = (newData: Partial<UserProfile>) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData }
      
      // Atualizar nomes formatados se program ou goal mudaram
      if (newData.program) {
        updated.programName = getProgramName(newData.program)
      }
      if (newData.goal) {
        updated.goalName = getGoalName(newData.goal)
      }
      
      return updated
    })
  }

  // Handlers
  const handleToggleEdit = useCallback(() => {
    setIsEditing(!isEditing)
  }, [isEditing])

  const handleSave = useCallback(() => {
    setIsEditing(false)
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }, [])

  const handleDataChange = useCallback((data: Partial<UserProfile>) => {
    updateUserData(data)
  }, [])

  const handlePhotoChange = useCallback(() => {
    // Implementar upload de foto
    console.log("Photo change requested")
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return {
    userData,
    userStats: stats,
    isEditing,
    isLoading,
    successMessage: showSuccessAlert ? "Perfil atualizado com sucesso!" : "",
    handleToggleEdit,
    handleSave,
    handleDataChange,
    handlePhotoChange
  }
}