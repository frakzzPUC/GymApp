"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Leaf, ShoppingCart, Utensils } from "lucide-react"

export default function DietOptionsPage() {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null)
  const router = useRouter()

  // Adicione esta função para salvar a escolha da dieta
  const handleSubmit = async () => {
    if (selectedDiet) {
      try {
        const response = await fetch("/api/training-diet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dietType: selectedDiet,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Dieta salva com sucesso, redirecionar para o dashboard
          router.push("/dashboard?program=training-diet")
        } else {
          // Exibir mensagem de erro (você precisaria adicionar um estado para isso)
          console.error("Erro ao salvar dieta:", data.message)
        }
      } catch (error) {
        console.error("Erro ao salvar dieta:", error)
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
        <div className="mx-auto max-w-4xl">
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
              disabled={!selectedDiet}
              className="px-8 bg-emerald-600 hover:bg-emerald-700"
            >
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
