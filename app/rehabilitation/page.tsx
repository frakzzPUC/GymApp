"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function RehabilitationPage() {
  const [selectedPains, setSelectedPains] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const router = useRouter()
  const { data: session, status, update } = useSession()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (status === "authenticated") {
      // Verificar se o usuário já tem um programa de reabilitação
      if (session?.user?.program === "rehabilitation") {
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
      setIsLoading(true)
      setError(null)

      console.log("Enviando áreas de dor para a API:", selectedPains)

      const response = await fetch("/api/rehabilitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          painAreas: selectedPains,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (data.success) {
        console.log("Perfil salvo com sucesso, atualizando sessão")

        // Atualizar a sessão com o novo programa
        try {
          await update({ program: "rehabilitation" })
          console.log("Sessão atualizada com sucesso")
        } catch (updateError) {
          console.error("Erro ao atualizar sessão:", updateError)
          // Continuar mesmo com erro na atualização da sessão
        }

        // Perfil salvo com sucesso, redirecionar para o dashboard
        console.log("Redirecionando para o dashboard")
        router.push("/dashboard")
      } else {
        // Exibir mensagem de erro
        console.error("Erro retornado pela API:", data.message)
        setError(data.message || "Erro ao salvar perfil de reabilitação")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
      setIsLoading(false)
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

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Continuar"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
