import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'
import User from '@/models/User'

// Função para gerar código único
function generateChallengeCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// POST: Criar novo desafio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const { nome, descricao } = await request.json()

    // Buscar dados do usuário
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    console.log('Dados do usuário:', { id: user._id, name: user.name, email: user.email })

    // Verificar se o usuário tem nome
    if (!user.name) {
      return NextResponse.json({ error: 'Nome do usuário não encontrado' }, { status: 400 })
    }

    // Gerar código único
    let codigo = generateChallengeCode()
    let existingChallenge = await Challenge.findOne({ codigo })
    
    // Garantir que o código seja único
    while (existingChallenge) {
      codigo = generateChallengeCode()
      existingChallenge = await Challenge.findOne({ codigo })
    }

    // Criar o desafio
    const challenge = new Challenge({
      codigo,
      nome,
      descricao,
      admin: user._id.toString(),
      participantes: [{
        userId: user._id.toString(),
        nome: user.name,
        fotoPerfil: user.fotoPerfil || '',
        pontos: 0,
        joinedAt: new Date()
      }]
    })

    await challenge.save()

    return NextResponse.json({ 
      success: true, 
      challenge: {
        codigo: challenge.codigo,
        nome: challenge.nome,
        admin: challenge.admin
      }
    })

  } catch (error) {
    console.error('Erro ao criar desafio:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// GET: Buscar desafios do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar desafios onde o usuário é participante
    const challenges = await Challenge.find({
      'participantes.userId': user._id.toString(),
      ativo: true
    }).select('codigo nome descricao admin participantes criadoEm')

    return NextResponse.json({ success: true, challenges })

  } catch (error) {
    console.error('Erro ao buscar desafios:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}