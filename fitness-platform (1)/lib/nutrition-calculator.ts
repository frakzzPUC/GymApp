// lib/nutrition-calculator.ts
export function calculateCalorieNeeds(userData: {
    gender: string,
    weight: number,
    height: number,
    age: number,
    goal: string,
    activityLevel: string
  }) {
    const { gender, weight, height, age, goal, activityLevel } = userData
    
    // Calcular Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor
    let bmr = 0
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Fator de atividade
    let activityFactor = 1.2 // Sedentário
    switch (activityLevel) {
      case "light":
        activityFactor = 1.375 // Exercício leve 1-3x por semana
        break
      case "moderate":
        activityFactor = 1.55 // Exercício moderado 3-5x por semana
        break
      case "active":
        activityFactor = 1.725 // Exercício intenso 6-7x por semana
        break
      case "very_active":
        activityFactor = 1.9 // Exercício muito intenso, trabalho físico
        break
    }
    
    // Calorias diárias para manutenção
    const maintenanceCalories = Math.round(bmr * activityFactor)
    
    // Ajustar com base no objetivo
    let targetCalories = maintenanceCalories
    let macros = { protein: 30, carbs: 40, fat: 30 } // Distribuição padrão
    
    if (goal === "lose-weight") {
      // Déficit calórico saudável (15-20%)
      targetCalories = Math.round(maintenanceCalories * 0.85)
      macros = { protein: 40, carbs: 30, fat: 30 } // Mais proteína para preservar massa muscular
    } else if (goal === "gain-muscle") {
      // Superávit calórico moderado (10-15%)
      targetCalories = Math.round(maintenanceCalories * 1.1)
      macros = { protein: 35, carbs: 45, fat: 20 } // Mais carboidratos para energia
    }
    
    return {
      bmr,
      maintenanceCalories,
      targetCalories,
      macros,
      // Calcular gramas de cada macronutriente
      macrosInGrams: {
        protein: Math.round((targetCalories * (macros.protein / 100)) / 4), // 4 calorias por grama
        carbs: Math.round((targetCalories * (macros.carbs / 100)) / 4), // 4 calorias por grama
        fat: Math.round((targetCalories * (macros.fat / 100)) / 9) // 9 calorias por grama
      }
    }
  }