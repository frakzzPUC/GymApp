import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import RehabilitationProfile from "@/models/RehabilitationProfile"
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
    const { painAreas } = body

    // Validação básica
    if (!painAreas || !Array.isArray(painAreas) || painAreas.length === 0) {
      return NextResponse.json({ success: false, message: "Selecione pelo menos uma área de dor" }, { status: 400 })
    }

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "rehabilitation" })

    // Verificar se já existe um perfil de reabilitação para este usuário
    let profile = await RehabilitationProfile.findOne({ userId })

    if (profile) {
      // Atualizar perfil existente
      profile.painAreas = painAreas
      profile.updatedAt = new Date()
      await profile.save()
    } else {
      // Criar novo perfil
      profile = await RehabilitationProfile.create({
        userId,
        painAreas,
      })
    }

    return NextResponse.json({ success: true, data: profile }, { status: 201 })
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

    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil de reabilitação:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil de reabilitação" }, { status: 500 })
  }
}
