import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import RehabilitationProfile from "@/models/RehabilitationProfile"
import SedentaryProfile from "@/models/SedentaryProfile"
import TrainingDietProfile from "@/models/TrainingDietProfile"
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
    const { activityId, programType } = body

    // Validação básica
    if (!activityId || !programType) {
      return NextResponse.json(
        { success: false, message: "ID da atividade e tipo de programa são obrigatórios" },
        { status: 400 }
      )
    }

    let profile
    let updated = false

    // Buscar o perfil correto com base no tipo de programa
    switch (programType) {
      case "rehabilitation":
        profile = await RehabilitationProfile.findOne({ userId })
        if (profile && profile.exercises) {
          // Encontrar e atualizar o exercício
          const exerciseIndex = profile.exercises.findIndex((ex: any) => ex._id.toString() === activityId)
          if (exerciseIndex !== -1) {
            profile.exercises[exerciseIndex].completed = true
            profile.progress.completedExercises = (profile.progress.completedExercises || 0) + 1
            await profile.save()
            updated = true
          }
        }
        break

      case "sedentary":
        profile = await SedentaryProfile.findOne({ userId })
        if (profile && profile.activities) {
          // Encontrar e atualizar a atividade
          const activityIndex = profile.activities.findIndex((act: any) => act._id.toString() === activityId)
          if (activityIndex !== -1) {
            profile.activities[activityIndex].completed = true
            profile.progress.weeklyActivity = (profile.progress.weeklyActivity || 0) + 
              (parseInt(profile.activities[activityIndex].duration) || 0) / 60
            await profile.save()
            updated = true
          }
        }
        break

      case "training-diet":
        profile = await TrainingDietProfile.findOne({ userId })
        if (profile && profile.workouts) {
          // Encontrar e atualizar o treino
          const workoutIndex = profile.workouts.findIndex((workout: any) => workout._id.toString() === activityId)
          if (workoutIndex !== -1) {
            profile.workouts[workoutIndex].completed = true
            profile.progress.caloriesBurned = (profile.progress.caloriesBurned || 0) + 
              (profile.workouts[workoutIndex].caloriesBurned || 0)
            await profile.save()
            updated = true
          }
        }
        break

      default:
        return NextResponse.json(
          { success: false, message: "Tipo de programa inválido" },
          { status: 400 }
        )
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Perfil não encontrado" },
        { status: 404 }
      )
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Atividade não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Atividade marcada como concluída com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao marcar atividade como concluída:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao marcar atividade como concluída" },
      { status: 500 }
    )
  }
}