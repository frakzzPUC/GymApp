import React from "react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Label } from "@/components/ui/form/label"
import { Input } from "@/components/ui/form/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Textarea } from "@/components/ui/form/textarea"
import { Slider } from "@/components/ui/utilities/slider"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Progress } from "@/components/ui/feedback/progress"
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { 
  PAIN_OPTIONS, 
  INJURY_TYPES, 
  INJURY_DURATION, 
  MEDICAL_TREATMENT,
  DAILY_ACTIVITIES,
  MOVEMENT_LIMITATIONS,
  REHAB_GOALS
} from "@/hooks/useRehabilitationForm"

interface RehabilitationFormProps {
  formData: any
  currentStep: number
  error: string | null
  isLoading: boolean
  updateFormData: (field: string, value: any) => void
  handleArrayToggle: (field: string, itemId: string) => void
  nextStep: () => void
  prevStep: () => void
  submitForm: () => void
}

const TOTAL_STEPS = 6

export function RehabilitationForm({
  formData,
  currentStep,
  error,
  isLoading,
  updateFormData,
  handleArrayToggle,
  nextStep,
  prevStep,
  submitForm
}: RehabilitationFormProps) {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Informações Básicas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age || ""}
                    onChange={(e) => updateFormData("age", parseInt(e.target.value))}
                    placeholder="Sua idade"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">Áreas de Dor</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione todas as áreas onde você sente dor ou desconforto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PAIN_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
                    <Checkbox
                      id={option.id}
                      checked={formData.painAreas.includes(option.id)}
                      onCheckedChange={() => handleArrayToggle("painAreas", option.id)}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Histórico da Lesão/Dor</Label>
            </div>
            
            <div>
              <Label htmlFor="injuryType">Tipo de lesão ou problema</Label>
              <Select value={formData.injuryType} onValueChange={(value) => updateFormData("injuryType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de lesão" />
                </SelectTrigger>
                <SelectContent>
                  {INJURY_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="injuryDuration">Há quanto tempo você tem essa dor?</Label>
              <Select value={formData.injuryDuration} onValueChange={(value) => updateFormData("injuryDuration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  {INJURY_DURATION.map((duration) => (
                    <SelectItem key={duration.id} value={duration.id}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nível de dor atual (1 = sem dor, 10 = dor insuportável)</Label>
              <div className="mt-4 mb-2">
                <Slider
                  value={[formData.painLevel]}
                  onValueChange={(value) => updateFormData("painLevel", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 - Sem dor</span>
                <span className="font-medium">Atual: {formData.painLevel}</span>
                <span>10 - Dor insuportável</span>
              </div>
            </div>

            <div>
              <Label htmlFor="medicalTreatment">Tratamento médico atual</Label>
              <Select value={formData.medicalTreatment} onValueChange={(value) => updateFormData("medicalTreatment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tratamento" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICAL_TREATMENT.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      {treatment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="surgeryHistory">Histórico de cirurgias relacionadas</Label>
              <Textarea
                id="surgeryHistory"
                value={formData.surgeryHistory}
                onChange={(e) => updateFormData("surgeryHistory", e.target.value)}
                placeholder="Descreva cirurgias relacionadas ao problema ou digite 'Nenhuma'"
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Atividades Diárias Afetadas</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Quais atividades do dia a dia causam dor ou desconforto?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DAILY_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2 rounded-md border p-3">
                    <Checkbox
                      id={activity.id}
                      checked={formData.dailyActivities.includes(activity.id)}
                      onCheckedChange={() => handleArrayToggle("dailyActivities", activity.id)}
                    />
                    <Label htmlFor={activity.id} className="flex-1 cursor-pointer">
                      {activity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Limitações de Movimento</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Que tipo de limitações você sente?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOVEMENT_LIMITATIONS.map((limitation) => (
                  <div key={limitation.id} className="flex items-center space-x-2 rounded-md border p-3">
                    <Checkbox
                      id={limitation.id}
                      checked={formData.movementLimitations.includes(limitation.id)}
                      onCheckedChange={() => handleArrayToggle("movementLimitations", limitation.id)}
                    />
                    <Label htmlFor={limitation.id} className="flex-1 cursor-pointer">
                      {limitation.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Experiência com Tratamentos</Label>
            </div>

            <div>
              <Label htmlFor="previousPhysioTherapy">Já fez fisioterapia antes?</Label>
              <Select value={formData.previousPhysioTherapy} onValueChange={(value) => updateFormData("previousPhysioTherapy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca fiz fisioterapia</SelectItem>
                  <SelectItem value="past">Já fiz no passado</SelectItem>
                  <SelectItem value="current">Faço atualmente</SelectItem>
                  <SelectItem value="recent">Fiz recentemente (últimos 6 meses)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="exerciseExperience">Experiência com exercícios</Label>
              <Select value={formData.exerciseExperience} onValueChange={(value) => updateFormData("exerciseExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua experiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sedentário - não pratico exercícios</SelectItem>
                  <SelectItem value="beginner">Iniciante - exercícios leves ocasionalmente</SelectItem>
                  <SelectItem value="intermediate">Intermediário - exercícios regulares</SelectItem>
                  <SelectItem value="advanced">Avançado - exercícios intensos regularmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="medications">Medicamentos que usa para dor (opcional)</Label>
              <Textarea
                id="medications"
                value={formData.medications.join(", ")}
                onChange={(e) => updateFormData("medications", e.target.value.split(", ").filter(m => m.trim()))}
                placeholder="Ex: Ibuprofeno, Paracetamol (deixe em branco se não usa)"
                rows={2}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Objetivos da Reabilitação</Label>
              <p className="text-sm text-muted-foreground mb-4">
                O que você espera alcançar com a reabilitação?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REHAB_GOALS.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2 rounded-md border p-3">
                    <Checkbox
                      id={goal.id}
                      checked={formData.rehabGoals.includes(goal.id)}
                      onCheckedChange={() => handleArrayToggle("rehabGoals", goal.id)}
                    />
                    <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="timeAvailability">Quanto tempo você tem disponível para exercícios por dia?</Label>
              <Select value={formData.timeAvailability} onValueChange={(value) => updateFormData("timeAvailability", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tempo disponível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutos</SelectItem>
                  <SelectItem value="30min">30 minutos</SelectItem>
                  <SelectItem value="45min">45 minutos</SelectItem>
                  <SelectItem value="60min">1 hora</SelectItem>
                  <SelectItem value="90min">1 hora e 30 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Estilo de Vida</Label>
            </div>

            <div>
              <Label htmlFor="homeEnvironment">Ambiente para exercícios em casa</Label>
              <Select value={formData.homeEnvironment} onValueChange={(value) => updateFormData("homeEnvironment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Descreva seu espaço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Espaço pequeno (quarto/sala pequena)</SelectItem>
                  <SelectItem value="medium">Espaço médio (sala ampla)</SelectItem>
                  <SelectItem value="large">Espaço grande (quintal/área ampla)</SelectItem>
                  <SelectItem value="limited">Muito limitado (só a cama/cadeira)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workType">Tipo de trabalho</Label>
              <Select value={formData.workType} onValueChange={(value) => updateFormData("workType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu tipo de trabalho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentário (escritório/computador)</SelectItem>
                  <SelectItem value="standing">Fico muito em pé</SelectItem>
                  <SelectItem value="physical">Trabalho físico</SelectItem>
                  <SelectItem value="mixed">Misto (sentado e em movimento)</SelectItem>
                  <SelectItem value="retired">Aposentado</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sleepQuality">Qualidade do sono</Label>
              <Select value={formData.sleepQuality} onValueChange={(value) => updateFormData("sleepQuality", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Como você dorme?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente - durmo bem</SelectItem>
                  <SelectItem value="good">Boa - algumas interrupções</SelectItem>
                  <SelectItem value="fair">Regular - acordo algumas vezes</SelectItem>
                  <SelectItem value="poor">Ruim - tenho insônia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stressLevel">Nível de estresse</Label>
              <Select value={formData.stressLevel} onValueChange={(value) => updateFormData("stressLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Como está seu estresse?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixo - me sinto tranquilo</SelectItem>
                  <SelectItem value="moderate">Moderado - estresse normal</SelectItem>
                  <SelectItem value="high">Alto - muito estressado</SelectItem>
                  <SelectItem value="very-high">Muito alto - estresse excessivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    const titles = [
      "Informações Básicas",
      "Histórico da Lesão",
      "Limitações Diárias",
      "Experiência com Tratamentos",
      "Objetivos da Reabilitação",
      "Estilo de Vida"
    ]
    return titles[currentStep] || ""
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.age > 0 && formData.gender && formData.painAreas.length > 0
      case 1:
        return formData.injuryType && formData.injuryDuration && formData.medicalTreatment
      case 2:
        return formData.dailyActivities.length > 0 || formData.movementLimitations.length > 0
      case 3:
        return formData.previousPhysioTherapy && formData.exerciseExperience
      case 4:
        return formData.rehabGoals.length > 0 && formData.timeAvailability
      case 5:
        return formData.homeEnvironment && formData.workType && formData.sleepQuality && formData.stressLevel
      default:
        return false
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Programa de Reabilitação</CardTitle>
            <CardDescription>
              {getStepTitle()} - Passo {currentStep + 1} de {TOTAL_STEPS}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{Math.round(progress)}%</div>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      
      <CardContent className="min-h-[400px]">
        {renderStep()}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={submitForm}
            disabled={!canProceed() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Gerando seu plano..." : "Finalizar e Gerar Plano"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}