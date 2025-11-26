import { useState } from "react"
import { useSession } from "next-auth/react"

export const PAIN_OPTIONS = [
  { id: "lower-back", label: "Dor na lombar" },
  { id: "upper-back", label: "Dor na parte superior das costas" },
  { id: "neck", label: "Dor no pescoço" },
  { id: "shoulder", label: "Dor nos ombros" },
  { id: "elbow", label: "Dor no cotovelo" },
  { id: "wrist", label: "Dor nos pulsos" },
  { id: "hip", label: "Dor no quadril" },
  { id: "knee", label: "Dor nos joelhos" },
  { id: "ankle", label: "Dor no tornozelo" },
  { id: "foot", label: "Dor nos pés" },
  { id: "jaw", label: "Dor na mandíbula (ATM)" },
  { id: "headache", label: "Dores de cabeça frequentes" },
]

export const INJURY_TYPES = [
  { id: "muscle-strain", label: "Distensão muscular" },
  { id: "joint-pain", label: "Dor articular" },
  { id: "chronic-pain", label: "Dor crônica" },
  { id: "post-surgery", label: "Pós-cirúrgica" },
  { id: "work-injury", label: "Lesão do trabalho (LER/DORT)" },
  { id: "sports-injury", label: "Lesão esportiva" },
  { id: "postural", label: "Problemas posturais" },
  { id: "arthritis", label: "Artrite/Artrose" },
  { id: "herniated-disc", label: "Hérnia de disco" },
  { id: "fibromyalgia", label: "Fibromialgia" },
  { id: "other", label: "Outro" },
]

export const INJURY_DURATION = [
  { id: "recent", label: "Menos de 1 mês" },
  { id: "short", label: "1-3 meses" },
  { id: "medium", label: "3-6 meses" },
  { id: "long", label: "6 meses - 1 ano" },
  { id: "chronic", label: "Mais de 1 ano" },
]

export const MEDICAL_TREATMENT = [
  { id: "none", label: "Nenhum tratamento médico" },
  { id: "doctor-visits", label: "Consultas médicas regulares" },
  { id: "physiotherapy", label: "Fisioterapia" },
  { id: "medication", label: "Medicamentos para dor" },
  { id: "surgery", label: "Cirurgia" },
  { id: "alternative", label: "Terapias alternativas (acupuntura, quiropraxia)" },
]

export const DAILY_ACTIVITIES = [
  { id: "walking", label: "Caminhar" },
  { id: "stairs", label: "Subir/descer escadas" },
  { id: "sitting", label: "Permanecer sentado" },
  { id: "standing", label: "Permanecer em pé" },
  { id: "lifting", label: "Levantar objetos" },
  { id: "bending", label: "Curvar-se" },
  { id: "reaching", label: "Alcançar objetos altos" },
  { id: "sleeping", label: "Dormir" },
  { id: "driving", label: "Dirigir" },
  { id: "computer-work", label: "Trabalhar no computador" },
]

export const MOVEMENT_LIMITATIONS = [
  { id: "flexibility", label: "Perda de flexibilidade" },
  { id: "strength", label: "Fraqueza muscular" },
  { id: "balance", label: "Problemas de equilíbrio" },
  { id: "coordination", label: "Falta de coordenação" },
  { id: "stiffness", label: "Rigidez articular" },
  { id: "numbness", label: "Dormência ou formigamento" },
  { id: "instability", label: "Instabilidade articular" },
]

export const REHAB_GOALS = [
  { id: "pain-relief", label: "Reduzir a dor" },
  { id: "mobility", label: "Melhorar mobilidade" },
  { id: "strength", label: "Aumentar força muscular" },
  { id: "flexibility", label: "Aumentar flexibilidade" },
  { id: "posture", label: "Corrigir postura" },
  { id: "daily-activities", label: "Retomar atividades diárias" },
  { id: "work-return", label: "Retornar ao trabalho" },
  { id: "sports-return", label: "Retornar ao esporte" },
  { id: "sleep-quality", label: "Melhorar qualidade do sono" },
  { id: "prevention", label: "Prevenir futuras lesões" },
]

interface RehabilitationFormData {
  // Informações básicas
  painAreas: string[]
  age: number
  gender: string
  
  // Histórico médico
  injuryType: string
  injuryDuration: string
  painLevel: number
  medicalTreatment: string
  medications: string[]
  surgeryHistory: string
  
  // Limitações e atividades
  dailyActivities: string[]
  movementLimitations: string[]
  previousPhysioTherapy: string
  exerciseExperience: string
  
  // Objetivos e estilo de vida
  rehabGoals: string[]
  timeAvailability: string
  homeEnvironment: string
  workType: string
  sleepQuality: string
  stressLevel: string
}

export function useRehabilitationForm() {
  const { update } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<RehabilitationFormData>({
    painAreas: [],
    age: 0,
    gender: "",
    injuryType: "",
    injuryDuration: "",
    painLevel: 5,
    medicalTreatment: "",
    medications: [],
    surgeryHistory: "none",
    dailyActivities: [],
    movementLimitations: [],
    previousPhysioTherapy: "",
    exerciseExperience: "",
    rehabGoals: [],
    timeAvailability: "",
    homeEnvironment: "",
    workType: "",
    sleepQuality: "",
    stressLevel: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = (field: keyof RehabilitationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (error) {
      setError(null)
    }
  }

  const handleArrayToggle = (field: keyof RehabilitationFormData, itemId: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(itemId)
        ? currentArray.filter(id => id !== itemId)
        : [...currentArray, itemId]
      
      return {
        ...prev,
        [field]: newArray
      }
    })
    
    if (error) {
      setError(null)
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  // Manter compatibilidade com a função antiga
  const handlePainToggle = (painId: string) => {
    handleArrayToggle('painAreas', painId)
  }

  const submitForm = async (): Promise<{ success: boolean; message?: string }> => {
    if (formData.painAreas.length === 0) {
      setError("Por favor, selecione pelo menos uma área de dor")
      return { success: false, message: "Por favor, selecione pelo menos uma área de dor" }
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Enviando dados do formulário para a API:", formData)

      const response = await fetch("/api/rehabilitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (data.success) {
        console.log("Perfil salvo com sucesso, atualizando sessão")

        // Atualizar a sessão com o novo programa
        try {
          await update({ program: "rehabilitation" })
          console.log("Sessão atualizada com sucesso")
        } catch (updateError) {
          console.error("Erro ao atualizar sessão:", updateError)
          // Continuar mesmo com erro na atualização da sessão
        }

        return { success: true }
      } else {
        console.error("Erro retornado pela API:", data.message)
        const errorMessage = data.message || "Erro ao salvar perfil de reabilitação"
        setError(errorMessage)
        return { success: false, message: errorMessage }
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      const errorMessage = "Erro ao conectar com o servidor. Tente novamente mais tarde."
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    currentStep,
    error,
    isLoading,
    updateFormData,
    handleArrayToggle,
    handlePainToggle,
    nextStep,
    prevStep,
    submitForm,
    setError,
    // Compatibilidade com versão antiga
    selectedPains: formData.painAreas,
  }
}