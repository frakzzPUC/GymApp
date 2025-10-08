import React from "react"
import { Button } from "@/components/ui/actions/button"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Progress } from "@/components/ui/feedback/progress"
import { Loader2, AlertCircle } from "lucide-react"
import { FormErrors } from "@/hooks/useTrainingDietForm"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  isLoading: boolean
  errors: FormErrors
  onPrevStep: () => void
  onNextStep: () => void
  onSubmit: () => void
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  isLoading,
  errors,
  onPrevStep,
  onNextStep,
  onSubmit
}: StepNavigationProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Etapa {currentStep} de {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% concluído</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </div>

      {/* Step indicators */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-emerald-600 text-white"
                  : isCurrent
                  ? "bg-emerald-100 text-emerald-600 border-2 border-emerald-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {stepNumber}
            </div>
          )
        })}
      </div>

      {/* Error messages */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        {!isFirstStep ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevStep}
            disabled={isLoading}
          >
            Anterior
          </Button>
        ) : (
          <div />
        )}
        
        {!isLastStep ? (
          <Button 
            type="button" 
            onClick={onNextStep} 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            Próximo
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={onSubmit} 
            className="bg-emerald-600 hover:bg-emerald-700" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Finalizar e Continuar"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}