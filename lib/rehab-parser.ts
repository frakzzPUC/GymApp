// Função para extrair exercícios do plano de reabilitação para o dia atual
export function parseTodayRehabExercises(rehabilitationPlan: string): Array<{
  id: string
  name: string
  description: string
  duration: string
  phase: string
  instructions: string[]
}> {
  if (!rehabilitationPlan) return []
  
  const exercises = []
  const lines = rehabilitationPlan.split('\n')
  
  let currentExercise: any = null
  let currentPhase = 'FASE 1'
  let exerciseCounter = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Detectar mudança de fase - formato: #### **FASE X - TÍTULO**
    if (line.match(/^#+\s*\*\*FASE\s+\d+/i)) {
      currentPhase = line.replace(/^#+\s*\*\*/, '').replace(/\*\*.*$/, '').trim()
      continue
    }
    
    // Detectar exercícios numerados - formato: 1. **Nome do Exercício**
    if (line.match(/^\d+\.\s*\*\*/)) {
      // Salvar exercício anterior se existir
      if (currentExercise && currentExercise.name) {
        exercises.push(currentExercise)
      }
      
      exerciseCounter++
      const cleanName = line
        .replace(/^\d+\.\s*/, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim()
      
      currentExercise = {
        id: `rehab-exercise-${exerciseCounter}`,
        name: cleanName,
        description: '',
        duration: '5-10 min',
        phase: currentPhase,
        instructions: []
      }
    }
    
    // Adicionar instruções ao exercício atual
    else if (currentExercise && line.length > 0) {
      // Detectar descrições técnicas
      if (line.match(/^\*\s*\*\*(posição|execução|repetições|séries|frequência)/i)) {
        const content = line.replace(/^\*\s*\*\*/, '').replace(/\*\*/, ': ')
        currentExercise.instructions.push(content)
      }
      // Adicionar outras instruções em formato de lista
      else if (line.match(/^\s*[-*•]\s+/) || line.match(/^\s*\*\s+/)) {
        const cleanInstruction = line.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\*\s*/, '').trim()
        if (cleanInstruction && !cleanInstruction.startsWith('**')) {
          currentExercise.instructions.push(cleanInstruction)
        }
      }
      // Primeira linha após o nome sem formatação especial é descrição
      else if (!currentExercise.description && !line.match(/^(#+|###|\*\*)/)) {
        currentExercise.description = line
      }
    }
  }
  
  // Adicionar último exercício
  if (currentExercise && currentExercise.name) {
    exercises.push(currentExercise)
  }

  // Retornar todos os exercícios encontrados (de todas as fases)
  return exercises.slice(0, 15) // Máximo 15 exercícios total
}

// Função para obter exercícios baseados no dia da semana
export function getTodayRehabExercises(rehabilitationPlan: string, dayOfWeek: number): Array<{
  id: string
  name: string
  description: string
  duration: string
  phase: string
  instructions: string[]
}> {
  const allExercises = parseTodayRehabExercises(rehabilitationPlan)
  
  if (allExercises.length === 0) return []
  
  // Distribuir exercícios ao longo da semana - misturando todas as fases
  // Cada dia terá exercícios de diferentes fases para variedade
  
  const exercisesByDay = {
    1: allExercises.slice(0, 6), // Segunda - primeiros 6 exercícios (mix de fases)
    2: allExercises.slice(2, 8), // Terça - exercícios 3-8 (mix de fases)
    3: allExercises.slice(4, 10), // Quarta - exercícios 5-10 (mix de fases)
    4: allExercises.slice(1, 7), // Quinta - exercícios 2-7 (mix de fases)
    5: allExercises.slice(3, 9), // Sexta - exercícios 4-9 (mix de fases)
    6: allExercises.slice(0, 5), // Sábado - primeiros 5 exercícios
    0: allExercises.slice(0, 4), // Domingo - primeiros 4 exercícios
  }
  
  const dayExercises = exercisesByDay[dayOfWeek as keyof typeof exercisesByDay] || []
  
  // Se não tiver exercícios suficientes para o dia, usar todos os disponíveis
  if (dayExercises.length === 0 && allExercises.length > 0) {
    return allExercises.slice(0, 6)
  }
  
  return dayExercises
}