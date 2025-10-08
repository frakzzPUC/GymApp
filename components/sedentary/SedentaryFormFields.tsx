import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/form/radio-group"
import { Button } from "@/components/ui/actions/button"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { AlertCircle } from "lucide-react"
import { SedentaryFormData, SedentaryFormErrors } from "@/hooks/useSedentaryForm"

interface SedentaryFormFieldsProps {
  formData: SedentaryFormData
  errors: SedentaryFormErrors
  isLoading: boolean
  onUpdateField: (field: keyof SedentaryFormData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SedentaryFormFields({ 
  formData, 
  errors, 
  isLoading, 
  onUpdateField, 
  onSubmit 
}: SedentaryFormFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Saindo do Sedentarismo</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para criarmos seu programa personalizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Gênero</Label>
            <RadioGroup 
              value={formData.gender} 
              onValueChange={(value) => onUpdateField("gender", value)} 
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="flex-1 cursor-pointer">
                  Masculino
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="flex-1 cursor-pointer">
                  Feminino
                </Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => onUpdateField("weight", e.target.value)}
                className={errors.weight ? "border-red-500" : ""}
                required
              />
              {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => onUpdateField("height", e.target.value)}
                className={errors.height ? "border-red-500" : ""}
                required
              />
              {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days-per-week">Dias disponíveis por semana</Label>
            <Select 
              value={formData.daysPerWeek} 
              onValueChange={(value) => onUpdateField("daysPerWeek", value)} 
              required
            >
              <SelectTrigger 
                id="days-per-week" 
                className={errors.daysPerWeek ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 dia</SelectItem>
                <SelectItem value="2">2 dias</SelectItem>
                <SelectItem value="3">3 dias</SelectItem>
                <SelectItem value="4">4 dias</SelectItem>
                <SelectItem value="5">5 dias</SelectItem>
                <SelectItem value="6">6 dias</SelectItem>
                <SelectItem value="7">7 dias</SelectItem>
              </SelectContent>
            </Select>
            {errors.daysPerWeek && <p className="text-sm text-red-500">{errors.daysPerWeek}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-per-day">Tempo disponível por dia</Label>
            <Select 
              value={formData.timePerDay} 
              onValueChange={(value) => onUpdateField("timePerDay", value)} 
              required
            >
              <SelectTrigger 
                id="time-per-day" 
                className={errors.timePerDay ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                <SelectItem value="120">2 horas ou mais</SelectItem>
              </SelectContent>
            </Select>
            {errors.timePerDay && <p className="text-sm text-red-500">{errors.timePerDay}</p>}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor, corrija os erros no formulário antes de continuar.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700" 
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Continuar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}