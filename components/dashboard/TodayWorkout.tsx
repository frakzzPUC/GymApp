'use client'

import { useEffect, useState } from 'react'
import { WorkoutHeader } from './WorkoutHeader'
import { ExerciseList } from './ExerciseList'
import { WorkoutPlanModal } from './WorkoutPlanModal'
import { useWorkoutState } from '@/hooks/useWorkoutState'
import { Dumbbell } from 'lucide-react'

interface TodayWorkoutProps {
  onMarkComplete?: (workoutId: string) => Promise<void>
}

interface AIPlansData {
  latest?: {
    workoutPlan: string
    nutritionPlan: string
    planType: 'ai-generated' | 'static-fallback'
    generatedAt: string
    planId: string
  }
}

export const TodayWorkout = ({ onMarkComplete }: TodayWorkoutProps) => {
  const [aiPlans, setAiPlans] = useState<AIPlansData | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  
  const {
    todayWorkout,
    completedExercises,
    isLoading,
    completedCount,
    totalCount,
    toggleExerciseComplete
  } = useWorkoutState({ 
    aiPlan: aiPlans?.latest?.workoutPlan, 
    workoutPlan: aiPlans?.latest?.workoutPlan 
  })

  // Buscar planos da IA
  useEffect(() => {
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
      } catch (error) {
        console.error('Erro ao buscar planos de IA:', error)
        setAiPlans(null)
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchAIPlans()
  }, [])

  const showLoading = isLoading || isLoadingPlans

  if (showLoading || !todayWorkout) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Cabeçalho do treino */}
      <div className="mb-6">
        <WorkoutHeader
          focus={todayWorkout.focus}
          day={todayWorkout.day}
          duration={todayWorkout.duration}
          completedCount={completedCount}
          totalCount={totalCount}
        />
      </div>

      {/* Lista de exercícios */}
      {todayWorkout.exercises.length > 0 ? (
        <div className="mb-6">
          <ExerciseList
            exercises={todayWorkout.exercises}
            completedExercises={completedExercises}
            onToggleComplete={toggleExerciseComplete}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 mb-6">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>É dia de descanso!</p>
          <p className="text-sm mt-1">Aproveite para se recuperar ou fazer uma atividade leve.</p>
        </div>
      )}

      {/* Botão para ver plano completo */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <WorkoutPlanModal
          workoutPlan={aiPlans?.latest?.workoutPlan || ''}
          aiPlan={aiPlans?.latest?.workoutPlan}
        />
      </div>
    </div>
  )
}