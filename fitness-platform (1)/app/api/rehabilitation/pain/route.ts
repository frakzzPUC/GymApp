import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import RehabilitationProfile from "@/models/RehabilitationProfile"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Interface para o tipo de exercício
interface Exercise {
  _id?: string
  name: string
  description: string
  duration: string
  completed: boolean
  date: Date
}

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
    const { painLevel } = body

    // Validação básica
    if (painLevel === undefined || painLevel < 1 || painLevel > 10) {
      return NextResponse.json(
        { success: false, message: "Nível de dor deve ser um número entre 1 e 10" },
        { status: 400 },
      )
    }

    // Buscar perfil de reabilitação do usuário
    const profile = await RehabilitationProfile.findOne({ userId })

    if (!profile) {
      return NextResponse.json({ success: false, message: "Perfil de reabilitação não encontrado" }, { status: 404 })
    }

    // Atualizar o nível de dor atual
    profile.progress.currentPainLevel = painLevel

    // Incrementar o contador de exercícios completados
    profile.progress.completedExercises = (profile.progress.completedExercises || 0) + 1

    await profile.save()

    // Criar novos exercícios para o próximo dia
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Copiar os exercícios atuais, mas com a data de amanhã e marcados como não concluídos
    if (profile.exercises && profile.exercises.length > 0) {
      const newExercises = profile.exercises
        .map((ex: Exercise) => {
          // Manter apenas os exercícios de hoje para criar novos para amanhã
          const exDate = new Date(ex.date)
          const today = new Date()

          if (
            exDate.getDate() === today.getDate() &&
            exDate.getMonth() === today.getMonth() &&
            exDate.getFullYear() === today.getFullYear()
          ) {
            return {
              name: ex.name,
              description: ex.description,
              duration: ex.duration,
              completed: false,
              date: tomorrow,
            }
          }
          return null
        })
        .filter((ex: Exercise | null) => ex !== null)

      // Adicionar os novos exercícios ao perfil
      profile.exercises = [...profile.exercises, ...newExercises]
      await profile.save()
    }

    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar nível de dor:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar nível de dor" }, { status: 500 })
  }
}
