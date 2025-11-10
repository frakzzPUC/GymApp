import React from "react"
import { Utensils, Target, ShoppingCart, Trophy, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"

interface NutritionPlanRendererProps {
  nutritionText: string
}

export function NutritionPlanRenderer({ nutritionText }: NutritionPlanRendererProps) {
  // Validar se há texto para processar
  if (!nutritionText || nutritionText.trim() === '' || nutritionText.includes('Nenhum plano nutricional disponível')) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Nenhum Plano Nutricional Disponível</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para visualizar seu plano nutricional personalizado, primeiro gere seus planos de IA.
            </p>
            <p className="text-xs text-muted-foreground">
              Vá para: Menu → Planos de IA → Gerar Novo Plano
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const lines = nutritionText.split('\n')
  let sections: Array<{
    title: string
    content: string[]
    type: 'analysis' | 'meal' | 'shopping' | 'guidance' | 'supplement' | 'other'
  }> = []
  
  let currentSection: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar seções principais
    if (line.match(/^##\s+/)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const title = line.replace(/^##\s+/, '')
      let sectionType: 'analysis' | 'meal' | 'shopping' | 'guidance' | 'supplement' | 'other' = 'other'
      
      if (title.toLowerCase().includes('análise') || title.toLowerCase().includes('nutricional')) {
        sectionType = 'analysis'
      } else if (title.toLowerCase().includes('cardápio') || title.toLowerCase().includes('refeição')) {
        sectionType = 'meal'
      } else if (title.toLowerCase().includes('compras') || title.toLowerCase().includes('lista')) {
        sectionType = 'shopping'
      } else if (title.toLowerCase().includes('orientações') || title.toLowerCase().includes('dicas')) {
        sectionType = 'guidance'
      } else if (title.toLowerCase().includes('suplementação')) {
        sectionType = 'supplement'
      }
      
      currentSection = {
        title: title,
        content: [],
        type: sectionType
      }
    }
    // Detectar refeições específicas (### CAFÉ DA MANHÃ)
    else if (line.match(/^###\s+/)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      currentSection = {
        title: line.replace(/^###\s+/, ''),
        content: [],
        type: 'meal'
      }
    }
    // Adicionar conteúdo à seção atual
    else if (currentSection && line.length > 0) {
      currentSection.content.push(line)
    }
  }
  
  if (currentSection) {
    sections.push(currentSection)
  }

  const getSectionIcon = (type: string) => {
    switch(type) {
      case 'analysis': return <Target className="h-4 w-4 text-blue-600" />
      case 'meal': return <Utensils className="h-4 w-4 text-green-600" />
      case 'shopping': return <ShoppingCart className="h-4 w-4 text-purple-600" />
      case 'guidance': return <Trophy className="h-4 w-4 text-orange-600" />
      case 'supplement': return <Clock className="h-4 w-4 text-red-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getSectionColor = (type: string) => {
    switch(type) {
      case 'analysis': return 'border-l-blue-500 bg-blue-50'
      case 'meal': return 'border-l-green-500 bg-green-50'
      case 'shopping': return 'border-l-purple-500 bg-purple-50'
      case 'guidance': return 'border-l-orange-500 bg-orange-50'
      case 'supplement': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Seu Plano Nutricional Personalizado</h3>
            <p className="text-muted-foreground">
              Plano completo baseado no seu perfil e objetivos
            </p>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className={`border-l-4 ${getSectionColor(section.type)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {getSectionIcon(section.type)}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {section.content.map((item, itemIndex) => {
                // Remover marcadores de lista
                const cleanItem = item.replace(/^[-•*]\s*/, '').replace(/^\*\*|\*\*$/g, '')
                
                // Se é uma linha com informações nutricionais (contém ":")
                if (cleanItem.includes(':') && section.type === 'analysis') {
                  const [label, value] = cleanItem.split(':')
                  return (
                    <div key={itemIndex} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-sm">{label.replace(/^\*\*|\*\*$/g, '').trim()}</span>
                      <Badge variant="outline">{value.trim()}</Badge>
                    </div>
                  )
                }
                
                // Se é uma refeição com alimentos
                if (section.type === 'meal' && item.startsWith('-')) {
                  return (
                    <div key={itemIndex} className="flex items-center gap-2 py-1">
                      <span className="text-green-600">•</span>
                      <span className="text-sm">{cleanItem}</span>
                    </div>
                  )
                }
                
                // Conteúdo normal
                return (
                  <p key={itemIndex} className="text-sm leading-relaxed">
                    {cleanItem}
                  </p>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Se não conseguiu parsear, mostrar formatação alternativa */}
      {sections.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center mb-4">
              <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium">Seu Plano Nutricional Personalizado</h4>
              <p className="text-sm text-muted-foreground">Visualização completa</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {nutritionText}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}