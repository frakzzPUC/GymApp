import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const equipment = searchParams.get('equipment') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Construir filtros
    const filters: any = {}

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { muscleGroups: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    if (category && category !== 'all') {
      filters.category = category
    }

    if (difficulty && difficulty !== 'all') {
      filters.difficulty = difficulty
    }

    if (equipment && equipment !== 'all') {
      filters.equipment = { $in: [equipment] }
    }

    // Buscar exercícios com paginação
    const skip = (page - 1) * limit
    const exercises = await Exercise.find(filters)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Contar total para paginação
    const total = await Exercise.countDocuments(filters)

    return NextResponse.json({
      success: true,
      data: {
        exercises,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar exercícios:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Endpoint para criar exercícios (para popular o banco)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const exercise = new Exercise(body)
    await exercise.save()

    return NextResponse.json({
      success: true,
      data: exercise
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar exercício:', error)
    return NextResponse.json({
      error: 'Erro ao criar exercício'
    }, { status: 500 })
  }
}