import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import RehabilitationProfile from "@/models/RehabilitationProfile"
import AIPlans from "@/models/AIPlans"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateRehabilitationPlan, type RehabilitationData } from "@/lib/gemini"

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
    const formData: RehabilitationData = body

    // Validação básica
    if (!formData.painAreas || !Array.isArray(formData.painAreas) || formData.painAreas.length === 0) {
      return NextResponse.json({ success: false, message: "Selecione pelo menos uma área de dor" }, { status: 400 })
    }

    if (!formData.age || !formData.gender || !formData.injuryType) {
      return NextResponse.json({ success: false, message: "Preencha todos os campos obrigatórios" }, { status: 400 })
    }

    // Gerar plano de reabilitação com IA
    console.log("Gerando plano de reabilitação personalizado...")
    const rehabilitationPlan = await generateRehabilitationPlan(formData)
    
    if (!rehabilitationPlan) {
      console.error("Falha na geração do plano de reabilitação pela IA")
      return NextResponse.json({ 
        success: false, 
        message: "Erro ao gerar plano de reabilitação. O serviço de IA pode estar sobrecarregado. Tente novamente em alguns minutos." 
      }, { status: 503 })
    }

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "rehabilitation" })

    // Verificar se já existe um perfil de reabilitação para este usuário
    let profile = await RehabilitationProfile.findOne({ userId })

    if (profile) {
      // Atualizar perfil existente (sem o rehabilitationPlan)
      Object.assign(profile, {
        ...formData,
        updatedAt: new Date()
      })
      await profile.save()
    } else {
      // Criar novo perfil (sem o rehabilitationPlan)
      profile = await RehabilitationProfile.create({
        userId,
        ...formData,
      })
    }

    // Salvar o plano de reabilitação na coleção AIPlans
    let aiPlan = await AIPlans.findOne({ userId })
    
    if (aiPlan) {
      // Atualizar plano existente
      aiPlan.rehabilitationPlan = rehabilitationPlan
      aiPlan.userProfile = { ...aiPlan.userProfile, ...formData }
      aiPlan.updatedAt = new Date()
      await aiPlan.save()
      console.log("Plano de reabilitação atualizado no AIPlans")
    } else {
      // Criar novo plano AI com campos opcionais para reabilitação
      const aiPlanData = {
        userId,
        workoutPlan: '',
        nutritionPlan: '',
        rehabilitationPlan,
        planType: 'ai-generated' as const,
        userProfile: {
          weight: 0,
          height: 0,
          primaryGoal: 'Reabilitação',
          activityLevel: 'low',
          experience: 'beginner',
          ...formData
        }
      }
      
      console.log("Criando novo AIPlans com dados:", JSON.stringify(aiPlanData, null, 2))
      aiPlan = await AIPlans.create(aiPlanData)
      console.log("Plano de reabilitação criado no AIPlans")
    }

    return NextResponse.json({ success: true, data: { ...profile.toObject(), rehabilitationPlan } }, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar perfil de reabilitação:", error)
    return NextResponse.json({ success: false, message: "Erro ao salvar perfil de reabilitação" }, { status: 500 })
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

    // Buscar perfil de reabilitação do usuário
    const profile = await RehabilitationProfile.findOne({ userId })

    if (!profile) {
      return NextResponse.json({ success: false, message: "Perfil de reabilitação não encontrado" }, { status: 404 })
    }

    // Buscar plano de reabilitação do AIPlans
    const aiPlan = await AIPlans.findOne({ userId })
    const rehabilitationPlan = aiPlan?.rehabilitationPlan || ""

    // Combinar dados do perfil com o plano de reabilitação
    const combinedData = {
      ...profile.toObject(),
      rehabilitationPlan
    }

    return NextResponse.json({ success: true, data: combinedData }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil de reabilitação:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil de reabilitação" }, { status: 500 })
  }
}
