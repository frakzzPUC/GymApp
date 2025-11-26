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
    type: 'analysis' | 'structure' | 'workout' | 'guidance' | 'motivation' | 'topic' | 'day' | 'other'
    number?: string
  }> = []
  
  let currentSection: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar tópicos numerados (### **1. ANÁLISE INICIAL**, ### 2. ESTRUTURA, etc.)
    if (line.match(/^###?\s*\*?\*?\d+\./) || line.match(/^\*?\*?\d+\.\s*(ANÁLISE|ESTRUTURA|TREINOS|ORIENTAÇÕES|DICAS)/i)) {
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
      
      let sectionType: 'analysis' | 'structure' | 'workout' | 'guidance' | 'motivation' | 'topic' = 'topic'
      
      if (title.toLowerCase().includes('análise') || title.toLowerCase().includes('inicial')) {
        sectionType = 'analysis'
      } else if (title.toLowerCase().includes('estrutura') || title.toLowerCase().includes('divisão')) {
        sectionType = 'structure'
      } else if (title.toLowerCase().includes('treino') || title.toLowerCase().includes('detalhado')) {
        sectionType = 'workout'
      } else if (title.toLowerCase().includes('orientações') || title.toLowerCase().includes('importantes')) {
        sectionType = 'guidance'
      } else if (title.toLowerCase().includes('dicas') || title.toLowerCase().includes('motivacionais')) {
        sectionType = 'motivation'
      }
      
      currentSection = {
        title: title,
        content: [],
        type: sectionType,
        number: topicNumber
      }
    }
    // Detectar seções principais sem numeração
    else if (line.match(/^##\s+/) || line.match(/^PLANO DE TREINO|^ANÁLISE INICIAL|^ESTRUTURA DO TREINO|^ORIENTAÇÕES|^DICAS/)) {
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
    // Detectar dias de treino específicos (DIA 1:, TREINO A, etc.)
    else if (line.match(/^(DIA\s+\d+:|TREINO\s+[A-Z]:|.*DIA\s+\d+.*SUPERIORES|.*DIA\s+\d+.*INFERIORES)/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const dayMatch = line.match(/(DIA\s+\d+|TREINO\s+[A-Z])/i)
      const dayNumber = dayMatch ? dayMatch[0] : ''
      
      currentSection = {
        title: line,
        content: [],
        type: 'day',
        number: dayNumber
      }
    }
    // Detectar treinos específicos sem DIA (TREINO A, B, C)
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
      case 'topic': return <Target className="h-5 w-5 text-indigo-600" />
      case 'day': return <Dumbbell className="h-5 w-5 text-emerald-600" />
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
      case 'topic': return 'border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50'
      case 'day': return 'border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
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

      {sections.map((section, sectionIndex) => {
        const isTopicSection = section.type === 'topic' || section.type === 'analysis' || section.type === 'structure' || section.type === 'guidance' || section.type === 'motivation'
        const isDaySection = section.type === 'day' || section.type === 'workout'
        
        return (
          <Card key={sectionIndex} className={`border-l-4 ${getSectionColor(section.type)} ${isTopicSection ? 'shadow-lg' : isDaySection ? 'shadow-md border-2' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`${isTopicSection ? 'text-xl' : isDaySection ? 'text-lg' : 'text-lg'} flex items-center gap-3`}>
                {section.number && (
                  <span className={`${isTopicSection ? 'bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold' : isDaySection ? 'bg-emerald-600 text-white px-2 py-1 rounded text-sm font-semibold' : 'bg-gray-600 text-white px-2 py-1 rounded text-xs'}`}>
                    {section.number}
                  </span>
                )}
                {getSectionIcon(section.type)}
                <span className={isTopicSection ? 'font-bold' : isDaySection ? 'font-semibold' : 'font-medium'}>
                  {section.title
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
                    .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                    .replace(/\*\*/g, '') // Remove qualquer ** restante
                    .replace(/^\d+\.\s*/, '') // Remove numeração
                    .replace(/^#+\s*/, '') // Remove markdown headers
                    .replace(/^---+$/, '') // Remove separadores
                    .replace(/\*Plano gerado automaticamente.*\*/gi, '') // Remove linha de crédito
                    .replace(/Nome:\s*\w+/gi, '') // Remove "Nome: [Nome]"
                    .trim()}
                </span>
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
                      .replace(/\*Plano gerado automaticamente.*\*/gi, '') // Remove linha de crédito
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
                      .replace(/\*Plano gerado automaticamente.*\*/gi, '') // Remove linha de crédito
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
            ) : (section.type === 'day' || isDaySection) ? (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-200">
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => {
                    const cleanItem = item
                      .replace(/^[-•*]\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/^\*\*|\*\*$/g, '')
                      .replace(/\*\*/g, '')
                      .replace(/^#+\s*/, '')
                      .replace(/^---+$/, '')
                      .replace(/\*Plano gerado automaticamente.*\*/gi, '')
                      .trim()
                    
                    if (!cleanItem) return null
                    
                    // Seções de aquecimento, exercícios principais, volta à calma
                    if (cleanItem.match(/^\d+\.\s*(Aquecimento|Exercícios|Volta)/i)) {
                      const text = cleanItem.replace(/^\d+\.\s*/, '')
                      let icon = <Clock className="h-4 w-4" />
                      let bgColor = "bg-yellow-100"
                      let textColor = "text-yellow-800"
                      let borderColor = "border-yellow-300"
                      
                      if (text.toLowerCase().includes('aquecimento')) {
                        icon = <Activity className="h-4 w-4" />
                        bgColor = "bg-orange-100"
                        textColor = "text-orange-800"
                        borderColor = "border-orange-300"
                      } else if (text.toLowerCase().includes('exercícios')) {
                        icon = <Dumbbell className="h-4 w-4" />
                        bgColor = "bg-blue-100"
                        textColor = "text-blue-800"
                        borderColor = "border-blue-300"
                      } else if (text.toLowerCase().includes('volta') || text.toLowerCase().includes('calma')) {
                        icon = <Target className="h-4 w-4" />
                        bgColor = "bg-purple-100"
                        textColor = "text-purple-800"
                        borderColor = "border-purple-300"
                      }
                      
                      return (
                        <div key={itemIndex} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor} mt-3`}>
                          <h4 className={`font-bold ${textColor} flex items-center gap-2 text-base`}>
                            {icon}
                            {text}
                          </h4>
                        </div>
                      )
                    }
                    
                    // Exercícios com séries (A1:, A2:, etc.)
                    if (cleanItem.match(/^[A-Z]\d*:/)) {
                      const [exerciseCode, exercise] = cleanItem.split(':')
                      const cleanExercise = exercise ? exercise.trim() : ''
                      
                      return (
                        <div key={itemIndex} className="bg-white p-4 rounded-lg border-2 border-emerald-300 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                              {exerciseCode.trim()}
                            </span>
                            <span className="font-semibold text-emerald-900 text-base">
                              {cleanExercise}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    // Séries x Reps (formato estruturado)
                    if (cleanItem.match(/Séries\s*x\s*Reps/i)) {
                      return (
                        <div key={itemIndex} className="bg-emerald-100 p-3 rounded-lg ml-4 border border-emerald-200">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">📊</span>
                            <span className="text-sm font-semibold text-emerald-800">{cleanItem}</span>
                          </div>
                        </div>
                      )
                    }
                    
                    // Informações com séries e repetições (3 x 8-12, etc.)
                    if (cleanItem.match(/\d+\s*x\s*\d+(-\d+)?/)) {
                      return (
                        <div key={itemIndex} className="flex items-center justify-between bg-emerald-100 p-3 rounded-lg ml-4 border border-emerald-200">
                          <span className="text-sm font-medium text-emerald-800">Séries x Repetições:</span>
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 font-bold">
                            {cleanItem}
                          </Badge>
                        </div>
                      )
                    }
                    
                    // Dicas de execução (texto que começa com ações)
                    if (cleanItem.toLowerCase().includes('dica') || 
                        cleanItem.match(/^(Mantenha|Incline|Puxe|Empurre|Segure|Controle|Desça|Suba)/i)) {
                      return (
                        <div key={itemIndex} className="bg-blue-50 p-3 rounded-lg ml-4 border-l-4 border-blue-400">
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5 text-sm">💡</span>
                            <span className="text-sm text-blue-800 leading-relaxed font-medium">
                              <strong>Dica:</strong> {cleanItem}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    // Tempo de execução (30s, 1 min, etc.)
                    if (cleanItem.match(/(\d+s|\d+\s*min|\d+\s*segundo|\d+\s*minuto)/i)) {
                      return (
                        <div key={itemIndex} className="flex items-center gap-2 ml-4 bg-yellow-50 p-2 rounded border border-yellow-200">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">{cleanItem}</span>
                        </div>
                      )
                    }
                    
                    // Alongamentos
                    if (cleanItem.toLowerCase().includes('alongamento')) {
                      return (
                        <div key={itemIndex} className="bg-purple-50 p-3 rounded-lg ml-4 border border-purple-200">
                          <div className="flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">🧜</span>
                            <span className="text-sm text-purple-800 leading-relaxed">
                              {cleanItem}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    // Lista de exercícios simples
                    if (item.startsWith('-') || item.startsWith('•')) {
                      return (
                        <div key={itemIndex} className="flex items-start gap-3 py-2 ml-2">
                          <span className="text-emerald-600 mt-1 text-sm font-bold">•</span>
                          <span className="text-sm text-gray-700 leading-relaxed">{cleanItem}</span>
                        </div>
                      )
                    }
                    
                    // Texto normal
                    return cleanItem ? (
                      <div key={itemIndex} className="bg-gray-50 p-2 rounded ml-2 border-l-2 border-gray-300">
                        <span className="text-sm leading-relaxed text-gray-700">
                          {cleanItem}
                        </span>
                      </div>
                    ) : null
                  }).filter(Boolean)}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => {
                // Limpeza mais agressiva de marcadores markdown
                const cleanItem = item
                  .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
                  .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém o texto
                  .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
                  .replace(/\*\*/g, '') // Remove qualquer ** restante
                  .replace(/^#+\s*/, '') // Remove headers markdown
                  .replace(/^---+$/, '') // Remove separadores
                  .replace(/- \*\*Nome\*\*:/gi, '') // Remove "- **Nome**:"
                  .replace(/Nome:\s*\w+/gi, '') // Remove "Nome: [Nome]"
                  .replace(/\*\*Nome\*\*:\s*\w+/gi, '') // Remove "**Nome**: [Nome]"
                  .replace(/para\s+\w+/gi, '') // Remove "para [Nome]"
                  .replace(/\*Plano gerado automaticamente.*\*/gi, '') // Remove linha de crédito
                  .trim()
                
                if (!cleanItem) return null
                
                // Se é uma linha com informações de perfil (contém ":")
                if (cleanItem.includes(':')) {
                  const [label, value] = cleanItem.split(':')
                  const cleanLabel = label.replace(/^\*\*|\*\*$/g, '').replace(/^-\s*/, '').trim()
                  const cleanValue = value.replace(/^\*\*|\*\*$/g, '').trim()
                  
                  // Pular labels vazios ou inválidos
                  if (!cleanLabel || !cleanValue || cleanLabel.toLowerCase() === 'nome') {
                    return null
                  }
                  
                  // Se é um exercício com repetições
                  if (cleanValue.match(/\d+x\d+/)) {
                    return (
                      <div key={itemIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="font-medium text-sm text-gray-800">{cleanLabel}</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-semibold">
                          {cleanValue}
                        </Badge>
                      </div>
                    )
                  }
                  
                  // Informações gerais
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
                
                // Se é uma seção numerada (1. Aquecimento, 2. Exercícios)
                if (cleanItem.match(/^\d+\.\s*/)) {
                  const text = cleanItem.replace(/^\d+\.\s*/, '').replace(/^\*\*|\*\*$/g, '')
                  let icon = <Clock className="h-4 w-4" />
                  let bgColor = "bg-amber-50"
                  let textColor = "text-amber-800"
                  let borderColor = "border-amber-400"
                  
                  if (text.toLowerCase().includes('aquecimento')) {
                    icon = <Activity className="h-4 w-4" />
                    bgColor = "bg-yellow-50"
                    textColor = "text-yellow-800"
                    borderColor = "border-yellow-400"
                  } else if (text.toLowerCase().includes('exercícios')) {
                    icon = <Dumbbell className="h-4 w-4" />
                    bgColor = "bg-green-50"
                    textColor = "text-green-800"
                    borderColor = "border-green-400"
                  } else if (text.toLowerCase().includes('volta') || text.toLowerCase().includes('calma')) {
                    icon = <Target className="h-4 w-4" />
                    bgColor = "bg-blue-50"
                    textColor = "text-blue-800"
                    borderColor = "border-blue-400"
                  }
                  
                  return (
                    <div key={itemIndex} className={`${bgColor} p-4 rounded-md border-l-4 ${borderColor} mt-4 mb-2`}>
                      <h4 className={`font-semibold ${textColor} flex items-center gap-2`}>
                        {icon}
                        {text}
                      </h4>
                    </div>
                  )
                }
                
                // Se é uma lista de exercícios ou informações
                if (item.startsWith('-') || item.startsWith('•')) {
                  return (
                    <div key={itemIndex} className="flex items-start gap-3 py-2 pl-2">
                      <span className="text-green-600 mt-0.5 text-lg">•</span>
                      <span className="text-sm text-gray-700 leading-relaxed">{cleanItem}</span>
                    </div>
                  )
                }
                
                // Conteúdo normal
                return cleanItem ? (
                  <p key={itemIndex} className="text-sm leading-relaxed text-gray-700 py-1">
                    {cleanItem}
                  </p>
                ) : null
              }).filter(Boolean)}
              </div>
            )}
          </CardContent>
        </Card>
      )})}
      

    </div>
  )
}