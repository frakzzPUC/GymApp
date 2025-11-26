import React, { useState } from "react"
import { CheckCircle, Clock, Play, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getTodayRehabExercises } from "@/lib/rehab-parser"

interface TodayRehabExercisesProps {
  rehabilitationPlan: string
  onMarkComplete?: (exerciseId: string) => void
  completedExercises?: string[]
}

export function TodayRehabExercises({ 
  rehabilitationPlan, 
  onMarkComplete,
  completedExercises = []
}: TodayRehabExercisesProps) {
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({})
  
  const today = new Date()
  const todayExercises = getTodayRehabExercises(rehabilitationPlan, today.getDay())
  

  
  const toggleExpanded = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }))
  }
  
  if (!rehabilitationPlan || todayExercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reabilitação
          </CardTitle>
          <CardDescription>
            Seus exercícios de reabilitação para hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Play className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum exercício programado para hoje</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete seu questionário de reabilitação para receber exercícios personalizados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const completedCount = todayExercises.filter(ex => completedExercises.includes(ex.id)).length
  const progressPercentage = (completedCount / todayExercises.length) * 100
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Reabilitação
        </CardTitle>
        <CardDescription>
          {completedCount}/{todayExercises.length} exercícios concluídos ({Math.round(progressPercentage)}%)
        </CardDescription>
        {progressPercentage > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayExercises.map((exercise) => {
            const isCompleted = completedExercises.includes(exercise.id)
            const isExpanded = expandedExercises[exercise.id]
            
            return (
              <div 
                key={exercise.id} 
                className={`border rounded-lg transition-all duration-200 ${
                  isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium ${isCompleted ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {exercise.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${
                            exercise.phase.includes('FASE 1') 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : exercise.phase.includes('FASE 2')
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : exercise.phase.includes('FASE 3')
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {exercise.phase || 'Reabilitação'}
                        </Badge>
                      </div>
                      
                      {exercise.description && (
                        <p className={`text-sm mb-2 ${isCompleted ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                          {exercise.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{exercise.duration}</span>
                        </div>
                        
                        {exercise.instructions.length > 0 && (
                          <Collapsible>
                            <CollapsibleTrigger 
                              onClick={() => toggleExpanded(exercise.id)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Ver instruções</span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </CollapsibleTrigger>
                          </Collapsible>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {isCompleted ? (
                        <Badge className="text-emerald-700 bg-emerald-100 border-emerald-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Concluído
                        </Badge>
                      ) : (
                        onMarkComplete && (
                          <Button
                            size="sm"
                            onClick={() => onMarkComplete(exercise.id)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluir
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                  
                  {exercise.instructions.length > 0 && (
                    <Collapsible open={isExpanded}>
                      <CollapsibleContent className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                            <Play className="h-4 w-4 text-blue-600" />
                            Instruções de Execução
                          </h5>
                          <ul className="space-y-2">
                            {exercise.instructions.map((instruction, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-blue-600 mt-1 text-xs">•</span>
                                <span className="leading-relaxed">{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            )
          })}
          
          {completedCount === todayExercises.length && (
            <div className="text-center py-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
              <p className="text-emerald-800 font-medium">Parabéns! Você completou todos os exercícios de hoje!</p>
              <p className="text-sm text-emerald-700 mt-1">
                Continue assim para acelerar sua recuperação.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}