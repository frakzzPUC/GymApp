'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkoutDay, parseWorkoutPlan } from '@/lib/workout-parser'

interface UseWorkoutStateProps {
  aiPlan?: string
  workoutPlan?: string
}

export const useWorkoutState = ({ aiPlan, workoutPlan }: UseWorkoutStateProps) => {
  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | null>(null)
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Função para processar o plano de treino
  const processWorkoutPlan = useCallback(() => {
    setIsLoading(true)
    try {
      // Usar o plano da IA ou o plano padrão
      const planToUse = aiPlan || workoutPlan || ''
      
      if (planToUse) {
        const workout = parseWorkoutPlan(planToUse)
        setTodayWorkout(workout)
        
        // Inicializar array de exercícios completados
        const completed = new Array(workout.exercises.length).fill(false)
        setCompletedExercises(completed)
      } else {
        // Fallback para treino do dia
        const today = new Date().getDay()
        const workout = parseWorkoutPlan('')
        setTodayWorkout(workout)
        setCompletedExercises(new Array(workout.exercises.length).fill(false))
      }
    } catch (error) {
      console.error('Erro ao processar plano de treino:', error)
      // Fallback em caso de erro
      const fallbackWorkout = parseWorkoutPlan('')
      setTodayWorkout(fallbackWorkout)
      setCompletedExercises(new Array(fallbackWorkout.exercises.length).fill(false))
    } finally {
      setIsLoading(false)
    }
  }, [aiPlan, workoutPlan])

  // Função para marcar/desmarcar exercício como completo
  const toggleExerciseComplete = useCallback((index: number) => {
    setCompletedExercises(prev => {
      const newCompleted = [...prev]
      newCompleted[index] = !newCompleted[index]
      return newCompleted
    })
  }, [])

  // Calcular estatísticas do progresso
  const completedCount = completedExercises.filter(Boolean).length
  const totalCount = completedExercises.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  // Processar plano quando houver mudanças
  useEffect(() => {
    processWorkoutPlan()
  }, [processWorkoutPlan])

  // Reprocessar quando aiPlan ou workoutPlan mudarem
  useEffect(() => {
    if (aiPlan || workoutPlan) {
      processWorkoutPlan()
    }
  }, [aiPlan, workoutPlan, processWorkoutPlan])

  return {
    todayWorkout,
    completedExercises,
    isLoading,
    completedCount,
    totalCount,
    progressPercentage,
    toggleExerciseComplete,
    refreshWorkout: processWorkoutPlan
  }
}