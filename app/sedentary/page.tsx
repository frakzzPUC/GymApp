"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/form/radio-group"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function SedentaryPage() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("")
  const [daysPerWeek, setDaysPerWeek] = useState("")
  const [timePerDay, setTimePerDay] = useState("")
  const [errors, setErrors] = useState<{
    weight?: string
    height?: string
    gender?: string
    daysPerWeek?: string
    timePerDay?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const router = useRouter()
  const { data: session, status, update } = useSession()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (status === "authenticated") {
      // Verificar se o usuário já tem um programa sedentário
      if (session?.user?.program === "sedentary") {
        // Se já tem, redirecionar para o dashboard
        router.push("/dashboard")
      } else {
        setIsPageLoading(false)
      }
    } else if (status === "unauthenticated") {
      // Se não estiver autenticado, redirecionar para o login
      router.push("/login")
    }
  }, [status, session, router])

  const validateForm = () => {
    const newErrors: {
      weight?: string
      height?: string
      gender?: string
      daysPerWeek?: string
      timePerDay?: string
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função handleSubmit atualizada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsLoading(true)
        setErrors({})

        console.log("Enviando dados para a API:", {
          gender,
          weight: Number(weight),
          height: Number(height),
          daysPerWeek: Number(daysPerWeek),
          timePerDay: Number(timePerDay),
        })

        const response = await fetch("/api/sedentary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gender,
            weight: Number(weight),
            height: Number(height),
            daysPerWeek: Number(daysPerWeek),
            timePerDay: Number(timePerDay),
          }),
        })

        const data = await response.json()
        console.log("Resposta da API:", data)

        if (data.success) {
          console.log("Perfil salvo com sucesso, atualizando sessão")

          // Atualizar a sessão com o novo programa
          await update({ program: "sedentary" })

          // Perfil salvo com sucesso, redirecionar para o dashboard
          console.log("Redirecionando para o dashboard")
          router.push("/dashboard")
        } else {
          // Exibir mensagem de erro
          console.error("Erro retornado pela API:", data.message)
          setErrors({
            ...errors,
            weight: data.message || "Erro ao salvar perfil",
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro ao salvar perfil:", error)
        setErrors({
          ...errors,
          weight: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
        })
        setIsLoading(false)
      }
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Verificando seu perfil...</h2>
          <p className="text-muted-foreground mt-2">Aguarde um momento</p>
        </div>
      </div>
    )
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
              <CardTitle className="text-2xl">Saindo do Sedentarismo</CardTitle>
              <CardDescription>Preencha as informações abaixo para criarmos seu programa personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-2 gap-2">
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

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Por favor, corrija os erros no formulário antes de continuar.</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Continuar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
