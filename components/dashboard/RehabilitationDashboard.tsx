import React from "react"
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { UserProfile } from "@/hooks/useDashboard"
import { RehabilitationStats } from "./RehabilitationStats"
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
  const todaysActivities = getTodaysActivities(userProfile)
  const today = new Date()
  const hasCompletedToday = hasCompletedWorkout(today, userProfile)
  const hasMissedToday = hasMissedWorkout(today, userProfile)
  
  // Gerar últimos 7 dias para o calendário
  const getLastSevenDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      days.push(date)
    }
    return days
  }

  const lastSevenDays = getLastSevenDays()

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
      </div>

      {/* Estatísticas */}
      <RehabilitationStats userProfile={userProfile} />

      {/* Grid de conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Exercícios de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Exercícios de Hoje
            </CardTitle>
            <CardDescription>
              {shouldTrainOnDay(today, userProfile.daysPerWeek) 
                ? "Seus exercícios programados para hoje"
                : "Hoje é dia de descanso"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shouldTrainOnDay(today, userProfile.daysPerWeek) ? (
              <div className="space-y-4">
                {todaysActivities.length > 0 ? (
                  todaysActivities.map((exercise) => (
                    <div key={exercise._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{exercise.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {exercise.completed ? (
                          <Badge variant="secondary" className="text-green-700 bg-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluído
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => onMarkComplete(exercise._id)}
                            className="text-xs"
                          >
                            Marcar como concluído
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum exercício programado para hoje</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Hoje é seu dia de descanso!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aproveite para relaxar e permitir que seu corpo se recupere.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendário Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Últimos 7 Dias
            </CardTitle>
            <CardDescription>
              Histórico de exercícios realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {lastSevenDays.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString()
                const isTrainingDay = shouldTrainOnDay(date, userProfile.daysPerWeek)
                const completed = hasCompletedWorkout(date, userProfile)
                const missed = hasMissedWorkout(date, userProfile)
                
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                        ${isToday ? 'ring-2 ring-primary' : ''}
                        ${completed ? 'bg-green-500 text-white' : ''}
                        ${missed ? 'bg-red-500 text-white' : ''}
                        ${isTrainingDay && !completed && !missed ? 'bg-blue-100 text-blue-700' : ''}
                        ${!isTrainingDay ? 'bg-gray-100 text-gray-500' : ''}
                      `}
                    >
                      {date.getDate()}
                    </div>
                    <div className="text-xs mt-1">
                      {completed && '✓'}
                      {missed && '✗'}
                      {!isTrainingDay && '-'}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Exercício realizado</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Exercício perdido</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                <span>Dia de descanso</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}