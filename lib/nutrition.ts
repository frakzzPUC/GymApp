// Função para calcular as necessidades calóricas diárias
export function calculateCalorieNeeds(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string,
): number {
  // Calcular TMB (Taxa Metabólica Basal) usando a fórmula de Mifflin-St Jeor
  let bmr = 0
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Aplicar multiplicador de nível de atividade
  let tdee = 0
  switch (activityLevel) {
    case "sedentary":
      tdee = bmr * 1.2 // Pouca ou nenhuma atividade
      break
    case "light":
      tdee = bmr * 1.375 // Exercício leve 1-3 dias por semana
      break
    case "moderate":
      tdee = bmr * 1.55 // Exercício moderado 3-5 dias por semana
      break
    case "active":
      tdee = bmr * 1.725 // Exercício intenso 6-7 dias por semana
      break
    case "very-active":
      tdee = bmr * 1.9 // Exercício muito intenso, trabalho físico ou treinamento 2x por dia
      break
    default:
      tdee = bmr * 1.2
  }

  // Ajustar com base no objetivo
  let calorieNeeds = 0
  switch (goal) {
    case "lose-weight":
      calorieNeeds = tdee - 500 // Déficit de 500 calorias para perda de peso
      break
    case "maintain":
      calorieNeeds = tdee // Manutenção
      break
    case "gain-muscle":
      calorieNeeds = tdee + 300 // Superávit de 300 calorias para ganho de massa muscular
      break
    default:
      calorieNeeds = tdee
  }

  // Garantir um mínimo saudável de calorias
  const minCalories = gender === "male" ? 1500 : 1200
  return Math.max(Math.round(calorieNeeds), minCalories)
}

// Função para gerar um plano de refeições com base nas necessidades calóricas
export function generateMealPlan(
  calorieNeeds: number,
  dietType: string,
  goal: string,
  restrictions: string[] = [],
): {
  meals: Array<{
    name: string
    description: string
    calories: number
    date: Date
  }>
  macros: {
    protein: number
    carbs: number
    fat: number
  }
} {
  // Definir distribuição de macronutrientes com base no objetivo
  let proteinPercentage = 0
  let carbsPercentage = 0
  let fatPercentage = 0

  switch (goal) {
    case "lose-weight":
      proteinPercentage = 40 // Alto em proteína para preservar massa muscular
      carbsPercentage = 30
      fatPercentage = 30
      break
    case "maintain":
      proteinPercentage = 30
      carbsPercentage = 40
      fatPercentage = 30
      break
    case "gain-muscle":
      proteinPercentage = 35
      carbsPercentage = 45 // Mais carboidratos para energia
      fatPercentage = 20
      break
    default:
      proteinPercentage = 30
      carbsPercentage = 40
      fatPercentage = 30
  }

  // Ajustar com base no tipo de dieta
  switch (dietType) {
    case "economic":
      // Sem alterações na distribuição de macros, apenas refeições mais econômicas
      break
    case "balanced":
      // Distribuição padrão já definida acima
      break
    case "premium":
      // Ajuste para dieta premium com mais variedade e qualidade
      proteinPercentage = 35
      carbsPercentage = 35
      fatPercentage = 30
      break
  }

  // Calcular gramas de cada macronutriente
  const proteinCalories = calorieNeeds * (proteinPercentage / 100)
  const carbsCalories = calorieNeeds * (carbsPercentage / 100)
  const fatCalories = calorieNeeds * (fatPercentage / 100)

  // Converter calorias em gramas (4 cal/g para proteínas e carboidratos, 9 cal/g para gorduras)
  const proteinGrams = Math.round(proteinCalories / 4)
  const carbsGrams = Math.round(carbsCalories / 4)
  const fatGrams = Math.round(fatCalories / 9)

  // Gerar refeições de exemplo
  const meals = generateSampleMeals(calorieNeeds, dietType, restrictions)

  return {
    meals,
    macros: {
      protein: proteinPercentage,
      carbs: carbsPercentage,
      fat: fatPercentage,
    },
  }
}

