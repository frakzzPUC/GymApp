'use client'

import { ExerciseItem } from './ExerciseItem'

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

interface ExerciseListProps {
  exercises: Exercise[]
  completedExercises: boolean[]
  onToggleComplete: (index: number) => void
}

export const ExerciseList = ({ 
  exercises, 
  completedExercises, 
  onToggleComplete 
}: ExerciseListProps) => {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Nenhum exercício encontrado para hoje.</p>
        <p className="text-sm mt-2">Verifique seu plano personalizado ou tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <ExerciseItem
          key={`${exercise.name}-${index}`}
          exercise={exercise}
          index={index}
          isCompleted={completedExercises[index] || false}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  )
}