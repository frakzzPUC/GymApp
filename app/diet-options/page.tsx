"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Leaf, ShoppingCart, Utensils, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DietOptionsPage() {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status, update } = useSession()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkUserProgram = async () => {
      try {
        if (status === "authenticated") {
          console.log("Sessão atual:", session)

          // Verificar se o usuário tem o programa training-diet
          if (session?.user?.program !== "training-diet") {
            console.log("Usuário não tem o programa training-diet, verificando no banco de dados")

            try {
              const response = await fetch("/api/user/program")

              if (!response.ok) {
                throw new Error(`Erro ao buscar programa: ${response.status}`)
              }

              const data = await response.json()

              if (data.success && data.program === "training-diet") {
                console.log("Programa training-diet encontrado no banco de dados")
                // Atualizar a sessão com o programa do usuário
                try {
                  await update({ program: data.program })
                  setIsPageLoading(false)
                } catch (updateError) {
                  console.error("Erro ao atualizar sessão:", updateError)
                  // Continuar mesmo com erro na atualização da sessão
                  setIsPageLoading(false)
                }
              } else {
                console.log("Usuário não tem o programa training-diet, redirecionando para seleção de programa")
                // Se não tem, redirecionar para a seleção de programa
                router.push("/program-selection")
              }
            } catch (fetchError) {
              console.error("Erro ao verificar programa do usuário:", fetchError)
              setError("Erro ao verificar seu programa. Continuando com a seleção de dieta.")
              setIsPageLoading(false)
            }
          } else {
            setIsPageLoading(false)
          }
        } else if (status === "unauthenticated") {
          // Se não estiver autenticado, redirecionar para o login
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro geral na verificação:", error)
        setError("Ocorreu um erro ao verificar seu perfil. Por favor, tente novamente.")
        setIsPageLoading(false)
      }
    }

    checkUserProgram()
  }, [status, session, router, update])

  // Adicione esta função para salvar a escolha da dieta
  const handleSubmit = async () => {
    if (selectedDiet) {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Enviando tipo de dieta para a API:", selectedDiet)

        const response = await fetch("/api/training-diet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dietType: selectedDiet,
          }),
        })

        if (!response.ok) {
          throw new Error(`Erro na resposta da API: ${response.status}`)
        }

        const data = await response.json()
        console.log("Resposta da API:", data)

        if (data.success) {
          console.log("Dieta salva com sucesso, redirecionando para o dashboard")
          // Dieta salva com sucesso, redirecionar para o dashboard
          router.push("/dashboard")
        } else {
          // Exibir mensagem de erro
          console.error("Erro ao salvar dieta:", data.message)
          setError(data.message || "Erro ao salvar dieta. Por favor, tente novamente.")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro ao salvar dieta:", error)
        setError("Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.")
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
        <div className="mx-auto max-w-4xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Opções de Dieta</h1>
            <p className="mt-4 text-muted-foreground">
              Escolha o plano alimentar que melhor se adapta ao seu orçamento e estilo de vida
            </p>
          </div>

          <RadioGroup value={selectedDiet || ""} onValueChange={setSelectedDiet} className="grid gap-6 md:grid-cols-3">
            <div className="relative">
              <RadioGroupItem value="economic" id="economic" className="sr-only" />
              <Label
                htmlFor="economic"
                className={`flex h-full cursor-pointer flex-col rounded-lg border p-6 shadow-sm ${
                  selectedDiet === "economic" ? "border-emerald-600 ring-2 ring-emerald-600" : ""
                }`}
              >
                {selectedDiet === "economic" && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Dieta Econômica</CardTitle>
                <div className="mt-1 text-sm text-muted-foreground">Alimentos acessíveis e nutritivos</div>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Ingredientes de baixo custo
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Receitas simples e práticas
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Foco em alimentos da estação
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Lista de compras otimizada
                  </li>
                </ul>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="balanced" id="balanced" className="sr-only" />
              <Label
                htmlFor="balanced"
                className={`flex h-full cursor-pointer flex-col rounded-lg border p-6 shadow-sm ${
                  selectedDiet === "balanced" ? "border-emerald-600 ring-2 ring-emerald-600" : ""
                }`}
              >
                {selectedDiet === "balanced" && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Utensils className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Dieta Balanceada</CardTitle>
                <div className="mt-1 text-sm text-muted-foreground">Equilíbrio entre custo e variedade</div>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Alimentos de custo médio
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Maior variedade de proteínas
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Opções para todas as refeições
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Receitas mais elaboradas
                  </li>
                </ul>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="premium" id="premium" className="sr-only" />
              <Label
                htmlFor="premium"
                className={`flex h-full cursor-pointer flex-col rounded-lg border p-6 shadow-sm ${
                  selectedDiet === "premium" ? "border-emerald-600 ring-2 ring-emerald-600" : ""
                }`}
              >
                {selectedDiet === "premium" && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Dieta Premium</CardTitle>
                <div className="mt-1 text-sm text-muted-foreground">Ingredientes de alta qualidade</div>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Alimentos orgânicos e premium
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Superalimentos e suplementos
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Proteínas de alta qualidade
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Receitas gourmet e elaboradas
                  </li>
                </ul>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedDiet || isLoading}
              className="px-8 bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Salvando..." : "Confirmar Seleção"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
