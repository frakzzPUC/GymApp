"use client"

import { Button } from "@/components/ui/actions/button"
import { useDietOptions } from "@/hooks/useDietOptions"
import { AppHeader } from "@/components/layout/AppHeader"
import { LoadingScreen } from "@/components/ui/feedback/LoadingScreen"
import { ErrorAlert } from "@/components/ui/feedback/ErrorAlert"
import { DietSelection } from "@/components/diet-options/DietSelection"

export default function DietOptionsPage() {
  const {
    selectedDiet,
    setSelectedDiet,
    isLoading,
    isPageLoading,
    error,
    handleSubmit
  } = useDietOptions()

  if (isPageLoading) {
    return (
      <LoadingScreen 
        title="Verificando seu perfil..." 
        description="Aguarde um momento"
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          {error && <ErrorAlert error={error} />}
          
          <DietSelection 
            selectedDiet={selectedDiet}
            onDietChange={setSelectedDiet}
          />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedDiet || isLoading}
              className="px-8 bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Salvando..." : "Confirmar Seleção"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}