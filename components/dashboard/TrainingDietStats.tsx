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

  return null
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