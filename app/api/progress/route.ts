import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Progress, { BodyMetrics, WorkoutRecord } from "@/models/Progress"
import User from "@/models/User"
import TrainingDietProfile from "@/models/TrainingDietProfile"
import SedentaryProfile from "@/models/SedentaryProfile"
import RehabilitationProfile from "@/models/RehabilitationProfile"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    await dbConnect()

    // Buscar o usuário
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar ou criar progresso do usuário
    let progress = await Progress.findOne({ userId: user._id })
    
    if (!progress) {
      progress = new Progress({ 
        userId: user._id,
        streakData: {
          currentStreak: 0,
          longestStreak: 0,
          weeklyGoal: 3,
          monthlyCompletedDays: 0
        }
      })
      await progress.save()
    }

    // Atualizar estatísticas
    progress.calculateStats()
    progress.updateStreak()
    await progress.save()

    // Buscar dados do perfil do usuário baseado no programa
    let userProfile: any = {}
    
    if (user.program) {
      let profileData: any = null
      
      switch (user.program) {
        case 'training-diet':
          profileData = await TrainingDietProfile.findOne({ userId: user._id })
          break
        case 'sedentary':
          profileData = await SedentaryProfile.findOne({ userId: user._id })
          break
        case 'rehabilitation':
          profileData = await RehabilitationProfile.findOne({ userId: user._id })
          break
      }
      
      if (profileData) {
        // Calcular idade baseada na data de nascimento
        const birthdate = new Date(user.birthdate)
        const today = new Date()
        const age = today.getFullYear() - birthdate.getFullYear() - 
          (today.getMonth() < birthdate.getMonth() || 
           (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()) ? 1 : 0)

        userProfile = {
          weight: profileData.weight,
          height: profileData.height,
          gender: profileData.gender,
          age: age,
          program: user.program
        }
      }
    }

    // Preparar dados para o frontend
    const responseData = {
      stats: progress.stats,
      streakData: progress.streakData,
      goals: progress.goals,
      recentMetrics: progress.bodyMetrics
        .sort((a: BodyMetrics, b: BodyMetrics) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
        .slice(0, 10), // Últimas 10 medições
      recentWorkouts: progress.workoutHistory
        .sort((a: WorkoutRecord, b: WorkoutRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20), // Últimos 20 treinos
      
      // Dados do perfil do usuário
      userProfile: userProfile,
      
      // Dados para gráficos (últimos 3 meses)
      chartData: {
        weight: progress.bodyMetrics
          .filter((m: BodyMetrics) => m.weight && new Date(m.recordedAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
          .map((m: BodyMetrics) => ({
            date: m.recordedAt,
            value: m.weight
          }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        
        bodyFat: progress.bodyMetrics
          .filter((m: BodyMetrics) => m.bodyFat && new Date(m.recordedAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
          .map((m: BodyMetrics) => ({
            date: m.recordedAt,
            value: m.bodyFat
          }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        
        workoutFrequency: getWorkoutFrequencyData(progress.workoutHistory)
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao buscar progresso:", error)
    return NextResponse.json({
      error: "Erro interno do servidor"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    await dbConnect()

    // Buscar o usuário
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar ou criar progresso
    let progress = await Progress.findOne({ userId: user._id })
    if (!progress) {
      progress = new Progress({ userId: user._id })
    }

    let result: any = null

    switch (type) {
      case 'workout':
        // Adicionar treino
        result = progress.addWorkout(data)
        break

      case 'metrics':
        // Adicionar métricas corporais
        result = progress.addBodyMetrics(data)
        break

      case 'goal':
        // Atualizar metas
        progress.goals = { ...progress.goals, ...data }
        result = progress.goals
        break

      case 'streak-goal':
        // Atualizar meta de streak
        progress.streakData.weeklyGoal = data.weeklyGoal
        result = progress.streakData
        break

      default:
        return NextResponse.json({ error: "Tipo de dados inválido" }, { status: 400 })
    }

    await progress.save()

    return NextResponse.json({
      success: true,
      message: "Dados salvos com sucesso",
      data: result
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao salvar progresso:", error)
    return NextResponse.json({
      error: "Erro interno do servidor"
    }, { status: 500 })
  }
}

// Função auxiliar para gerar dados de frequência de treinos
function getWorkoutFrequencyData(workoutHistory: WorkoutRecord[]) {
  const last30Days = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const workoutsOnDay = workoutHistory.filter((workout: WorkoutRecord) => {
      const workoutDate = new Date(workout.date)
      workoutDate.setHours(0, 0, 0, 0)
      return workoutDate.getTime() === date.getTime() && workout.completed
    }).length
    
    last30Days.push({
      date: date.toISOString().split('T')[0],
      workouts: workoutsOnDay,
      hasWorkout: workoutsOnDay > 0
    })
  }
  
  return last30Days
}