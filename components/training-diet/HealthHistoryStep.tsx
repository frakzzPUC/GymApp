import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Textarea } from "@/components/ui/form/textarea"
import { Activity } from "lucide-react"
import { FormData, FormErrors } from "@/hooks/useTrainingDietForm"

interface HealthHistoryStepProps {
  formData: FormData
  errors: FormErrors
  onUpdateField: (field: keyof FormData, value: any) => void
  onUpdateArrayField: (field: keyof FormData, value: string, checked: boolean) => void
}

export function HealthHistoryStep({ 
  formData, 
  errors, 
  onUpdateField, 
  onUpdateArrayField 
}: HealthHistoryStepProps) {
  const medicalConditionOptions = [
    "Nenhuma",
    "Diabetes",
    "Hipertensão",
    "Problemas cardíacos",
    "Artrite/Artrose",
    "Asma",
    "Problemas na coluna",
    "Outras condições"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" />
          Histórico de Saúde e Atividade Física
        </CardTitle>
        <CardDescription>
          Estas informações nos ajudam a criar um programa seguro e eficaz para você
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nível de atividade atual *</Label>
            <Select 
              value={formData.activityLevel} 
              onValueChange={(value) => onUpdateField("activityLevel", value)}
            >
              <SelectTrigger className={errors.activityLevel ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione seu nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                <SelectItem value="light">Leve (exercício leve 1-3 dias/semana)</SelectItem>
                <SelectItem value="moderate">Moderado (exercício moderado 3-5 dias/semana)</SelectItem>
                <SelectItem value="active">Ativo (exercício pesado 6-7 dias/semana)</SelectItem>
                <SelectItem value="very-active">Muito ativo (exercício muito pesado, trabalho físico)</SelectItem>
              </SelectContent>
            </Select>
            {errors.activityLevel && <p className="text-sm text-red-500">{errors.activityLevel}</p>}
          </div>

          <div className="space-y-2">
            <Label>Experiência com exercícios *</Label>
            <Select 
              value={formData.exerciseExperience} 
              onValueChange={(value) => onUpdateField("exerciseExperience", value)}
            >
              <SelectTrigger className={errors.exerciseExperience ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione sua experiência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Nunca pratiquei exercícios regularmente</SelectItem>
                <SelectItem value="beginner">Iniciante (menos de 6 meses)</SelectItem>
                <SelectItem value="some">Alguma experiência (6 meses - 2 anos)</SelectItem>
                <SelectItem value="experienced">Experiente (2-5 anos)</SelectItem>
                <SelectItem value="veteran">Veterano (mais de 5 anos)</SelectItem>
              </SelectContent>
            </Select>
            {errors.exerciseExperience && <p className="text-sm text-red-500">{errors.exerciseExperience}</p>}
          </div>

          <div className="space-y-2">
            <Label>Nível de condicionamento físico atual *</Label>
            <Select 
              value={formData.fitnessLevel} 
              onValueChange={(value) => onUpdateField("fitnessLevel", value)}
            >
              <SelectTrigger className={errors.fitnessLevel ? "border-red-500" : ""}>
                <SelectValue placeholder="Avalie seu condicionamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
            {errors.fitnessLevel && <p className="text-sm text-red-500">{errors.fitnessLevel}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Condições médicas (selecione todas que se aplicam)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {medicalConditionOptions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`medical-${condition}`}
                    checked={formData.medicalConditions.includes(condition)}
                    onCheckedChange={(checked) => 
                      onUpdateArrayField("medicalConditions", condition, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`medical-${condition}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="injuries">Lesões atuais ou recentes</Label>
            <Textarea
              id="injuries"
              placeholder="Descreva qualquer lesão atual ou recente que devemos considerar no seu treino..."
              value={formData.injuries}
              onChange={(e) => onUpdateField("injuries", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Medicamentos em uso</Label>
            <Textarea
              id="medications"
              placeholder="Liste os medicamentos que você está tomando atualmente..."
              value={formData.medications}
              onChange={(e) => onUpdateField("medications", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}