import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

// Interface para a resposta da ExerciseDB API
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

// Mapeamento de categorias
const categoryMapping: { [key: string]: string } = {
  'chest': 'Peito',
  'back': 'Costas',
  'upper legs': 'Pernas',
  'lower legs': 'Pernas',
  'shoulders': 'Ombros',
  'upper arms': 'Bíceps',
  'lower arms': 'Antebraços',
  'waist': 'Core',
  'cardio': 'Cardio',
  'neck': 'Pescoço'
}

// Mapeamento de equipamentos
const equipmentMapping: { [key: string]: string } = {
  'body weight': 'Peso corporal',
  'barbell': 'Barra',
  'dumbbell': 'Halteres',
  'cable': 'Máquina de cabo',
  'machine': 'Máquina',
  'resistance band': 'Faixa elástica',
  'kettlebell': 'Kettlebell',
  'assisted': 'Assistido',
  'medicine ball': 'Medicine ball',
  'stability ball': 'Bola suíça',
  'roller': 'Rolo',
  'rope': 'Corda',
  'skierg machine': 'Máquina de ski',
  'hammer': 'Martelo',
  'lever machine': 'Máquina alavanca',
  'olympic barbell': 'Barra olímpica',
  'upper body ergometer': 'Ergômetro',
  'bosu ball': 'Bosu ball',
  'ez barbell': 'Barra W',
  'tire': 'Pneu',
  'trap bar': 'Barra hexagonal',
  'wheel roller': 'Roda abdominal'
}

// Mapeamento de músculos
const muscleMapping: { [key: string]: string } = {
  'pectorals': 'Peitoral',
  'lats': 'Grande dorsal',
  'middle back': 'Romboides',
  'lower back': 'Lombar',
  'traps': 'Trapézio',
  'quads': 'Quadríceps',
  'hamstrings': 'Isquiotibiais',
  'glutes': 'Glúteos',
  'calves': 'Panturrilha',
  'biceps': 'Bíceps',
  'triceps': 'Tríceps',
  'forearms': 'Antebraços',
  'delts': 'Deltoides',
  'abs': 'Abdômen',
  'adductors': 'Adutores',
  'abductors': 'Abdutores',
  'cardiovascular system': 'Sistema cardiovascular',
  'spine': 'Coluna',
  'upper back': 'Parte superior das costas'
}

function mapDifficulty(equipment: string, bodyPart: string): 'Iniciante' | 'Intermediário' | 'Avançado' {
  if (equipment === 'body weight') return 'Iniciante'
  if (equipment.includes('barbell') || equipment.includes('machine')) return 'Intermediário'
  if (bodyPart === 'cardio') return 'Iniciante'
  return 'Intermediário'
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bodyPart = searchParams.get('bodyPart') || 'chest'
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log(`Buscando exercícios para: ${bodyPart}`)

    // Fazer request para ExerciseDB API
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=${limit}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'SUA_CHAVE_AQUI',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const apiExercises: ExerciseDBExercise[] = await response.json()
    console.log(`Recebidos ${apiExercises.length} exercícios da API`)

    // Conectar ao banco
    await dbConnect()

    const importedExercises = []

    for (const apiExercise of apiExercises) {
      try {
        // Verificar se já existe
        const existingExercise = await Exercise.findOne({ 
          name: { $regex: new RegExp(apiExercise.name, 'i') }
        })

        if (existingExercise) {
          console.log(`Exercício já existe: ${apiExercise.name}`)
          continue
        }

        // Mapear dados da API para nosso schema
        const mappedExercise = {
          name: apiExercise.name.charAt(0).toUpperCase() + apiExercise.name.slice(1),
          description: `Exercício para ${muscleMapping[apiExercise.target] || apiExercise.target} usando ${equipmentMapping[apiExercise.equipment] || apiExercise.equipment}.`,
          instructions: apiExercise.instructions,
          category: categoryMapping[apiExercise.bodyPart] || 'Outros',
          muscleGroups: [
            muscleMapping[apiExercise.target] || apiExercise.target,
            ...apiExercise.secondaryMuscles.map(muscle => muscleMapping[muscle] || muscle)
          ].filter((muscle, index, arr) => arr.indexOf(muscle) === index), // Remove duplicatas
          equipment: [equipmentMapping[apiExercise.equipment] || apiExercise.equipment],
          difficulty: mapDifficulty(apiExercise.equipment, apiExercise.bodyPart),
          imageUrl: apiExercise.gifUrl, // 🔥 USAR A URL REAL DO GIF!
          tips: [
            "Mantenha a forma adequada durante todo o movimento",
            "Controle a velocidade de execução",
            "Respire adequadamente durante o exercício"
          ],
          sets: "3-4 séries",
          reps: apiExercise.bodyPart === 'cardio' ? undefined : "8-15 repetições",
          duration: apiExercise.bodyPart === 'cardio' ? "30-60 segundos" : undefined,
          calories: Math.floor(Math.random() * 100) + 50 // Estimativa
        }

        console.log(`🎯 Salvando exercício: ${mappedExercise.name}`)
        console.log(`🖼️ URL da imagem: ${mappedExercise.imageUrl}`)

        // Salvar no banco
        const newExercise = new Exercise(mappedExercise)
        await newExercise.save()
        importedExercises.push(newExercise)

        console.log(`Exercício importado: ${mappedExercise.name}`)

      } catch (error) {
        console.error(`Erro ao importar exercício ${apiExercise.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${importedExercises.length} exercícios importados com sucesso!`,
      data: {
        imported: importedExercises.length,
        total: apiExercises.length,
        bodyPart: bodyPart,
        exercises: importedExercises.map(ex => ({
          id: ex._id,
          name: ex.name,
          category: ex.category
        }))
      }
    })

  } catch (error) {
    console.error('Erro ao importar exercícios da API:', error)
    return NextResponse.json({
      error: 'Erro ao conectar com a API externa',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Endpoint para listar partes do corpo disponíveis
export async function GET() {
  const bodyParts = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs',
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ]

  return NextResponse.json({
    success: true,
    bodyParts: bodyParts,
    message: 'Use POST /api/exercises/import?bodyPart=chest&limit=20 para importar exercícios'
  })
}