import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import RehabilitationProfile from "@/models/RehabilitationProfile"
import SedentaryProfile from "@/models/SedentaryProfile"
import TrainingDietProfile from "@/models/TrainingDietProfile"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar dados básicos do usuário
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar dados específicos do programa
    let programData = null

    if (user.program) {
      switch (user.program) {
        case "rehabilitation":
          programData = await RehabilitationProfile.findOne({ userId })
          break
        case "sedentary":
          programData = await SedentaryProfile.findOne({ userId })
          break
        case "training-diet":
          programData = await TrainingDietProfile.findOne({ userId })
          break
      }
    }

    // Combinar dados do usuário com dados do programa
    const userData = {
      ...user.toObject(),
      programData: programData ? programData.toObject() : null,
    }

    return NextResponse.json({ success: true, user: userData }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil do usuário" }, { status: 500 })
  }
}
