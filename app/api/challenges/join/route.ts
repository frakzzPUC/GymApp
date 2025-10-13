import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const { codigo } = await request.json()

    if (!codigo) {
      return NextResponse.json({ error: 'Código do desafio é obrigatório' }, { status: 400 })
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

    // Verificar se já é participante
    const jaParticipante = challenge.participantes.some(
      (p: any) => p.userId === user._id.toString()
    )

    if (jaParticipante) {
      return NextResponse.json({ error: 'Você já participa deste desafio' }, { status: 400 })
    }

    // Adicionar como participante
    challenge.participantes.push({
      userId: user._id.toString(),
      nome: user.name,
      fotoPerfil: user.fotoPerfil || '',
      pontos: 0,
      joinedAt: new Date()
    })

    await challenge.save()

    return NextResponse.json({ 
      success: true,
      message: 'Você entrou no desafio com sucesso!',
      challenge: {
        codigo: challenge.codigo,
        nome: challenge.nome
      }
    })

  } catch (error) {
    console.error('Erro ao entrar no desafio:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}