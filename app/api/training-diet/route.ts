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

    console.log("Corpo da requisição:", body)

    // Se apenas dietType estiver presente, estamos atualizando apenas a dieta
    if (body.dietType && Object.keys(body).length === 1) {
      console.log("Atualizando apenas o tipo de dieta:", body.dietType)

      const profile = await TrainingDietProfile.findOne({ userId })

      if (!profile) {
        return NextResponse.json({ success: false, message: "Perfil não encontrado" }, { status: 404 })
      }

      profile.dietType = body.dietType
      profile.updatedAt = new Date()
      await profile.save()

      console.log("Tipo de dieta atualizado com sucesso")
      return NextResponse.json({ success: true, data: profile }, { status: 200 })
    }

    // Caso contrário, estamos criando/atualizando o perfil completo
    const { gender, weight, height, goal, fitnessLevel, daysPerWeek, timePerDay, dietType } = body

    // Validação básica para criação/atualização completa
    if (!gender || !weight || !height || !goal || !fitnessLevel || !daysPerWeek || !timePerDay) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    console.log("Atualizando programa do usuário para training-diet:", userId)

    // Atualizar o programa do usuário
    await User.findByIdAndUpdate(userId, { program: "training-diet" })

    // Verificar se já existe um perfil de treino+dieta para este usuário
    let profile = await TrainingDietProfile.findOne({ userId })

    if (profile) {
      console.log("Atualizando perfil existente")
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
      console.log("Criando novo perfil")
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
        // Adicionar treinos padrão
        workouts: [
          {
            name: "Treino Completo",
            description: "Treino completo para iniciantes",
            duration: "45 minutos",
            caloriesBurned: 300,
            completed: false,
            date: new Date(),
          },
          {
            name: "Treino de Força",
            description: "Foco em ganho de massa muscular",
            duration: "30 minutos",
            caloriesBurned: 250,
            completed: false,
            date: new Date(Date.now() + 86400000), // Amanhã
          },
        ],
        // Adicionar refeições padrão
        meals: [
          {
            name: "Café da Manhã",
            description: "Ovos mexidos, torrada integral e frutas",
            calories: 450,
            date: new Date(),
          },
          {
            name: "Almoço",
            description: "Frango grelhado, arroz integral e legumes",
            calories: 650,
            date: new Date(),
          },
        ],
        // Inicializar progresso
        progress: {
          caloriesGoal: goal === "lose-weight" ? 1800 : 2200,
          caloriesConsumed: 0,
          caloriesBurned: 0,
          weightChange: 0,
          macros: {
            protein: goal === "gain-muscle" ? 40 : 30,
            carbs: goal === "gain-muscle" ? 40 : 30,
            fat: goal === "gain-muscle" ? 20 : 40,
          },
        },
      })
    }

    console.log("Perfil salvo com sucesso:", profile._id)

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
