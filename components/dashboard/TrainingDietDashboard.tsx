import React, { useState, useEffect } from "react"
import { Calendar, Dumbbell, Utensils, Trophy, Clock, Sparkles, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay/dialog"
import { UserProfile } from "@/hooks/useDashboard"
import { TrainingDietStats } from "./TrainingDietStats"
import { 
  hasCompletedWorkout, 
  hasMissedWorkout, 
  getTodaysActivities,
  shouldTrainOnDay,
  calculateStats 
} from "@/lib/dashboard-utils"

interface TrainingDietDashboardProps {
  userProfile: UserProfile
  onMarkComplete: (workoutId: string) => Promise<void>
}

interface AIPlansData {
  latest?: {
    workoutPlan: string
    nutritionPlan: string
    planType: 'ai-generated' | 'static-fallback'
    generatedAt: string
    planId: string
    userProfile: {
      age: number
      gender: string
      weight: number
      height: number
      primaryGoal: string
      activityLevel: string
      experience: string
    }
  }
  allPlans: Array<{
    planId: string
    planType: 'ai-generated' | 'static-fallback'
    generatedAt: string
    userProfile: any
  }>
  totalPlans: number
}

export function TrainingDietDashboard({ userProfile, onMarkComplete }: TrainingDietDashboardProps) {
  const [aiPlans, setAiPlans] = useState<AIPlansData | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [plansError, setPlansError] = useState<string | null>(null)
  
  const todaysActivities = getTodaysActivities(userProfile)
  const today = new Date()
  const stats = calculateStats(userProfile)
  const hasCompletedToday = hasCompletedWorkout(today, userProfile)

  // Buscar planos de IA ao carregar o componente
  useEffect(() => {
    fetchAIPlans()
  }, [])

  const fetchAIPlans = async () => {
    try {
      setIsLoadingPlans(true)
      const response = await fetch('/api/ai-plans')
      const data = await response.json()
      
      if (data.success && data.hasPlans) {
        setAiPlans(data.data)
      } else {
        setAiPlans(null)
      }
      setPlansError(null)
    } catch (error) {
      console.error('Erro ao buscar planos de IA:', error)
      setPlansError('Erro ao carregar planos de IA')
    } finally {
      setIsLoadingPlans(false)
    }
  }

  const generateNewPlans = async () => {
    try {
      setIsLoadingPlans(true)
      const response = await fetch('/api/ai-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchAIPlans() // Recarregar os planos
        alert('Planos gerados com sucesso!')
      } else {
        throw new Error(data.error || 'Erro ao gerar planos')
      }
    } catch (error) {
      console.error('Erro ao gerar planos:', error)
      alert('Erro ao gerar planos. Tente novamente.')
    } finally {
      setIsLoadingPlans(false)
    }
  }
  
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

  // Plano de refeições sugerido
  const mealPlan = [
    { id: '1', meal: 'Café da manhã', time: '07:00', calories: 400, completed: false },
    { id: '2', meal: 'Lanche da manhã', time: '10:00', calories: 150, completed: false },
    { id: '3', meal: 'Almoço', time: '12:30', calories: 600, completed: false },
    { id: '4', meal: 'Lanche da tarde', time: '15:30', calories: 200, completed: false },
    { id: '5', meal: 'Jantar', time: '19:00', calories: 500, completed: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treino & Nutrição</h1>
          <p className="text-muted-foreground">
            Alcance seus objetivos com treino e alimentação balanceada
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
          <div className="flex items-center gap-2 mt-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">
              Objetivo: {userProfile.goal === 'lose-weight' ? 'Perder peso' : 
                        userProfile.goal === 'gain-muscle' ? 'Ganhar massa' : 
                        'Condicionamento geral'}
            </span>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <TrainingDietStats userProfile={userProfile} />

      {/* Seção de Planos de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Planos Personalizados com IA
          </CardTitle>
          <CardDescription>
            Planos de treino e nutrição gerados especialmente para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Carregando planos...</p>
              </div>
            </div>
          ) : plansError ? (
            <Alert variant="destructive">
              <AlertDescription>{plansError}</AlertDescription>
            </Alert>
          ) : aiPlans?.latest ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Seus Planos Mais Recentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Gerado em {new Date(aiPlans.latest.generatedAt).toLocaleDateString('pt-BR')} • 
                    {aiPlans.latest.planType === 'ai-generated' ? ' IA Avançada' : ' Plano Personalizado'}
                    {aiPlans.totalPlans > 1 && ` • ${aiPlans.totalPlans} planos salvos`}
                  </p>
                </div>
                <Button onClick={generateNewPlans} disabled={isLoadingPlans}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Novos Planos
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plano de Treino */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Plano de Treino</span>
                    <Badge variant="outline" className="text-xs">
                      {aiPlans.latest.planType === 'ai-generated' ? 'IA' : 'Personalizado'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {aiPlans.latest.workoutPlan.substring(0, 150)}...
                  </p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Completo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Plano de Treino Personalizado</DialogTitle>
                          <DialogDescription>
                            Gerado em {new Date(aiPlans.latest.generatedAt).toLocaleDateString('pt-BR')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                            {aiPlans.latest.workoutPlan}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Plano de Nutrição */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Plano de Nutrição</span>
                    <Badge variant="outline" className="text-xs">
                      {aiPlans.latest.planType === 'ai-generated' ? 'IA' : 'Personalizado'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {aiPlans.latest.nutritionPlan.substring(0, 150)}...
                  </p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Completo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Plano de Nutrição Personalizado</DialogTitle>
                          <DialogDescription>
                            Gerado em {new Date(aiPlans.latest.generatedAt).toLocaleDateString('pt-BR')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                            {aiPlans.latest.nutritionPlan}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Informações do perfil usado */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Baseado no seu perfil:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
                  <span>Idade: {aiPlans.latest.userProfile.age} anos</span>
                  <span>Objetivo: {aiPlans.latest.userProfile.primaryGoal}</span>
                  <span>Nível: {aiPlans.latest.userProfile.experience}</span>
                  <span>Atividade: {aiPlans.latest.userProfile.activityLevel}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto text-purple-300 mb-4" />
              <h4 className="font-medium mb-2">Nenhum plano gerado ainda</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Gere seus planos personalizados de treino e nutrição com IA
              </p>
              <Button onClick={generateNewPlans} disabled={isLoadingPlans}>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Meus Planos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid de conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Treino de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Treino de Hoje
            </CardTitle>
            <CardDescription>
              {shouldTrainOnDay(today, userProfile.daysPerWeek) 
                ? "Seus exercícios programados para hoje"
                : "Hoje é dia de descanso ativo"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shouldTrainOnDay(today, userProfile.daysPerWeek) ? (
              <div className="space-y-4">
                {todaysActivities.length > 0 ? (
                  <>
                    {todaysActivities.map((workout) => (
                      <div key={workout._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{workout.name}</h4>
                          <p className="text-sm text-muted-foreground">{workout.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{workout.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {workout.completed ? (
                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                              ✓ Concluído
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => onMarkComplete(workout._id)}
                              className="text-xs"
                            >
                              Iniciar Treino
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Progresso do dia */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Progresso de Hoje</span>
                      </div>
                      <Progress 
                        value={hasCompletedToday ? 100 : 0} 
                        className="h-2" 
                      />
                      <p className="text-xs text-blue-700 mt-1">
                        {hasCompletedToday ? "Parabéns! Treino concluído" : "Vamos treinar!"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum treino programado para hoje</p>
                    <Button size="sm" className="mt-2">
                      Criar Treino
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Hoje é seu dia de descanso!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aproveite para fazer atividades leves como caminhada ou alongamento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plano Alimentar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Plano Alimentar
            </CardTitle>
            <CardDescription>
              Suas refeições programadas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Progresso calórico */}
              {stats.caloriesGoal && (
                <div className="space-y-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-800">Calorias</span>
                    <span className="text-green-700">
                      {userProfile.progress?.caloriesConsumed || 0} / {stats.caloriesGoal}
                    </span>
                  </div>
                  <Progress value={stats.caloriesProgress} className="h-2" />
                </div>
              )}
              
              {/* Lista de refeições */}
              <div className="space-y-2">
                {mealPlan.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{meal.meal}</span>
                        <Badge variant="outline" className="text-xs">
                          {meal.calories} kcal
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={meal.completed ? "secondary" : "outline"}
                      onClick={() => onMarkComplete(meal.id)}
                      className="text-xs"
                    >
                      {meal.completed ? "✓" : "Registrar"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendário de Treinos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Treinos - Últimos 7 Dias
          </CardTitle>
          <CardDescription>
            Acompanhe sua consistência nos treinos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4">
              {lastSevenDays.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString()
                const isTrainingDay = shouldTrainOnDay(date, userProfile.daysPerWeek)
                const completed = hasCompletedWorkout(date, userProfile)
                const missed = hasMissedWorkout(date, userProfile)
                
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div
                      className={`
                        w-12 h-12 rounded-lg flex flex-col items-center justify-center text-sm font-medium border-2
                        ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                        ${completed ? 'bg-green-500 text-white border-green-500' : ''}
                        ${missed ? 'bg-red-500 text-white border-red-500' : ''}
                        ${isTrainingDay && !completed && !missed ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${!isTrainingDay ? 'bg-gray-50 text-gray-500 border-gray-200' : ''}
                      `}
                    >
                      <span className="text-xs">{date.getDate()}</span>
                      <span className="text-xs">
                        {completed && '✓'}
                        {missed && '✗'}
                        {!isTrainingDay && '—'}
                        {isTrainingDay && !completed && !missed && '○'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Legenda */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Treino concluído</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Treino perdido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div>
                <span>Treino programado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200"></div>
                <span>Descanso</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}