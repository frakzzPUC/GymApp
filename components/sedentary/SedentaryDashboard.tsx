"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Button } from "@/components/ui/actions/button"
import { Badge } from "@/components/ui/feedback/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/feedback/progress"
import { 
  Heart, 
  Calendar, 
  Trophy,
  Target,
  Zap,
  Star,
  CheckCircle2,
  Circle,
  Eye,
  Smile,
  TrendingUp,
  Clock,
  Activity
} from "lucide-react"
import { useSedentaryData } from "@/hooks/useSedentaryData"
import SedentaryPlanRenderer from "./SedentaryPlanRenderer"

interface Exercise {
  name: string
  duration: string
  completed: boolean
  date: string
}

const SedentaryDashboard: React.FC = () => {
  const { data, isLoading, error } = useSedentaryData()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [weekProgress, setWeekProgress] = useState(0)

  useEffect(() => {
    // Simular exercícios baseados no programa da IA
    if (data.aiProgram) {
      // Extrair exercícios da primeira semana do programa
      const exerciseMatches = data.aiProgram.match(/\d+\.\s*([^:\n]+):\s*([^\n]+)/g)
      if (exerciseMatches) {
        const extractedExercises = exerciseMatches.slice(0, 5).map((match, index) => {
          const [_, name, description] = match.match(/\d+\.\s*([^:]+):\s*(.+)/) || []
          return {
            name: name?.trim() || `Exercício ${index + 1}`,
            duration: description?.match(/(\d+\s*minutos?)/i)?.[1] || "15 minutos",
            completed: false,
            date: new Date().toISOString().split('T')[0]
          }
        })
        
        // Carregar progresso do localStorage
        const savedProgress = localStorage.getItem('sedentary-exercises')
        if (savedProgress) {
          const progressData = JSON.parse(savedProgress)
          extractedExercises.forEach(exercise => {
            const saved = progressData[exercise.name]
            if (saved && saved.date === exercise.date) {
              exercise.completed = saved.completed
            }
          })
        }
        
        setExercises(extractedExercises)
      }
    }
  }, [data.aiProgram])

  useEffect(() => {
    // Calcular progresso da semana
    if (exercises.length > 0) {
      const completed = exercises.filter(ex => ex.completed).length
      setWeekProgress((completed / exercises.length) * 100)
    }
  }, [exercises])

  const toggleExercise = (exerciseName: string) => {
    setExercises(prev => {
      const updated = prev.map(ex => 
        ex.name === exerciseName 
          ? { ...ex, completed: !ex.completed }
          : ex
      )
      
      // Salvar no localStorage
      const progressData: Record<string, any> = {}
      updated.forEach(ex => {
        progressData[ex.name] = {
          completed: ex.completed,
          date: ex.date
        }
      })
      localStorage.setItem('sedentary-exercises', JSON.stringify(progressData))
      
      return updated
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-2" />
          <p className="text-gray-600">Carregando seu programa motivacional...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Smile className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Ops! Erro ao carregar seu programa.</p>
          <p className="text-sm text-gray-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data.profile) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Configure seu perfil para começar sua jornada!</p>
        </CardContent>
      </Card>
    )
  }

  const completedToday = exercises.filter(ex => ex.completed).length
  const totalExercises = exercises.length

  return (
    <div className="space-y-6">
      {/* Header motivacional */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-pink-600" />
                Olá! Vamos começar hoje? 
                <Star className="h-6 w-6 text-yellow-500" />
              </h1>
              <p className="text-gray-700 mt-2">
                <strong>Seu objetivo:</strong> {data.profile.primaryGoal} • 
                <strong> Tempo disponível:</strong> {data.profile.availableTime}
              </p>
              <p className="text-sm text-gray-600 mt-1 italic">
                "{data.profile.motivation}"
              </p>
            </div>
            {data.aiProgram && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Programa Completo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Seu Programa Personalizado
                    </DialogTitle>
                  </DialogHeader>
                  <SedentaryPlanRenderer content={data.aiProgram} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progresso da semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Progresso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={weekProgress} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concluído</span>
                <span className="font-semibold text-green-600">
                  {Math.round(weekProgress)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {completedToday}/{totalExercises}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Exercícios realizados
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-purple-600" />
              Tempo Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {completedToday * 15}min
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Hoje
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercícios de hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Seus Exercícios de Hoje
            <Badge variant="outline" className="ml-auto">
              {completedToday}/{totalExercises} concluídos
            </Badge>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {exercises.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Seus exercícios aparecerão aqui após gerar o programa</p>
            </div>
          ) : (
            <div className="divide-y">
              {exercises.map((exercise, index) => (
                <div 
                  key={index}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    exercise.completed ? 'bg-green-50' : ''
                  }`}
                  onClick={() => toggleExercise(exercise.name)}
                >
                  <button className="flex-shrink-0">
                    {exercise.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-green-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {exercise.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {exercise.duration}
                    </p>
                  </div>

                  {exercise.completed && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Concluído!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensagem motivacional */}
      {completedToday > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Parabéns! 🎉
              </h3>
            </div>
            <p className="text-gray-700">
              {completedToday === totalExercises 
                ? "Você completou todos os exercícios de hoje! Isso é incrível! 🌟"
                : `Já são ${completedToday} exercícios concluídos! Continue assim! 💪`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SedentaryDashboard