"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

// Hooks
import { useTrainingDietForm } from "@/hooks/useTrainingDietForm"
import { useStepNavigation, validateStep } from "@/hooks/useStepNavigation"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

// Components
import { FormHeader } from "@/components/training-diet/FormHeader"
import { PersonalInfoStep } from "@/components/training-diet/PersonalInfoStep"
import { HealthHistoryStep } from "@/components/training-diet/HealthHistoryStep"
import { WorkoutGoalsStep } from "@/components/training-diet/WorkoutGoalsStep"
import { NutritionInfoStep } from "@/components/training-diet/NutritionInfoStep"
import { LifestyleMotivationStep } from "@/components/training-diet/LifestyleMotivationStep"
import { StepNavigation } from "@/components/training-diet/StepNavigation"

const TOTAL_STEPS = 5

export default function TrainingDietPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const isPageLoading = useAuthRedirect()

  // Custom hooks
  const {
    formData,
    errors,
    isLoading,
    setIsLoading,
    updateField,
    updateArrayField,
    setErrors,
    setGeneralError
  } = useTrainingDietForm()

  const {
    currentStep,
    nextStep: goNextStep,
    prevStep,
    isFirstStep,
    isLastStep
  } = useStepNavigation(TOTAL_STEPS)

  // Handle step navigation with validation
  const handleNextStep = () => {
    const validation = validateStep(currentStep, formData)
    if (validation.isValid) {
      setErrors({})
      goNextStep()
    } else {
      setErrors(validation.errors)
    }
  }

  // Handle form submission for the submit button in navigation
  const handleFinalSubmit = () => {
    const validation = validateStep(currentStep, formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    setGeneralError('')

    const submitData = async () => {
      try {
        const response = await fetch('/api/training-diet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userId: session?.user?.id,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao salvar dados')
        }

        // Update session with new profile
        if (session?.user) {
          await update({
            ...session,
            user: {
              ...session.user,
              hasTrainingDietProfile: true,
            },
          })
        }

        router.push('/ai-plans')
      } catch (error) {
        console.error('Erro ao enviar dados:', error)
        setGeneralError(
          error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    submitData()
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLastStep) {
      handleNextStep()
      return
    }

    // Final validation
    const validation = validateStep(currentStep, formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    setGeneralError('')

    try {
      const response = await fetch('/api/training-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar dados')
      }

      // Update session with new profile
      if (session?.user) {
        await update({
          ...session,
          user: {
            ...session.user,
            hasTrainingDietProfile: true,
          },
        })
      }

      router.push('/ai-plans')
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      setGeneralError(
        error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Verificando seu perfil...</h2>
          <p className="text-muted-foreground mt-2">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
          />
        )
      case 2:
        return (
          <HealthHistoryStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            onUpdateArrayField={updateArrayField}
          />
        )
      case 3:
        return (
          <WorkoutGoalsStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            onUpdateArrayField={updateArrayField}
          />
        )
      case 4:
        return (
          <NutritionInfoStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            onUpdateArrayField={updateArrayField}
          />
        )
      case 5:
        return (
          <LifestyleMotivationStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <FormHeader currentStep={currentStep} />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}
            
            <StepNavigation
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isLoading={isLoading}
              onPrevStep={prevStep}
              onNextStep={handleNextStep}
              onSubmit={handleFinalSubmit}
              errors={errors}
            />
          </form>
        </div>
      </main>
    </div>
  )
}