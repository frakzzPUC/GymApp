import React from "react"
import { Heart, Target, Clock, Shield, Activity, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"

interface RehabilitationPlanRendererProps {
  rehabilitationText: string
}

export function RehabilitationPlanRenderer({ rehabilitationText }: RehabilitationPlanRendererProps) {
  // Validar se há texto para processar
  if (!rehabilitationText || rehabilitationText.trim() === '') {
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
              Vá para: Menu → Reabilitação → Complete o Questionário
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
    type: 'analysis' | 'objectives' | 'phase' | 'techniques' | 'education' | 'prevention' | 'other'
    phase?: string
  }> = []
  
  let currentSection: any = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar seções principais (### **1. AVALIAÇÃO INICIAL**, etc.)
    if (line.match(/^###?\s*\*?\*?\d+\./) || line.match(/^\d+\.\s*(AVALIAÇÃO|OBJETIVOS|PROGRAMA|TÉCNICAS|EDUCAÇÃO|PREVENÇÃO)/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const cleanTitle = line
        .replace(/^###?\s*\*?\*?/, '')
        .replace(/\*\*?$/, '')
        .trim()
      
      let sectionType: 'analysis' | 'objectives' | 'phase' | 'techniques' | 'education' | 'prevention' | 'other' = 'other'
      
      if (cleanTitle.includes('AVALIAÇÃO') || cleanTitle.includes('ANÁLISE')) {
        sectionType = 'analysis'
      } else if (cleanTitle.includes('OBJETIVOS')) {
        sectionType = 'objectives'
      } else if (cleanTitle.includes('PROGRAMA') || cleanTitle.includes('EXERCÍCIOS')) {
        sectionType = 'phase'
      } else if (cleanTitle.includes('TÉCNICAS') || cleanTitle.includes('ALÍVIO')) {
        sectionType = 'techniques'
      } else if (cleanTitle.includes('EDUCAÇÃO') || cleanTitle.includes('ORIENTAÇÕES')) {
        sectionType = 'education'
      } else if (cleanTitle.includes('PREVENÇÃO')) {
        sectionType = 'prevention'
      }
      
      currentSection = {
        title: cleanTitle,
        content: [],
        type: sectionType
      }
    }
    
    // Detectar fases de exercícios (#### **FASE 1**, etc.)
    else if (line.match(/^#+\s*\*\*FASE\s+\d+/i)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      
      const cleanTitle = line
        .replace(/^#+\s*\*\*/, '')
        .replace(/\*\*.*$/, '')
        .trim()
      
      currentSection = {
        title: cleanTitle,
        content: [],
        type: 'phase',
        phase: cleanTitle
      }
    }
    
    // Adicionar conteúdo às seções
    else if (currentSection && line.length > 0 && !line.match(/^-{3,}$/)) {
      currentSection.content.push(line)
    }
  }
  
  // Adicionar última seção
  if (currentSection) {
    sections.push(currentSection)
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <Target className="h-5 w-5" />
      case 'objectives':
        return <CheckCircle2 className="h-5 w-5" />
      case 'phase':
        return <Activity className="h-5 w-5" />
      case 'techniques':
        return <Heart className="h-5 w-5" />
      case 'education':
        return <Shield className="h-5 w-5" />
      case 'prevention':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const renderBadgeColor = (type: string) => {
    switch (type) {
      case 'analysis':
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 'objectives':
        return "bg-green-100 text-green-800 border-green-200"
      case 'phase':
        return "bg-purple-100 text-purple-800 border-purple-200"
      case 'techniques':
        return "bg-red-100 text-red-800 border-red-200"
      case 'education':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'prevention':
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatContent = (content: string) => {
    // Processar formatação especial
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    return formatted
  }

  const parseExercises = (content: string[]) => {
    const exercises = []
    let currentExercise: any = null
    
    for (const line of content) {
      // Detectar exercício numerado
      if (line.match(/^\d+\.\s*\*\*/)) {
        if (currentExercise) {
          exercises.push(currentExercise)
        }
        
        const name = line
          .replace(/^\d+\.\s*/, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .trim()
        
        currentExercise = {
          name,
          instructions: []
        }
      } else if (currentExercise && line.trim()) {
        currentExercise.instructions.push(line)
      }
    }
    
    if (currentExercise) {
      exercises.push(currentExercise)
    }
    
    return exercises
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plano de Reabilitação Completo</h2>
        <p className="text-gray-600">Seu programa personalizado de fisioterapia e reabilitação</p>
      </div>
      
      {sections.map((section, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center gap-3">
              {renderIcon(section.type)}
              <span className="flex-1">{section.title}</span>
              <Badge className={renderBadgeColor(section.type)}>
                {section.type === 'analysis' && 'Avaliação'}
                {section.type === 'objectives' && 'Objetivos'}
                {section.type === 'phase' && 'Exercícios'}
                {section.type === 'techniques' && 'Técnicas'}
                {section.type === 'education' && 'Educação'}
                {section.type === 'prevention' && 'Prevenção'}
                {section.type === 'other' && 'Informações'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {section.type === 'phase' && section.content.some(line => line.match(/^\d+\.\s*\*\*/)) ? (
              // Renderizar exercícios de forma especial
              <div className="space-y-4">
                {parseExercises(section.content).map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border-l-4 border-purple-300 pl-4 bg-purple-50 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">{exercise.name}</h4>
                    <div className="space-y-1">
                      {exercise.instructions.map((instruction: string, instrIndex: number) => (
                        <p 
                          key={instrIndex} 
                          className="text-sm text-purple-800"
                          dangerouslySetInnerHTML={{ __html: formatContent(instruction) }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Renderizar conteúdo normal
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.startsWith('*') || item.startsWith('-') ? (
                      <div className="flex items-start gap-2 ml-4">
                        <span className="text-gray-400 mt-2">•</span>
                        <p 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatContent(item.replace(/^[*-]\s*/, '')) }}
                        />
                      </div>
                    ) : (
                      <p 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatContent(item) }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
    </div>
  )
}