import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

interface ExerciseDBExercise {
  bodyPart: string
  equipment: string
  gifUrl: string
  id: string
  name: string
  target: string
  secondaryMuscles: string[]
  instructions: string[]
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Buscar exercícios que têm placeholder
    const exercisesWithPlaceholder = await Exercise.find({
      imageUrl: "/placeholder.svg?height=300&width=400"
    })

    console.log(`🔍 Encontrados ${exercisesWithPlaceholder.length} exercícios com placeholder`)

    let updatedCount = 0

    for (const exercise of exercisesWithPlaceholder) {
      try {
        // Tentar buscar o exercício correspondente na API
        let searchName = exercise.name.toLowerCase()
        
        // Remover acentos e caracteres especiais
        searchName = searchName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        
        // Mapear categorias para buscar na API
        const categoryToBodyPart: { [key: string]: string } = {
          'Peito': 'chest',
          'Costas': 'back',
          'Pernas': 'upper legs',
          'Ombros': 'shoulders',
          'Bíceps': 'upper arms',
          'Tríceps': 'upper arms',
          'Core': 'waist',
          'Cardio': 'cardio'
        }

        const bodyPart = categoryToBodyPart[exercise.category] || 'chest'
        
        console.log(`🔍 Buscando imagem para: ${exercise.name} (categoria: ${exercise.category} -> ${bodyPart})`)

        // Buscar na API
        const response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=100`,
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
          }
        )

        if (response.ok) {
          const apiExercises: ExerciseDBExercise[] = await response.json()
          
          console.log(`📊 Encontrados ${apiExercises.length} exercícios na API para ${bodyPart}`)
          
          // Múltiplas estratégias de busca
          let matchingExercise = null
          
          // 1. Busca por nome exato (ignorando case)
          matchingExercise = apiExercises.find(apiEx => 
            apiEx.name.toLowerCase() === searchName
          )
          
          // 2. Busca por palavras-chave principais
          if (!matchingExercise) {
            const keywords = searchName.split(' ').filter((word: string) => word.length > 3)
            matchingExercise = apiExercises.find(apiEx => {
              const apiName = apiEx.name.toLowerCase()
              return keywords.some((keyword: string) => apiName.includes(keyword))
            })
          }
          
          // 3. Busca por exercícios que contêm palavras do nome
          if (!matchingExercise) {
            matchingExercise = apiExercises.find(apiEx => {
              const apiName = apiEx.name.toLowerCase()
              const nameWords = searchName.split(' ')
              return nameWords.some((word: string) => word.length > 2 && apiName.includes(word))
            })
          }
          
          // 4. Se é um exercício com "barbell", procurar especificamente
          if (!matchingExercise && searchName.includes('barbell')) {
            matchingExercise = apiExercises.find(apiEx => 
              apiEx.name.toLowerCase().includes('barbell')
            )
          }

          if (matchingExercise && matchingExercise.gifUrl) {
            // Atualizar com a URL real
            await Exercise.findByIdAndUpdate(exercise._id, {
              imageUrl: matchingExercise.gifUrl
            })
            
            console.log(`✅ Atualizado: ${exercise.name} -> ${matchingExercise.name} -> ${matchingExercise.gifUrl}`)
            updatedCount++
          } else {
            console.log(`❌ Não encontrado: ${exercise.name} (tentado: ${searchName})`)
            // Mostrar algumas opções disponíveis para debug
            const samples = apiExercises.slice(0, 3).map(ex => ex.name).join(', ')
            console.log(`   📝 Exemplos disponíveis: ${samples}`)
          }
        } else {
          console.log(`❌ Erro na API para ${bodyPart}: ${response.status}`)
        }
        
        // Delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`Erro ao atualizar ${exercise.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} exercícios atualizados com imagens reais!`,
      data: {
        updated: updatedCount,
        total: exercisesWithPlaceholder.length
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar imagens:', error)
    return NextResponse.json({
      error: 'Erro ao atualizar imagens',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}