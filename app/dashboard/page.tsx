"use client"

import { useDashboard } from "@/hooks/useDashboard"
import AuthGuard from "@/components/auth-guard"
import { LoadingSpinner } from "@/components/ui/feedback/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { RehabilitationDashboard } from "@/components/dashboard/RehabilitationDashboard"
import { SedentaryDashboard } from "@/components/dashboard/SedentaryDashboard"
import { TrainingDietDashboard } from "@/components/dashboard/TrainingDietDashboard"

export default function DashboardPage() {
  const { 
    userProfile, 
    isLoading, 
    error, 
    markActivityAsCompleted 
  } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Nenhum perfil encontrado. Complete seu cadastro em uma das opções de programa.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Determinar qual dashboard exibir baseado no tipo de perfil
  const renderDashboard = () => {
    // Verificar se é perfil de reabilitação
    if (userProfile.painAreas && userProfile.painAreas.length > 0) {
      return (
        <RehabilitationDashboard 
          userProfile={userProfile}
          onMarkComplete={markActivityAsCompleted}
        />
      )
    }
    
    // Verificar se é perfil sedentário (daysPerWeek baixo ou objetivo específico)
    if (userProfile.daysPerWeek <= 2 || userProfile.goal === 'reduce-sedentary') {
      return (
        <SedentaryDashboard 
          userProfile={userProfile}
          onMarkComplete={markActivityAsCompleted}
        />
      )
    }
    
    // Caso contrário, é perfil de treino e dieta
    return (
      <TrainingDietDashboard 
        userProfile={userProfile}
        onMarkComplete={markActivityAsCompleted}
      />
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </AuthGuard>
  )
}