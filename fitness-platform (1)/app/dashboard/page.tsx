"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  CheckCircle2,
  Circle,
  Dumbbell,
  Flame,
  Heart,
  HeartPulse,
  Info,
  Utensils,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

// Interface para os dados do perfil do usuário
interface UserProfile {
  _id: string
  userId: string
  gender: string
  weight: number
  height: number
  daysPerWeek: number
  timePerDay: number
  // Campos específicos para cada tipo de programa
  painAreas?: string[]
  goal?: string
  fitnessLevel?: string
  dietType?: string
  // Dados de progresso
  progress: {
    caloriesGoal?: number
    caloriesConsumed?: number
    caloriesBurned?: number
    weightChange?: number
    stepsGoal?: number
    stepsToday?: number
    weeklyActivity?: number
    weeklyGoal?: number
    initialPainLevel?: number
    currentPainLevel?: number
    weeklyExercises?: number
    completedExercises?: number
    heartRate?: {
      resting: number
      initial: number
    }
    macros?: {
      protein: number
      carbs: number
      fat: number
    }
  }
  // Exercícios e atividades
  exercises?: Array<{
    _id: string // Adicionado _id
    name: string
    description: string
    duration: string
    completed: boolean
    date: Date
  }>
  activities?: Array<{
    _id: string // Adicionado _id
    name: string
    description: string
    duration: string
    completed: boolean
    date: Date
  }>
  workouts?: Array<{
    _id: string // Adicionado _id
    name: string
    description: string
    duration: string
    caloriesBurned: number
    completed: boolean
    date: Date
  }>
  meals?: Array<{
    _id: string // Adicionado _id
    name: string
    description: string
    calories: number
    date: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export default function DashboardPage() {
  const [programType, setProgramType] = useState<"rehabilitation" | "sedentary" | "training-diet" | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const session = useSession()
  const router = useRouter()
  const [showPainDialog, setShowPainDialog] = useState(false)
  const [currentPainLevel, setCurrentPainLevel] = useState(5) // Initialize with a default value

  // Função para marcar um exercício como concluído
  const markActivityAsCompleted = async (activityId: string) => {
    try {
      const response = await fetch("/api/activities/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          programType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Verificar se todos os exercícios do dia foram concluídos
        if (programType === "rehabilitation") {
          const updatedExercises = userProfile?.exercises || []
          const todayExercises = updatedExercises.filter((ex) => {
            const exDate = new Date(ex.date)
            const today = new Date()
            return (
              exDate.getDate() === today.getDate() &&
              exDate.getMonth() === today.getMonth() &&
              exDate.getFullYear() === today.getFullYear()
            )
          })

          const allCompleted = todayExercises.every((ex) => ex._id === activityId || ex.completed)

          if (allCompleted) {
            setShowPainDialog(true)
          }
        }

        // Atualizar o estado local para refletir a mudança
        fetchUserData()
      } else {
        setError(data.message || "Erro ao marcar atividade como concluída")
      }
    } catch (error) {
      console.error("Erro ao marcar atividade como concluída:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    }
  }

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!session.data) return

      // Determinar qual API chamar com base no programa do usuário
      const program = session.data?.user?.program || new URLSearchParams(window.location.search).get("program") || null

      if (!program) {
        setError("Nenhum programa selecionado")
        setIsLoading(false)
        return
      }

      setProgramType(program as "rehabilitation" | "sedentary" | "training-diet")

      // Carregar dados específicos do programa
      let endpoint = ""

      switch (program) {
        case "rehabilitation":
          endpoint = "/api/rehabilitation"
          break
        case "sedentary":
          endpoint = "/api/sedentary"
          break
        case "training-diet":
          endpoint = "/api/training-diet"
          break
        default:
          setError("Programa não reconhecido")
          setIsLoading(false)
          return
      }

      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        setUserProfile(data.data)

        // Se não houver exercícios, criar exercícios padrão para reabilitação
        if (program === "rehabilitation" && (!data.data.exercises || data.data.exercises.length === 0)) {
          await createDefaultExercises()
        }
      } else {
        setError(data.message || "Erro ao carregar dados do usuário")
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para criar exercícios padrão para reabilitação
  const createDefaultExercises = async () => {
    try {
      const response = await fetch("/api/rehabilitation/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Recarregar os dados do usuário para obter os exercícios criados
        fetchUserData()
      } else {
        console.error("Erro ao criar exercícios padrão:", data.message)
      }
    } catch (error) {
      console.error("Erro ao criar exercícios padrão:", error)
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchUserData()
    } else if (session.status === "unauthenticated") {
      router.push("/login")
    }
  }, [session.status])

  // Função para verificar se uma data tem um treino completo
  const hasCompletedWorkout = (date: Date | undefined) => {
    if (!date || !userProfile) return false

    const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []

    return activities.some((activity) => {
      const activityDate = new Date(activity.date)
      return (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear() &&
        activity.completed
      )
    })
  }

  // Função para verificar se uma data tem um treino perdido
  const hasMissedWorkout = (date: Date | undefined) => {
    if (!date || !userProfile) return false

    // Não podemos perder treinos futuros
    const today = new Date()
    if (date > today) return false

    // Não podemos perder treinos antes da data de cadastro
    const createdAt = new Date(userProfile.createdAt)
    if (date < createdAt) return false

    // Verificar se é um dia de treino
    if (!shouldTrainOnDay(date, userProfile.daysPerWeek)) return false

    const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []

    // Se não há atividades neste dia e é um dia passado, é um treino perdido
    const hasActivitiesOnDate = activities.some((activity) => {
      const activityDate = new Date(activity.date)
      return (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear()
      )
    })

    return !hasActivitiesOnDate
  }

  // Função para determinar se um dia é dia de treino
  const shouldTrainOnDay = (date: Date, daysPerWeek: number): boolean => {
    // Para reabilitação, treinar todos os dias
    if (programType === "rehabilitation") return true

    // Se o usuário treina todos os dias
    if (daysPerWeek >= 7) return true

    // Se o usuário não treina
    if (daysPerWeek <= 0) return false

    // Distribuir os dias de treino pela semana
    // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const dayOfWeek = date.getDay()

    if (daysPerWeek === 1) {
      // Se treina 1 dia, será na segunda-feira
      return dayOfWeek === 1
    } else if (daysPerWeek === 2) {
      // Se treina 2 dias, será segunda e quinta
      return dayOfWeek === 1 || dayOfWeek === 4
    } else if (daysPerWeek === 3) {
      // Se treina 3 dias, será segunda, quarta e sexta
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5
    } else if (daysPerWeek === 4) {
      // Se treina 4 dias, será segunda, terça, quinta e sexta
      return dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 5
    } else if (daysPerWeek === 5) {
      // Se treina 5 dias, será todos os dias úteis
      return dayOfWeek >= 1 && dayOfWeek <= 5
    } else if (daysPerWeek === 6) {
      // Se treina 6 dias, será todos os dias exceto domingo
      return dayOfWeek >= 1 && dayOfWeek <= 6
    }

    return false
  }

  // Calcular progresso semanal
  const calculateWeeklyProgress = () => {
    if (!userProfile) return { completed: 0, total: 0, percentage: 0 }

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Domingo

    const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []

    // Contar atividades concluídas esta semana
    const completedThisWeek = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return activity.completed && activityDate >= startOfWeek && activityDate <= today
    }).length

    // Total de dias de treino planejados para a semana
    let totalTrainingDays = 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      if (shouldTrainOnDay(date, userProfile.daysPerWeek)) {
        totalTrainingDays++
      }
    }

