import React from "react"
import { Dumbbell, Utensils } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"

interface QuickActionsProps {
  hasCompletedTodaysWorkout: boolean
  onQuickMealLog: () => void
  onMarkWorkout: () => void
}

export function QuickActions({
  hasCompletedTodaysWorkout,
  onQuickMealLog,
  onMarkWorkout
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        <CardDescription>
          Marque rapidamente suas atividades do dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-16 flex flex-col gap-2"
            onClick={onQuickMealLog}
          >
            <Utensils className="h-5 w-5" />
            <span className="text-sm">Marcar Refeição</span>
          </Button>
          <Button 
            variant={hasCompletedTodaysWorkout ? "default" : "outline"}
            className="h-16 flex flex-col gap-2"
            onClick={onMarkWorkout}
            disabled={hasCompletedTodaysWorkout}
          >
            <Dumbbell className="h-5 w-5" />
            <span className="text-sm">
              {hasCompletedTodaysWorkout ? "✓ Treino Concluído" : "Marcar Treino"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}