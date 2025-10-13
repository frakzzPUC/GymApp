"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Button } from "@/components/ui/actions/button"
import { Progress } from "@/components/ui/feedback/progress"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlay/dialog"
import {
  Dumbbell,
  Clock,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Target,
  Zap,
  RotateCcw,
  Eye
} from "lucide-react"

interface AIPlansData {
  latest?: {
    workoutPlan: string
    nutritionPlan: string
    planType: 'ai-generated' | 'static-fallback'
    generatedAt: string
    planId: string
  }
}

interface TodayWorkoutProps {
  onMarkComplete?: (workoutId: string) => Promise<void>
}

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
  duration: string
  warmup: string
  cooldown: string
}

export function TodayWorkout({ onMarkComplete }: TodayWorkoutProps) {
  const [aiPlans, setAiPlans] = useState<AIPlansData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | null>(null)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [showFullPlan, setShowFullPlan] = useState(false)

  useEffect(() => {
    fetchAIPlans()
    loadCompletedExercises()
  }, [])

  const fetchAIPlans = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/ai-plans')
      const data = await response.json()
      
      if (data.success && data.hasPlans) {
        setAiPlans(data.data)
        parseTodayWorkout(data.data.latest.workoutPlan)
      } else {
        setAiPlans(null)
      }
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar planos de IA:', error)
      setError('Erro ao carregar plano de treino')
    } finally {
      setIsLoading(false)
    }
  }

  const parseTodayWorkout = (workoutPlan: string) => {
    try {
      // Determinar o dia da semana atual (0 = domingo, 1 = segunda, etc.)
      const today = new Date().getDay()
      const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
      const todayName = daysOfWeek[today]
      
      console.log('Parsing workout plan for:', todayName)
      console.log('Workout plan content:', workoutPlan)

      // Dividir o plano em seções (TREINO A, B, C, etc.)
      const sections = workoutPlan.split(/##\s*TREINO\s*[A-Z]/i)
      
      let exercises: Exercise[] = []
      let focus = ''
      let duration = '45-60 min'
      let warmup = '5-10 min de aquecimento'
      let cooldown = '5-10 min de alongamento'

      // Mapear dias da semana para treinos (A, B, C, D, E)
      const workoutSchedule = {
        1: 'A', // Segunda - TREINO A
        2: 'B', // Terça - TREINO B  
        3: 'C', // Quarta - TREINO C
        4: 'D', // Quinta - TREINO D
        5: 'E', // Sexta - TREINO E
        6: 'A', // Sábado - TREINO A (repetir)
        0: 'descanso' // Domingo - Descanso
      }

      const todayWorkoutLetter = workoutSchedule[today as keyof typeof workoutSchedule]
      
      if (todayWorkoutLetter === 'descanso') {
        setTodayWorkout({
          day: todayName,
          focus: 'Descanso Ativo',
          exercises: [],
          duration: '20-30 min',
          warmup: 'Alongamento leve',
          cooldown: 'Meditação ou relaxamento'
        })
        return
      }

      console.log('Looking for TREINO:', todayWorkoutLetter)

      // Procurar o treino específico para hoje
      let currentSection = ''
      const lines = workoutPlan.split('\n')
      let inTargetSection = false
      let sectionTitle = ''

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        const lowerLine = line.toLowerCase()
        
        // Detectar início de uma seção de treino
        if (line.match(/##\s*TREINO\s*[A-Z]/i)) {
          const match = line.match(/##\s*TREINO\s*([A-Z])/i)
          if (match) {
            currentSection = match[1]
            inTargetSection = (currentSection === todayWorkoutLetter)
            
            if (inTargetSection) {
              // Extrair o foco do treino do título
              sectionTitle = line.replace(/##\s*TREINO\s*[A-Z]\s*-?\s*/i, '').trim()
              focus = sectionTitle || getDefaultFocusForToday(today)
              console.log('Found target section:', currentSection, 'Focus:', focus)
            }
          }
        }
        
        // Se estamos na seção correta, extrair exercícios
        if (inTargetSection && line.length > 0) {
          // Detectar aquecimento
          if (lowerLine.includes('aquecimento') && lowerLine.includes('min')) {
            const match = line.match(/(\d+)\s*min/i)
            if (match) {
              warmup = `${match[1]} min de aquecimento`
            }
          }
          
          // Detectar volta à calma
          if (lowerLine.includes('volta') || lowerLine.includes('calma') || lowerLine.includes('alongamento estático')) {
            const match = line.match(/(\d+)\s*min/i)
            if (match) {
              cooldown = `${match[1]} min de alongamento`
            } else {
              cooldown = 'Alongamento estático'
            }
          }
          
          // Extrair exercícios (formato: "- Nome do exercício: 3x8-12")
          if (line.match(/^\s*-\s*.+:\s*\d+x\d+/)) {
            const exerciseMatch = line.match(/^\s*-\s*(.+?):\s*(\d+)x(\d+(?:-\d+)?)/i)
            if (exerciseMatch) {
              const name = exerciseMatch[1].trim()
              const sets = exerciseMatch[2]
              const reps = exerciseMatch[3]
              
              exercises.push({
                name: name,
                sets: sets,
                reps: reps,
                rest: '60-90s',
                notes: ''
              })
              console.log('Added exercise:', name, sets + 'x' + reps)
            }
          }
          
          // Também capturar exercícios no formato "Nome: séries x repetições"
          else if (line.match(/^\s*\d+\.\s*\*\*.+\*\*$|^\s*-\s*.+$/)) {
            // Pular títulos e bullets sem especificações
            continue
          }
          else if (line.match(/.*:\s*\d+x\d+/i)) {
            const exerciseMatch = line.match(/(.+?):\s*(\d+)x(\d+(?:-\d+)?)/i)
            if (exerciseMatch) {
              const name = exerciseMatch[1].trim().replace(/^\d+\.\s*\*\*?|\*\*?$/g, '')
              const sets = exerciseMatch[2]
              const reps = exerciseMatch[3]
              
              if (name.length > 2) {
                exercises.push({
                  name: name,
                  sets: sets,
                  reps: reps,
                  rest: '60-90s',
                  notes: ''
                })
                console.log('Added exercise (alt format):', name, sets + 'x' + reps)
              }
            }
          }
        }
        
        // Se chegamos em outra seção de treino, parar
        if (inTargetSection && line.match(/##\s*TREINO\s*[A-Z]/i) && !line.includes(todayWorkoutLetter)) {
          break
        }
      }

      console.log('Total exercises found:', exercises.length)

      // Se não encontrou exercícios específicos, usar fallback baseado no foco detectado
      if (exercises.length === 0) {
        console.log('No exercises found, using fallback for focus:', focus)
        exercises = getFallbackExercisesForFocus(focus) || getDefaultExercisesForToday(today)
        if (!focus) focus = getDefaultFocusForToday(today)
      }

      setTodayWorkout({
        day: todayName,
        focus,
        exercises: exercises.slice(0, 8), // Limitar a 8 exercícios
        duration,
        warmup,
        cooldown
      })

    } catch (error) {
      console.error('Erro ao processar plano de treino:', error)
      // Fallback para treino padrão
      const today = new Date().getDay()
      setTodayWorkout({
        day: 'hoje',
        focus: getDefaultFocusForToday(today),
        exercises: getDefaultExercisesForToday(today),
        duration: '45-60 min',
        warmup: '5-10 min de aquecimento',
        cooldown: '5-10 min de alongamento'
      })
    }
  }

  const getDefaultFocusForToday = (day: number): string => {
    const focuses = [
      'Descanso Ativo', // Domingo
      'Peito e Tríceps', // Segunda
      'Costas e Bíceps', // Terça
      'Pernas e Glúteos', // Quarta
      'Ombros e Core', // Quinta
      'Cardio e Funcional', // Sexta
      'Treino Livre' // Sábado
    ]
    return focuses[day] || 'Treino Geral'
  }

  const getFallbackExercisesForFocus = (focus: string): Exercise[] | null => {
    const focusLower = focus.toLowerCase()
    
    if (focusLower.includes('peito') || focusLower.includes('ombros') || focusLower.includes('tríceps')) {
      return [
        { name: 'Supino reto', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Supino inclinado', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Desenvolvimento', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Elevação lateral', sets: '3', reps: '12-15', rest: '60s' },
        { name: 'Tríceps pulley', sets: '3', reps: '10-15', rest: '60s' },
        { name: 'Tríceps francês', sets: '3', reps: '10-15', rest: '60s' }
      ]
    }
    
    if (focusLower.includes('costas') || focusLower.includes('bíceps')) {
      return [
        { name: 'Remada curvada', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Puxada alta', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Remada baixa', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Rosca direta', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Rosca martelo', sets: '3', reps: '10-12', rest: '60s' }
      ]
    }
    
    if (focusLower.includes('pernas') || focusLower.includes('glúteos') || focusLower.includes('quadríceps')) {
      return [
        { name: 'Agachamento livre', sets: '3', reps: '12-15', rest: '90s' },
        { name: 'Leg press', sets: '3', reps: '12-15', rest: '90s' },
        { name: 'Afundo', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Stiff', sets: '3', reps: '12-15', rest: '60s' },
        { name: 'Panturrilha', sets: '3', reps: '15-20', rest: '45s' }
      ]
    }
    
    return null
  }

  const getDefaultExercisesForToday = (day: number): Exercise[] => {
    const workouts = {
      1: [ // Segunda - Peito e Tríceps
        { name: 'Supino com halteres', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Flexão de braço', sets: '3', reps: '10-15', rest: '60s' },
        { name: 'Tríceps testa', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Crucifixo', sets: '3', reps: '12-15', rest: '60s' }
      ],
      2: [ // Terça - Costas e Bíceps
        { name: 'Remada curvada', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Puxada alta', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Rosca direta', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Remada unilateral', sets: '3', reps: '12-15', rest: '60s' }
      ],
      3: [ // Quarta - Pernas e Glúteos
        { name: 'Agachamento livre', sets: '3', reps: '12-15', rest: '90s' },
        { name: 'Afundo', sets: '3', reps: '10-12', rest: '60s' },
        { name: 'Elevação pélvica', sets: '3', reps: '15-20', rest: '60s' },
        { name: 'Panturrilha em pé', sets: '3', reps: '15-20', rest: '45s' }
      ],
      4: [ // Quinta - Ombros e Core
        { name: 'Desenvolvimento com halteres', sets: '3', reps: '10-12', rest: '90s' },
        { name: 'Elevação lateral', sets: '3', reps: '12-15', rest: '60s' },
        { name: 'Prancha', sets: '3', reps: '30-60s', rest: '60s' },
        { name: 'Elevação frontal', sets: '3', reps: '12-15', rest: '60s' }
      ],
      5: [ // Sexta - Cardio e Funcional
        { name: 'Burpee', sets: '3', reps: '8-12', rest: '90s' },
        { name: 'Mountain climber', sets: '3', reps: '20-30', rest: '60s' },
        { name: 'Jumping jacks', sets: '3', reps: '30-45s', rest: '60s' },
        { name: 'Agachamento com salto', sets: '3', reps: '10-15', rest: '60s' }
      ],
      default: [ // Outros dias
        { name: 'Caminhada', sets: '1', reps: '20-30 min', rest: '-' },
        { name: 'Alongamento', sets: '1', reps: '10-15 min', rest: '-' },
        { name: 'Mobilidade', sets: '1', reps: '10 min', rest: '-' }
      ]
    }

    return workouts[day as keyof typeof workouts] || workouts.default
  }

  const loadCompletedExercises = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`completed_exercises_${today}`)
    if (stored) {
      setCompletedExercises(JSON.parse(stored))
    }
  }

  const toggleExerciseComplete = (exerciseName: string) => {
    const today = new Date().toDateString()
    let completed = [...completedExercises]
    
    if (completed.includes(exerciseName)) {
      completed = completed.filter(name => name !== exerciseName)
    } else {
      completed.push(exerciseName)
    }
    
    setCompletedExercises(completed)
    localStorage.setItem(`completed_exercises_${today}`, JSON.stringify(completed))
  }

  const calculateProgress = () => {
    if (!todayWorkout) return 0
    return Math.round((completedExercises.length / todayWorkout.exercises.length) * 100)
  }

  const isRestDay = () => {
    const today = new Date().getDay()
    return today === 0 || (todayWorkout?.focus === 'Descanso Ativo')
  }

  const renderFormattedWorkoutPlan = (workoutPlan: string) => {
    try {
      const lines = workoutPlan.split('\n')
      let sections: Array<{
        title: string
        day?: string
        exercises: Array<{
          name: string
          sets?: string
          reps?: string
          details?: string
        }>
        warmup?: string
        cooldown?: string
      }> = []
      
      let currentSection: any = null
      
      // Mapear treinos para dias da semana
      const workoutToDayMap: { [key: string]: string } = {
        'TREINO A': 'Segunda-feira',
        'TREINO B': 'Terça-feira', 
        'TREINO C': 'Quarta-feira',
        'TREINO D': 'Quinta-feira',
        'TREINO E': 'Sexta-feira'
      }
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // Detectar seções de treino (## TREINO A, B, C, etc.)
        if (line.match(/##\s*TREINO\s*[A-Z]/i)) {
          if (currentSection) {
            sections.push(currentSection)
          }
          const fullTitle = line.replace(/##\s*/, '').trim()
          const workoutLetter = line.match(/TREINO\s*([A-Z])/i)?.[0]?.toUpperCase()
          const focus = fullTitle.replace(/TREINO\s*[A-Z]\s*-?\s*/i, '').trim()
          
          currentSection = {
            title: focus || fullTitle,
            day: workoutLetter ? workoutToDayMap[workoutLetter] : undefined,
            exercises: []
          }
        }
        // Detectar aquecimento
        else if (currentSection && line.toLowerCase().includes('aquecimento')) {
          const nextLines = []
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const nextLine = lines[j].trim()
            if (nextLine && !nextLine.includes('##') && !nextLine.toLowerCase().includes('exercícios')) {
              // Extrair tempo se tiver
              if (nextLine.match(/\d+\s*min/)) {
                nextLines.push(nextLine.replace(/^\d+\.\s*\*\*?|\*\*?$/g, ''))
              } else if (nextLine.startsWith('-')) {
                nextLines.push(nextLine.replace(/^\s*-\s*/, ''))
              }
            } else break
          }
          if (nextLines.length > 0) {
            currentSection.warmup = nextLines.join(' • ')
          }
        }
        // Detectar volta à calma
        else if (currentSection && (line.toLowerCase().includes('volta') || line.toLowerCase().includes('calma'))) {
          const nextLines = []
          for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
            const nextLine = lines[j].trim()
            if (nextLine && !nextLine.includes('##')) {
              nextLines.push(nextLine.replace(/^\s*-\s*/, ''))
            } else break
          }
          if (nextLines.length > 0) {
            currentSection.cooldown = nextLines.join(' • ')
          }
        }
        // Detectar exercícios (formato: "- Nome: 3x8-12")
        else if (currentSection && line.match(/^\s*-\s*.+:\s*\d+x\d+/)) {
          const exerciseMatch = line.match(/^\s*-\s*(.+?):\s*(\d+)x(\d+(?:-\d+)?)/i)
          if (exerciseMatch) {
            currentSection.exercises.push({
              name: exerciseMatch[1].trim(),
              sets: exerciseMatch[2],
              reps: exerciseMatch[3]
            })
          }
        }
      }
      
      if (currentSection) {
        sections.push(currentSection)
      }

      return (
        <div className="space-y-6">
          {/* Header com resumo */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Seu Plano Semanal</h3>
                <p className="text-muted-foreground">
                  {sections.length} treinos distribuídos ao longo da semana
                </p>
              </div>
            </CardContent>
          </Card>

          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                  {section.day && (
                    <Badge variant="secondary" className="text-xs">
                      {section.day}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Aquecimento */}
                {section.warmup && (
                  <div className="bg-orange-50 border-l-4 border-orange-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Aquecimento</span>
                    </div>
                    <p className="text-sm text-orange-700 leading-relaxed">{section.warmup}</p>
                  </div>
                )}

                {/* Exercícios */}
                {section.exercises.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Dumbbell className="h-4 w-4" />
                      Exercícios Principais ({section.exercises.length})
                    </h4>
                    <div className="grid gap-3">
                      {section.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{exercise.name}</h5>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {exercise.sets} séries
                              </span>
                              <span className="flex items-center gap-1">
                                <RotateCcw className="h-3 w-3" />
                                {exercise.reps} reps
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono">
                            {exercise.sets}×{exercise.reps}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volta à calma */}
                {section.cooldown && (
                  <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Volta à Calma</span>
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed">{section.cooldown}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Se não conseguiu parsear, mostrar formatação alternativa */}
          {sections.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium mb-2">Plano Personalizado</h4>
                <p className="text-muted-foreground mb-4">Visualização completa do seu plano</p>
                <div className="max-w-3xl mx-auto text-left">
                  <div className="bg-muted/50 p-6 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {workoutPlan}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )
    } catch (error) {
      // Fallback se der erro no parsing
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center mb-4">
              <h4 className="font-medium">Seu Plano Personalizado</h4>
              <p className="text-sm text-muted-foreground">Visualização completa</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {workoutPlan}
              </pre>
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Treino de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Carregando seu treino...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Treino de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={fetchAIPlans} 
            className="mt-4 w-full" 
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isRestDay()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Descanso Ativo
          </CardTitle>
          <CardDescription>
            Hoje é seu dia de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Dia de Descanso</h3>
            <p className="text-muted-foreground mb-4">
              Aproveite para fazer atividades leves como caminhada, alongamento ou yoga.
            </p>
            <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
              <Badge variant="outline" className="justify-center">
                <Clock className="h-3 w-3 mr-1" />
                Caminhada 20-30 min
              </Badge>
              <Badge variant="outline" className="justify-center">
                <Target className="h-3 w-3 mr-1" />
                Alongamento 10-15 min
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!todayWorkout && !aiPlans) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Treino de Hoje
          </CardTitle>
          <CardDescription>
            Gere seus planos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum plano encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seus planos personalizados de treino para começar
            </p>
            <Button onClick={() => window.location.href = '/ai-plans'}>
              <Zap className="h-4 w-4 mr-2" />
              Criar Planos Personalizados
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Treino de Hoje
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{todayWorkout?.focus} • {todayWorkout?.duration}</span>
          {aiPlans?.latest && (
            <Badge variant="outline" className="text-xs">
              📋 Personalizado
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todayWorkout && (
          <div className="space-y-4">
            {/* Progresso do Treino */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso</span>
                <span className="text-muted-foreground">
                  {completedExercises.length} / {todayWorkout.exercises.length} exercícios
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
              {calculateProgress() === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Parabéns! Treino concluído!
                </div>
              )}
            </div>

            {/* Lista de Exercícios */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Exercícios</h4>
                {aiPlans?.latest && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Plano Completo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Plano de Treino Completo</DialogTitle>
                        <DialogDescription>
                          Criado em {new Date(aiPlans.latest.generatedAt).toLocaleDateString('pt-BR')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        {renderFormattedWorkoutPlan(aiPlans.latest.workoutPlan)}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {todayWorkout.exercises.map((exercise, index) => {
                const isCompleted = completedExercises.includes(exercise.name)
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {exercise.name}
                        </h5>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{exercise.sets} séries</span>
                        <span>{exercise.reps} repetições</span>
                        <span>Descanso: {exercise.rest}</span>
                      </div>
                      {exercise.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "outline"}
                      onClick={() => toggleExerciseComplete(exercise.name)}
                      className="text-xs min-w-[80px]"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Feito
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Iniciar
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* Aquecimento e Volta à Calma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-blue-700 text-sm font-medium mb-1">
                  <Zap className="h-3 w-3" />
                  Aquecimento
                </div>
                <p className="text-xs text-blue-600">{todayWorkout.warmup}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-purple-700 text-sm font-medium mb-1">
                  <Target className="h-3 w-3" />
                  Volta à Calma
                </div>
                <p className="text-xs text-purple-600">{todayWorkout.cooldown}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}