    // Evitar divisão por zero
    if (totalTrainingDays === 0) return { completed: 0, total: 0, percentage: 0 }

    return {
      completed: completedThisWeek,
      total: totalTrainingDays,
      percentage: Math.min(100, Math.round((completedThisWeek / totalTrainingDays) * 100)),
    }
  }

  // Componentes específicos para cada tipo de programa
  const RehabilitationDashboard = () => {
    if (!userProfile) return null

    const exercises = userProfile.exercises || []
    const progressData = userProfile.progress || {} // Use progressData here
    const painAreas = userProfile.painAreas || []

    // Dicas para reabilitação
    const tips = [
      "Mantenha uma postura adequada durante o dia",
      "Evite ficar sentado por longos períodos",
      "Use uma cadeira com suporte lombar",
      "Aplique compressa morna na região antes dos exercícios",
    ]

    // Calcular progresso
    const weeklyProgress = calculateWeeklyProgress()
    const painReduction =
      progressData.initialPainLevel && progressData.currentPainLevel
        ? Math.max(0, progressData.initialPainLevel - progressData.currentPainLevel)
        : 0
    const painReductionPercentage = progressData.initialPainLevel
      ? Math.round((painReduction / progressData.initialPainLevel) * 100)
      : 0

    // Exercícios para hoje
    const today = new Date()
    const exercisesForToday = exercises.filter((ex) => {
      const exDate = new Date(ex.date)
      return (
        exDate.getDate() === today.getDate() &&
        exDate.getMonth() === today.getMonth() &&
        exDate.getFullYear() === today.getFullYear()
      )
    })

    // Se não há exercícios para hoje, mostrar os exercícios padrão
    const displayExercises = exercisesForToday.length > 0 ? exercisesForToday : exercises

    const updatePainLevel = async () => {
      try {
        const response = await fetch("/api/rehabilitation/pain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            painLevel: currentPainLevel,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setShowPainDialog(false)
          fetchUserData() // Recarregar dados
        } else {
          setError(data.message || "Erro ao atualizar nível de dor")
        }
      } catch (error) {
        console.error("Erro ao atualizar nível de dor:", error)
        setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
      }
    }

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progresso da Reabilitação</CardTitle>
              <CardDescription>Redução da dor e recuperação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso semanal</span>
                <span className="text-sm font-medium">{weeklyProgress.percentage}%</span>
              </div>
              <Progress value={weeklyProgress.percentage} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor inicial</p>
                  <p className="text-xl font-bold">
                    {progressData.initialPainLevel || 0}
                    <span className="text-sm">/10</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor atual</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {progressData.currentPainLevel || 0}
                    <span className="text-sm">/10</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Área de Tratamento</CardTitle>
              <CardDescription>Região: {painAreas.map((area) => area.replace("-", " ")).join(", ")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="font-medium">Exercícios semanais: {progressData.weeklyExercises || 0}</p>
                <p className="text-sm text-muted-foreground">Completados: {progressData.completedExercises || 0}</p>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Lembrete</AlertTitle>
                <AlertDescription>
                  Não force além do seu limite de dor. Pare se sentir desconforto intenso.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Calendário de Exercícios</CardTitle>
              <CardDescription>Acompanhe sua frequência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />
                  <span>Concluído</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  <span>Perdido</span>
                </div>
                <div className="flex items-center">
                  <Circle className="h-4 w-4 mr-1" />
                  <span>Planejado</span>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                components={{
                  Day: ({ date, ...props }) => {
                    // Remover qualquer propriedade que não seja reconhecida pelo DOM
                    const { displayMonth, ...domProps } = props as any

                    // Verificar se é um dia de treino
                    const isTrainingDay = date && shouldTrainOnDay(date, userProfile.daysPerWeek)

                    return (
                      <button
                        {...domProps}
                        className={`${typeof domProps.className === "string" ? domProps.className : ""} ${isTrainingDay ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                      >
                        {date && hasCompletedWorkout(date) ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : date && hasMissedWorkout(date) ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : date && isTrainingDay ? (
                          <div className="relative">
                            {date.getDate()}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                          </div>
                        ) : date ? (
                          date.getDate()
                        ) : (
                          ""
                        )}
                      </button>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="exercises" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="exercises">Exercícios de Hoje</TabsTrigger>
              <TabsTrigger value="tips">Dicas e Cuidados</TabsTrigger>
            </TabsList>
            <TabsContent value="exercises" className="mt-6">
              {displayExercises.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {displayExercises.map((exercise, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{exercise.name}</CardTitle>
                          <span className="text-sm font-medium">{exercise.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        {!exercise.completed && (
                          <Button
                            onClick={() => markActivityAsCompleted(exercise._id)}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            Marcar como concluído
                          </Button>
                        )}
                        {exercise.completed && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                            disabled
                          >
                            Concluído ✓
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhum exercício programado para hoje. Aproveite o descanso!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="tips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Alívio da Dor</CardTitle>
                  <CardDescription>Recomendações para ajudar na sua recuperação</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Diálogo para atualizar nível de dor */}
        <Dialog open={showPainDialog} onOpenChange={setShowPainDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Como está sua dor hoje?</DialogTitle>
              <DialogDescription>
                Após completar seus exercícios, informe como está seu nível de dor atual.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Sem dor</span>
                  <span>Dor extrema</span>
                </div>
                <Slider
                  value={[currentPainLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCurrentPainLevel(value[0])}
                />
                <div className="text-center">
                  <span className="text-2xl font-bold">{currentPainLevel}</span>
                  <span className="text-sm text-muted-foreground"> / 10</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPainDialog(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={updatePainLevel} className="bg-emerald-600 hover:bg-emerald-700">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const SedentaryDashboard = () => {
    if (!userProfile) return null

    const activities = userProfile.activities || []

    // Dicas para iniciantes
    const tips = [
      "Comece devagar e aumente gradualmente",
      "Hidrate-se bem antes, durante e após a atividade",
      "Use calçados confortáveis e adequados",
      "Priorize a consistência sobre a intensidade",
    ]

    // Atividades para hoje
    const today = new Date()
    const displayActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return (
        activityDate.getDate() === today.getDate() &&
        activityDate.getMonth() === today.getMonth() &&
        activityDate.getFullYear() === today.getFullYear()
      )
    })

    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progresso Semanal</CardTitle>
            <CardDescription>Saindo do sedentarismo</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const weeklyProgress = calculateWeeklyProgress()
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progresso geral</span>
                    <span className="text-sm font-medium">
                      {weeklyProgress.completed}/{weeklyProgress.total} treinos
                    </span>
                  </div>
                  <Progress value={weeklyProgress.percentage} className="h-2 mb-4" />

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Atividade semanal</p>
                      <p className="text-xl font-bold">
                        {weeklyProgress.completed}
                        <span className="text-sm"> / {weeklyProgress.total} treinos</span>
                      </p>
                    </div>
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progresso Diário</CardTitle>
            <CardDescription>Nível: Iniciante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32">
              {(() => {
                // Calcular progresso diário
                const today = new Date()
                const activities = userProfile.activities || []
                const activitiesForToday = activities.filter((activity) => {
                  const activityDate = new Date(activity.date)
                  return (
                    activityDate.getDate() === today.getDate() &&
                    activityDate.getMonth() === today.getMonth() &&
                    activityDate.getFullYear() === today.getFullYear()
                  )
                })

                const totalActivities = activitiesForToday.length || 1
                const completedActivities = activitiesForToday.filter((a) => a.completed).length
                const progressPercentage = (completedActivities / totalActivities) * 100

                return (
                  <>
                    <div className="text-4xl font-bold text-center">
                      {completedActivities}/{totalActivities}
                    </div>
                    <div className="text-sm text-muted-foreground text-center">atividades concluídas hoje</div>
                    <Progress value={progressPercentage} className="h-2 w-full mt-4" />
                  </>
                )
              })()}
            </div>

            <div className="mt-4">
              {displayActivities.length > 0 && !displayActivities[0].completed && (
                <Button
                  onClick={() => markActivityAsCompleted(displayActivities[0]._id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Marcar atividade como concluída
                </Button>
              )}
              {displayActivities.length > 0 && displayActivities[0].completed && (
                <Button
                  variant="outline"
                  className="w-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                  disabled
                >
                  Atividade concluída ✓
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Calendário de Atividades</CardTitle>
            <CardDescription>Acompanhe sua consistência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />
                <span>Concluído</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                <span>Perdido</span>
              </div>
              <div className="flex items-center">
                <Circle className="h-4 w-4 mr-1" />
                <span>Planejado</span>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                Day: ({ date, ...props }) => {
                  // Remover qualquer propriedade que não seja reconhecida pelo DOM
                  const { displayMonth, ...domProps } = props as any

                  // Verificar se é um dia de treino
                  const isTrainingDay = date && shouldTrainOnDay(date, userProfile.daysPerWeek)

                  return (
                    <button
                      {...domProps}
                      className={`${typeof domProps.className === "string" ? domProps.className : ""} ${isTrainingDay ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                    >
                      {date && hasCompletedWorkout(date) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : date && hasMissedWorkout(date) ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : date && isTrainingDay ? (
                        <div className="relative">
                          {date.getDate()}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                        </div>
                      ) : date ? (
                        date.getDate()
                      ) : (
                        ""
                      )}
                    </button>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        <div className="mt-8">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="activities">Atividades de Hoje</TabsTrigger>
              <TabsTrigger value="tips">Dicas</TabsTrigger>
              <TabsTrigger value="progress">Meu Progresso</TabsTrigger>
            </TabsList>
            <TabsContent value="activities" className="mt-6">
              {displayActivities.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {displayActivities.map((activity, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{activity.name}</CardTitle>
                          <span className="text-sm font-medium">{activity.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {!activity.completed && (
                          <Button
                            onClick={() => markActivityAsCompleted(activity._id)}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            Marcar como concluído
                          </Button>
                        )}
                        {activity.completed && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                            disabled
                          >
                            Concluído ✓
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhuma atividade programada para hoje. Aproveite o descanso!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="tips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Iniciantes</CardTitle>
                  <CardDescription>Recomendações para quem está começando</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequência Cardíaca</CardTitle>
                    <CardDescription>Evolução da sua frequência cardíaca em repouso</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    {(() => {
                      const progressData = userProfile.progress || {}
                      return (
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <HeartPulse className="h-8 w-8 text-red-500 mr-2" />
                            <p className="text-3xl font-bold">
                              {progressData.heartRate?.resting || 0} <span className="text-lg">bpm</span>
                            </p>
                          </div>
                          {progressData.heartRate?.initial && progressData.heartRate?.resting && (
                            <p className="text-sm text-emerald-600 mt-2">
                              Redução de {progressData.heartRate.initial - progressData.heartRate.resting} bpm desde o
                              início
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-4">
                            Uma frequência cardíaca de repouso mais baixa geralmente indica melhor condicionamento
                            cardiovascular.
                          </p>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Física</CardTitle>
                    <CardDescription>Minutos de atividade por semana</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    {(() => {
                      const progressData = userProfile.progress || {}
                      return (
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <Activity className="h-8 w-8 text-emerald-600 mr-2" />
                            <p className="text-3xl font-bold">
                              {(progressData.weeklyActivity || 0) * 60} <span className="text-lg">min</span>
                            </p>
                          </div>
                          {progressData.weeklyActivity && progressData.weeklyGoal && (
                            <p className="text-sm text-emerald-600 mt-2">
                              {Math.round((progressData.weeklyActivity / progressData.weeklyGoal) * 100)}% da meta
                              semanal
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-4">
                            Recomendação: 150 minutos de atividade moderada por semana.
                          </p>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  }

  const TrainingDietDashboard = () => {
    if (!userProfile) return null

    const workouts = userProfile.workouts || []
    const meals = userProfile.meals || []
    const progressData = userProfile.progress || {}

    // Calcular progresso
    const weeklyProgress = calculateWeeklyProgress()

    // Treinos para hoje
    const today = new Date()
    const workoutsForToday = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return (
        workoutDate.getDate() === today.getDate() &&
        workoutDate.getMonth() === today.getMonth() &&
        workoutDate.getFullYear() === today.getFullYear()
      )
    })

    // Se não há treinos para hoje, mostrar os treinos padrão
    const displayWorkouts = workoutsForToday.length > 0 ? workoutsForToday : workouts

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progresso do Objetivo</CardTitle>
              <CardDescription>
                Meta: {userProfile.goal === "lose-weight" ? "Emagrecer" : "Ganhar Massa Muscular"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso semanal</span>
                <span className="text-sm font-medium">{weeklyProgress.percentage}%</span>
              </div>
              <Progress value={weeklyProgress.percentage} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mudança de peso</p>
                  <p className="text-xl font-bold text-emerald-600">{progressData.weightChange || 0} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Calorias hoje</p>
                  <p className="text-xl font-bold">
                    {progressData.caloriesConsumed || 0}{" "}
                    <span className="text-sm">/ {progressData.caloriesGoal || 0}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Treino de Hoje</CardTitle>
              <CardDescription>
                Calorias queimadas: {displayWorkouts.length > 0 ? displayWorkouts[0].caloriesBurned : 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Duração total: {displayWorkouts.length > 0 ? displayWorkouts[0].duration : "0 min"}
                  </p>
                  <p className="text-sm text-muted-foreground">{displayWorkouts.length} exercícios</p>
                </div>
                {displayWorkouts.length > 0 && !displayWorkouts[0].completed && (
                  <Button
                    onClick={() => markActivityAsCompleted(displayWorkouts[0]._id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Marcar como concluído
                  </Button>
                )}
                {displayWorkouts.length > 0 && displayWorkouts[0].completed && (
                  <Button
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                    disabled
                  >
                    Concluído ✓
                  </Button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                  <Flame className="h-5 w-5 text-orange-500 mb-1" />
                  <span className="text-xs font-medium">
                    {displayWorkouts.length > 0 ? displayWorkouts[0].caloriesBurned : 0} kcal
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                  <Dumbbell className="h-5 w-5 text-slate-600 mb-1" />
                  <span className="text-xs font-medium">Força</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                  <Heart className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xs font-medium">Cardio</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Calendário de Treinos</CardTitle>
              <CardDescription>Acompanhe sua frequência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />
                  <span>Concluído</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  <span>Perdido</span>
                </div>
                <div className="flex items-center">
                  <Circle className="h-4 w-4 mr-1" />
                  <span>Planejado</span>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                components={{
                  Day: ({ date, ...props }) => {
                    // Remover qualquer propriedade que não seja reconhecida pelo DOM
                    const { displayMonth, ...domProps } = props as any

                    // Verificar se é um dia de treino
                    const isTrainingDay = date && shouldTrainOnDay(date, userProfile.daysPerWeek)

                    return (
                      <button
                        {...domProps}
                        className={`${typeof domProps.className === "string" ? domProps.className : ""} ${isTrainingDay ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                      >
                        {date && hasCompletedWorkout(date) ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : date && hasMissedWorkout(date) ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : date && isTrainingDay ? (
                          <div className="relative">
                            {date.getDate()}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                          </div>
                        ) : date ? (
                          date.getDate()
                        ) : (
                          ""
                        )}
                      </button>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="workout">Treino de Hoje</TabsTrigger>
              <TabsTrigger value="diet">Plano Alimentar</TabsTrigger>
              <TabsTrigger value="progress">Meu Progresso</TabsTrigger>
            </TabsList>
            <TabsContent value="workout" className="mt-6">
              {displayWorkouts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {displayWorkouts.map((workout, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{workout.name}</CardTitle>
                          <span className="text-sm font-medium">{workout.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{workout.description}</p>
                        {!workout.completed && (
                          <Button
                            onClick={() => markActivityAsCompleted(workout._id)}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            Marcar como concluído
                          </Button>
                        )}
                        {workout.completed && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                            disabled
                          >
                            Concluído ✓
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhum treino programado para hoje. Aproveite o descanso!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="diet" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Resumo Nutricional</CardTitle>
                      <CardDescription>Distribuição de macronutrientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Proteínas</span>
                            <span className="text-sm">{progressData.macros?.protein || 0}%</span>
                          </div>
                          <Progress value={progressData.macros?.protein || 0} className="h-2 bg-blue-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Carboidratos</span>
                            <span className="text-sm">{progressData.macros?.carbs || 0}%</span>
                          </div>
                          <Progress value={progressData.macros?.carbs || 0} className="h-2 bg-amber-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Gorduras</span>
                            <span className="text-sm">{progressData.macros?.fat || 0}%</span>
                          </div>
                          <Progress value={progressData.macros?.fat || 0} className="h-2 bg-green-100" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <Utensils className="h-5 w-5 mr-2 text-emerald-600" />
                          <span className="font-medium">Calorias consumidas</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{progressData.caloriesConsumed || 0}</span>
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            / {progressData.caloriesGoal || 0} kcal
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {meals.length > 0 ? (
                  meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{meal.name}</CardTitle>
                        <CardDescription>{meal.calories} kcal</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{meal.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        Nenhum plano alimentar definido. Configure seu plano na seção de dieta.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent value="progress" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Peso</CardTitle>
                    <CardDescription>Acompanhamento semanal</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userProfile.weight || 0} kg</p>
                      <p className="text-sm text-emerald-600">{progressData.weightChange || 0} kg desde o início</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Última atualização: {new Date(userProfile.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Composição Corporal</CardTitle>
                    <CardDescription>Estimativa de percentual de gordura</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">Dados não disponíveis</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Atualize seu perfil para ver estimativas de composição corporal
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  }

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">FitJourney</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Perfil
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Sair
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Carregando seu dashboard...</h2>
            <p className="text-muted-foreground mt-2">Estamos preparando seus dados personalizados</p>
          </div>
        </main>
      </div>
    )
  }

  // Tela de erro
  if (error || !programType) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">FitJourney</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Perfil
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Sair
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Erro ao carregar dashboard</CardTitle>
                <CardDescription>
                  {error || "Nenhum programa selecionado. Por favor, escolha um programa."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error || "Você precisa selecionar um programa para continuar."}</AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push("/program-selection")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Selecionar Programa
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">FitJourney</span>
            <Badge variant="outline" className="ml-2">
              {programType === "rehabilitation" && "Reabilitação"}
              {programType === "sedentary" && "Saindo do Sedentarismo"}
              {programType === "training-diet" && "Treino + Dieta"}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Perfil
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter">
              {programType === "rehabilitation" && "Programa de Reabilitação"}
              {programType === "sedentary" && "Programa Saindo do Sedentarismo"}
              {programType === "training-diet" && "Programa Treino + Dieta"}
            </h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e treinos diários.</p>
          </div>

          {programType === "rehabilitation" && <RehabilitationDashboard />}
          {programType === "sedentary" && <SedentaryDashboard />}
          {programType === "training-diet" && <TrainingDietDashboard />}
        </div>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FitJourney. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
