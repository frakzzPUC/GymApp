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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const { codigo } = await params
    const { fotoBase64 } = await request.json()

    if (!fotoBase64) {
      return NextResponse.json({ error: 'Foto é obrigatória' }, { status: 400 })
    }

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

    // Verificar se já fez check-in hoje
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const checkinExistente = challenge.checkins.find(
      (c: any) => c.userId === user._id.toString() && 
      c.data >= hoje && c.data < amanha
    )

    if (checkinExistente) {
      return NextResponse.json({ error: 'Você já fez check-in hoje' }, { status: 400 })
    }

    // Adicionar check-in
    challenge.checkins.push({
      userId: user._id.toString(),
      data: new Date(),
      foto: fotoBase64,
      points: 1
    })

    await challenge.save()

    return NextResponse.json({ 
      success: true,
      message: 'Check-in realizado com sucesso! +1 ponto',
      pontos: 1
    })

  } catch (error) {
    console.error('Erro ao fazer check-in:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}