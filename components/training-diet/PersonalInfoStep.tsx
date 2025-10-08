import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { User } from "lucide-react"
import { FormData, FormErrors } from "@/hooks/useTrainingDietForm"

interface PersonalInfoStepProps {
  formData: FormData
  errors: FormErrors
  onUpdateField: (field: keyof FormData, value: any) => void
}

export function PersonalInfoStep({ formData, errors, onUpdateField }: PersonalInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-600" />
          Informações Pessoais
        </CardTitle>
        <CardDescription>
          Conte-nos um pouco sobre você para criarmos o melhor plano personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Idade *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Ex: 25"
              value={formData.age}
              onChange={(e) => onUpdateField("age", e.target.value)}
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gênero *</Label>
            <Select value={formData.gender} onValueChange={(value) => onUpdateField("gender", value)}>
              <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione seu gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg) *</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Ex: 70"
              value={formData.weight}
              onChange={(e) => onUpdateField("weight", e.target.value)}
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm) *</Label>
            <Input
              id="height"
              type="number"
              placeholder="Ex: 175"
              value={formData.height}
              onChange={(e) => onUpdateField("height", e.target.value)}
              className={errors.height ? "border-red-500" : ""}
            />
            {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}