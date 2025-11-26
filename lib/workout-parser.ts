interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
  duration: string
  warmup: string
  cooldown: string
}

export const parseWorkoutPlan = (workoutPlan: string): WorkoutDay => {
  try {
    // Determinar o dia da semana atual (0 = domingo, 1 = segunda, etc.)
    const today = new Date().getDay()
    const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
    const todayName = daysOfWeek[today]
    
    console.log('Parsing workout plan for:', todayName)
    console.log('Workout plan content:', workoutPlan)

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
      return {
        day: todayName,
        focus: 'Descanso Ativo',
        exercises: [],
        duration: '20-30 min',
        warmup: 'Alongamento leve',
        cooldown: 'Meditação ou relaxamento'
      }
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
            // Extrair o foco do treino do título e limpar formatação
            sectionTitle = line
              .replace(/##\s*TREINO\s*[A-Z]\s*-?\s*/i, '')
              .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
              .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
              .replace(/\*\*/g, '') // Remove qualquer ** restante
              .trim()
            
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
            // Limpar nome do exercício removendo formatação markdown
            let name = exerciseMatch[1].trim()
              .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
              .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim  
              .replace(/\*\*/g, '') // Remove qualquer ** restante
              .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
              .trim()
            
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
              console.log('Added exercise:', name, sets + 'x' + reps)
            }
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
            // Limpeza mais robusta do nome do exercício
            let name = exerciseMatch[1].trim()
              .replace(/^\d+\.\s*/, '') // Remove numeração
              .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
              .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
              .replace(/\*\*/g, '') // Remove qualquer ** restante
              .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
              .trim()
            
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

    return {
      day: todayName,
      focus,
      exercises: exercises.slice(0, 8), // Limitar a 8 exercícios
      duration,
      warmup,
      cooldown
    }

  } catch (error) {
    console.error('Erro ao processar plano de treino:', error)
    // Fallback para treino padrão
    const today = new Date().getDay()
    return {
      day: 'hoje',
      focus: getDefaultFocusForToday(today),
      exercises: getDefaultExercisesForToday(today),
      duration: '45-60 min',
      warmup: '5-10 min de aquecimento',
      cooldown: '5-10 min de alongamento'
    }
  }
}

export const getDefaultFocusForToday = (day: number): string => {
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

export const getFallbackExercisesForFocus = (focus: string): Exercise[] | null => {
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
      { name: 'Barra fixa (assistida)', sets: '3', reps: '6-10', rest: '90s' },
      { name: 'Rosca direta', sets: '3', reps: '10-15', rest: '60s' },
      { name: 'Rosca martelo', sets: '3', reps: '10-15', rest: '60s' }
    ]
  }
  
  if (focusLower.includes('pernas') || focusLower.includes('glúteos')) {
    return [
      { name: 'Agachamento livre', sets: '3', reps: '8-12', rest: '2min' },
      { name: 'Leg press', sets: '3', reps: '12-15', rest: '90s' },
      { name: 'Stiff', sets: '3', reps: '10-12', rest: '90s' },
      { name: 'Bulgária', sets: '3', reps: '10-12 (cada perna)', rest: '60s' },
      { name: 'Panturrilha em pé', sets: '4', reps: '15-20', rest: '45s' },
      { name: 'Abdução quadril', sets: '3', reps: '12-15', rest: '60s' }
    ]
  }
  
  if (focusLower.includes('cardio') || focusLower.includes('funcional')) {
    return [
      { name: 'Burpees', sets: '3', reps: '8-12', rest: '60s' },
      { name: 'Mountain climbers', sets: '3', reps: '20', rest: '45s' },
      { name: 'Polichinelos', sets: '3', reps: '30', rest: '45s' },
      { name: 'Prancha', sets: '3', reps: '30-60s', rest: '60s' },
      { name: 'Agachamento jump', sets: '3', reps: '15', rest: '60s' },
      { name: 'Push-ups', sets: '3', reps: '8-15', rest: '60s' }
    ]
  }
  
  return null
}

export const getDefaultExercisesForToday = (day: number): Exercise[] => {
  const exercisesByDay = [
    // Domingo - Descanso/Mobilidade
    [
      { name: 'Caminhada leve', sets: '1', reps: '20-30min', rest: '-' },
      { name: 'Alongamento geral', sets: '1', reps: '10-15min', rest: '-' },
      { name: 'Respiração profunda', sets: '3', reps: '1min', rest: '30s' }
    ],
    // Segunda - Peito e Tríceps  
    [
      { name: 'Supino reto', sets: '3', reps: '8-12', rest: '90s' },
      { name: 'Supino inclinado', sets: '3', reps: '8-12', rest: '90s' },
      { name: 'Crucifixo', sets: '3', reps: '10-15', rest: '60s' },
      { name: 'Tríceps pulley', sets: '3', reps: '10-15', rest: '60s' },
      { name: 'Tríceps francês', sets: '3', reps: '10-15', rest: '60s' }
    ],
    // Terça - Costas e Bíceps
    [
      { name: 'Remada curvada', sets: '3', reps: '8-12', rest: '90s' },
      { name: 'Puxada alta', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Remada baixa', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Rosca direta', sets: '3', reps: '10-15', rest: '60s' },
      { name: 'Rosca martelo', sets: '3', reps: '10-15', rest: '60s' }
    ],
    // Quarta - Pernas e Glúteos
    [
      { name: 'Agachamento livre', sets: '3', reps: '8-12', rest: '2min' },
      { name: 'Leg press', sets: '3', reps: '12-15', rest: '90s' },
      { name: 'Stiff', sets: '3', reps: '10-12', rest: '90s' },
      { name: 'Bulgária', sets: '3', reps: '10-12 cada perna', rest: '60s' },
      { name: 'Panturrilha em pé', sets: '4', reps: '15-20', rest: '45s' }
    ],
    // Quinta - Ombros e Core
    [
      { name: 'Desenvolvimento', sets: '3', reps: '8-12', rest: '90s' },
      { name: 'Elevação lateral', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Elevação frontal', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Encolhimento', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Prancha', sets: '3', reps: '30-60s', rest: '60s' }
    ],
    // Sexta - Cardio e Funcional
    [
      { name: 'Burpees', sets: '3', reps: '8-12', rest: '60s' },
      { name: 'Mountain climbers', sets: '3', reps: '20', rest: '45s' },
      { name: 'Polichinelos', sets: '3', reps: '30', rest: '45s' },
      { name: 'Agachamento jump', sets: '3', reps: '15', rest: '60s' },
      { name: 'Push-ups', sets: '3', reps: '8-15', rest: '60s' }
    ],
    // Sábado - Treino Livre
    [
      { name: 'Escolha livre 1', sets: '3', reps: '8-12', rest: '60-90s' },
      { name: 'Escolha livre 2', sets: '3', reps: '8-12', rest: '60-90s' },
      { name: 'Escolha livre 3', sets: '3', reps: '8-12', rest: '60-90s' },
      { name: 'Alongamento', sets: '1', reps: '10min', rest: '-' }
    ]
  ]
  
  return exercisesByDay[day] || exercisesByDay[1] // Default para segunda-feira
}