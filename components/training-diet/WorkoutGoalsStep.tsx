import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Target } from "lucide-react"
import { FormData, FormErrors } from "@/hooks/useTrainingDietForm"

interface WorkoutGoalsStepProps {
  formData: FormData
  errors: FormErrors
  onUpdateField: (field: keyof FormData, value: any) => void
  onUpdateArrayField: (field: keyof FormData, value: string, checked: boolean) => void
}

export function WorkoutGoalsStep({ 
  formData, 
  errors, 
  onUpdateField, 
  onUpdateArrayField 
}: WorkoutGoalsStepProps) {
  const secondaryGoalOptions = [
    "Melhorar resistência cardiovascular",
    "Aumentar flexibilidade",
    "Reduzir estresse",
    "Melhorar autoestima",
    "Melhorar postura",
    "Aumentar energia",
    "Melhorar qualidade do sono"
  ]

  const equipmentOptions = [
    "Nenhum equipamento",
    "Halteres",
    "Barras",
    "Kettlebells",
    "Faixas elásticas",
    "Esteira",
    "Bicicleta ergométrica",
    "Academia completa"
  ]

  const exercisePreferenceOptions = [
    "Musculação",
    "Cardio/Aeróbico",
    "Yoga/Pilates",
    "Natação",
    "Caminhada/Corrida",
    "Dança",
    "Artes marciais",
    "Esportes em equipe"
  ]

  const exerciseDislikeOptions = [
    "Exercícios muito intensos",
    "Exercícios longos",
    "Musculação",
    "Corrida",
    "Natação",
    "Exercícios em grupo",
    "Exercícios matinais",
    "Nenhuma preferência"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Objetivos e Preferências de Treino
        </CardTitle>
        <CardDescription>
          Vamos entender seus objetivos para criar o programa perfeito
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Objetivo principal *</Label>
            <Select 
              value={formData.primaryGoal} 
              onValueChange={(value) => onUpdateField("primaryGoal", value)}
            >
              <SelectTrigger className={errors.primaryGoal ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione seu objetivo principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Perder peso</SelectItem>
                <SelectItem value="gain-muscle">Ganhar massa muscular</SelectItem>
                <SelectItem value="improve-fitness">Melhorar condicionamento</SelectItem>
                <SelectItem value="maintain-health">Manter saúde</SelectItem>
                <SelectItem value="sports-performance">Performance esportiva</SelectItem>
              </SelectContent>
            </Select>
            {errors.primaryGoal && <p className="text-sm text-red-500">{errors.primaryGoal}</p>}
          </div>

          <div className="space-y-2">
            <Label>Dias por semana para treinar *</Label>
            <Select 
              value={formData.daysPerWeek} 
              onValueChange={(value) => onUpdateField("daysPerWeek", value)}
            >
              <SelectTrigger className={errors.daysPerWeek ? "border-red-500" : ""}>
                <SelectValue placeholder="Quantos dias?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 dias por semana</SelectItem>
                <SelectItem value="3">3 dias por semana</SelectItem>
                <SelectItem value="4">4 dias por semana</SelectItem>
                <SelectItem value="5">5 dias por semana</SelectItem>
                <SelectItem value="6">6 dias por semana</SelectItem>
                <SelectItem value="7">7 dias por semana</SelectItem>
              </SelectContent>
            </Select>
            {errors.daysPerWeek && <p className="text-sm text-red-500">{errors.daysPerWeek}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tempo disponível por dia (minutos) *</Label>
            <Select 
              value={formData.timePerDay} 
              onValueChange={(value) => onUpdateField("timePerDay", value)}
            >
              <SelectTrigger className={errors.timePerDay ? "border-red-500" : ""}>
                <SelectValue placeholder="Quanto tempo?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
                <SelectItem value="90">90 minutos</SelectItem>
                <SelectItem value="120">120 minutos</SelectItem>
              </SelectContent>
            </Select>
            {errors.timePerDay && <p className="text-sm text-red-500">{errors.timePerDay}</p>}
          </div>

          <div className="space-y-2">
            <Label>Horário preferido *</Label>
            <Select 
              value={formData.preferredTime} 
              onValueChange={(value) => onUpdateField("preferredTime", value)}
            >
              <SelectTrigger className={errors.preferredTime ? "border-red-500" : ""}>
                <SelectValue placeholder="Quando prefere treinar?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="early-morning">Muito cedo (5h-7h)</SelectItem>
                <SelectItem value="morning">Manhã (7h-10h)</SelectItem>
                <SelectItem value="late-morning">Final da manhã (10h-12h)</SelectItem>
                <SelectItem value="afternoon">Tarde (12h-17h)</SelectItem>
                <SelectItem value="evening">Início da noite (17h-20h)</SelectItem>
                <SelectItem value="night">Noite (20h-23h)</SelectItem>
                <SelectItem value="flexible">Flexível</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredTime && <p className="text-sm text-red-500">{errors.preferredTime}</p>}
          </div>

          <div className="space-y-2">
            <Label>Local de treino *</Label>
            <Select 
              value={formData.workoutLocation} 
              onValueChange={(value) => onUpdateField("workoutLocation", value)}
            >
              <SelectTrigger className={errors.workoutLocation ? "border-red-500" : ""}>
                <SelectValue placeholder="Onde vai treinar?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Em casa</SelectItem>
                <SelectItem value="gym">Academia</SelectItem>
                <SelectItem value="outdoor">Ao ar livre</SelectItem>
                <SelectItem value="mixed">Misto</SelectItem>
              </SelectContent>
            </Select>
            {errors.workoutLocation && <p className="text-sm text-red-500">{errors.workoutLocation}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Objetivos secundários (selecione todos que se aplicam)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {secondaryGoalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`secondary-${goal}`}
                    checked={formData.secondaryGoals.includes(goal)}
                    onCheckedChange={(checked) => 
                      onUpdateArrayField("secondaryGoals", goal, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`secondary-${goal}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Equipamentos disponíveis</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {equipmentOptions.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={`equipment-${equipment}`}
                    checked={formData.availableEquipment.includes(equipment)}
                    onCheckedChange={(checked) => 
                      onUpdateArrayField("availableEquipment", equipment, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`equipment-${equipment}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipos de exercício que você gosta</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {exercisePreferenceOptions.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={`preference-${preference}`}
                    checked={formData.exercisePreferences.includes(preference)}
                    onCheckedChange={(checked) => 
                      onUpdateArrayField("exercisePreferences", preference, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`preference-${preference}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {preference}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipos de exercício que você não gosta ou quer evitar</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {exerciseDislikeOptions.map((dislike) => (
                <div key={dislike} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dislike-${dislike}`}
                    checked={formData.exerciseDislikes.includes(dislike)}
                    onCheckedChange={(checked) => 
                      onUpdateArrayField("exerciseDislikes", dislike, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`dislike-${dislike}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {dislike}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}