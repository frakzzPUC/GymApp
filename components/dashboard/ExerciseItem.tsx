'use client'

import { useState } from 'react'
import { Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

interface ExerciseItemProps {
  exercise: Exercise
  index: number
  isCompleted: boolean
  onToggleComplete: (index: number) => void
}

export const ExerciseItem = ({ 
  exercise, 
  index, 
  isCompleted, 
  onToggleComplete 
}: ExerciseItemProps) => {
  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
        isCompleted 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
          : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleComplete(index)}
        className={`p-2 rounded-full ${
          isCompleted 
            ? 'text-green-600 hover:text-green-700 dark:text-green-400' 
            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm sm:text-base leading-tight ${
          isCompleted 
            ? 'text-green-800 dark:text-green-200 line-through' 
            : 'text-gray-900 dark:text-gray-100'
        }`}>
          {exercise.name}
        </h4>
        
        <div className="flex flex-wrap gap-4 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">
            {exercise.sets} séries × {exercise.reps} reps
          </span>
          <span>
            Descanso: {exercise.rest}
          </span>
          {exercise.notes && (
            <span className="text-blue-600 dark:text-blue-400">
              {exercise.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}