// Função auxiliar para gerar refeições de exemplo
function generateSampleMeals(
  calorieNeeds: number,
  dietType: string,
  restrictions: string[] = [],
): Array<{
  name: string
  description: string
  calories: number
  date: Date
}> {
  // Distribuir calorias entre as refeições
  const breakfastCalories = Math.round(calorieNeeds * 0.25)
  const lunchCalories = Math.round(calorieNeeds * 0.35)
  const dinnerCalories = Math.round(calorieNeeds * 0.3)
  const snackCalories = Math.round(calorieNeeds * 0.1)

  // Data atual
  const today = new Date()

  // Refeições de exemplo com base no tipo de dieta
  const meals = []

  // Café da manhã
  const breakfast = {
    name: "Café da Manhã",
    description: "",
    calories: breakfastCalories,
    date: today,
  }

  // Almoço
  const lunch = {
    name: "Almoço",
    description: "",
    calories: lunchCalories,
    date: today,
  }

  // Jantar
  const dinner = {
    name: "Jantar",
    description: "",
    calories: dinnerCalories,
    date: today,
  }

  // Lanche
  const snack = {
    name: "Lanche",
    description: "",
    calories: snackCalories,
    date: today,
  }

  // Definir descrições com base no tipo de dieta
  switch (dietType) {
    case "economic":
      breakfast.description = "Mingau de aveia com banana e canela"
      lunch.description = "Arroz, feijão, frango grelhado e salada de alface e tomate"
      dinner.description = "Macarrão integral com molho de tomate e atum"
      snack.description = "Iogurte natural com frutas"
      break
    case "balanced":
      breakfast.description = "Ovos mexidos, torrada integral, abacate e suco de laranja"
      lunch.description = "Arroz integral, feijão, filé de frango grelhado, brócolis e cenoura"
      dinner.description = "Salmão grelhado, batata doce assada e salada verde"
      snack.description = "Mix de castanhas e frutas vermelhas"
      break
    case "premium":
      breakfast.description = "Omelete com espinafre e queijo feta, pão artesanal, abacate e smoothie verde"
      lunch.description = "Quinoa, filé mignon grelhado, aspargos, abóbora assada e molho de ervas"
      dinner.description = "Peixe branco ao molho de limão, arroz selvagem e legumes assados"
      snack.description = "Iogurte grego com mel, granola premium e frutas frescas"
      break
    default:
      breakfast.description = "Ovos mexidos, torrada integral e frutas"
      lunch.description = "Arroz, feijão, carne e legumes"
      dinner.description = "Proteína magra com vegetais e carboidrato complexo"
      snack.description = "Iogurte com frutas"
  }

  // Filtrar com base em restrições alimentares
  if (restrictions.includes("vegetarian")) {
    lunch.description = lunch.description.replace("frango grelhado", "tofu grelhado")
    lunch.description = lunch.description.replace("filé de frango grelhado", "tofu grelhado")
    lunch.description = lunch.description.replace("filé mignon grelhado", "cogumelos portobello grelhados")
    dinner.description = dinner.description.replace("Salmão grelhado", "Hambúrguer de grão-de-bico")
    dinner.description = dinner.description.replace("Peixe branco", "Berinjela grelhada")
  }

  if (restrictions.includes("vegan")) {
    breakfast.description = breakfast.description.replace("Ovos mexidos", "Tofu mexido com cúrcuma")
    breakfast.description = breakfast.description.replace(
      "Omelete com espinafre e queijo feta",
      "Tofu mexido com espinafre e levedura nutricional",
    )
    lunch.description = lunch.description.replace("frango grelhado", "tofu grelhado")
    lunch.description = lunch.description.replace("filé de frango grelhado", "tofu grelhado")
    lunch.description = lunch.description.replace("filé mignon grelhado", "cogumelos portobello grelhados")
    dinner.description = dinner.description.replace("Salmão grelhado", "Hambúrguer de grão-de-bico")
    dinner.description = dinner.description.replace("Peixe branco", "Berinjela grelhada")
    snack.description = snack.description.replace("Iogurte", "Iogurte de coco")
    snack.description = snack.description.replace("Iogurte grego", "Iogurte de amêndoas")
  }

  if (restrictions.includes("gluten-free")) {
    breakfast.description = breakfast.description.replace("torrada integral", "torrada sem glúten")
    breakfast.description = breakfast.description.replace("pão artesanal", "pão sem glúten")
    lunch.description = lunch.description.replace("Arroz", "Arroz") // Já é sem glúten
    dinner.description = dinner.description.replace("Macarrão integral", "Macarrão de arroz")
  }

  if (restrictions.includes("lactose-free")) {
    breakfast.description = breakfast.description.replace("queijo feta", "queijo vegano")
    snack.description = snack.description.replace("Iogurte", "Iogurte de coco")
    snack.description = snack.description.replace("Iogurte grego", "Iogurte de amêndoas")
  }

  meals.push(breakfast, lunch, dinner, snack)
  return meals
}
