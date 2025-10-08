import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Loader2, Sparkles, Target, Utensils, CheckCircle } from "lucide-react"
import { PlanFormatter } from "./PlanFormatter"
import { PlansData } from "@/hooks/useAIPlans"

interface PlansDisplayProps {
  plansData: PlansData
  isGenerating: boolean
  onRegeneratePlans: () => void
}

export function PlansDisplay({ plansData, isGenerating, onRegeneratePlans }: PlansDisplayProps) {
  const router = useRouter()
  const { workoutPlan, nutritionPlan, generatedAt } = plansData

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full">
          <CheckCircle className="h-4 w-4" />
          Planos gerados com sucesso!
          {generatedAt && (
            <span className="text-sm">
              em {generatedAt.toLocaleDateString('pt-BR')} às {generatedAt.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Plano de Treino
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Plano Nutricional
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workout">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Seu Plano de Treino Personalizado
              </CardTitle>
              <CardDescription>
                Criado especialmente para seus objetivos, nível de condicionamento e preferências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanFormatter text={workoutPlan} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-blue-600" />
                Seu Plano Nutricional Personalizado
              </CardTitle>
              <CardDescription>
                Alimentação balanceada considerando suas preferências, restrições e objetivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanFormatter text={nutritionPlan} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-4">
        <Button 
          onClick={onRegeneratePlans} 
          disabled={isGenerating}
          variant="outline"
          className="mr-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Regenerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Regenerar Planos
            </>
          )}
        </Button>
        
        <Button 
          onClick={() => router.push("/dashboard")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Ir para Dashboard
        </Button>
      </div>
    </div>
  )
}