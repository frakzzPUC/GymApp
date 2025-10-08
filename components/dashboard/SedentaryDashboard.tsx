import React from "react"
import { Activity, Calendar, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Progress } from "@/components/ui/feedback/progress"
import { UserProfile } from "@/hooks/useDashboard"
import { SedentaryStats } from "./SedentaryStats"
import { 
  hasCompletedWorkout, 
  hasMissedWorkout, 
  getTodaysActivities,
  shouldTrainOnDay,
  calculateStats 
} from "@/lib/dashboard-utils"

interface SedentaryDashboardProps {
  userProfile: UserProfile
  onMarkComplete: (activityId: string) => Promise<void>
}

export function SedentaryDashboard({ userProfile, onMarkComplete }: SedentaryDashboardProps) {
  const todaysActivities = getTodaysActivities(userProfile)
  const today = new Date()
  const stats = calculateStats(userProfile)
  
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

  // Metas diárias sugeridas
  const dailyGoals = [
    { id: '1', title: 'Caminhar 10 minutos', completed: false },
    { id: '2', title: 'Alongamento matinal', completed: false },
    { id: '3', title: 'Subir escadas', completed: false },
    { id: '4', title: 'Pausas a cada hora', completed: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programa Anti-Sedentarismo</h1>
          <p className="text-muted-foreground">
            Pequenos passos para uma vida mais ativa
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
      <SedentaryStats userProfile={userProfile} />

      {/* Grid de conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Metas de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas de Hoje
            </CardTitle>
            <CardDescription>
              Pequenas ações para combater o sedentarismo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Meta de passos */}
              {stats.stepsGoal && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Meta de Passos</span>
                    <span>{userProfile.progress?.stepsToday || 0} / {stats.stepsGoal}</span>
                  </div>
                  <Progress value={stats.stepsProgress} className="h-2" />
                </div>
              )}
              
              {/* Metas diárias */}
              <div className="space-y-3">
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{goal.title}</span>
                    <Button
                      size="sm"
                      variant={goal.completed ? "secondary" : "default"}
                      onClick={() => onMarkComplete(goal.id)}
                      className="text-xs"
                    >
                      {goal.completed ? "Concluído" : "Marcar"}
                    </Button>
                  </div>
                ))}
              </div>
              
              {todaysActivities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Atividades Programadas</h4>
                  {todaysActivities.map((activity) => (
                    <div key={activity._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{activity.name}</h5>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={activity.completed ? "secondary" : "default"}
                        onClick={() => onMarkComplete(activity._id)}
                        className="text-xs"
                      >
                        {activity.completed ? "✓" : "Fazer"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progresso Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progresso Semanal
            </CardTitle>
            <CardDescription>
              Sua evolução nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progresso geral */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso Geral</span>
                  <span>{stats.weeklyProgress}%</span>
                </div>
                <Progress value={stats.weeklyProgress} className="h-3" />
              </div>
              
              {/* Calendário visual */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Atividade por Dia</h4>
                <div className="grid grid-cols-7 gap-2">
                  {lastSevenDays.map((date, index) => {
                    const isToday = date.toDateString() === today.toDateString()
                    const isActivityDay = shouldTrainOnDay(date, userProfile.daysPerWeek)
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
                            ${missed ? 'bg-orange-300 text-orange-800' : ''}
                            ${isActivityDay && !completed && !missed ? 'bg-blue-100 text-blue-700' : ''}
                            ${!isActivityDay ? 'bg-gray-100 text-gray-500' : ''}
                          `}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Dicas motivacionais */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Dica de Hoje</span>
                </div>
                <p className="text-sm text-blue-700">
                  {getDailyTip()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Função para obter dica diária baseada no dia da semana
function getDailyTip(): string {
  const tips = [
    "Use as escadas em vez do elevador sempre que possível.",
    "Faça uma caminhada de 10 minutos após o almoço.",
    "Configure alarmes para levantar a cada hora de trabalho.",
    "Estacione mais longe ou desça um ponto antes no transporte público.",
    "Faça exercícios de alongamento durante os intervalos.",
    "Dance sua música favorita por alguns minutos.",
    "Caminhe enquanto fala ao telefone quando possível."
  ]
  
  const today = new Date()
  return tips[today.getDay()]
}