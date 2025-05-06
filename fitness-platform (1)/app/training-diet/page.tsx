"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function TrainingDietPage() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("")
  const [daysPerWeek, setDaysPerWeek] = useState("")
  const [timePerDay, setTimePerDay] = useState("")
  const [fitnessLevel, setFitnessLevel] = useState("")
  const [goal, setGoal] = useState("")
  const [wantsDiet, setWantsDiet] = useState(false)
  const [errors, setErrors] = useState<{
    weight?: string
    height?: string
    gender?: string
    daysPerWeek?: string
    timePerDay?: string
    fitnessLevel?: string
    goal?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {
      weight?: string
      height?: string
      gender?: string
      daysPerWeek?: string
      timePerDay?: string
      fitnessLevel?: string
      goal?: string
    } = {}

    // Validar peso
    if (!weight) {
      newErrors.weight = "Peso é obrigatório"
    } else if (Number.parseFloat(weight) <= 0 || Number.parseFloat(weight) > 300) {
      newErrors.weight = "Peso deve estar entre 1 e 300 kg"
    }

    // Validar altura
    if (!height) {
      newErrors.height = "Altura é obrigatória"
    } else if (Number.parseFloat(height) <= 0 || Number.parseFloat(height) > 250) {
      newErrors.height = "Altura deve estar entre 1 e 250 cm"
    }

    // Validar gênero
    if (!gender) {
      newErrors.gender = "Gênero é obrigatório"
    }

    // Validar dias por semana
    if (!daysPerWeek) {
      newErrors.daysPerWeek = "Selecione os dias disponíveis"
    }

    // Validar tempo por dia
    if (!timePerDay) {
      newErrors.timePerDay = "Selecione o tempo disponível"
    }

    // Validar nível de condicionamento
    if (!fitnessLevel) {
      newErrors.fitnessLevel = "Selecione seu nível de condicionamento"
    }

    // Validar objetivo
    if (!goal) {
      newErrors.goal = "Selecione seu objetivo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        
        const formData = {
          gender,
          weight: Number(weight),
          height: Number(height),
          goal,
          fitnessLevel,
          daysPerWeek: Number(daysPerWeek),
          timePerDay: Number(timePerDay),
        }
        
        console.log("Enviando dados:", formData)

        const response = await fetch("/api/training-diet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()
        console.log("Resposta da API:", data)

        if (data.success) {
          // Perfil salvo com sucesso
          console.log("Perfil salvo com sucesso, redirecionando...")
          if (wantsDiet) {
            router.push("/diet-options")
          } else {
            router.push("/dashboard?program=training-diet")
          }
        } else {
          // Exibir mensagem de erro
          console.error("Erro retornado pela API:", data.message)
          setErrors({
            ...errors,
            weight: data.message || "Erro ao salvar perfil",
          })
          setIsSubmitting(false)
        }
      } catch (error) {
        console.error("Erro ao salvar perfil:", error)
        setErrors({
          ...errors,
          weight: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
        })
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">FitJourney</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Programa de Treino + Dieta</CardTitle>
              <CardDescription>Preencha as informações abaixo para criarmos seu programa personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="male" id="male-training" />
                      <Label htmlFor="male-training" className="flex-1 cursor-pointer">
                        Masculino
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="female" id="female-training" />
                      <Label htmlFor="female-training" className="flex-1 cursor-pointer">
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
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
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
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className={errors.height ? "border-red-500" : ""}
                      required
                    />
                    {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days-per-week">Dias disponíveis por semana</Label>
                  <Select value={daysPerWeek} onValueChange={setDaysPerWeek} required>
                    <SelectTrigger id="days-per-week" className={errors.daysPerWeek ? "border-red-500" : ""}>
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
                  <Select value={timePerDay} onValueChange={setTimePerDay} required>
                    <SelectTrigger id="time-per-day" className={errors.timePerDay ? "border-red-500" : ""}>
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

                <div className="space-y-2">
                  <Label>Seu objetivo</Label>
                  <RadioGroup value={goal} onValueChange={setGoal} className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="lose-weight" id="lose-weight" />
                      <Label htmlFor="lose-weight" className="flex-1 cursor-pointer">
                        Emagrecer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="gain-muscle" id="gain-muscle" />
                      <Label htmlFor="gain-muscle" className="flex-1 cursor-pointer">
                        Ganhar massa muscular
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.goal && <p className="text-sm text-red-500">{errors.goal}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitness-level">Nível de condicionamento</Label>
                  <Select value={fitnessLevel} onValueChange={setFitnessLevel} required>
                    <SelectTrigger id="fitness-level" className={errors.fitnessLevel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fitnessLevel && <p className="text-sm text-red-500">{errors.fitnessLevel}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="wants-diet" checked={wantsDiet} onCheckedChange={setWantsDiet} />
                  <Label htmlFor="wants-diet">Desejo incluir um plano alimentar</Label>
                </div>

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Por favor, corrija os erros no formulário antes de continuar.</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Continuar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}