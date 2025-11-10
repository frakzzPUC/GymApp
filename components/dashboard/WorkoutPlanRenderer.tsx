import React from "react"
import { Dumbbell, Target, Clock, Trophy, Activity, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"

interface WorkoutPlanRendererProps {
  workoutText: string
}

export function WorkoutPlanRenderer({ workoutText }: WorkoutPlanRendererProps) {
  // Validar se há texto para processar
  if (!workoutText || workoutText.trim() === '' || workoutText === 'Nenhum plano de treino disponível. Gere seus planos personalizados na seção "Planos de IA" do menu.') {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Nenhum Plano de Treino Disponível</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para visualizar seu plano personalizado, primeiro gere seus planos de IA.
            </p>
            <p className="text-xs text-muted-foreground">
              Vá para: Menu → Planos de IA → Gerar Novo Plano
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const lines = workoutText.split('\n')
  let sections: Array<{
    title: string
    content: string[]
    type: 'analysis' | 'structure' | 'workout' | 'guidance' | 'motivation' | 'other'
  }> = []
  
  let currentSection: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar seções principais
    if (line.match(/^##\s+/) || line.match(/^PLANO DE TREINO|^ANÁLISE INICIAL|^ESTRUTURA DO TREINO|^ORIENTAÇÕES|^DICAS/)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const title = line.replace(/^##\s+/, '')
      let sectionType: 'analysis' | 'structure' | 'workout' | 'guidance' | 'motivation' | 'other' = 'other'
      
      if (title.toLowerCase().includes('análise') || title.toLowerCase().includes('inicial')) {
        sectionType = 'analysis'
      } else if (title.toLowerCase().includes('estrutura') || title.toLowerCase().includes('divisão')) {
        sectionType = 'structure'
      } else if (title.toLowerCase().includes('treino') && title.match(/[A-Z]/)) {
        sectionType = 'workout'
      } else if (title.toLowerCase().includes('orientações') || title.toLowerCase().includes('importantes')) {
        sectionType = 'guidance'
      } else if (title.toLowerCase().includes('dicas') || title.toLowerCase().includes('motivacionais')) {
        sectionType = 'motivation'
      }
      
      currentSection = {
        title: title,
        content: [],
        type: sectionType
      }
    }
    // Detectar treinos específicos (TREINO A, B, C)
    else if (line.match(/^TREINO\s+[A-Z]/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      currentSection = {
        title: line,
        content: [],
        type: 'workout'
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
      case 'structure': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'workout': return <Dumbbell className="h-4 w-4 text-green-600" />
      case 'guidance': return <Trophy className="h-4 w-4 text-orange-600" />
      case 'motivation': return <Activity className="h-4 w-4 text-red-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getSectionColor = (type: string) => {
    switch(type) {
      case 'analysis': return 'border-l-blue-500 bg-blue-50'
      case 'structure': return 'border-l-purple-500 bg-purple-50'
      case 'workout': return 'border-l-green-500 bg-green-50'
      case 'guidance': return 'border-l-orange-500 bg-orange-50'
      case 'motivation': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Seu Plano de Treino Personalizado</h3>
            <p className="text-muted-foreground">
              Programa completo baseado no seu perfil e objetivos
            </p>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className={`border-l-4 ${getSectionColor(section.type)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {getSectionIcon(section.type)}
              {section.title
                .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                .replace(/\*\*/g, '') // Remove qualquer ** restante
                .replace(/^\d+\.\s*/, '') // Remove numeração
                .trim()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {section.type === 'analysis' ? (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => {
                    const cleanItem = item
                      .replace(/^[-•*]\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
                      .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                      .replace(/\*\*/g, '') // Remove qualquer ** restante
                      .replace(/- \*\*Nome\*\*:/gi, '') // Remove "- **Nome**:"
                      .replace(/Nome:\s*\w+/gi, '') // Remove "Nome: [Nome]"
                      .trim()
                    
                    if (cleanItem.includes(':')) {
                      const [label, value] = cleanItem.split(':')
                      const cleanLabel = label.replace(/^-\s*/, '').trim()
                      const cleanValue = value.trim()
                      
                      // Pular se o label for "Nome" ou se estiver vazio
                      if (cleanLabel.toLowerCase() === 'nome' || !cleanLabel || !cleanValue) {
                        return null
                      }
                      
                      return (
                        <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-blue-100 last:border-b-0">
                          <span className="font-semibold text-sm text-blue-900">{cleanLabel}</span>
                          <div className="md:col-span-2">
                            <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white border border-blue-200 text-blue-800">
                              {cleanValue}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    return cleanItem ? (
                      <p key={itemIndex} className="text-sm text-blue-900 leading-relaxed">
                        {cleanItem}
                      </p>
                    ) : null
                  })}
                </div>
              </div>
            ) : section.type === 'structure' ? (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => {
                    const cleanItem = item
                      .replace(/^[-•*]\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
                      .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                      .replace(/\*\*/g, '') // Remove qualquer ** restante
                      .replace(/para\s+\w+/gi, '') // Remove "para [Nome]"
                      .replace(/Nome:\s*\w+/gi, '') // Remove "Nome: [Nome]"
                      .replace(/\*\*Nome\*\*:\s*\w+/gi, '') // Remove "**Nome**: [Nome]"
                      .replace(/- \*\*Nome\*\*:/gi, '') // Remove "- **Nome**:"
                      .trim()
                    
                    if (!cleanItem) return null
                    
                    if (cleanItem.includes(':')) {
                      const [label, value] = cleanItem.split(':')
                      const cleanLabel = label.replace(/^-\s*/, '').trim()
                      const cleanValue = value.trim()
                      
                      // Pular se o label for "Nome" ou se estiver vazio
                      if (cleanLabel.toLowerCase() === 'nome' || !cleanLabel || !cleanValue) {
                        return null
                      }
                      
                      return (
                        <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-purple-100 last:border-b-0">
                          <span className="font-semibold text-sm text-purple-900">{cleanLabel}</span>
                          <div className="md:col-span-2">
                            <span className="inline-flex px-3 py-1 rounded-full text-sm bg-white border border-purple-200 text-purple-800">
                              {cleanValue}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    // Se for uma lista estruturada (Semana 1:, Segunda:, etc.)
                    if (cleanItem.match(/^(Semana|Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)/i)) {
                      return (
                        <div key={itemIndex} className="bg-white p-3 rounded-lg border border-purple-200">
                          <span className="font-medium text-purple-900 text-sm">
                            {cleanItem}
                          </span>
                        </div>
                      )
                    }
                    
                    return (
                      <p key={itemIndex} className="text-sm text-purple-900 leading-relaxed">
                        {cleanItem}
                      </p>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {section.content.map((item, itemIndex) => {
                // Remover marcadores de lista e formatação markdown
                const cleanItem = item
                  .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
                  .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém o texto
                  .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                  .replace(/\*\*/g, '') // Remove qualquer ** restante
                  .replace(/- \*\*Nome\*\*:/gi, '') // Remove "- **Nome**:"
                  .replace(/Nome:\s*\w+/gi, '') // Remove "Nome: [Nome]"
                  .trim()
                
                // Se é uma linha com informações de perfil (contém ":")
                if (cleanItem.includes(':') && section.type === 'analysis') {
                  const [label, value] = cleanItem.split(':')
                  const cleanLabel = label.replace(/^\*\*|\*\*$/g, '').replace(/^-\s*/, '').trim()
                  const cleanValue = value.replace(/^\*\*|\*\*$/g, '').trim()
                  
                  return (
                    <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-sm text-gray-700">{cleanLabel}</span>
                      <div className="md:col-span-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                          {cleanValue}
                        </Badge>
                      </div>
                    </div>
                  )
                }
                
                // Se é um exercício com repetições
                if (cleanItem.match(/^.+:\s*\d+x\d+/)) {
                  const [exercise, reps] = cleanItem.split(':')
                  return (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-sm">{exercise.trim()}</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {reps.trim()}
                      </Badge>
                    </div>
                  )
                }
                
                // Se é uma seção numerada (1. Aquecimento, 2. Exercícios)
                if (cleanItem.match(/^\d+\.\s*\*\*.+\*\*/) || cleanItem.match(/^\d+\.\s*/)) {
                  const text = cleanItem.replace(/^\d+\.\s*\*\*|\*\*$/g, '')
                  return (
                    <div key={itemIndex} className="bg-amber-50 p-3 rounded-md border-l-2 border-amber-400 mt-3">
                      <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {text}
                      </h4>
                    </div>
                  )
                }
                
                // Se é uma lista de exercícios ou informações
                if (item.startsWith('-') || item.startsWith('•')) {
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
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Se não conseguiu parsear, mostrar formatação alternativa */}
      {sections.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center mb-4">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium">Seu Plano de Treino Personalizado</h4>
              <p className="text-sm text-muted-foreground">Visualização completa</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {workoutText}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}