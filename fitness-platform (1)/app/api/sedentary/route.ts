import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import SedentaryProfile from "@/models/SedentaryProfile"
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
    const { gender, weight, height, daysPerWeek, timePerDay } = body

    // Validação básica
    if (!gender || !weight || !height || !daysPerWeek || !timePerDay) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "sedentary" })

    // Verificar se já existe um perfil sedentário para este usuário
    let profile = await SedentaryProfile.findOne({ userId })

    if (profile) {
      // Atualizar perfil existente
      profile.gender = gender
      profile.weight = weight
      profile.height = height
      profile.daysPerWeek = daysPerWeek
      profile.timePerDay = timePerDay
      profile.updatedAt = new Date()
      await profile.save()
    } else {
      // Criar novo perfil
      profile = await SedentaryProfile.create({
        userId,
        gender,
        weight,
        height,
        daysPerWeek,
        timePerDay,
      })
    }

    return NextResponse.json({ success: true, data: profile }, { status: 201 })
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

    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil sedentário:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil sedentário" }, { status: 500 })
  }
}
