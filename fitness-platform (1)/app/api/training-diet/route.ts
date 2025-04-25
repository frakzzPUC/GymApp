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
    const { gender, weight, height, goal, fitnessLevel, daysPerWeek, timePerDay, dietType } = body

    // Validação básica
    if (!gender || !weight || !height || !goal || !fitnessLevel || !daysPerWeek || !timePerDay) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "training-diet" })

    // Verificar se já existe um perfil de treino+dieta para este usuário
    let profile = await TrainingDietProfile.findOne({ userId })

    if (profile) {
      // Atualizar perfil existente
      profile.gender = gender
      profile.weight = weight
      profile.height = height
      profile.goal = goal
      profile.fitnessLevel = fitnessLevel
      profile.daysPerWeek = daysPerWeek
      profile.timePerDay = timePerDay
      if (dietType) profile.dietType = dietType
      profile.updatedAt = new Date()
      await profile.save()
    } else {
      // Criar novo perfil
      profile = await TrainingDietProfile.create({
        userId,
        gender,
        weight,
        height,
        goal,
        fitnessLevel,
        daysPerWeek,
        timePerDay,
        dietType: dietType || "balanced",
      })
    }

    return NextResponse.json({ success: true, data: profile }, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar perfil de treino+dieta:", error)
    return NextResponse.json({ success: false, message: "Erro ao salvar perfil de treino+dieta" }, { status: 500 })
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
