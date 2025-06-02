"use client"

import { CardFooter } from "@/components/ui/data-display/card"
import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Progress } from "@/components/ui/feedback/progress"
import { Calendar } from "@/components/ui/data-display/calendar"
import { Badge } from "@/components/ui/feedback/badge"
import {
  Activity,
  ArrowUp,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert"
import { useSession } from "next-auth/react"

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
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const session = useSession()
  const router = useRouter()

  // Referência para controlar se já estamos buscando dados
  const isFetchingRef = useRef(false)
  // Referência para controlar se a sessão já foi atualizada
  const sessionUpdatedRef = useRef(false)

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
  const fetchUserData = useCallback(async () => {
    // Evitar múltiplas chamadas simultâneas
    if (isFetchingRef.current) {
      console.log("Já existe uma requisição em andamento, ignorando...")
      return
    }

    isFetchingRef.current = true

    try {
      setIsLoading(true)
      setError(null)

      if (!session.data) {
        console.log("Sessão não disponível, aguardando...")
        isFetchingRef.current = false
        setIsLoading(false)
        return
      }

      // Determinar qual API chamar com base no programa do usuário
      let currentProgram = session.data?.user?.program

      if (!currentProgram) {
        console.log("Nenhum programa encontrado na sessão, verificando no banco de dados...")

        try {
          const programResponse = await fetch("/api/user/program")
          if (!programResponse.ok) {
            throw new Error(`Erro ao buscar programa: ${programResponse.status}`)
          }

          const programData = await programResponse.json()

          if (programData.success && programData.program) {
            console.log("Programa encontrado no banco de dados:", programData.program)
            currentProgram = programData.program
            setProgramType(currentProgram as "rehabilitation" | "sedentary" | "training-diet")

            // Atualizar a sessão com o programa do usuário apenas uma vez
            if (!sessionUpdatedRef.current) {
              try {
                await session.update({ program: programData.program })
                sessionUpdatedRef.current = true
                console.log("Sessão atualizada com sucesso")
              } catch (updateError) {
                console.error("Erro ao atualizar sessão:", updateError)
                // Continuar mesmo com erro na atualização da sessão
              }
            }
          } else {
            setError("Nenhum programa selecionado")
            isFetchingRef.current = false
            setIsLoading(false)
            return
          }
        } catch (programError) {
          console.error("Erro ao buscar programa do usuário:", programError)
          setError("Erro ao buscar programa do usuário. Por favor, tente novamente.")
          isFetchingRef.current = false
          setIsLoading(false)
          return
        }
      } else {
        console.log("Programa encontrado na sessão:", currentProgram)
        setProgramType(currentProgram as "rehabilitation" | "sedentary" | "training-diet")
      }

      // Carregar dados específicos do programa
      let endpoint = ""

      switch (currentProgram) {
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
          isFetchingRef.current = false
          setIsLoading(false)
          return
      }

      console.log("Buscando dados do programa em:", endpoint)

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Erro na resposta da API: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          console.log("Dados do programa carregados com sucesso")
          setUserProfile(data.data)
        } else {
          console.error("Erro retornado pela API:", data.message)
          setError(data.message || "Erro ao carregar dados do usuário")
        }
      } catch (fetchError) {
        console.error("Erro ao carregar dados do usuário:", fetchError)
        setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
      }
    } catch (error) {
      console.error("Erro geral ao carregar dados do usuário:", error)
      setError("Erro ao carregar dados do usuário. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
      isFetchingRef.current = false
    }
  }, [session])

  useEffect(() => {
    // Verificar se a sessão está autenticada
    if (session.status === "authenticated") {
      console.log("Sessão autenticada, carregando dados...")
      fetchUserData()
    } else if (session.status === "unauthenticated") {
      router.push("/login")
    }
  }, [session.status, fetchUserData, router])

  // Componente personalizado para o dia do calendário
  const CustomDay = ({ date: dayDate, ...props }: any) => {
    if (!dayDate || !userProfile) return <button {...props}>{props.children}</button>

    // Verificar se é um dia de treino
    const isTrainingDay = shouldTrainOnDay(dayDate, userProfile.daysPerWeek)

    // Remover a propriedade displayMonth que está causando o erro
    const { displayMonth, ...restProps } = props

    return (
      <button
        {...restProps}
        className={`${props.className || ""} ${isTrainingDay ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
      >
        {hasCompletedWorkout(dayDate) ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : hasMissedWorkout(dayDate) ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : isTrainingDay ? (
          <div className="relative">
            {dayDate.getDate()}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
          </div>
        ) : (
          dayDate.getDate()
        )}
      </button>
    )
  }

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
    if (!userProfile) return 0

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Domingo

    const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []

    // Contar atividades concluídas esta semana
    const completedThisWeek = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return activity.completed && activityDate >= startOfWeek && activityDate <= today
    }).length

    // Calcular quantos dias de treino já passaram esta semana
    let trainingDaysPassed = 0
    for (let i = 0; i <= today.getDay(); i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      if (shouldTrainOnDay(date, userProfile.daysPerWeek)) {
        trainingDaysPassed++
      }
    }

    // Evitar divisão por zero
    if (trainingDaysPassed === 0) return 0

    return Math.min(100, Math.round((completedThisWeek / trainingDaysPassed) * 100))
  }

  // Componentes específicos para cada tipo de programa
  const RehabilitationDashboard = () => {
    if (!userProfile) return null

    const exercises = userProfile.exercises || []
    const progress = userProfile.progress || {}
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
      progress.initialPainLevel && progress.currentPainLevel
        ? Math.max(0, progress.initialPainLevel - progress.currentPainLevel)
        : 0
    const painReductionPercentage = progress.initialPainLevel
      ? Math.round((painReduction / progress.initialPainLevel) * 100)
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
                <span className="text-sm font-medium">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor inicial</p>
                  <p className="text-xl font-bold">
                    {progress.initialPainLevel || 0}
                    <span className="text-sm">/10</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor atual</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {progress.currentPainLevel || 0}
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
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Exercícios semanais: {progress.weeklyExercises || 0}</p>
                  <p className="text-sm text-muted-foreground">Completados: {progress.completedExercises || 0}</p>
                </div>
                {displayExercises.length > 0 && !displayExercises[0].completed && (
                  <Button
                    onClick={() => markActivityAsCompleted(displayExercises[0]._id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Marcar como concluído
                  </Button>
                )}
                {displayExercises.length > 0 && displayExercises[0].completed && (
                  <Button
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                    disabled
                  >
                    Concluído ✓
                  </Button>
                )}
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
                  Day: CustomDay,
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
      </>
    )
  }

  const SedentaryDashboard = () => {
    if (!userProfile) return null

    const activities = userProfile.activities || []
    const progress = userProfile.progress || {}

    // Dicas para iniciantes
    const tips = [
      "Comece devagar e aumente gradualmente",
      "Hidrate-se bem antes, durante e após a atividade",
      "Use calçados confortáveis e adequados",
      "Priorize a consistência sobre a intensidade",
    ]

    // Calcular progresso
    const weeklyProgress = calculateWeeklyProgress()

    // Atividades para hoje
    const today = new Date()
    const activitiesForToday = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return (
        activityDate.getDate() === today.getDate() &&
        activityDate.getMonth() === today.getMonth() &&
        activityDate.getFullYear() === today.getFullYear()
      )
    })

    // Se não há atividades para hoje, mostrar as atividades padrão
    const displayActivities = activitiesForToday.length > 0 ? activitiesForToday : activities

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progresso Semanal</CardTitle>
              <CardDescription>Saindo do sedentarismo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso geral</span>
                <span className="text-sm font-medium">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Atividade semanal</p>
                  <p className="text-xl font-bold">
                    {progress.weeklyActivity || 0}
                    <span className="text-sm"> / {progress.weeklyGoal || 0} horas</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Frequência cardíaca</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold">{progress.heartRate?.resting || 0}</p>
                    <span className="text-sm ml-1">bpm</span>
                    {progress.heartRate?.initial && progress.heartRate?.resting && (
                      <span className="text-xs text-emerald-600 ml-2 flex items-center">
                        <ArrowUp className="h-3 w-3 rotate-180" />
                        {progress.heartRate.initial - progress.heartRate.resting}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Passos Diários</CardTitle>
              <CardDescription>Nível: Iniciante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-4xl font-bold text-center">{progress.stepsToday || 0}</div>
                <div className="text-sm text-muted-foreground text-center">de {progress.stepsGoal || 5000} passos</div>
                <Progress
                  value={
                    progress.stepsToday && progress.stepsGoal ? (progress.stepsToday / progress.stepsGoal) * 100 : 0
                  }
                  className="h-2 w-full mt-4"
                />
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
                  Day: CustomDay,
                }}
              />
            </CardContent>
          </Card>
        </div>

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
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <HeartPulse className="h-8 w-8 text-red-500 mr-2" />
                        <p className="text-3xl font-bold">
                          {progress.heartRate?.resting || 0} <span className="text-lg">bpm</span>
                        </p>
                      </div>
                      {progress.heartRate?.initial && progress.heartRate?.resting && (
                        <p className="text-sm text-emerald-600 mt-2">
                          Redução de {progress.heartRate.initial - progress.heartRate.resting} bpm desde o início
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-4">
                        Uma frequência cardíaca de repouso mais baixa geralmente indica melhor condicionamento
                        cardiovascular.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Física</CardTitle>
                    <CardDescription>Minutos de atividade por semana</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Activity className="h-8 w-8 text-emerald-600 mr-2" />
                        <p className="text-3xl font-bold">
                          {(progress.weeklyActivity || 0) * 60} <span className="text-lg">min</span>
                        </p>
                      </div>
                      {progress.weeklyActivity && progress.weeklyGoal && (
                        <p className="text-sm text-emerald-600 mt-2">
                          {Math.round((progress.weeklyActivity / progress.weeklyGoal) * 100)}% da meta semanal
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-4">
                        Recomendação: 150 minutos de atividade moderada por semana.
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

  const TrainingDietDashboard = () => {
    if (!userProfile) return null

    const workouts = userProfile.workouts || []
    const meals = userProfile.meals || []
    const progress = userProfile.progress || {}

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
                <span className="text-sm font-medium">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mudança de peso</p>
                  <p className="text-xl font-bold text-emerald-600">{progress.weightChange || 0} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Calorias hoje</p>
                  <p className="text-xl font-bold">
                    {progress.caloriesConsumed || 0} <span className="text-sm">/ {progress.caloriesGoal || 0}</span>
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
                  Day: CustomDay,
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
                            <span className="text-sm">{progress.macros?.protein || 0}%</span>
                          </div>
                          <Progress value={progress.macros?.protein || 0} className="h-2 bg-blue-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Carboidratos</span>
                            <span className="text-sm">{progress.macros?.carbs || 0}%</span>
                          </div>
                          <Progress value={progress.macros?.carbs || 0} className="h-2 bg-amber-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Gorduras</span>
                            <span className="text-sm">{progress.macros?.fat || 0}%</span>
                          </div>
                          <Progress value={progress.macros?.fat || 0} className="h-2 bg-green-100" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <Utensils className="h-5 w-5 mr-2 text-emerald-600" />
                          <span className="font-medium">Calorias consumidas</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{progress.caloriesConsumed || 0}</span>
                          <span className="text-sm text-muted-foreground"> / {progress.caloriesGoal || 0} kcal</span>
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
                      <p className="text-sm text-emerald-600">{progress.weightChange || 0} kg desde o início</p>
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
              <CardFooter className="flex flex-col gap-2">
                <Button onClick={() => fetchUserData()} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Tentar Novamente
                </Button>
                <Button onClick={() => router.push("/program-selection")} className="w-full" variant="outline">
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
