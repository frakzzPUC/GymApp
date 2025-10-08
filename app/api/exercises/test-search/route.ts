import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseName = searchParams.get('name') || 'barbell bench press'
    
    console.log(`🔍 Testando busca para: ${exerciseName}`)

    // Buscar na API
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/chest?limit=20`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const apiExercises = await response.json()
    
    console.log(`📊 Encontrados ${apiExercises.length} exercícios`)
    
    // Mostrar todos os nomes disponíveis
    const exerciseNames = apiExercises.map((ex: any) => ex.name).slice(0, 10)
    
    return NextResponse.json({
      success: true,
      searchTerm: exerciseName,
      availableExercises: exerciseNames,
      total: apiExercises.length,
      firstExercise: apiExercises[0]
    })

  } catch (error) {
    console.error('Erro ao testar API:', error)
    return NextResponse.json({
      error: 'Erro ao testar API',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}