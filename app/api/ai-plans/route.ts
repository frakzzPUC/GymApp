import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import TrainingDietProfile from "@/models/TrainingDietProfile"
import AIPlans from "@/models/AIPlans"
import User from "@/models/User"
import { generateCompletePlan, UserProfileData } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    console.log("=== INÍCIO DA GERAÇÃO DE PLANOS ===")
    
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log("Erro: Usuário não autenticado")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    console.log("Usuário autenticado:", session.user.email)

    // Conectar ao banco
    console.log("Conectando ao MongoDB...")
    await dbConnect()
    console.log("MongoDB conectado com sucesso")

    // Buscar o perfil do usuário
    console.log("Buscando perfil do usuário...")
    const profile = await TrainingDietProfile.findOne({ 
      userEmail: session.user.email 
    }).sort({ createdAt: -1 }) // Pegar o mais recente

    if (!profile) {
      console.log("Erro: Perfil não encontrado para:", session.user.email)
      return NextResponse.json({ 
        error: "Perfil não encontrado. Complete o formulário primeiro." 
      }, { status: 404 })
    }

    console.log("Perfil encontrado, ID:", profile._id)

    // Converter dados do perfil para o formato esperado pelo Gemini
    console.log("Convertendo dados do perfil...")
    const userData: UserProfileData = {
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel,
      exerciseExperience: profile.exerciseExperience,
      fitnessLevel: profile.fitnessLevel,
      medicalConditions: profile.medicalConditions || [],
      injuries: profile.injuries,
      medications: profile.medications,
      primaryGoal: profile.primaryGoal,
      secondaryGoals: profile.secondaryGoals || [],
      daysPerWeek: profile.daysPerWeek,
      timePerDay: profile.timePerDay,
      preferredTime: profile.preferredTime,
      workoutLocation: profile.workoutLocation,
      availableEquipment: profile.availableEquipment || [],
      exercisePreferences: profile.exercisePreferences || [],
      exerciseDislikes: profile.exerciseDislikes || [],
      wantsDiet: profile.wantsDiet,
      dietaryRestrictions: profile.dietaryRestrictions || [],
      allergies: profile.allergies,
      currentEatingHabits: profile.currentEatingHabits,
      mealsPerDay: profile.mealsPerDay,
      waterIntake: profile.waterIntake,
      supplementUsage: profile.supplementUsage,
      budgetPreference: profile.budgetPreference,
      cookingSkill: profile.cookingSkill,
      mealPrepTime: profile.mealPrepTime,
      profession: profile.profession,
      stressLevel: profile.stressLevel,
      sleepHours: profile.sleepHours,
      sleepQuality: profile.sleepQuality,
      motivation: profile.motivation,
      obstacles: profile.obstacles,
      supportSystem: profile.supportSystem,
      previousAttempts: profile.previousAttempts,
      dietType: profile.dietType
    }

    console.log("Dados convertidos, iniciando geração com IA...")

    // Gerar planos usando IA
    const plans = await generateCompletePlan(userData)
    console.log("Planos gerados com sucesso pela IA")

    // Buscar o usuário no banco
    console.log("Buscando usuário no banco...")
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      console.log("Erro: Usuário não encontrado no banco")
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Determinar se foi gerado por IA ou fallback
    const planType = plans.workoutPlan.includes('*Plano gerado automaticamente baseado no seu perfil*') 
      ? 'static-fallback' 
      : 'ai-generated'

    // Salvar os planos em uma nova coleção AIPlans
    console.log("Salvando planos na coleção AIPlans...")
    const aiPlansData = new AIPlans({
      userId: user._id,
      workoutPlan: plans.workoutPlan,
      nutritionPlan: plans.nutritionPlan,
      planType: planType,
      userProfile: {
        age: userData.age,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        primaryGoal: userData.primaryGoal,
        activityLevel: userData.activityLevel,
        experience: userData.exerciseExperience
      }
    })

    await aiPlansData.save()
    console.log("Planos salvos com sucesso na coleção AIPlans!")

    // Também salvar no perfil para compatibilidade
    console.log("Atualizando perfil com referência aos planos...")
    await TrainingDietProfile.findByIdAndUpdate(profile._id, {
      aiWorkoutPlan: plans.workoutPlan,
      aiNutritionPlan: plans.nutritionPlan,
      plansGeneratedAt: new Date(),
      lastAIPlansId: aiPlansData._id
    })

    console.log("Planos salvos com sucesso!")
    console.log("=== FIM DA GERAÇÃO DE PLANOS ===")

    return NextResponse.json({
      success: true,
      message: "Planos gerados com sucesso!",
      data: {
        workoutPlan: plans.workoutPlan,
        nutritionPlan: plans.nutritionPlan,
        planType: planType,
        generatedAt: aiPlansData.createdAt,
        planId: aiPlansData._id
      }
    }, { status: 200 })

  } catch (error) {
    console.error("=== ERRO DURANTE GERAÇÃO DE PLANOS ===")
    console.error("Tipo do erro:", typeof error)
    console.error("Erro completo:", error)
    
    if (error instanceof Error) {
      console.error("Mensagem:", error.message)
      console.error("Stack:", error.stack)
    }
    
    return NextResponse.json({
      error: "Erro interno do servidor ao gerar planos",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Conectar ao banco
    await dbConnect()

    // Buscar o usuário
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar todos os planos do usuário ordenados por data (mais recente primeiro)
    const allPlans = await AIPlans.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10) // Limitar a 10 planos mais recentes

    if (allPlans.length === 0) {
      return NextResponse.json({
        success: true,
        hasPlans: false,
        message: "Nenhum plano encontrado. Gere seus primeiros planos!",
        data: []
      }, { status: 200 })
    }

    // Retornar o plano mais recente e a lista de todos
    const latestPlan = allPlans[0]
    
    return NextResponse.json({
      success: true,
      hasPlans: true,
      data: {
        latest: {
          workoutPlan: latestPlan.workoutPlan,
          nutritionPlan: latestPlan.nutritionPlan,
          planType: latestPlan.planType,
          generatedAt: latestPlan.createdAt,
          planId: latestPlan._id,
          userProfile: latestPlan.userProfile
        },
        allPlans: allPlans.map(plan => ({
          planId: plan._id,
          planType: plan.planType,
          generatedAt: plan.createdAt,
          userProfile: plan.userProfile
        })),
        totalPlans: allPlans.length
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao buscar planos:", error)
    return NextResponse.json({
      error: "Erro interno do servidor"
    }, { status: 500 })
  }
}