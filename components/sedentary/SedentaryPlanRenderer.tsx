"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Timer, 
  Trophy,
  Target,
  Zap,
  Star,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Smile
} from "lucide-react"

interface SedentaryPlanRendererProps {
  content: string
}

const SedentaryPlanRenderer: React.FC<SedentaryPlanRendererProps> = ({ content }) => {
  const parseContent = (text: string) => {
    // Dividir o conteúdo em seções principais
    const sections = text.split(/(?=##\s)/g).filter(section => section.trim())
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      if (lines.length === 0) return null

      let title = lines[0].replace(/^#+\s*/, '').trim()
      let content = lines.slice(1).join('\n')
      
      // Limpar asteriscos e formatação dos títulos
      title = title.replace(/\*{1,}/g, '').trim()
      title = title.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '')
      
      // Pré-processamento do conteúdo: remover asteriscos em excesso
      content = content.replace(/\*{3,}/g, '') // Remove 3 ou mais asteriscos consecutivos
      
      // Limpar títulos de mensagens motivacionais
      if (title.toLowerCase().includes('mensagem motivacional')) {
        title = 'Mensagem Motivacional'
      }

      return {
        id: index,
        title,
        content,
        type: getSectionType(title)
      }
    }).filter(Boolean)
  }

  const getSectionType = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('motivação') || titleLower.includes('motivaç') || titleLower.includes('mensagem')) return 'motivation'
    if (titleLower.includes('semana') || titleLower.includes('programa') || titleLower.includes('cronograma')) return 'program'
    if (titleLower.includes('exercício') || titleLower.includes('atividade') || titleLower.includes('treino')) return 'exercise'
    if (titleLower.includes('dica') || titleLower.includes('orientaç') || titleLower.includes('conselho')) return 'tips'
    if (titleLower.includes('progresso') || titleLower.includes('resultado') || titleLower.includes('acompanhamento')) return 'progress'
    if (titleLower.includes('introdução') || titleLower.includes('bem-vind') || titleLower.includes('início')) return 'motivation'
    return 'general'
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'motivation': return <Heart className="h-5 w-5 text-pink-600" />
      case 'program': return <Calendar className="h-5 w-5 text-blue-600" />
      case 'exercise': return <Zap className="h-5 w-5 text-green-600" />
      case 'tips': return <Star className="h-5 w-5 text-yellow-600" />
      case 'progress': return <TrendingUp className="h-5 w-5 text-purple-600" />
      default: return <Target className="h-5 w-5 text-gray-600" />
    }
  }

  const getSectionBadgeColor = (type: string) => {
    switch (type) {
      case 'motivation': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'program': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'exercise': return 'bg-green-100 text-green-800 border-green-200'
      case 'tips': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatSectionContent = (content: string, type: string) => {
    let formattedContent = content

    // Remover asteriscos e formatação markdown excessiva - melhorado
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em class="text-gray-700">$1</em>')
    
    // Remover asteriscos isolados e múltiplos
    formattedContent = formattedContent.replace(/\*{1,}/g, '')
    
    // Remover asteriscos no início ou fim de linhas
    formattedContent = formattedContent.replace(/^\*+\s*/gm, '')
    formattedContent = formattedContent.replace(/\s*\*+$/gm, '')

    // Limpar títulos de seção para mensagens motivacionais
    if (type === 'motivation') {
      formattedContent = formattedContent.replace(/^#+\s*Mensagem\s*motivacional\s*personalizada:?/gmi, '')
      formattedContent = formattedContent.replace(/^#+\s*Mensagem\s*motivacional:?/gmi, '')
      formattedContent = formattedContent.replace(/^\s*Mensagem\s*motivacional\s*personalizada:?/gmi, '')
    }

    // Destacar exercícios
    formattedContent = formattedContent.replace(
      /(\d+\.\s*[^:\n]+):/g,
      '<div class="mt-3 mb-2"><strong class="text-gray-900 font-semibold text-base">$1:</strong></div>'
    )

    // Destacar durações e repetições
    formattedContent = formattedContent.replace(
      /(\d+\s*(minutos?|segundos?|repetições?|séries?))/gi,
      '<span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mx-1">$1</span>'
    )

    // Destacar dias da semana
    formattedContent = formattedContent.replace(
      /(segunda|terça|quarta|quinta|sexta|sábado|domingo)(-feira)?/gi,
      '<span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mx-1">$1$2</span>'
    )

    // Destacar semanas com melhor formatação
    formattedContent = formattedContent.replace(
      /(Semana\s+\d+)/gi,
      '<div class="mt-6 mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-400"><h4 class="text-lg font-bold text-indigo-800 flex items-center gap-2"><Calendar className="h-5 w-5" />$1</h4></div>'
    )

    // Destacar frases motivacionais de forma mais elegante
    formattedContent = formattedContent.replace(
      /([🎯🌟💪🏃‍♀️🚀❤️🔥✨🎉👏🌈⭐🎊💖][^.!?\n]*[.!?])/g,
      '<div class="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400 p-4 my-3 rounded-r-lg shadow-sm"><p class="text-gray-700 font-medium italic text-base leading-relaxed">$1</p></div>'
    )

    // Melhorar quebras de linha e espaçamento
    formattedContent = formattedContent.replace(/\n\n/g, '<div class="my-3"></div>')
    formattedContent = formattedContent.replace(/\n/g, '<br>')
    
    // Remover múltiplas quebras de linha consecutivas
    formattedContent = formattedContent.replace(/(<br>\s*){3,}/g, '<div class="my-3"></div>')
    
    // Limpeza final: remover qualquer asterisco restante que possa ter sobrado
    formattedContent = formattedContent.replace(/\*/g, '')
    
    // Limpar espaços extras que podem ter ficado após remover asteriscos
    formattedContent = formattedContent.replace(/\s{2,}/g, ' ')

    return formattedContent
  }

  const sections = parseContent(content)

  if (sections.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Smile className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Seu programa motivacional será exibido aqui após ser gerado.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-6 w-6 text-pink-600" />
          <h1 className="text-2xl font-bold text-gray-900">Seu Programa Motivacional</h1>
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <p className="text-gray-600">Desenvolvido especialmente para você sair do sedentarismo com motivação!</p>
      </div>

      {sections.map((section) => section && (
        <Card 
          key={section.id} 
          className={`w-full shadow-sm hover:shadow-md transition-shadow ${
            section.type === 'motivation' ? 'border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50' : ''
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              {getSectionIcon(section.type)}
              <span className="text-xl text-gray-900">{section.title}</span>
              <Badge 
                variant="outline" 
                className={`ml-auto ${getSectionBadgeColor(section.type)}`}
              >
                {section.type === 'motivation' && 'Motivação'}
                {section.type === 'program' && 'Programa'}
                {section.type === 'exercise' && 'Exercícios'}
                {section.type === 'tips' && 'Dicas'}
                {section.type === 'progress' && 'Progresso'}
                {section.type === 'general' && 'Informações'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div 
              className={`prose prose-sm max-w-none ${
                section.type === 'motivation' ? 'prose-pink' : ''
              }`}
              dangerouslySetInnerHTML={{ 
                __html: formatSectionContent(section.content, section.type) 
              }}
            />
          </CardContent>
        </Card>
      ))}

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Você consegue!</h3>
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-gray-700">
            Lembre-se: cada pequeno passo conta! Comemore cada conquista e seja paciente consigo mesmo. 
            O importante é começar e manter a consistência. 💪✨
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SedentaryPlanRenderer