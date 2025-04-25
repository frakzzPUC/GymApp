"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Adicione estes imports no topo do arquivo
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  // Em uma aplicação real, isso viria de um banco de dados ou API
  const [programType, setProgramType] = useState<"rehabilitation" | "sedentary" | "training-diet">("rehabilitation")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [workoutCompleted, setWorkoutCompleted] = useState(false)
  const session = useSession() // Move the hook outside the useEffect

  // Substitua o useEffect existente por este que carrega dados do usuário
  useEffect(() => {
    // Aqui você carregaria os dados do usuário de uma API
    const fetchUserData = async () => {
      try {
        if (!session.data) return

        // Determinar qual API chamar com base no programa do usuário
        const program =
          session.data?.user?.program || new URLSearchParams(window.location.search).get("program") || "rehabilitation"

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
            return
        }

        const response = await fetch(endpoint)
        const data = await response.json()

        if (data.success) {
          // Aqui você atualizaria o estado com os dados do usuário
          console.log("Dados do usuário carregados:", data.data)

          // Exemplo de como você poderia atualizar o estado
          // setProgramData(data.data)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    }

    fetchUserData()
  }, [session])

  // Mock data para o dashboard
  const weeklyProgress = 4 // 4 de 7 dias
  const totalDays = 7
  const progressPercentage = (weeklyProgress / totalDays) * 100

  // Mock calendar data - treinos passados
  const pastWorkouts = [
    { date: new Date(2023, 3, 1), completed: true },
    { date: new Date(2023, 3, 3), completed: true },
    { date: new Date(2023, 3, 5), completed: true },
    { date: new Date(2023, 3, 7), completed: false },
    { date: new Date(2023, 3, 9), completed: true },
  ]

  // Função para verificar se uma data tem um treino completo
  const hasCompletedWorkout = (date: Date | undefined) => {
    if (!date) return false

    return pastWorkouts.some(
      (workout) =>
        workout.date.getDate() === date.getDate() &&
        workout.date.getMonth() === date.getMonth() &&
        workout.date.getFullYear() === date.getFullYear() &&
        workout.completed,
    )
  }

  // Função para verificar se uma data tem um treino perdido
  const hasMissedWorkout = (date: Date | undefined) => {
    if (!date) return false

    return pastWorkouts.some(
      (workout) =>
        workout.date.getDate() === date.getDate() &&
        workout.date.getMonth() === date.getMonth() &&
        workout.date.getFullYear() === date.getFullYear() &&
        !workout.completed,
    )
  }

  // Dados específicos para cada tipo de programa
  const programData = {
    rehabilitation: {
      title: "Programa de Reabilitação",
      painArea: "Lombar",
      progress: 65,
      painLevel: 3, // Em uma escala de 1-10
      initialPainLevel: 7,
      weeklyExercises: 5,
      completedExercises: 3,
      exercises: [
        { name: "Alongamento lombar", duration: "5 min", description: "Alongamento suave para aliviar tensão" },
        { name: "Fortalecimento core", duration: "10 min", description: "Exercícios para fortalecer abdômen e lombar" },
        { name: "Mobilidade pélvica", duration: "8 min", description: "Movimentos para melhorar a mobilidade" },
        { name: "Relaxamento", duration: "5 min", description: "Técnicas de respiração e relaxamento" },
      ],
      tips: [
        "Mantenha uma postura adequada durante o dia",
        "Evite ficar sentado por longos períodos",
        "Use uma cadeira com suporte lombar",
        "Aplique compressa morna na região antes dos exercícios",
      ],
    },
    sedentary: {
      title: "Programa Saindo do Sedentarismo",
      level: "Iniciante",
      progress: 40,
      stepsGoal: 5000,
      stepsToday: 3200,
      weeklyActivity: 3, // horas
      weeklyGoal: 5, // horas
      heartRate: {
        resting: 72,
        initial: 78,
      },
      exercises: [
        { name: "Caminhada leve", duration: "20 min", description: "Caminhada em ritmo confortável" },
        { name: "Alongamentos básicos", duration: "10 min", description: "Alongamentos para todo o corpo" },
        { name: "Exercícios de mobilidade", duration: "10 min", description: "Movimentos para melhorar a amplitude" },
        { name: "Respiração e relaxamento", duration: "5 min", description: "Técnicas de respiração consciente" },
      ],
      tips: [
        "Comece devagar e aumente gradualmente",
        "Hidrate-se bem antes, durante e após a atividade",
        "Use calçados confortáveis e adequados",
        "Priorize a consistência sobre a intensidade",
      ],
    },
    "training-diet": {
      title: "Programa Treino + Dieta",
      goal: "Emagrecimento",
      progress: 75,
      caloriesGoal: 1800,
      caloriesConsumed: 1650,
      caloriesBurned: 320,
      dietType: "balanced", // Pode ser "economic", "balanced" ou "premium"
      macros: {
        protein: 35, // percentual
        carbs: 40,
        fat: 25,
      },
      weightChange: -2.5, // kg
      exercises: [
        { name: "Aquecimento", duration: "5 min", description: "Aquecimento articular e cardio leve" },
        { name: "Treino HIIT", duration: "20 min", description: "Intervalos de alta intensidade" },
        { name: "Treino de força", duration: "25 min", description: "Exercícios com peso corporal" },
        { name: "Alongamento", duration: "10 min", description: "Alongamento e volta à calma" },
      ],
      meals: {
        economic: [
          { name: "Café da manhã", calories: 350, description: "Mingau de aveia com banana e canela" },
          { name: "Lanche da manhã", calories: 120, description: "Maçã com uma colher de pasta de amendoim" },
          { name: "Almoço", calories: 500, description: "Arroz, feijão, frango grelhado e salada" },
          { name: "Lanche da tarde", calories: 180, description: "Iogurte natural com granola" },
          { name: "Jantar", calories: 400, description: "Omelete de legumes com torrada integral" },
        ],
        balanced: [
          { name: "Café da manhã", calories: 380, description: "Omelete com legumes e torrada integral" },
          { name: "Lanche da manhã", calories: 150, description: "Iogurte com frutas e castanhas" },
          { name: "Almoço", calories: 550, description: "Frango grelhado, arroz integral e legumes" },
          { name: "Lanche da tarde", calories: 200, description: "Shake proteico com banana" },
          { name: "Jantar", calories: 420, description: "Peixe assado com batata doce e salada" },
        ],
        premium: [
          { name: "Café da manhã", calories: 420, description: "Bowl de açaí com granola orgânica e frutas vermelhas" },
          { name: "Lanche da manhã", calories: 180, description: "Smoothie verde com spirulina e sementes de chia" },
          { name: "Almoço", calories: 580, description: "Salmão orgânico grelhado, quinoa e legumes assados" },
          { name: "Lanche da tarde", calories: 220, description: "Whey protein isolado com abacate e cacau" },
          { name: "Jantar", calories: 450, description: "Peito de frango orgânico, batata doce roxa e brócolis" },
        ],
      },
    },
  }

  // Componentes específicos para cada tipo de programa
  const RehabilitationDashboard = () => {
    const data = programData.rehabilitation

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
                <span className="text-sm font-medium">Progresso geral</span>
                <span className="text-sm font-medium">{data.progress}%</span>
              </div>
              <Progress value={data.progress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor inicial</p>
                  <p className="text-xl font-bold">
                    {data.initialPainLevel}
                    <span className="text-sm">/10</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nível de dor atual</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {data.painLevel}
                    <span className="text-sm">/10</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Área de Tratamento</CardTitle>
              <CardDescription>Região: {data.painArea}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Exercícios semanais: {data.weeklyExercises}</p>
                  <p className="text-sm text-muted-foreground">Completados: {data.completedExercises}</p>
                </div>
                <Button
                  onClick={() => setWorkoutCompleted(!workoutCompleted)}
                  variant={workoutCompleted ? "outline" : "default"}
                  className={
                    workoutCompleted
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }
                >
                  {workoutCompleted ? "Concluído ✓" : "Marcar como concluído"}
                </Button>
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
                  Day: ({ day, ...props }) => (
                    <button {...props} className={`${props.className}`}>
                      {day && hasCompletedWorkout(day) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : day && hasMissedWorkout(day) ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : day ? (
                        day.getDate()
                      ) : (
                        ""
                      )}
                    </button>
                  ),
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
              <div className="grid gap-4 md:grid-cols-2">
                {data.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                        <span className="text-sm font-medium">{exercise.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Alívio da Dor</CardTitle>
                  <CardDescription>Recomendações para ajudar na sua recuperação</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data.tips.map((tip, index) => (
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
    const data = programData.sedentary

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
                <span className="text-sm font-medium">{data.progress}%</span>
              </div>
              <Progress value={data.progress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Atividade semanal</p>
                  <p className="text-xl font-bold">
                    {data.weeklyActivity}
                    <span className="text-sm"> / {data.weeklyGoal} horas</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Frequência cardíaca</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold">{data.heartRate.resting}</p>
                    <span className="text-sm ml-1">bpm</span>
                    <span className="text-xs text-emerald-600 ml-2 flex items-center">
                      <ArrowUp className="h-3 w-3 rotate-180" />
                      {data.heartRate.initial - data.heartRate.resting}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Passos Diários</CardTitle>
              <CardDescription>Nível: {data.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-4xl font-bold text-center">{data.stepsToday.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground text-center">
                  de {data.stepsGoal.toLocaleString()} passos
                </div>
                <Progress value={(data.stepsToday / data.stepsGoal) * 100} className="h-2 w-full mt-4" />
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => setWorkoutCompleted(!workoutCompleted)}
                  variant={workoutCompleted ? "outline" : "default"}
                  className={`w-full ${workoutCompleted ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  {workoutCompleted ? "Atividade de hoje concluída ✓" : "Marcar atividade como concluída"}
                </Button>
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
                  Day: ({ day, ...props }) => (
                    <button {...props} className={`${props.className}`}>
                      {day && hasCompletedWorkout(day) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : day && hasMissedWorkout(day) ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : day ? (
                        day.getDate()
                      ) : (
                        ""
                      )}
                    </button>
                  ),
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
              <div className="grid gap-4 md:grid-cols-2">
                {data.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                        <span className="text-sm font-medium">{exercise.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Iniciantes</CardTitle>
                  <CardDescription>Recomendações para quem está começando</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data.tips.map((tip, index) => (
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
                          {data.heartRate.resting} <span className="text-lg">bpm</span>
                        </p>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2">
                        Redução de {data.heartRate.initial - data.heartRate.resting} bpm desde o início
                      </p>
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
                          {data.weeklyActivity * 60} <span className="text-lg">min</span>
                        </p>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2">
                        {Math.round((data.weeklyActivity / data.weeklyGoal) * 100)}% da meta semanal
                      </p>
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
    const data = programData["training-diet"]

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progresso do Objetivo</CardTitle>
              <CardDescription>Meta: {data.goal}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso geral</span>
                <span className="text-sm font-medium">{data.progress}%</span>
              </div>
              <Progress value={data.progress} className="h-2 mb-4" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mudança de peso</p>
                  <p className="text-xl font-bold text-emerald-600">{data.weightChange} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Calorias hoje</p>
                  <p className="text-xl font-bold">
                    {data.caloriesConsumed} <span className="text-sm">/ {data.caloriesGoal}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Treino de Hoje</CardTitle>
              <CardDescription>Calorias queimadas: {data.caloriesBurned}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Duração total: 60 minutos</p>
                  <p className="text-sm text-muted-foreground">{data.exercises.length} exercícios</p>
                </div>
                <Button
                  onClick={() => setWorkoutCompleted(!workoutCompleted)}
                  variant={workoutCompleted ? "outline" : "default"}
                  className={
                    workoutCompleted
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }
                >
                  {workoutCompleted ? "Concluído ✓" : "Marcar como concluído"}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                  <Flame className="h-5 w-5 text-orange-500 mb-1" />
                  <span className="text-xs font-medium">{data.caloriesBurned} kcal</span>
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
                  Day: ({ day, ...props }) => (
                    <button {...props} className={`${props.className}`}>
                      {day && hasCompletedWorkout(day) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : day && hasMissedWorkout(day) ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : day ? (
                        day.getDate()
                      ) : (
                        ""
                      )}
                    </button>
                  ),
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
              <div className="grid gap-4 md:grid-cols-2">
                {data.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                        <span className="text-sm font-medium">{exercise.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                            <span className="text-sm">{data.macros.protein}%</span>
                          </div>
                          <Progress
                            value={data.macros.protein}
                            className="h-2 bg-blue-100"
                            indicatorClassName="bg-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Carboidratos</span>
                            <span className="text-sm">{data.macros.carbs}%</span>
                          </div>
                          <Progress
                            value={data.macros.carbs}
                            className="h-2 bg-amber-100"
                            indicatorClassName="bg-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Gorduras</span>
                            <span className="text-sm">{data.macros.fat}%</span>
                          </div>
                          <Progress
                            value={data.macros.fat}
                            className="h-2 bg-green-100"
                            indicatorClassName="bg-green-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <Utensils className="h-5 w-5 mr-2 text-emerald-600" />
                          <span className="font-medium">Calorias consumidas</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{data.caloriesConsumed}</span>
                          <span className="text-sm text-muted-foreground"> / {data.caloriesGoal} kcal</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {data.meals[data.dietType as keyof typeof data.meals].map((meal, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{meal.name}</CardTitle>
                      <CardDescription>{meal.calories} kcal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{meal.description}</p>
                    </CardContent>
                  </Card>
                ))}
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
                      <p className="text-2xl font-bold">75 kg</p>
                      <p className="text-sm text-emerald-600">{data.weightChange} kg desde o início</p>
                      <p className="text-xs text-muted-foreground mt-2">Última atualização: 3 dias atrás</p>
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
                      <p className="text-2xl font-bold">22.5%</p>
                      <p className="text-sm text-emerald-600">-2.3% desde o início</p>
                      <p className="text-xs text-muted-foreground mt-2">Categoria: Fitness</p>
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
              {programType === "rehabilitation" && programData.rehabilitation.title}
              {programType === "sedentary" && programData.sedentary.title}
              {programType === "training-diet" && programData["training-diet"].title}
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
