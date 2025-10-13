import React, { useState, useEffect } from "react"
import { Calendar, Dumbbell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { UserProfile } from "@/hooks/useDashboard"
import { TrainingDietStats } from "./TrainingDietStats"
import { TodayWorkout } from "./TodayWorkout"
import { ProgressHeader } from "./ProgressHeader"
import { QuickActions } from "./QuickActions"
import { DailyNutritionCard } from "./DailyNutritionCard"
import { NutritionPlanModal } from "./NutritionPlanModal"
import { parseNutritionPlan, MealPlan } from "@/lib/nutrition-parser"
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

export function TrainingDietDashboard({ userProfile, onMarkComplete }: TrainingDietDashboardProps) {
  const todaysActivities = getTodaysActivities(userProfile)
  const today = new Date()
  
  // Estados para controlar progresso interativo
  const [hasCompletedTodaysWorkout, setHasCompletedTodaysWorkout] = useState(hasCompletedWorkout(today, userProfile))
  const [currentSteps, setCurrentSteps] = useState(userProfile.progress?.stepsToday || 0)
  const [currentWeight, setCurrentWeight] = useState(userProfile.weight)
  const [completedMeals, setCompletedMeals] = useState(0)
  const [activeMinutesToday, setActiveMinutesToday] = useState(userProfile.progress?.weeklyActivity || 0)
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(userProfile.progress?.caloriesConsumed || 0)
  const [completedWorkoutsWeek, setCompletedWorkoutsWeek] = useState(userProfile.progress?.completedExercises || 0)
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null)
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(true)
  
  // Estado para controlar quais refeições foram completadas
  const [completedMealIds, setCompletedMealIds] = useState<Set<number>>(new Set())
  
  // Plano de refeições baseado na IA
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    { mealTime: 'Café da manhã', foods: [], time: '07:00', calories: '400 kcal' },
    { mealTime: 'Lanche da manhã', foods: [], time: '10:00', calories: '150 kcal' },
    { mealTime: 'Almoço', foods: [], time: '12:30', calories: '600 kcal' },
    { mealTime: 'Lanche da tarde', foods: [], time: '15:30', calories: '200 kcal' },
    { mealTime: 'Jantar', foods: [], time: '19:00', calories: '500 kcal' },
  ])
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false)

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

  // Buscar plano nutricional da IA
  useEffect(() => {
    const fetchNutritionPlan = async () => {
      if (!userProfile) return
      
      try {
        setIsLoadingNutrition(true)
        
        // O plano nutricional está no próprio userProfile como aiNutritionPlan
        if (userProfile.aiNutritionPlan) {
          console.log('Plano nutricional encontrado no perfil:', userProfile.aiNutritionPlan)
          setNutritionPlan(userProfile.aiNutritionPlan)
          
          // Usar o parser modular
          const parsedMeals = parseNutritionPlan(userProfile.aiNutritionPlan)
          if (parsedMeals.length > 0) {
            setMealPlan(parsedMeals)
            console.log('Refeições extraídas pelo parser:', parsedMeals)
          }
        } else {
          console.log('Nenhum plano nutricional encontrado no perfil')
        }
      } catch (error) {
        console.error('Erro ao processar plano nutricional:', error)
      } finally {
        setIsLoadingNutrition(false)
      }
    }

    fetchNutritionPlan()
  }, [userProfile])

  // Verificar se o treino de hoje já foi completado
  useEffect(() => {
    if (hasCompletedTodaysWorkout && completedWorkoutsWeek === 0) {
      setCompletedWorkoutsWeek(1) // Se já completou o treino de hoje, pelo menos 1 treino foi feito na semana
    }
  }, [hasCompletedTodaysWorkout, completedWorkoutsWeek])

  // Calcular refeições completadas e calorias
  useEffect(() => {
    setCompletedMeals(completedMealIds.size)
    
    // Calcular calorias consumidas baseado nas refeições marcadas
    const calories = mealPlan
      .filter((_, index) => completedMealIds.has(index))
      .reduce((total, meal) => {
        const calorieValue = meal.calories ? parseInt(meal.calories.replace(/\D/g, '')) : 0
        return total + calorieValue
      }, 0)
    setTotalCaloriesConsumed(calories)
  }, [mealPlan, completedMealIds])

  // Calcular meta de calorias baseada no plano nutricional
  const dailyCaloriesGoal = mealPlan.reduce((total, meal) => {
    const calorieValue = meal.calories ? parseInt(meal.calories.replace(/\D/g, '')) : 0
    return total + calorieValue
  }, 0) || userProfile.progress?.caloriesGoal || 2000

  // Calcular estatísticas usando as calorias do plano nutricional
  const stats = {
    ...calculateStats(userProfile),
    caloriesGoal: dailyCaloriesGoal,
    weeklyProgress: Math.min(100, Math.round((completedWorkoutsWeek / (userProfile.daysPerWeek || 3)) * 100))
  }

  // Funções para interatividade
  const handleStepsIncrement = () => {
    setCurrentSteps(prev => prev + 1000)
  }

  const handleWeightUpdate = () => {
    const newWeight = prompt('Digite seu peso atual (kg):')
    if (newWeight && !isNaN(Number(newWeight)) && Number(newWeight) > 0) {
      setCurrentWeight(Number(newWeight))
    }
  }

  const handleWorkoutComplete = async (workoutId: string) => {
    try {
      setHasCompletedTodaysWorkout(true)
      setCompletedWorkoutsWeek(prev => Math.min(prev + 1, userProfile.daysPerWeek || 3))
      // Chamar a função original do pai
      await onMarkComplete(workoutId)
    } catch (error) {
      console.error('Erro ao marcar treino como completo:', error)
      // Reverter mudanças se houver erro
      setHasCompletedTodaysWorkout(false)
      setCompletedWorkoutsWeek(prev => Math.max(prev - 1, 0))
    }
  }

  const handleMealComplete = (mealIndex: number) => {
    setCompletedMealIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(mealIndex)) {
        newSet.delete(mealIndex)
      } else {
        newSet.add(mealIndex)
      }
      return newSet
    })
  }

  const handleQuickMealLog = () => {
    // Marcar próxima refeição como completa
    const nextMealIndex = mealPlan.findIndex((_, index) => !completedMealIds.has(index))
    if (nextMealIndex !== -1) {
      handleMealComplete(nextMealIndex)
    }
  }

  const handleQuickWorkout = () => {
    if (!hasCompletedTodaysWorkout) {
      setHasCompletedTodaysWorkout(true)
      setCompletedWorkoutsWeek(prev => Math.min(prev + 1, userProfile.daysPerWeek || 3))
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Estatísticas */}
      <TrainingDietStats userProfile={userProfile} />

      {/* Header de Progresso */}
      <ProgressHeader
        userProfile={userProfile}
        completedMeals={completedMeals}
        mealPlan={mealPlan}
        completedWorkoutsWeek={completedWorkoutsWeek}
        weeklyProgress={stats.weeklyProgress}
        activeMinutesToday={activeMinutesToday}
      />

      {/* Ações Rápidas */}
      <QuickActions
        hasCompletedTodaysWorkout={hasCompletedTodaysWorkout}
        onQuickMealLog={handleQuickMealLog}
        onMarkWorkout={handleQuickWorkout}
      />

      {/* Grid de conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Treino de Hoje - Baseado na IA */}
        <TodayWorkout onMarkComplete={handleWorkoutComplete} />

        {/* Plano Alimentar - Componente Modular */}
        <DailyNutritionCard 
          meals={mealPlan} 
          onViewFullPlan={() => setIsNutritionModalOpen(true)} 
        />
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
                    <div className="text-xs text-muted-foreground mb-1">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div 
                      className={`
                        h-12 w-12 rounded-full border-2 flex flex-col items-center justify-center mx-auto transition-all
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
      
      {/* Modal do Plano Nutricional */}
      <NutritionPlanModal
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
        nutritionPlan={nutritionPlan || "Nenhum plano nutricional disponível"}
        userName={userProfile.userId}
      />
    </div>
  )
}