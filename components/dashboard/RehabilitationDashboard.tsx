import React from "react"
import { CheckCircle, Clock, Plus } from "lucide-react"
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
                <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Hoje é seu dia de descanso!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aproveite para relaxar e permitir que seu corpo se recupere.
                </p>
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  )
}