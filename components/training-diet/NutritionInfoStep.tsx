import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Switch } from "@/components/ui/form/switch"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Textarea } from "@/components/ui/form/textarea"
import { Utensils } from "lucide-react"
import { FormData, FormErrors } from "@/hooks/useTrainingDietForm"

interface NutritionInfoStepProps {
  formData: FormData
  errors: FormErrors
  onUpdateField: (field: keyof FormData, value: any) => void
  onUpdateArrayField: (field: keyof FormData, value: string, checked: boolean) => void
}

export function NutritionInfoStep({ 
  formData, 
  errors, 
  onUpdateField, 
  onUpdateArrayField 
}: NutritionInfoStepProps) {
  const dietaryRestrictionOptions = [
    "Nenhuma",
    "Vegetariano",
    "Vegano",
    "Sem glúten",
    "Sem lactose",
    "Low carb",
    "Cetogênica",
    "Paleo",
    "Mediterrânea"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-emerald-600" />
          Informações Nutricionais
        </CardTitle>
        <CardDescription>
          Vamos criar um plano alimentar que funcione para seu estilo de vida
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2 p-4 bg-emerald-50 rounded-lg">
          <Switch
            id="wants-diet"
            checked={formData.wantsDiet}
            onCheckedChange={(checked) => onUpdateField("wantsDiet", checked)}
          />
          <Label htmlFor="wants-diet" className="font-medium">
            Quero receber orientação nutricional personalizada
          </Label>
        </div>

        {formData.wantsDiet && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Hábitos alimentares atuais</Label>
                <Select 
                  value={formData.currentEatingHabits} 
                  onValueChange={(value) => onUpdateField("currentEatingHabits", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Como você avalia sua alimentação?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-poor">Muito ruim</SelectItem>
                    <SelectItem value="poor">Ruim</SelectItem>
                    <SelectItem value="average">Razoável</SelectItem>
                    <SelectItem value="good">Boa</SelectItem>
                    <SelectItem value="excellent">Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Número de refeições por dia *</Label>
                <Select 
                  value={formData.mealsPerDay} 
                  onValueChange={(value) => onUpdateField("mealsPerDay", value)}
                >
                  <SelectTrigger className={errors.mealsPerDay ? "border-red-500" : ""}>
                    <SelectValue placeholder="Quantas refeições?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 refeições</SelectItem>
                    <SelectItem value="4">4 refeições</SelectItem>
                    <SelectItem value="5">5 refeições</SelectItem>
                    <SelectItem value="6">6 refeições</SelectItem>
                  </SelectContent>
                </Select>
                {errors.mealsPerDay && <p className="text-sm text-red-500">{errors.mealsPerDay}</p>}
              </div>

              <div className="space-y-2">
                <Label>Consumo diário de água (litros) *</Label>
                <Select 
                  value={formData.waterIntake} 
                  onValueChange={(value) => onUpdateField("waterIntake", value)}
                >
                  <SelectTrigger className={errors.waterIntake ? "border-red-500" : ""}>
                    <SelectValue placeholder="Quanto você bebe?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-1">Menos de 1L</SelectItem>
                    <SelectItem value="1-1.5">1 a 1,5L</SelectItem>
                    <SelectItem value="1.5-2">1,5 a 2L</SelectItem>
                    <SelectItem value="2-2.5">2 a 2,5L</SelectItem>
                    <SelectItem value="more-2.5">Mais de 2,5L</SelectItem>
                  </SelectContent>
                </Select>
                {errors.waterIntake && <p className="text-sm text-red-500">{errors.waterIntake}</p>}
              </div>

              <div className="space-y-2">
                <Label>Orçamento para alimentação</Label>
                <Select 
                  value={formData.budgetPreference} 
                  onValueChange={(value) => onUpdateField("budgetPreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qual seu orçamento?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixo (economia)</SelectItem>
                    <SelectItem value="medium">Médio (equilibrado)</SelectItem>
                    <SelectItem value="high">Alto (premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Habilidade culinária</Label>
                <Select 
                  value={formData.cookingSkill} 
                  onValueChange={(value) => onUpdateField("cookingSkill", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Como você cozinha?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante (receitas simples)</SelectItem>
                    <SelectItem value="intermediate">Intermediário (cozinho bem)</SelectItem>
                    <SelectItem value="advanced">Avançado (amo cozinhar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tempo disponível para preparo</Label>
                <Select 
                  value={formData.mealPrepTime} 
                  onValueChange={(value) => onUpdateField("mealPrepTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quanto tempo tem?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Mínimo (receitas rápidas)</SelectItem>
                    <SelectItem value="moderate">Moderado (30-60 min/dia)</SelectItem>
                    <SelectItem value="extensive">Bastante (mais de 1h/dia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Restrições ou preferências alimentares</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dietaryRestrictionOptions.map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dietary-${restriction}`}
                        checked={formData.dietaryRestrictions.includes(restriction)}
                        onCheckedChange={(checked) => 
                          onUpdateArrayField("dietaryRestrictions", restriction, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`dietary-${restriction}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {restriction}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Alergias alimentares</Label>
                <Textarea
                  id="allergies"
                  placeholder="Liste qualquer alergia ou intolerância alimentar que devemos considerar..."
                  value={formData.allergies}
                  onChange={(e) => onUpdateField("allergies", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplements">Suplementos em uso</Label>
                <Textarea
                  id="supplements"
                  placeholder="Liste os suplementos que você já usa ou tem interesse..."
                  value={formData.supplementUsage}
                  onChange={(e) => onUpdateField("supplementUsage", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {!formData.wantsDiet && (
          <div className="text-center py-8 text-gray-500">
            <p>Você pode pular esta seção ou ativá-la mais tarde se mudar de ideia.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}