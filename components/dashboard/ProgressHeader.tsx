import React from "react"
import { Dumbbell, Utensils, Trophy, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/data-display/card"
import { UserProfile } from "@/hooks/useDashboard"
import { MealPlan } from "@/lib/nutrition-parser"

interface ProgressHeaderProps {
  completedWorkoutsWeek: number
  userProfile: UserProfile
  completedMeals: number
  mealPlan: MealPlan[]
  weeklyProgress: number
  activeMinutesToday: number
}

export function ProgressHeader({
  completedWorkoutsWeek,
  userProfile,
  completedMeals,
  mealPlan,
  weeklyProgress,
  activeMinutesToday
}: ProgressHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Dumbbell className="h-8 w-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {completedWorkoutsWeek}/{userProfile.daysPerWeek || 3}
          </div>
          <p className="text-sm text-muted-foreground">Treinos esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Utensils className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {Math.round((completedMeals / mealPlan.length) * 100)}%
          </div>
          <p className="text-sm text-muted-foreground">Refeições hoje</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
          <div className="text-2xl font-bold text-yellow-600">
            {Math.floor(weeklyProgress || 0)}%
          </div>
          <p className="text-sm text-muted-foreground">Progresso semanal</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Clock className="h-8 w-8 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {activeMinutesToday}
          </div>
          <p className="text-sm text-muted-foreground">Minutos ativos</p>
        </CardContent>
      </Card>
    </div>
  )
}