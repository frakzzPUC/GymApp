"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Loader2, AlertCircle } from "lucide-react"

// Hooks
import { useAIPlans } from "@/hooks/useAIPlans"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

// Components
import { PageHeader } from "@/components/ai-plans/PageHeader"
import { PlanGenerationCard } from "@/components/ai-plans/PlanGenerationCard"
import { PlansDisplay } from "@/components/ai-plans/PlansDisplay"

export default function AIPlansPage() {
  const router = useRouter()
  const isPageLoading = useAuthRedirect()
  
  const {
    session,
    status,
    isGenerating,
    plansData,
    error,
    loading,
    checkExistingPlans,
    generatePlans,
    setError
  } = useAIPlans()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      checkExistingPlans()
    }
  }, [status, router])

  if (status === "loading" || loading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Carregando...</h2>
          <p className="text-muted-foreground mt-2">Verificando seus planos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader 
            title="Seus Planos Personalizados com IA"
            description="Planos de treino e nutrição criados especialmente para você usando Inteligência Artificial"
          />

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!plansData.hasPlans ? (
            <PlanGenerationCard 
              isGenerating={isGenerating}
              onGeneratePlans={generatePlans}
            />
          ) : (
            <PlansDisplay 
              plansData={plansData}
              isGenerating={isGenerating}
              onRegeneratePlans={generatePlans}
            />
          )}
        </div>
      </main>
    </div>
  )
}