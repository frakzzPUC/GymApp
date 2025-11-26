export interface MealPlan {
  mealTime: string
  foods: string[]
  time?: string
  calories?: string
}

export const parseNutritionPlan = (nutritionText: string): MealPlan[] => {
  try {
    console.log('Parsing nutrition plan:', nutritionText)
    
    const lines = nutritionText.split('\n')
    const meals: MealPlan[] = []
    
    // Extrair a meta de calorias diárias do plano
    let dailyCaloriesGoal = 2000
    for (const line of lines) {
      const calorieGoalMatch = line.match(/calorias\s+diárias?\s*:?\s*(\d+)/i)
      if (calorieGoalMatch) {
        dailyCaloriesGoal = parseInt(calorieGoalMatch[1])
        console.log('Meta de calorias extraída:', dailyCaloriesGoal)
        break
      }
    }
    
    // Horários padrão das refeições
    const defaultTimes: { [key: string]: string } = {
      'café da manhã': '07:00',
      'lanche da manhã': '10:00',
      'lanche manhã': '10:00',
      'colação': '10:00',
      'almoço': '12:30',
      'lanche da tarde': '15:30',
      'lanche tarde': '15:30',
      'jantar': '19:00',
      'ceia': '21:00'
    }
    
    let currentMeal = null
    let mealFoods: string[] = []
    let mealCalories = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      // Detectar início de uma refeição
      const mealMatch = line.match(/(café da manhã|lanche da manhã|lanche manhã|lanche da tarde|lanche tarde|almoço|jantar|colação|ceia).*\((\d+)\s*kcal\)/i)
      
      if (mealMatch) {
        // Salvar refeição anterior se existir
        if (currentMeal && mealFoods.length > 0) {
          meals.push({
            mealTime: currentMeal,
            time: defaultTimes[currentMeal.toLowerCase()] || '12:00',
            calories: `${mealCalories || Math.floor(dailyCaloriesGoal / 5)} kcal`,
            foods: [...mealFoods]
          })
        }
        
        // Iniciar nova refeição - limpar formatação
        currentMeal = mealMatch[1]
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
          .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
          .replace(/\*\*/g, '') // Remove qualquer ** restante
          .trim()
        
        mealFoods = []
        mealCalories = parseInt(mealMatch[2])
        
        console.log(`Refeição encontrada: ${currentMeal} - ${mealCalories} kcal`)
      }
      // Se não encontrou no título, tentar detectar refeição sem calorias
      else if (!currentMeal) {
        const simpleMealMatch = line.match(/(café da manhã|lanche da manhã|lanche manhã|lanche da tarde|lanche tarde|almoço|jantar|colação|ceia)/i)
        if (simpleMealMatch) {
          currentMeal = simpleMealMatch[1]
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
            .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
            .replace(/\*\*/g, '') // Remove qualquer ** restante
            .trim()
          
          mealFoods = []
          mealCalories = 0
          console.log(`Refeição encontrada (sem calorias): ${currentMeal}`)
        }
      }
      // Detectar alimentos da refeição atual
      else if (currentMeal && line.length > 3) {
        if (line.startsWith('-') || line.match(/^\d+\./) || 
            (line.length > 5 && !line.includes('##') && !line.includes('**') && !lowerLine.includes('orientações'))) {
          
          let food = line
            .replace(/^[-•\d\.\s]+/, '') // Remove marcadores e numeração
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **texto** mas mantém texto
            .replace(/^\*\*|\*\*$/g, '') // Remove ** no início/fim
            .replace(/\*\*/g, '') // Remove qualquer ** restante
            .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
            .replace(/\([^)]*kcal\)/gi, '') // Remove (XXX kcal)
            .replace(/\([^)]*calorias?\)/gi, '') // Remove (XXX calorias)
            .replace(/\d+g\s+de\s+/gi, '') // Remove "150g de"
            .replace(/\d+\s*ml\s+de\s+/gi, '') // Remove "200ml de"
            .replace(/\d+\s*colheres?\s+(de\s+)?/gi, '') // Remove "2 colheres de"
            .replace(/\d+\s*fatias?\s+de\s+/gi, '') // Remove "2 fatias de"
            .replace(/\d+\s*unidades?\s+de\s+/gi, '') // Remove "1 unidade de"
            .replace(/\d+\s*xícaras?\s+(de\s+)?/gi, '') // Remove "1 xícara de"
            .replace(/^\d+\s*/, '') // Remove números no início
            .trim()
          
          if (food.length > 3 && !food.includes('refeição') && !food.includes('plano') && !food.includes('lista') && !food.includes('substituições') && !food.includes('modo de preparo')) {
            mealFoods.push(food)
          }
        }
        // Detectar quando sai da seção de refeições
        else if (line.includes('##') || lowerLine.includes('lista') || lowerLine.includes('orientações')) {
          if (currentMeal && mealCalories === 0) {
            const mealDistribution = {
              'café da manhã': 0.25,
              'lanche da manhã': 0.10,
              'almoço': 0.35,
              'lanche da tarde': 0.15,
              'jantar': 0.15
            }
            const mealKey = currentMeal.toLowerCase()
            const distribution = mealDistribution[mealKey as keyof typeof mealDistribution] || 0.20
            mealCalories = Math.floor(dailyCaloriesGoal * distribution)
          }
          
          if (currentMeal && mealFoods.length > 0) {
            meals.push({
              mealTime: currentMeal,
              time: defaultTimes[currentMeal.toLowerCase()] || '12:00',
              calories: `${mealCalories} kcal`,
              foods: [...mealFoods]
            })
          }
          currentMeal = null
          mealFoods = []
          mealCalories = 0
        }
      }
    }
    
    // Salvar última refeição se ainda estiver aberta
    if (currentMeal && mealFoods.length > 0) {
      if (mealCalories === 0) {
        const mealDistribution = {
          'café da manhã': 0.25,
          'lanche da manhã': 0.10,
          'almoço': 0.35,
          'lanche da tarde': 0.15,
          'jantar': 0.15
        }
        const mealKey = currentMeal.toLowerCase()
        const distribution = mealDistribution[mealKey as keyof typeof mealDistribution] || 0.20
        mealCalories = Math.floor(dailyCaloriesGoal * distribution)
      }
      
      meals.push({
        mealTime: currentMeal,
        time: defaultTimes[currentMeal.toLowerCase()] || '12:00',
        calories: `${mealCalories} kcal`,
        foods: [...mealFoods]
      })
    }
    
    // Se não encontrou refeições, usar padrão com calorias adaptadas
    if (meals.length === 0) {
      console.log('Nenhuma refeição encontrada, usando padrão com calorias adaptadas')
      return [
        { mealTime: 'Café da manhã', time: '07:00', calories: `${Math.floor(dailyCaloriesGoal * 0.25)} kcal`, foods: [] },
        { mealTime: 'Lanche da manhã', time: '10:00', calories: `${Math.floor(dailyCaloriesGoal * 0.10)} kcal`, foods: [] },
        { mealTime: 'Almoço', time: '12:30', calories: `${Math.floor(dailyCaloriesGoal * 0.35)} kcal`, foods: [] },
        { mealTime: 'Lanche da tarde', time: '15:30', calories: `${Math.floor(dailyCaloriesGoal * 0.15)} kcal`, foods: [] },
        { mealTime: 'Jantar', time: '19:00', calories: `${Math.floor(dailyCaloriesGoal * 0.15)} kcal`, foods: [] },
      ]
    }
    
    console.log('Refeições extraídas:', meals)
    return meals
    
  } catch (error) {
    console.error('Erro ao parsear plano nutricional:', error)
    return []
  }
}