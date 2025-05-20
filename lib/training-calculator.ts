// lib/training-calculator.ts
export function generateTrainingPlan(userData: {
    gender: string,
    weight: number,
    height: number,
    goal: string,
    fitnessLevel: string,
    daysPerWeek: number,
    timePerDay: number
  }) {
    const { gender, weight, height, goal, fitnessLevel, daysPerWeek, timePerDay } = userData
    
    // Calcular IMC
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    // Array para armazenar os exercícios
    const exercises = []
    
    // Gerar exercícios com base no objetivo
    if (goal === "lose-weight") {
      // Exercícios para perda de peso (mais cardio)
      exercises.push(
        { name: "Aquecimento", duration: "5 min", description: "Aquecimento articular e cardio leve", caloriesBurned: 25 },
        { name: "Corrida/Caminhada", duration: "20 min", description: "Cardio moderado a intenso", caloriesBurned: 200 }
      )
      
      // Adicionar exercícios com base no nível de condicionamento
      if (fitnessLevel === "beginner") {
        exercises.push(
          { name: "Agachamento", duration: "10 min", description: "3 séries de 10 repetições", caloriesBurned: 80 },
          { name: "Flexão modificada", duration: "10 min", description: "3 séries de 8 repetições", caloriesBurned: 70 }
        )
      } else if (fitnessLevel === "intermediate") {
        exercises.push(
          { name: "Agachamento com salto", duration: "10 min", description: "4 séries de 12 repetições", caloriesBurned: 120 },
          { name: "Flexão completa", duration: "10 min", description: "4 séries de 10 repetições", caloriesBurned: 100 }
        )
      } else { // advanced
        exercises.push(
          { name: "Burpees", duration: "15 min", description: "5 séries de 15 repetições", caloriesBurned: 180 },
          { name: "Mountain climbers", duration: "10 min", description: "5 séries de 30 segundos", caloriesBurned: 150 }
        )
      }
      
      exercises.push(
        { name: "Alongamento", duration: "5 min", description: "Alongamento completo", caloriesBurned: 15 }
      )
    } else if (goal === "gain-muscle") {
      // Exercícios para ganho de massa (mais força)
      // ...lógica similar
    }
    
    // Ajustar com base no tempo disponível
    if (timePerDay < 30) {
      // Reduzir duração dos exercícios
      // ...
    }
    
    return {
      exercises,
      totalCaloriesBurned: exercises.reduce((total, ex) => total + ex.caloriesBurned, 0)
    }
  }