import React, { useEffect, useState } from "react"
import { CheckCircle, Clock, Plus, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay/dialog"
import { UserProfile } from "@/hooks/useDashboard"
import { RehabilitationStats } from "./RehabilitationStats"
import { TodayRehabExercises } from "../rehabilitation/TodayRehabExercises"
import { RehabilitationPlanRenderer } from "./RehabilitationPlanRenderer"
import { 
  hasCompletedWorkout, 
  hasMissedWorkout, 
  getTodaysActivities,
  shouldTrainOnDay 
} from "@/lib/dashboard-utils"

interface RehabilitationDashboardProps {
  userProfile: UserProfile
  onMarkComplete: (exerciseId: string) => Promise<void>
}

export function RehabilitationDashboard({ userProfile, onMarkComplete }: RehabilitationDashboardProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Usar o rehabilitationPlan do userProfile diretamente
  const rehabilitationPlan = userProfile.rehabilitationPlan || ""

  // Carregar exercícios completados do localStorage quando o componente inicializa
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const storageKey = `rehab-completed-${today}`
    const completed = JSON.parse(localStorage.getItem(storageKey) || '[]')
    setCompletedExercises(completed)
  }, [])

  const handleMarkComplete = async (exerciseId: string) => {
    try {
      // Adicionar à lista local imediatamente para feedback visual
      setCompletedExercises(prev => [...prev, exerciseId])
      
      // Para reabilitação, apenas salvar localmente no localStorage
      const today = new Date().toISOString().split('T')[0]
      const storageKey = `rehab-completed-${today}`
      const existingCompleted = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const updatedCompleted = [...existingCompleted, exerciseId]
      localStorage.setItem(storageKey, JSON.stringify(updatedCompleted))
      
      console.log(`Exercício ${exerciseId} marcado como concluído`)
      
    } catch (error) {
      console.error("Erro ao marcar exercício como completo:", error)
      // Reverter mudança local em caso de erro
      setCompletedExercises(prev => prev.filter(id => id !== exerciseId))
    }
  }
  const todaysActivities = getTodaysActivities(userProfile)
  const today = new Date()
  const hasCompletedToday = hasCompletedWorkout(today, userProfile)
  const hasMissedToday = hasMissedWorkout(today, userProfile)
  


  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Reabilitação</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e exercícios de reabilitação
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {today.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          {rehabilitationPlan && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ver Plano Completo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Plano de Reabilitação Completo
                    </DialogTitle>
                  </div>
                </DialogHeader>
                <RehabilitationPlanRenderer rehabilitationText={rehabilitationPlan} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <RehabilitationStats userProfile={userProfile} />

      {/* Grid de conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Exercícios de Hoje - Usando IA */}
        <TodayRehabExercises 
          rehabilitationPlan={rehabilitationPlan}
          onMarkComplete={handleMarkComplete}
          completedExercises={completedExercises}
        />

        {/* Progresso Semanal ou outras métricas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Progresso da Semana
            </CardTitle>
            <CardDescription>
              Acompanhe sua consistência nos exercícios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Carregando...</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    {completedExercises.length}
                  </div>
                  <p className="text-muted-foreground">Exercícios completados hoje</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continue assim para acelerar sua recuperação!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}