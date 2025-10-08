import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import TrainingDietProfile from "@/models/TrainingDietProfile"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    console.log("Corpo da requisição:", body)

    // Se apenas dietType estiver presente, estamos atualizando apenas a dieta
    if (body.dietType && Object.keys(body).length === 1) {
      console.log("Atualizando apenas o tipo de dieta:", body.dietType)

      const profile = await TrainingDietProfile.findOne({ userId })

      if (!profile) {
        return NextResponse.json({ success: false, message: "Perfil não encontrado" }, { status: 404 })
      }

      profile.dietType = body.dietType
      profile.updatedAt = new Date()
      await profile.save()

      console.log("Tipo de dieta atualizado com sucesso")
      return NextResponse.json({ success: true, data: profile }, { status: 200 })
    }

    // Caso contrário, estamos criando/atualizando o perfil completo
    const { 
      // Dados pessoais básicos
      age, gender, weight, height,
      
      // Histórico de saúde e atividade física
      activityLevel, exerciseExperience, fitnessLevel, medicalConditions, injuries, medications,
      
      // Objetivos e preferências de treino
      primaryGoal, secondaryGoals, daysPerWeek, timePerDay, preferredTime, workoutLocation, 
      availableEquipment, exercisePreferences, exerciseDislikes,
      
      // Informações nutricionais
      wantsDiet, dietaryRestrictions, allergies, currentEatingHabits, mealsPerDay, 
      waterIntake, supplementUsage, budgetPreference, cookingSkill, mealPrepTime,
      
      // Estilo de vida
      profession, stressLevel, sleepHours, sleepQuality,
      
      // Motivação e apoio
      motivation, obstacles, supportSystem, previousAttempts,
      
      // Legacy fields
      goal, dietType 
    } = body

    // Validação básica para criação/atualização completa
    if (!age || !gender || !weight || !height || !primaryGoal || !fitnessLevel || !daysPerWeek || !timePerDay) {
      console.error("Campos obrigatórios faltando:", {
        age: !!age,
        gender: !!gender,
        weight: !!weight,
        height: !!height,
        primaryGoal: !!primaryGoal,
        fitnessLevel: !!fitnessLevel,
        daysPerWeek: !!daysPerWeek,
        timePerDay: !!timePerDay
      })
      return NextResponse.json({ 
        success: false, 
        message: "Campos obrigatórios: idade, gênero, peso, altura, objetivo principal, nível de condicionamento, dias por semana e tempo por dia" 
      }, { status: 400 })
    }

    // Validação adicional de enums
    const validGenders = ["male", "female", "other"]
    if (!validGenders.includes(gender)) {
      return NextResponse.json({ 
        success: false, 
        message: `Gênero inválido: ${gender}. Valores aceitos: ${validGenders.join(', ')}` 
      }, { status: 400 })
    }

    const validActivityLevels = ["sedentary", "light", "moderate", "active", "very-active"]
    if (activityLevel && !validActivityLevels.includes(activityLevel)) {
      return NextResponse.json({ 
        success: false, 
        message: `Nível de atividade inválido: ${activityLevel}. Valores aceitos: ${validActivityLevels.join(', ')}` 
      }, { status: 400 })
    }

    console.log("Atualizando programa do usuário para training-diet:", userId)

    // Preparar dados limpos para evitar problemas de validação
    const cleanData = {
      // Dados pessoais básicos (obrigatórios)
      age: Number(age),
      gender,
      weight: Number(weight), 
      height: Number(height),
      
      // Histórico de saúde e atividade física
      activityLevel,
      exerciseExperience, 
      fitnessLevel,
      medicalConditions: medicalConditions || [],
      injuries: injuries || "",
      medications: medications || "",
      
      // Objetivos e preferências de treino
      primaryGoal,
      secondaryGoals: secondaryGoals || [],
      daysPerWeek: Number(daysPerWeek),
      timePerDay: Number(timePerDay),
      preferredTime,
      workoutLocation,
      availableEquipment: availableEquipment || [],
      exercisePreferences: exercisePreferences || [],
      exerciseDislikes: exerciseDislikes || [],
      
      // Informações nutricionais (condicionais)
      wantsDiet: wantsDiet || false,
      dietaryRestrictions: dietaryRestrictions || [],
      allergies: allergies || "",
      ...(wantsDiet && currentEatingHabits && { currentEatingHabits }),
      ...(wantsDiet && mealsPerDay && { mealsPerDay: Number(mealsPerDay) }),
      ...(wantsDiet && waterIntake && { waterIntake }),
      supplementUsage: supplementUsage || "",
      ...(wantsDiet && budgetPreference && { budgetPreference }),
      ...(wantsDiet && cookingSkill && { cookingSkill }),
      ...(wantsDiet && mealPrepTime && { mealPrepTime }),
      
      // Estilo de vida
      profession,
      stressLevel,
      sleepHours: Number(sleepHours),
      sleepQuality,
      
      // Motivação e apoio
      motivation,
      obstacles: obstacles || "",
      supportSystem: supportSystem || "",
      previousAttempts: previousAttempts || "",
      
      // Legacy compatibility
      goal: primaryGoal,
      dietType: dietType || "balanced",
      
      // Metadados
      userEmail: session.user.email,
      updatedAt: new Date()
    }

    console.log("Dados limpos preparados:", cleanData)

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "training-diet" })

    // Verificar se já existe um perfil de treino+dieta para este usuário
    let profile = await TrainingDietProfile.findOne({ userId })

    if (profile) {
      console.log("Atualizando perfil existente")
      // Atualizar perfil existente com dados limpos
      Object.assign(profile, cleanData)
      await profile.save()
    } else {
      console.log("Criando novo perfil")
      // Criar novo perfil com dados limpos e campos adicionais
      profile = await TrainingDietProfile.create({
        userId,
        ...cleanData,
        
        // Adicionar treinos padrão
        workouts: [
          {
            name: "Treino Completo",
            description: "Treino completo para iniciantes", 
            duration: "45 minutos",
            caloriesBurned: 300,
            completed: false,
            date: new Date(),
          },
          {
            name: "Treino de Força",
            description: "Foco em ganho de massa muscular",
            duration: "30 minutos", 
            caloriesBurned: 250,
            completed: false,
            date: new Date(Date.now() + 86400000), // Amanhã
          },
        ],
        // Adicionar refeições padrão
        meals: [
          {
            name: "Café da Manhã",
            description: "Ovos mexidos, torrada integral e frutas",
            calories: 450,
            date: new Date(),
          },
          {
            name: "Almoço", 
            description: "Frango grelhado, arroz integral e legumes",
            calories: 650,
            date: new Date(),
          },
        ],
        // Inicializar progresso baseado no objetivo
        progress: {
          caloriesGoal: primaryGoal === "lose-weight" ? 1800 : 2200,
          caloriesConsumed: 0,
          caloriesBurned: 0,
          weightChange: 0,
          macros: {
            protein: primaryGoal === "gain-muscle" ? 40 : 30,
            carbs: primaryGoal === "gain-muscle" ? 40 : 30,
            fat: primaryGoal === "gain-muscle" ? 20 : 40,
          },
        },
      })
    }

    console.log("Perfil salvo com sucesso:", profile._id)

    return NextResponse.json({ success: true, data: profile }, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar perfil de treino+dieta:", error)
    
    // Melhor tratamento de erros específicos
    let errorMessage = "Erro ao salvar perfil de treino+dieta"
    
    if (error instanceof Error) {
      errorMessage = error.message
      console.error("Mensagem específica do erro:", error.message)
      console.error("Stack trace:", error.stack)
    }
    
    // Erro de validação do Mongoose
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const mongooseError = error as any
      const validationErrors = Object.values(mongooseError.errors).map((err: any) => err.message)
      errorMessage = `Erro de validação: ${validationErrors.join(', ')}`
    }
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage,
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar perfil de treino+dieta do usuário
    const profile = await TrainingDietProfile.findOne({ userId })

    if (!profile) {
      return NextResponse.json({ success: false, message: "Perfil de treino+dieta não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil de treino+dieta:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil de treino+dieta" }, { status: 500 })
  }
}
