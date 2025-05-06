"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function DietOptionsPage() {
  const [dietType, setDietType] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dietType) {
      setError("Por favor, selecione um tipo de dieta")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Buscar o perfil atual primeiro
      const profileResponse = await fetch("/api/training-diet")
      const profileData = await profileResponse.json()
      
      if (!profileData.success) {
        throw new Error(profileData.message || "Erro ao buscar perfil")
      }
      
      // Atualizar o perfil com o tipo de dieta selecionado
      const response = await fetch("/api/training-diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData.data,
          dietType
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push("/dashboard")
      } else {
        setError(data.message || "Erro ao salvar tipo de dieta")
      }
    } catch (error) {
      console.error("Erro ao salvar tipo de dieta:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
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
              <CardTitle className="text-2xl">Escolha seu Plano Alimentar</CardTitle>
              <CardDescription>Selecione o tipo de plano alimentar que melhor se adapta às suas necessidades</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup value={dietType} onValueChange={setDietType} className="grid gap-4">
                  <div className="flex items-start space-x-4 rounded-md border p-4">
                    <RadioGroupItem value="economic" id="economic" className="mt-1" />
                    <div>
                      <Label htmlFor="economic" className="text-base font-medium">Econômico</Label>
                      <p className="text-sm text-muted-foreground">
                        Plano alimentar com opções acessíveis e de baixo custo, mantendo o valor nutricional necessário.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rounded-md border p-4">
                    <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
                    <div>
                      <Label htmlFor="balanced" className="text-base font-medium">Balanceado</Label>
                      <p className="text-sm text-muted-foreground">
                        Plano alimentar equilibrado com variedade de alimentos e nutrientes para uma dieta saudável.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rounded-md border p-4">
                    <RadioGroupItem value="premium" id="premium" className="mt-1" />
                    <div>
                      <Label htmlFor="premium" className="text-base font-medium">Premium</Label>
                      <p className="text-sm text-muted-foreground">
                        Plano alimentar com alimentos de alta qualidade, superalimentos e opções orgânicas.
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
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
        </div>
      </main>
    </div>
  )
}