import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

// Interface para a resposta da API-NINJAS
interface NinjaExercise {
  name: string
  type: string
  muscle: string
  equipment: string
  difficulty: string
  instructions: string
}

// Mapeamento de categorias
const categoryMapping: { [key: string]: string } = {
  'chest': 'Peito',
  'back': 'Costas',
  'legs': 'Pernas',
  'shoulders': 'Ombros',
  'biceps': 'Bíceps',
  'triceps': 'Tríceps',
  'abdominals': 'Core',
  'calves': 'Panturrilha',
  'forearms': 'Antebraços',
  'glutes': 'Glúteos',
  'hamstrings': 'Pernas',
  'lats': 'Costas',
  'middle_back': 'Costas',
  'lower_back': 'Costas',
  'neck': 'Pescoço',
  'quadriceps': 'Pernas',
  'traps': 'Costas',
  'cardio': 'Cardio'
}

// Mapeamento de equipamentos
const equipmentMapping: { [key: string]: string } = {
  'body_only': 'Peso corporal',
  'machine': 'Máquina',
  'other': 'Outros',
  'foam_roll': 'Rolo',
  'kettlebells': 'Kettlebell',
  'dumbbell': 'Halteres',
  'cable': 'Cabo',
  'barbell': 'Barra',
  'bands': 'Faixa elástica',
  'medicine_ball': 'Medicine ball',
  'exercise_ball': 'Bola suíça',
  'e_z_curl_bar': 'Barra W'
}

// Mapeamento de dificuldade
const difficultyMapping: { [key: string]: 'Iniciante' | 'Intermediário' | 'Avançado' } = {
  'beginner': 'Iniciante',
  'intermediate': 'Intermediário',
  'expert': 'Avançado'
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const muscle = searchParams.get('muscle') || 'chest'
    const difficulty = searchParams.get('difficulty') || ''
    const type = searchParams.get('type') || ''

    console.log(`Buscando exercícios para: ${muscle}`)

    // Construir URL da API-NINJAS
    const params = new URLSearchParams()
    if (muscle && muscle !== 'all') params.append('muscle', muscle)
    if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty)
    if (type && type !== 'all') params.append('type', type)

    const apiUrl = `https://api.api-ninjas.com/v1/exercises?${params.toString()}`
    
    // Fazer request para API-NINJAS
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY || 'YOUR_API_KEY_HERE'
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const apiExercises: NinjaExercise[] = await response.json()
    console.log(`Recebidos ${apiExercises.length} exercícios da API-NINJAS`)

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
          description: `Exercício de ${apiExercise.type} para ${categoryMapping[apiExercise.muscle] || apiExercise.muscle}.`,
          instructions: apiExercise.instructions ? apiExercise.instructions.split('. ').filter(i => i.length > 10) : [
            "Execute o movimento de forma controlada",
            "Mantenha a postura adequada",
            "Respire corretamente durante o exercício"
          ],
          category: categoryMapping[apiExercise.muscle] || 'Outros',
          muscleGroups: [categoryMapping[apiExercise.muscle] || apiExercise.muscle],
          equipment: [equipmentMapping[apiExercise.equipment] || 'Outros'],
          difficulty: difficultyMapping[apiExercise.difficulty] || 'Intermediário',
          imageUrl: '/placeholder.svg?height=300&width=400',
          tips: [
            "Aqueça adequadamente antes do exercício",
            "Mantenha a forma correta",
            "Não exagere na carga inicial"
          ],
          sets: "3-4 séries",
          reps: apiExercise.type === 'cardio' ? undefined : "8-15 repetições",
          duration: apiExercise.type === 'cardio' ? "20-45 segundos" : undefined,
          calories: Math.floor(Math.random() * 120) + 60
        }

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
      message: `${importedExercises.length} exercícios importados da API-NINJAS!`,
      data: {
        imported: importedExercises.length,
        total: apiExercises.length,
        muscle: muscle,
        exercises: importedExercises.map(ex => ({
          id: ex._id,
          name: ex.name,
          category: ex.category
        }))
      }
    })

  } catch (error) {
    console.error('Erro ao importar exercícios da API-NINJAS:', error)
    return NextResponse.json({
      error: 'Erro ao conectar com a API-NINJAS',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Endpoint para listar músculos disponíveis
export async function GET() {
  const muscles = [
    'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest',
    'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back',
    'neck', 'quadriceps', 'shoulders', 'triceps', 'traps'
  ]

  const difficulties = ['beginner', 'intermediate', 'expert']
  const types = ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman']

  return NextResponse.json({
    success: true,
    availableFilters: {
      muscles,
      difficulties,
      types
    },
    usage: 'POST /api/exercises/import-ninjas?muscle=chest&difficulty=beginner',
    note: 'API-NINJAS é gratuita (50k requests/mês) mas precisa de chave API'
  })
}