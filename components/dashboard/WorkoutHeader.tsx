'use client'

import { Dumbbell, Clock, Target } from 'lucide-react'

interface WorkoutHeaderProps {
  focus: string
  day: string
  duration: string
  completedCount: number
  totalCount: number
}

export const WorkoutHeader = ({ 
  focus, 
  day, 
  duration, 
  completedCount, 
  totalCount 
}: WorkoutHeaderProps) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Título principal */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Treino de Hoje
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {day} - {focus}
          </p>
        </div>
      </div>

      {/* Informações do treino */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Target className="h-4 w-4" />
          <span>{completedCount} de {totalCount} exercícios</span>
        </div>
      </div>

      {/* Barra de progresso */}
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}