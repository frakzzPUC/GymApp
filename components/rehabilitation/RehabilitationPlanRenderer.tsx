import React from "react"
import { Heart, Target, Activity, BookOpen, Shield, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"

interface RehabilitationPlanRendererProps {
  rehabilitationText: string
}

export function RehabilitationPlanRenderer({ rehabilitationText }: RehabilitationPlanRendererProps) {
  // Validar se há texto para processar
  if (!rehabilitationText || rehabilitationText.trim() === "") {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Nenhum Plano de Reabilitação Disponível</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para visualizar seu plano personalizado, primeiro complete o questionário de reabilitação.
            </p>
            <p className="text-xs text-muted-foreground">
              Vá para: Menu → Reabilitação → Completar Avaliação
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const lines = rehabilitationText.split('\n')
  let sections: Array<{
    title: string
    content: string[]
    type: 'assessment' | 'objectives' | 'exercises' | 'pain-relief' | 'education' | 'prevention' | 'topic' | 'phase'
    number?: string
  }> = []
  
  let currentSection: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar seções principais numeradas
    if (line.match(/^###?\s*\*?\*?\d+\./) || line.match(/^\*?\*?\d+\.\s*(AVALIAÇÃO|OBJETIVOS|PROGRAMA|TÉCNICAS|EDUCAÇÃO|PREVENÇÃO)/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const numberMatch = line.match(/\d+/)
      const topicNumber = numberMatch ? numberMatch[0] : ''
      const title = line
        .replace(/^###?\s*/, '')
        .replace(/^\*\*|\*\*$/, '')
        .replace(/^\d+\.\s*/, '')
        .trim()
      
      let sectionType: 'assessment' | 'objectives' | 'exercises' | 'pain-relief' | 'education' | 'prevention' | 'topic' = 'topic'
      
      const titleLower = title.toLowerCase()
      if (titleLower.includes('avaliação') || titleLower.includes('inicial')) {
        sectionType = 'assessment'
      } else if (titleLower.includes('objetivos') || titleLower.includes('tratamento')) {
        sectionType = 'objectives'
      } else if (titleLower.includes('programa') || titleLower.includes('exercícios') || titleLower.includes('domiciliares')) {
        sectionType = 'exercises'
      } else if (titleLower.includes('técnicas') || titleLower.includes('alívio') || titleLower.includes('dor')) {
        sectionType = 'pain-relief'
      } else if (titleLower.includes('educação') || titleLower.includes('orientações')) {
        sectionType = 'education'
      } else if (titleLower.includes('prevenção') || titleLower.includes('recidivas')) {
        sectionType = 'prevention'
      }
      
      currentSection = {
        title: title,
        content: [],
        type: sectionType,
        number: topicNumber
      }
    }
    // Detectar fases dos exercícios
    else if (line.match(/^FASE\s+\d+/i) || line.match(/^(FASE|ETAPA)/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      currentSection = {
        title: line,
        content: [],
        type: 'phase'
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
      case 'assessment': return <Target className="h-4 w-4 text-blue-600" />
      case 'objectives': return <BookOpen className="h-4 w-4 text-purple-600" />
      case 'exercises': return <Activity className="h-4 w-4 text-green-600" />
      case 'pain-relief': return <Heart className="h-4 w-4 text-red-600" />
      case 'education': return <BookOpen className="h-4 w-4 text-orange-600" />
      case 'prevention': return <Shield className="h-4 w-4 text-teal-600" />
      case 'phase': return <Clock className="h-5 w-5 text-emerald-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getSectionColor = (type: string) => {
    switch(type) {
      case 'assessment': return 'border-l-blue-500 bg-blue-50'
      case 'objectives': return 'border-l-purple-500 bg-purple-50'
      case 'exercises': return 'border-l-green-500 bg-green-50'
      case 'pain-relief': return 'border-l-red-500 bg-red-50'
      case 'education': return 'border-l-orange-500 bg-orange-50'
      case 'prevention': return 'border-l-teal-500 bg-teal-50'
      case 'phase': return 'border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  console.log('=== SEÇÕES DE REABILITAÇÃO DETECTADAS ===')
  sections.forEach((section, index) => {
    console.log(`${index + 1}. "${section.title}" (tipo: ${section.type}, número: ${section.number})`)
  })
  console.log(`Total: ${sections.length} seções`)

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Seu Plano de Reabilitação Personalizado</h3>
            <p className="text-muted-foreground">
              Programa completo de fisioterapia baseado na sua condição e objetivos
            </p>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, sectionIndex) => {
        const isTopicSection = ['topic', 'assessment', 'objectives', 'education', 'prevention'].includes(section.type)
        const isPhaseSection = section.type === 'phase'
        const isExerciseSection = section.type === 'exercises' || section.type === 'pain-relief'
        
        return (
          <Card key={sectionIndex} className={`border-l-4 ${getSectionColor(section.type)} ${isTopicSection ? 'shadow-lg' : isPhaseSection ? 'shadow-md border-2' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${isTopicSection ? 'text-xl' : isPhaseSection ? 'text-lg' : 'text-lg'} flex items-center gap-3`}>
                {section.number && (
                  <span className={`${isTopicSection ? 'bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold' : isPhaseSection ? 'bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold' : 'bg-gray-600 text-white px-2 py-1 rounded text-xs'}`}>
                    {section.number}
                  </span>
                )}
                {getSectionIcon(section.type)}
                <span className={isTopicSection ? 'font-bold' : isPhaseSection ? 'font-semibold' : 'font-medium'}>
                  {section.title
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/^\*\*|\*\*$/g, '')
                    .replace(/\*\*/g, '')
                    .replace(/^\d+\.\s*/, '')
                    .replace(/^#+\s*/, '')
                    .trim()}
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {section.type === 'assessment' ? (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      if (cleanItem.includes(':')) {
                        const [label, value] = cleanItem.split(':')
                        const cleanLabel = label.trim()
                        const cleanValue = value.trim()
                        
                        if (!cleanLabel || !cleanValue) return null
                        
                        return (
                          <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-blue-100 last:border-b-0">
                            <span className="font-semibold text-sm text-blue-900">{cleanLabel}</span>
                            <div className="md:col-span-2">
                              <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                                {cleanValue}
                              </Badge>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <p key={itemIndex} className="text-sm text-blue-900 leading-relaxed">
                          {cleanItem}
                        </p>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : section.type === 'objectives' ? (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                  <div className="space-y-4">
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      // Objetivos por prazo (curto, médio, longo)
                      if (cleanItem.match(/^(curto|médio|longo).*prazo/i)) {
                        let bgColor = "bg-purple-100"
                        let textColor = "text-purple-800"
                        let borderColor = "border-purple-300"
                        
                        if (cleanItem.toLowerCase().includes('curto')) {
                          bgColor = "bg-green-100"
                          textColor = "text-green-800"
                          borderColor = "border-green-300"
                        } else if (cleanItem.toLowerCase().includes('médio')) {
                          bgColor = "bg-yellow-100"
                          textColor = "text-yellow-800"
                          borderColor = "border-yellow-300"
                        } else if (cleanItem.toLowerCase().includes('longo')) {
                          bgColor = "bg-blue-100"
                          textColor = "text-blue-800"
                          borderColor = "border-blue-300"
                        }
                        
                        return (
                          <div key={itemIndex} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                            <h4 className={`font-bold ${textColor} flex items-center gap-2 text-base`}>
                              <Target className="h-4 w-4" />
                              {cleanItem}
                            </h4>
                          </div>
                        )
                      }
                      
                      if (item.startsWith('-') || item.startsWith('•')) {
                        return (
                          <div key={itemIndex} className="flex items-start gap-2 ml-4">
                            <span className="text-purple-600 mt-1 text-sm">•</span>
                            <span className="text-sm text-purple-800">{cleanItem}</span>
                          </div>
                        )
                      }
                      
                      return (
                        <p key={itemIndex} className="text-sm text-purple-900 leading-relaxed">
                          {cleanItem}
                        </p>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : (section.type === 'exercises' || section.type === 'phase') ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                  <div className="space-y-4">
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      // Nome de exercício (título em maiúsculas ou com numeração)
                      if (cleanItem.match(/^\d+\.\s*[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ]/) || cleanItem.match(/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ][A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ\s]+$/)) {
                        return (
                          <div key={itemIndex} className="bg-green-100 p-4 rounded-lg border-2 border-green-300 shadow-sm">
                            <h4 className="font-bold text-green-900 flex items-center gap-2 text-base">
                              <Activity className="h-4 w-4" />
                              {cleanItem}
                            </h4>
                          </div>
                        )
                      }
                      
                      // Descrição técnica (posição inicial, execução, etc.)
                      if (cleanItem.match(/^(posição|execução|repetições|séries|frequência|progressão|precauções):/i)) {
                        const [label, ...rest] = cleanItem.split(':')
                        const content = rest.join(':').trim()
                        
                        let icon = '📝'
                        let bgColor = 'bg-blue-50'
                        let textColor = 'text-blue-800'
                        let borderColor = 'border-blue-300'
                        
                        if (label.toLowerCase().includes('posição')) {
                          icon = '📍'
                          bgColor = 'bg-yellow-50'
                          textColor = 'text-yellow-800'
                          borderColor = 'border-yellow-300'
                        } else if (label.toLowerCase().includes('execução')) {
                          icon = '🎯'
                          bgColor = 'bg-green-50'
                          textColor = 'text-green-800'
                          borderColor = 'border-green-300'
                        } else if (label.toLowerCase().includes('repetições') || label.toLowerCase().includes('séries')) {
                          icon = '🔢'
                          bgColor = 'bg-purple-50'
                          textColor = 'text-purple-800'
                          borderColor = 'border-purple-300'
                        } else if (label.toLowerCase().includes('precauções')) {
                          icon = '⚠️'
                          bgColor = 'bg-red-50'
                          textColor = 'text-red-800'
                          borderColor = 'border-red-300'
                        }
                        
                        return (
                          <div key={itemIndex} className={`${bgColor} p-3 rounded-lg border-l-4 ${borderColor} ml-4`}>
                            <div className="flex items-start gap-2">
                              <span className="text-lg">{icon}</span>
                              <div>
                                <span className={`font-semibold ${textColor} text-sm`}>{label}:</span>
                                <span className={`text-sm ${textColor} ml-1`}>{content}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      
                      // Lista de exercícios ou instruções
                      if (item.startsWith('-') || item.startsWith('•')) {
                        return (
                          <div key={itemIndex} className="flex items-start gap-2 ml-4">
                            <span className="text-green-600 mt-1 text-sm font-bold">•</span>
                            <span className="text-sm text-green-800">{cleanItem}</span>
                          </div>
                        )
                      }
                      
                      return (
                        <div key={itemIndex} className="bg-gray-50 p-2 rounded ml-2 border-l-2 border-green-300">
                          <span className="text-sm leading-relaxed text-gray-700">
                            {cleanItem}
                          </span>
                        </div>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : section.type === 'pain-relief' ? (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-xl border-2 border-red-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-red-800 mb-2">
                        ❤️ Técnicas de Alívio da Dor
                      </h4>
                      <p className="text-sm text-red-700">
                        Métodos seguros para reduzir desconforto e dor
                      </p>
                    </div>
                    
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      // Técnicas específicas
                      if (cleanItem.match(/^(aplicação|técnicas|automassagem|posicionamento):/i)) {
                        return (
                          <div key={itemIndex} className="bg-red-100 p-4 rounded-lg border border-red-300">
                            <h5 className="font-bold text-red-900 flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              {cleanItem}
                            </h5>
                          </div>
                        )
                      }
                      
                      if (item.startsWith('-') || item.startsWith('•')) {
                        return (
                          <div key={itemIndex} className="flex items-start gap-2 ml-4">
                            <span className="text-red-600 mt-1 text-sm">•</span>
                            <span className="text-sm text-red-800">{cleanItem}</span>
                          </div>
                        )
                      }
                      
                      return (
                        <p key={itemIndex} className="text-sm text-red-800 leading-relaxed ml-2">
                          {cleanItem}
                        </p>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : section.type === 'education' ? (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-orange-800 mb-2">
                        📚 Educação e Orientações
                      </h4>
                      <p className="text-sm text-orange-700">
                        Conhecimentos importantes para sua recuperação
                      </p>
                    </div>
                    
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      // Tópicos principais
                      if (cleanItem.match(/^[A-Z][a-zà-ÿ\s]+:/)) {
                        const [topic, content] = cleanItem.split(':')
                        return (
                          <div key={itemIndex} className="bg-orange-100 p-4 rounded-lg border border-orange-300">
                            <h5 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              {topic}:
                            </h5>
                            {content && (
                              <p className="text-sm text-orange-800 leading-relaxed ml-6">
                                {content.trim()}
                              </p>
                            )}
                          </div>
                        )
                      }
                      
                      if (item.startsWith('-') || item.startsWith('•')) {
                        return (
                          <div key={itemIndex} className="flex items-start gap-2 ml-4">
                            <span className="text-orange-600 mt-1 text-sm">•</span>
                            <span className="text-sm text-orange-800">{cleanItem}</span>
                          </div>
                        )
                      }
                      
                      return (
                        <div key={itemIndex} className="bg-gray-50 p-2 rounded ml-2 border-l-2 border-orange-300">
                          <span className="text-sm leading-relaxed text-gray-700">
                            {cleanItem}
                          </span>
                        </div>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : section.type === 'prevention' ? (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-teal-800 mb-2">
                        🛡️ Prevenção de Recidivas
                      </h4>
                      <p className="text-sm text-teal-700">
                        Estratégias para manter os resultados a longo prazo
                      </p>
                    </div>
                    
                    {section.content.map((item, itemIndex) => {
                      const cleanItem = item
                        .replace(/^[-•*]\s*/, '')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^\*\*|\*\*$/g, '')
                        .replace(/\*\*/g, '')
                        .trim()
                      
                      if (!cleanItem) return null
                      
                      // Estratégias de prevenção
                      if (cleanItem.match(/^(exercícios|hábitos|estratégias|programa):/i)) {
                        return (
                          <div key={itemIndex} className="bg-teal-100 p-4 rounded-lg border border-teal-300">
                            <h5 className="font-bold text-teal-900 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              {cleanItem}
                            </h5>
                          </div>
                        )
                      }
                      
                      if (item.startsWith('-') || item.startsWith('•')) {
                        return (
                          <div key={itemIndex} className="flex items-start gap-2 ml-4">
                            <span className="text-teal-600 mt-1 text-sm">•</span>
                            <span className="text-sm text-teal-800">{cleanItem}</span>
                          </div>
                        )
                      }
                      
                      return (
                        <p key={itemIndex} className="text-sm text-teal-800 leading-relaxed ml-2">
                          {cleanItem}
                        </p>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ) : (
                // Renderização padrão para outras seções
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => {
                    const cleanItem = item
                      .replace(/^[-•*]\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/^\*\*|\*\*$/g, '')
                      .replace(/\*\*/g, '')
                      .replace(/^#+\s*/, '')
                      .trim()
                    
                    if (!cleanItem) return null
                    
                    if (cleanItem.includes(':')) {
                      const [label, value] = cleanItem.split(':')
                      const cleanLabel = label.trim()
                      const cleanValue = value.trim()
                      
                      if (!cleanLabel || !cleanValue) return null
                      
                      return (
                        <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-gray-100 last:border-b-0">
                          <span className="font-semibold text-sm text-gray-700">{cleanLabel}</span>
                          <div className="md:col-span-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                              {cleanValue}
                            </Badge>
                          </div>
                        </div>
                      )
                    }
                    
                    if (item.startsWith('-') || item.startsWith('•')) {
                      return (
                        <div key={itemIndex} className="flex items-start gap-3 py-2 pl-2">
                          <span className="text-emerald-600 mt-0.5 text-lg">•</span>
                          <span className="text-sm text-gray-700 leading-relaxed">{cleanItem}</span>
                        </div>
                      )
                    }
                    
                    return (
                      <p key={itemIndex} className="text-sm leading-relaxed text-gray-700 py-1">
                        {cleanItem}
                      </p>
                    )
                  }).filter(Boolean)}
                </div>
              )}
            </CardContent>
          </Card>
        )})}

      {/* Aviso de segurança */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante - Orientações de Segurança</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Interrompa qualquer exercício se sentir dor intensa</li>
                <li>• Consulte um profissional de saúde se os sintomas piorarem</li>
                <li>• Este plano não substitui tratamento médico profissional</li>
                <li>• Siga sempre as orientações do seu médico ou fisioterapeuta</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}