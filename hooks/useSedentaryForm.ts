import { useState } from "react"
import { useSession } from "next-auth/react"

export interface SedentaryFormData {
  weight: string
  height: string
  gender: string
  daysPerWeek: string
  timePerDay: string
}

export interface SedentaryFormErrors {
  weight?: string
  height?: string
  gender?: string
  daysPerWeek?: string
  timePerDay?: string
}

export function useSedentaryForm() {
  const { update } = useSession()
  const [formData, setFormData] = useState<SedentaryFormData>({
    weight: "",
    height: "",
    gender: "",
    daysPerWeek: "",
    timePerDay: ""
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

    // Validar peso
    if (!formData.weight) {
      newErrors.weight = "Peso é obrigatório"
    } else if (Number.parseFloat(formData.weight) <= 0 || Number.parseFloat(formData.weight) > 300) {
      newErrors.weight = "Peso deve estar entre 1 e 300 kg"
    }

    // Validar altura
    if (!formData.height) {
      newErrors.height = "Altura é obrigatória"
    } else if (Number.parseFloat(formData.height) <= 0 || Number.parseFloat(formData.height) > 250) {
      newErrors.height = "Altura deve estar entre 1 e 250 cm"
    }

    // Validar gênero
    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório"
    }

    // Validar dias por semana
    if (!formData.daysPerWeek) {
      newErrors.daysPerWeek = "Selecione os dias disponíveis"
    }

    // Validar tempo por dia
    if (!formData.timePerDay) {
      newErrors.timePerDay = "Selecione o tempo disponível"
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

      console.log("Enviando dados para a API:", {
        gender: formData.gender,
        weight: Number(formData.weight),
        height: Number(formData.height),
        daysPerWeek: Number(formData.daysPerWeek),
        timePerDay: Number(formData.timePerDay),
      })

      const response = await fetch("/api/sedentary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: formData.gender,
          weight: Number(formData.weight),
          height: Number(formData.height),
          daysPerWeek: Number(formData.daysPerWeek),
          timePerDay: Number(formData.timePerDay),
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