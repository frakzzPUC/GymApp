import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Progress } from "@/components/ui/feedback/progress"
import { Activity, Target, TrendingUp, Zap } from "lucide-react"
import { UserProfile } from "@/hooks/useDashboard"
import { calculateStats } from "@/lib/dashboard-utils"

interface SedentaryStatsProps {
  userProfile: UserProfile
}

export function SedentaryStats({ userProfile }: SedentaryStatsProps) {
  const stats = calculateStats(userProfile)

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Atividade Diária */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Diária</CardTitle>
          <CardDescription>Seu movimento hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.stepsGoal && userProfile.progress?.stepsToday !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Passos</span>
                  <span className="font-medium">{userProfile.progress.stepsToday} / {stats.stepsGoal}</span>
                </div>
                <Progress value={stats.stepsProgress} className="h-2" />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Minutos Ativos</span>
                <span className="font-medium">0 min</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Meta: Reduzir sedentarismo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Semanal</CardTitle>
          <CardDescription>Evolução dos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">{stats.weeklyProgress}%</span>
              </div>
              <Progress value={stats.weeklyProgress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Passos esta semana</span>
              </div>
              <span className="text-sm font-medium">-</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm">Horas ativas</span>
              </div>
              <span className="text-sm font-medium">-</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metas e Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle>Metas e Conquistas</CardTitle>
          <CardDescription>Seus objetivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Melhoria semanal</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                -
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Objetivo: Aumentar atividade física gradualmente
              </p>
              <p className="text-sm font-medium">
                {stats.weeklyProgress >= 70 
                  ? "🎉 Excelente progresso!" 
                  : stats.weeklyProgress >= 50 
                    ? "👍 Bom progresso!" 
                    : "💪 Continue se esforçando!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}