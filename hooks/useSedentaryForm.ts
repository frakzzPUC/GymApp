import { useState } from "react"
import { useSession } from "next-auth/react"

export interface SedentaryFormData {
  age: string
  gender: string
  motivation: string
  primaryGoal: string
  currentActivityLevel: string
  availableTime: string
  preferredActivities: string
}

export interface SedentaryFormErrors {
  age?: string
  gender?: string
  motivation?: string
  primaryGoal?: string
  currentActivityLevel?: string
  availableTime?: string
  preferredActivities?: string
}

export function useSedentaryForm() {
  const { update } = useSession()
  const [formData, setFormData] = useState<SedentaryFormData>({
    age: "",
    gender: "",
    motivation: "",
    primaryGoal: "",
    currentActivityLevel: "",
    availableTime: "",
    preferredActivities: ""
  })
  const [errors, setErrors] = useState<SedentaryFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field: keyof SedentaryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: SedentaryFormErrors = {}

    // Validar idade
    if (!formData.age) {
      newErrors.age = "Idade é obrigatória"
    } else if (Number.parseFloat(formData.age) < 16 || Number.parseFloat(formData.age) > 100) {
      newErrors.age = "Idade deve estar entre 16 e 100 anos"
    }

    // Validar gênero
    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório"
    }

    // Validar motivação
    if (!formData.motivation) {
      newErrors.motivation = "Conte-nos sua motivação"
    }

    // Validar objetivo principal
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = "Selecione seu objetivo principal"
    }

    // Validar nível de atividade atual
    if (!formData.currentActivityLevel) {
      newErrors.currentActivityLevel = "Selecione seu nível atual de atividade"
    }

    // Validar tempo disponível
    if (!formData.availableTime) {
      newErrors.availableTime = "Selecione o tempo que tem disponível"
    }

    // Validar atividades preferidas
    if (!formData.preferredActivities) {
      newErrors.preferredActivities = "Selecione pelo menos uma atividade de interesse"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submitForm = async (): Promise<{ success: boolean; message?: string }> => {
    if (!validateForm()) {
      return { success: false, message: "Por favor, corrija os erros no formulário" }
    }

    try {
      setIsLoading(true)
      setErrors({})

      console.log("Enviando dados para a API:", formData)

      const response = await fetch("/api/sedentary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number(formData.age),
          gender: formData.gender,
          motivation: formData.motivation,
          primaryGoal: formData.primaryGoal,
          currentActivityLevel: formData.currentActivityLevel,
          availableTime: formData.availableTime,
          preferredActivities: formData.preferredActivities.split(",").filter(a => a.trim()),
        }),
      })

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (data.success) {
        console.log("Perfil salvo com sucesso, atualizando sessão")
        
        // Atualizar a sessão com o novo programa
        await update({ program: "sedentary" })
        
        return { success: true }
      } else {
        console.error("Erro retornado pela API:", data.message)
        return { success: false, message: data.message || "Erro ao salvar perfil" }
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      return { 
        success: false, 
        message: "Erro ao conectar com o servidor. Tente novamente mais tarde." 
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    errors,
    isLoading,
    updateField,
    validateForm,
    submitForm,
    setErrors
  }
}