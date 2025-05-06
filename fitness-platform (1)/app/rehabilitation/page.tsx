"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RehabilitationPage() {
  const [selectedPains, setSelectedPains] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [painLevel, setPainLevel] = useState("7")

  const painOptions = [
    { id: "lower-back", label: "Dor na lombar" },
    { id: "neck", label: "Dor no pescoço" },
    { id: "shoulder", label: "Dor nos ombros" },
    { id: "knee", label: "Dor nos joelhos" },
    { id: "hip", label: "Dor no quadril" },
    { id: "wrist", label: "Dor nos pulsos" },
  ]

  const handlePainToggle = (painId: string) => {
    setSelectedPains((prev) => {
      if (prev.includes(painId)) {
        return prev.filter((id) => id !== painId)
      } else {
        return [...prev, painId]
      }
    })

    // Limpar erro quando o usuário seleciona uma opção
    if (error) {
      setError(null)
    }
  }

  // Substitua a função handleSubmit por esta versão que usa a API
  const handleSubmit = async () => {
    if (selectedPains.length === 0) {
      setError("Por favor, selecione pelo menos uma área de dor")
      return
    }

    try {
      const response = await fetch("/api/rehabilitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          painAreas: selectedPains,
          initialPainLevel: Number.parseInt(painLevel, 10),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Perfil salvo com sucesso, redirecionar para o dashboard
        router.push("/dashboard?program=rehabilitation")
      } else {
        // Exibir mensagem de erro
        setError(data.message || "Erro ao salvar perfil de reabilitação")
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
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
              <CardTitle className="text-2xl">Programa de Reabilitação</CardTitle>
              <CardDescription>
                Selecione as áreas onde você sente dor para recebermos exercícios personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {painOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
                    <Checkbox
                      id={option.id}
                      checked={selectedPains.includes(option.id)}
                      onCheckedChange={() => handlePainToggle(option.id)}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-6">
                <Label htmlFor="pain-level">Nível de dor atual (1-10)</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">1</span>
                  <input
                    id="pain-level"
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(e.target.value)}
                    className="flex-1"
                  />
                  <span className="ml-2 text-sm">10</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium">{painLevel}</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Continuar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
