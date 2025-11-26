import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import SedentaryProfile from "@/models/SedentaryProfile"
import AIPlans from "@/models/AIPlans"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateSedentaryProgram } from "@/lib/gemini"

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
    const { age, gender, motivation, primaryGoal, currentActivityLevel, availableTime, preferredActivities } = body

    // Validação básica
    if (!age || !gender || !motivation || !primaryGoal || !currentActivityLevel || !availableTime || !preferredActivities) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    console.log("Atualizando programa do usuário para sedentary:", userId)

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "sedentary" })

    // Verificar se já existe um perfil sedentário para este usuário
    let profile = await SedentaryProfile.findOne({ userId })

    if (profile) {
      console.log("Atualizando perfil existente")
      // Atualizar perfil existente
      profile.age = age
      profile.gender = gender
      profile.motivation = motivation
      profile.primaryGoal = primaryGoal
      profile.currentActivityLevel = currentActivityLevel
      profile.availableTime = availableTime
      profile.preferredActivities = preferredActivities
      profile.updatedAt = new Date()
      await profile.save()
    } else {
      console.log("Criando novo perfil")
      // Criar novo perfil
      profile = await SedentaryProfile.create({
        userId,
        age,
        gender,
        motivation,
        primaryGoal,
        currentActivityLevel,
        availableTime,
        preferredActivities,
      })
    }

    console.log("Perfil salvo com sucesso:", profile._id)

    // Gerar programa motivacional com IA
    console.log("Gerando programa motivacional com IA...")
    const aiProgram = await generateSedentaryProgram({
      age,
      gender,
      motivation,
      primaryGoal,
      currentActivityLevel,
      availableTime,
      preferredActivities,
    })

    // Salvar o programa gerado no AIPlans
    let aiPlan = await AIPlans.findOne({ userId, planType: "sedentary" })
    
    if (aiPlan) {
      console.log("Atualizando plano existente")
      aiPlan.planContent = aiProgram || ''
      aiPlan.updatedAt = new Date()
      await aiPlan.save()
    } else {
      console.log("Criando novo plano")
      aiPlan = await AIPlans.create({
        userId,
        planType: "sedentary",
        planContent: aiProgram,
      })
    }

    console.log("Programa motivacional gerado e salvo com sucesso")

    return NextResponse.json({ 
      success: true, 
      data: { 
        profile,
        aiProgram 
      } 
    }, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar perfil sedentário:", error)
    return NextResponse.json({ success: false, message: "Erro ao salvar perfil sedentário" }, { status: 500 })
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

    // Buscar perfil sedentário do usuário
    const profile = await SedentaryProfile.findOne({ userId })

    if (!profile) {
      return NextResponse.json({ success: false, message: "Perfil sedentário não encontrado" }, { status: 404 })
    }

    // Buscar também o plano da IA
    const aiPlan = await AIPlans.findOne({ userId, planType: "sedentary" })

    return NextResponse.json({ 
      success: true, 
      data: { 
        profile,
        aiProgram: aiPlan?.planContent || null
      } 
    }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil sedentário:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil sedentário" }, { status: 500 })
  }
}
