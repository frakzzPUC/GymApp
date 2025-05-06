import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import RehabilitationProfile from "@/models/RehabilitationProfile"
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

    // Buscar perfil de reabilitação do usuário
    const profile = await RehabilitationProfile.findOne({ userId })

    if (!profile) {
      return NextResponse.json({ success: false, message: "Perfil de reabilitação não encontrado" }, { status: 404 })
    }

    // Verificar as áreas de dor para personalizar os exercícios
    const painAreas = profile.painAreas || []
    const today = new Date()

    // Criar exercícios padrão com base nas áreas de dor
    const exercises = []

    if (painAreas.includes("lower-back")) {
      exercises.push({
        name: "Alongamento lombar",
        description: "Deite-se de costas, traga os joelhos ao peito e segure por 30 segundos",
        duration: "5 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Ponte",
        description: "Deite-se de costas, dobre os joelhos e levante o quadril, mantendo por 10 segundos",
        duration: "8 min",
        completed: false,
        date: today,
      })
    }

    if (painAreas.includes("neck")) {
      exercises.push({
        name: "Alongamento cervical",
        description: "Incline a cabeça para os lados e para frente, mantendo cada posição por 15 segundos",
        duration: "5 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Fortalecimento cervical",
        description: "Pressione a mão contra a testa e resista com o pescoço por 10 segundos",
        duration: "6 min",
        completed: false,
        date: today,
      })
    }

    if (painAreas.includes("shoulder")) {
      exercises.push({
        name: "Rotação de ombros",
        description: "Faça movimentos circulares com os ombros, 10 para frente e 10 para trás",
        duration: "4 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Alongamento de ombros",
        description: "Cruze um braço na frente do corpo e puxe com o outro braço, mantendo por 20 segundos",
        duration: "5 min",
        completed: false,
        date: today,
      })
    }

    if (painAreas.includes("knee")) {
      exercises.push({
        name: "Fortalecimento de quadríceps",
        description: "Sentado, estenda a perna e mantenha por 10 segundos, repita 10 vezes",
        duration: "7 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Alongamento de isquiotibiais",
        description: "Sentado, estenda a perna e tente tocar o pé, mantendo por 20 segundos",
        duration: "5 min",
        completed: false,
        date: today,
      })
    }

    if (painAreas.includes("hip")) {
      exercises.push({
        name: "Rotação de quadril",
        description: "Em pé, faça movimentos circulares com o quadril, 10 para cada lado",
        duration: "5 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Alongamento piriforme",
        description: "Sentado, cruze uma perna sobre a outra e gire o tronco, mantendo por 20 segundos",
        duration: "6 min",
        completed: false,
        date: today,
      })
    }

    if (painAreas.includes("wrist")) {
      exercises.push({
        name: "Flexão e extensão de punho",
        description: "Estenda o braço e flexione o punho para cima e para baixo, 10 vezes cada",
        duration: "4 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Rotação de punho",
        description: "Faça movimentos circulares com o punho, 10 para cada lado",
        duration: "3 min",
        completed: false,
        date: today,
      })
    }

    // Se não houver áreas de dor específicas, adicionar exercícios gerais
    if (exercises.length === 0) {
      exercises.push({
        name: "Alongamento geral",
        description: "Alongue todo o corpo, mantendo cada posição por 20 segundos",
        duration: "10 min",
        completed: false,
        date: today,
      })
      exercises.push({
        name: "Respiração e relaxamento",
        description: "Respire profundamente e relaxe os músculos, 10 respirações profundas",
        duration: "5 min",
        completed: false,
        date: today,
      })
    }

    // Atualizar o perfil com os exercícios
    profile.exercises = exercises
    await profile.save()

    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    console.error("Erro ao criar exercícios padrão:", error)
    return NextResponse.json({ success: false, message: "Erro ao criar exercícios padrão" }, { status: 500 })
  }
}
