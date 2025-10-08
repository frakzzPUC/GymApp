import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Progress } from "@/components/ui/feedback/progress"
import { Badge } from "@/components/ui/feedback/badge"
import { 
  Utensils, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Activity,
  Scale 
} from "lucide-react"
import { UserProfile } from "@/hooks/useDashboard"
import { calculateStats } from "@/lib/dashboard-utils"

interface TrainingDietStatsProps {
  userProfile: UserProfile
}

export function TrainingDietStats({ userProfile }: TrainingDietStatsProps) {
  const stats = calculateStats(userProfile)

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Nutrição */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrição</CardTitle>
          <CardDescription>Sua ingestão hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.caloriesGoal && stats.caloriesConsumed !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Calorias</span>
                  <span className="font-medium">
                    {stats.caloriesConsumed} / {stats.caloriesGoal} kcal
                  </span>
                </div>
                <Progress value={stats.caloriesProgress} className="h-2" />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Proteína</span>
                <span className="font-medium">
                  {userProfile.progress?.macros?.protein || 0}g / -
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Utensils className="h-4 w-4" />
              <span>Meta: Dieta balanceada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treino */}
      <Card>
        <CardHeader>
          <CardTitle>Treino</CardTitle>
          <CardDescription>Seu progresso esta semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso Semanal</span>
                <span className="font-medium">{stats.weeklyProgress}%</span>
              </div>
              <Progress value={stats.weeklyProgress} className="h-2" />
            </div>
            
            {stats.caloriesBurned !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Calorias queimadas</span>
                </div>
                <span className="text-sm font-medium">{stats.caloriesBurned} kcal</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Dumbbell className="h-4 w-4" />
              <span>Treinos concluídos: {userProfile.progress?.weeklyExercises || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos e Peso */}
      <Card>
        <CardHeader>
          <CardTitle>Objetivos</CardTitle>
          <CardDescription>Metas e evolução</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Peso Atual</span>
                <span className="font-medium">{userProfile.weight} kg</span>
              </div>
              {stats.weightChange !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Mudança</span>
                  </div>
                  <Badge variant={stats.weightChange >= 0 ? "secondary" : "destructive"}>
                    {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} kg
                  </Badge>
                </div>
              )}
            </div>
            
            {userProfile.goal && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Objetivo Principal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getGoalLabel(userProfile.goal)}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {stats.weeklyProgress >= 80 
                  ? "🏆 Excelente semana!" 
                  : stats.weeklyProgress >= 60 
                    ? "💪 Bom progresso!" 
                    : "📈 Continue focado!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Função auxiliar para converter objetivos em labels legíveis
function getGoalLabel(goals: string | string[]): string {
  const goalLabels: Record<string, string> = {
    "lose-weight": "Perder peso",
    "gain-muscle": "Ganhar massa muscular",
    "maintain-weight": "Manter peso",
    "improve-endurance": "Melhorar resistência",
    "general-fitness": "Condicionamento geral",
    "strength": "Ganhar força"
  }
  
  if (Array.isArray(goals)) {
    return goals.map(goal => goalLabels[goal] || goal).join(", ")
  }
  
  return goalLabels[goals] || goals
}