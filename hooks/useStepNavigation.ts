import { useState } from "react"
import { FormData, FormErrors } from "./useTrainingDietForm"

export function useStepNavigation(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  }
}

export function validateStep(step: number, formData: FormData): { isValid: boolean; errors: FormErrors } {
  const newErrors: FormErrors = {}

  switch (step) {
    case 1: // Dados pessoais básicos
      if (!formData.age) newErrors.age = "Idade é obrigatória"
      if (!formData.gender) newErrors.gender = "Gênero é obrigatório"
      if (!formData.weight) newErrors.weight = "Peso é obrigatório"
      if (!formData.height) newErrors.height = "Altura é obrigatória"
      break

    case 2: // Histórico de saúde e atividade
      if (!formData.activityLevel) newErrors.activityLevel = "Nível de atividade é obrigatório"
      if (!formData.exerciseExperience) newErrors.exerciseExperience = "Experiência com exercícios é obrigatória"
      if (!formData.fitnessLevel) newErrors.fitnessLevel = "Nível de condicionamento é obrigatório"
      break

    case 3: // Objetivos e preferências de treino
      if (!formData.primaryGoal) newErrors.primaryGoal = "Objetivo principal é obrigatório"
      if (!formData.daysPerWeek) newErrors.daysPerWeek = "Dias por semana é obrigatório"
      if (!formData.timePerDay) newErrors.timePerDay = "Tempo por dia é obrigatório"
      if (!formData.preferredTime) newErrors.preferredTime = "Horário preferido é obrigatório"
      if (!formData.workoutLocation) newErrors.workoutLocation = "Local de treino é obrigatório"
      break

    case 4: // Informações nutricionais
      if (formData.wantsDiet) {
        if (!formData.mealsPerDay) newErrors.mealsPerDay = "Número de refeições é obrigatório"
        if (!formData.waterIntake) newErrors.waterIntake = "Consumo de água é obrigatório"
      }
      break

    case 5: // Estilo de vida e motivação
      if (!formData.profession) newErrors.profession = "Profissão/ocupação é obrigatória"
      if (!formData.stressLevel) newErrors.stressLevel = "Nível de estresse é obrigatório"
      if (!formData.sleepHours) newErrors.sleepHours = "Horas de sono é obrigatório"
      if (!formData.sleepQuality) newErrors.sleepQuality = "Qualidade do sono é obrigatória"
      if (!formData.motivation) newErrors.motivation = "Motivação é obrigatória"
      break
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  }
}