import { UserProfile } from "@/hooks/useDashboard"

export interface DashboardStats {
  // Nutrition stats
  caloriesGoal?: number
  caloriesConsumed?: number
  caloriesBurned?: number
  proteinGoal?: number
  proteinConsumed?: number
  proteinProgress: number
  
  // Activity stats
  stepsGoal?: number
  stepsToday?: number
  stepsProgress: number
  activeMinutes?: number
  activeHours?: number
  weeklySteps?: number
  
  // Health stats
  weightChange?: number
  resting?: number
  currentPainLevel?: number
  
  // Progress stats
  weeklyProgress: number
  caloriesProgress: number
  completedExercises?: number
  completedWorkouts?: number
  painReductionPercentage?: number
  weeklyImprovementRate?: number
}

// Função para determinar se um dia é dia de treino
export const shouldTrainOnDay = (date: Date, daysPerWeek: number): boolean => {
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
export const calculateWeeklyProgress = (userProfile: UserProfile): number => {
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

// Verificar se completou treino em uma data específica
export const hasCompletedWorkout = (date: Date | undefined, userProfile: UserProfile): boolean => {
  if (!date || !userProfile) return false

  const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []
  return activities.some((activity) => {
    const activityDate = new Date(activity.date)
    return (
      activity.completed &&
      activityDate.toDateString() === date.toDateString()
    )
  })
}

// Verificar se perdeu treino em uma data específica
export const hasMissedWorkout = (date: Date | undefined, userProfile: UserProfile): boolean => {
  if (!date || !userProfile) return false

  const today = new Date()
  
  // Só considerar como "perdido" se a data já passou
  if (date > today) return false

  // Verificar se é um dia de treino
  if (!shouldTrainOnDay(date, userProfile.daysPerWeek)) return false

  // Verificar se tem atividades nessa data
  const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []
  const hasActivitiesOnDate = activities.some((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate.toDateString() === date.toDateString()
  })

  return !hasActivitiesOnDate
}

// Obter atividades de hoje
export const getTodaysActivities = (userProfile: UserProfile) => {
  if (!userProfile) return []

  const today = new Date()
  const activities = userProfile.exercises || userProfile.activities || userProfile.workouts || []
  
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate.toDateString() === today.toDateString()
  })
}

// Calcular estatísticas gerais
export const calculateStats = (userProfile: UserProfile): DashboardStats => {
  if (!userProfile) {
    return {
      weeklyProgress: 0,
      caloriesProgress: 0,
      stepsProgress: 0,
      proteinProgress: 0,
      painReductionPercentage: 0
    }
  }

  const progress = userProfile.progress || {}
  const weeklyProgress = calculateWeeklyProgress(userProfile)
  
  // Para reabilitação
  const painReduction = progress.initialPainLevel && progress.currentPainLevel
    ? Math.max(0, progress.initialPainLevel - progress.currentPainLevel)
    : 0
    
  const painReductionPercentage = progress.initialPainLevel
    ? Math.round((painReduction / progress.initialPainLevel) * 100)
    : 0

  // Para sedentário
  const stepsProgress = progress.stepsGoal && progress.stepsToday
    ? Math.round((progress.stepsToday / progress.stepsGoal) * 100)
    : 0

  // Para treino e dieta  
  const caloriesProgress = progress.caloriesGoal && progress.caloriesConsumed
    ? Math.round((progress.caloriesConsumed / progress.caloriesGoal) * 100)
    : 0
    
  const proteinProgress = 0 // Será implementado quando a estrutura de dados for atualizada

  return {
    weeklyProgress,
    painReductionPercentage,
    stepsProgress,
    caloriesProgress,
    proteinProgress,
    ...progress
  }
}