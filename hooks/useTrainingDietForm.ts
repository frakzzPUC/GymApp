import { useState } from "react"

export interface FormData {
  // Dados pessoais básicos
  age: string
  weight: string
  height: string
  gender: string
  
  // Histórico de saúde e atividade física
  activityLevel: string
  exerciseExperience: string
  fitnessLevel: string
  medicalConditions: string[]
  injuries: string
  medications: string
  
  // Objetivos e preferências de treino
  primaryGoal: string
  secondaryGoals: string[]
  daysPerWeek: string
  timePerDay: string
  preferredTime: string
  workoutLocation: string
  availableEquipment: string[]
  exercisePreferences: string[]
  exerciseDislikes: string[]
  
  // Informações nutricionais
  wantsDiet: boolean
  dietaryRestrictions: string[]
  allergies: string
  currentEatingHabits: string
  mealsPerDay: string
  waterIntake: string
  supplementUsage: string
  budgetPreference: string
  cookingSkill: string
  mealPrepTime: string
  
  // Estilo de vida
  profession: string
  stressLevel: string
  sleepHours: string
  sleepQuality: string
  
  // Motivação e apoio
  motivation: string
  obstacles: string
  supportSystem: string
  previousAttempts: string
}

export interface FormErrors {
  [key: string]: string
}

const initialFormData: FormData = {
  // Dados pessoais básicos
  age: "",
  weight: "",
  height: "",
  gender: "",
  
  // Histórico de saúde e atividade física
  activityLevel: "",
  exerciseExperience: "",
  fitnessLevel: "",
  medicalConditions: [],
  injuries: "",
  medications: "",
  
  // Objetivos e preferências de treino
  primaryGoal: "",
  secondaryGoals: [],
  daysPerWeek: "",
  timePerDay: "",
  preferredTime: "",
  workoutLocation: "",
  availableEquipment: [],
  exercisePreferences: [],
  exerciseDislikes: [],
  
  // Informações nutricionais
  wantsDiet: false,
  dietaryRestrictions: [],
  allergies: "",
  currentEatingHabits: "",
  mealsPerDay: "",
  waterIntake: "",
  supplementUsage: "",
  budgetPreference: "",
  cookingSkill: "",
  mealPrepTime: "",
  
  // Estilo de vida
  profession: "",
  stressLevel: "",
  sleepHours: "",
  sleepQuality: "",
  
  // Motivação e apoio
  motivation: "",
  obstacles: "",
  supportSystem: "",
  previousAttempts: "",
}

export function useTrainingDietForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando o usuário editar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateArrayField = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        }
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        }
      }
    })
  }

  const clearErrors = () => {
    setErrors({})
  }

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  const setGeneralError = (message: string) => {
    setErrors(prev => ({
      ...prev,
      general: message
    }))
  }

  return {
    formData,
    errors,
    isLoading,
    setIsLoading,
    updateField,
    updateArrayField,
    clearErrors,
    setFieldError,
    setGeneralError,
    setErrors
  }
}