import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Progress } from "@/components/ui/feedback/progress"
import { Badge } from "@/components/ui/feedback/badge"
import { Activity, Heart, HeartPulse } from "lucide-react"
import { UserProfile } from "@/hooks/useDashboard"
import { calculateStats } from "@/lib/dashboard-utils"

interface RehabilitationStatsProps {
  userProfile: UserProfile
}

export function RehabilitationStats({ userProfile }: RehabilitationStatsProps) {
  const stats = calculateStats(userProfile)
  const painAreas = userProfile.painAreas || []

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Progresso da Reabilitação */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Reabilitação</CardTitle>
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
            
            {(stats.painReductionPercentage || 0) > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Redução da Dor</span>
                  <span className="font-medium text-green-600">-{stats.painReductionPercentage}%</span>
                </div>
                <Progress value={stats.painReductionPercentage || 0} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Exercícios concluídos: {userProfile.progress?.completedExercises || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Área de Tratamento */}
      <Card>
        <CardHeader>
          <CardTitle>Área de Tratamento</CardTitle>
          <CardDescription>Regiões em foco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {painAreas.length > 0 ? (
              painAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{getPainAreaLabel(area)}</span>
                  <Badge variant="secondary">Em tratamento</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma área especificada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Status Geral</CardTitle>
          <CardDescription>Como você está hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile.progress?.heartRate?.resting && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Frequência Cardíaca</span>
                </div>
                <span className="text-sm font-medium">{userProfile.progress.heartRate.resting} bpm</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Nível de Dor Atual</span>
              </div>
              <span className="text-sm font-medium">
                {userProfile.progress?.currentPainLevel || "Não informado"}/10
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Função auxiliar para converter IDs de áreas de dor em labels legíveis
function getPainAreaLabel(areaId: string): string {
  const painAreaLabels: Record<string, string> = {
    "lower-back": "Dor na lombar",
    "neck": "Dor no pescoço", 
    "shoulder": "Dor nos ombros",
    "knee": "Dor nos joelhos",
    "hip": "Dor no quadril",
    "wrist": "Dor nos pulsos"
  }
  
  return painAreaLabels[areaId] || areaId
}