import React from "react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Loader2, Sparkles, Target } from "lucide-react"

interface PlanGenerationCardProps {
  isGenerating: boolean
  onGeneratePlans: () => void
}

export function PlanGenerationCard({ isGenerating, onGeneratePlans }: PlanGenerationCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-emerald-600" />
          Gerar Planos Personalizados
        </CardTitle>
        <CardDescription>
          Com base no seu perfil, nossa IA criará planos de treino e nutrição personalizados para seus objetivos.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">📋 Plano de Treino</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Exercícios específicos para seu objetivo</li>
                <li>• Cronograma semanal personalizado</li>
                <li>• Progressão adaptada ao seu nível</li>
                <li>• Considerações sobre equipamentos</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🍽️ Plano Nutricional</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Cardápio semanal balanceado</li>
                <li>• Cálculos calóricos personalizados</li>
                <li>• Receitas e dicas práticas</li>
                <li>• Considerações sobre restrições</li>
              </ul>
            </div>
          </div>
          
          <Button 
            onClick={onGeneratePlans} 
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando seus planos...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Gerar Planos com IA
              </>
            )}
          </Button>
          
          {isGenerating && (
            <p className="text-sm text-gray-600 mt-4">
              Isso pode levar alguns minutos. Nossa IA está analisando seu perfil e criando os melhores planos para você.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}