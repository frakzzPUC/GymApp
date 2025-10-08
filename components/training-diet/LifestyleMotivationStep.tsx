import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Textarea } from "@/components/ui/form/textarea"
import { Heart } from "lucide-react"
import { FormData, FormErrors } from "@/hooks/useTrainingDietForm"

interface LifestyleMotivationStepProps {
  formData: FormData
  errors: FormErrors
  onUpdateField: (field: keyof FormData, value: any) => void
}

export function LifestyleMotivationStep({ 
  formData, 
  errors, 
  onUpdateField 
}: LifestyleMotivationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-emerald-600" />
          Estilo de Vida e Motivação
        </CardTitle>
        <CardDescription>
          Estas informações nos ajudam a criar um programa que se adapte à sua rotina e mantenha você motivado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Profissão/Ocupação *</Label>
            <Select 
              value={formData.profession} 
              onValueChange={(value) => onUpdateField("profession", value)}
            >
              <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
                <SelectValue placeholder="Qual sua ocupação?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Trabalho sedentário (escritório)</SelectItem>
                <SelectItem value="light-active">Trabalho levemente ativo</SelectItem>
                <SelectItem value="moderate-active">Trabalho moderadamente ativo</SelectItem>
                <SelectItem value="very-active">Trabalho muito ativo (físico)</SelectItem>
                <SelectItem value="unemployed">Desempregado</SelectItem>
                <SelectItem value="retired">Aposentado</SelectItem>
              </SelectContent>
            </Select>
            {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
          </div>

          <div className="space-y-2">
            <Label>Nível de estresse diário *</Label>
            <Select 
              value={formData.stressLevel} 
              onValueChange={(value) => onUpdateField("stressLevel", value)}
            >
              <SelectTrigger className={errors.stressLevel ? "border-red-500" : ""}>
                <SelectValue placeholder="Como está seu estresse?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="very-high">Muito alto</SelectItem>
              </SelectContent>
            </Select>
            {errors.stressLevel && <p className="text-sm text-red-500">{errors.stressLevel}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleep-hours">Horas de sono por noite *</Label>
            <Input
              id="sleep-hours"
              type="number"
              placeholder="Ex: 7"
              value={formData.sleepHours}
              onChange={(e) => onUpdateField("sleepHours", e.target.value)}
              className={errors.sleepHours ? "border-red-500" : ""}
              min="3"
              max="12"
            />
            {errors.sleepHours && <p className="text-sm text-red-500">{errors.sleepHours}</p>}
          </div>

          <div className="space-y-2">
            <Label>Qualidade do sono *</Label>
            <Select 
              value={formData.sleepQuality} 
              onValueChange={(value) => onUpdateField("sleepQuality", value)}
            >
              <SelectTrigger className={errors.sleepQuality ? "border-red-500" : ""}>
                <SelectValue placeholder="Como você dorme?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Ruim (acordo cansado)</SelectItem>
                <SelectItem value="fair">Razoável (às vezes acordo cansado)</SelectItem>
                <SelectItem value="good">Boa (geralmente descansado)</SelectItem>
                <SelectItem value="excellent">Excelente (sempre descansado)</SelectItem>
              </SelectContent>
            </Select>
            {errors.sleepQuality && <p className="text-sm text-red-500">{errors.sleepQuality}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Principal motivação para se exercitar *</Label>
            <Select 
              value={formData.motivation} 
              onValueChange={(value) => onUpdateField("motivation", value)}
            >
              <SelectTrigger className={errors.motivation ? "border-red-500" : ""}>
                <SelectValue placeholder="O que mais te motiva?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Saúde (prevenir doenças, melhorar bem-estar)</SelectItem>
                <SelectItem value="appearance">Aparência (melhorar forma física)</SelectItem>
                <SelectItem value="energy">Energia (ter mais disposição)</SelectItem>
                <SelectItem value="confidence">Autoconfiança (sentir-se melhor comigo mesmo)</SelectItem>
                <SelectItem value="social">Social (acompanhar amigos/família)</SelectItem>
                <SelectItem value="performance">Performance (melhorar em esportes)</SelectItem>
                <SelectItem value="medical">Recomendação médica</SelectItem>
              </SelectContent>
            </Select>
            {errors.motivation && <p className="text-sm text-red-500">{errors.motivation}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="obstacles">Principais obstáculos para se exercitar</Label>
            <Textarea
              id="obstacles"
              placeholder="Ex: falta de tempo, cansaço, falta de motivação, lesões..."
              value={formData.obstacles}
              onChange={(e) => onUpdateField("obstacles", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support">Sistema de apoio</Label>
            <Textarea
              id="support"
              placeholder="Você tem apoio de família/amigos? Treina com alguém? Como podemos te ajudar a manter a motivação?"
              value={formData.supportSystem}
              onChange={(e) => onUpdateField("supportSystem", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous">Tentativas anteriores</Label>
            <Textarea
              id="previous"
              placeholder="Já tentou outros programas de exercício ou dieta? O que funcionou? O que não funcionou?"
              value={formData.previousAttempts}
              onChange={(e) => onUpdateField("previousAttempts", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}