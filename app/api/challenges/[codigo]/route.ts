import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'
import User from '@/models/User'

interface RouteParams {
  params: {
    codigo: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const { codigo } = await params

    // Buscar o desafio
    const challenge = await Challenge.findOne({ codigo: codigo.toUpperCase(), ativo: true })
    if (!challenge) {
      return NextResponse.json({ error: 'Desafio não encontrado' }, { status: 404 })
    }

    // Buscar dados do usuário
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se é participante
    const isParticipante = challenge.participantes.some(
      (p: any) => p.userId === user._id.toString()
    )

    if (!isParticipante) {
      return NextResponse.json({ error: 'Você não participa deste desafio' }, { status: 403 })
    }

    // Calcular pontos atualizados para cada participante
    const participantesComPontos = challenge.participantes.map((p: any) => {
      const pontosCheckins = challenge.checkins.filter(
        (c: any) => c.userId === p.userId
      ).reduce((total: number, checkin: any) => total + checkin.points, 0)
      
      return {
        ...p.toObject(),
        pontos: pontosCheckins
      }
    }).sort((a: any, b: any) => b.pontos - a.pontos) // Ordenar por pontos decrescente

    // Verificar se já fez check-in hoje
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const checkinHoje = challenge.checkins.find(
      (c: any) => c.userId === user._id.toString() && 
      c.data >= hoje && c.data < amanha
    )

    // Mapear check-ins com dados dos usuários para o feed
    const checkinsComUsuarios = challenge.checkins.map((checkin: any) => {
      const participante = challenge.participantes.find(
        (p: any) => p.userId === checkin.userId
      )
      return {
        userId: checkin.userId,
        userName: participante?.nome || 'Usuário',
        userPhoto: participante?.fotoPerfil,
        foto: checkin.foto,
        data: checkin.data,
        points: checkin.points
      }
    })

    return NextResponse.json({ 
      success: true,
      challenge: {
        codigo: challenge.codigo,
        nome: challenge.nome,
        descricao: challenge.descricao,
        admin: challenge.admin,
        participantes: participantesComPontos,
        checkins: checkinsComUsuarios,
        checkinHoje: !!checkinHoje,
        criadoEm: challenge.criadoEm,
        isAdmin: challenge.admin === user._id.toString()
      }
    })

  } catch (error) {
    console.error('Erro ao buscar detalhes do desafio:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}