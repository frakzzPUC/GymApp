import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

const exercisesWithImages = [
  {
    name: "Flexão de Braço",
    description: "Exercício fundamental para fortalecer peito, ombros e tríceps",
    category: "Peito",
    muscleGroups: ["Peitoral", "Tríceps", "Deltoides"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-front.gif",
    instructions: [
      "Posicione-se em prancha com mãos alinhadas aos ombros",
      "Mantenha o corpo reto da cabeça aos pés",
      "Desça o corpo até o peito quase tocar o chão",
      "Empurre de volta à posição inicial",
      "Mantenha o core contraído durante todo movimento"
    ],
    sets: "3-4 séries",
    reps: "8-15 repetições",
    calories: 85,
    tips: [
      "Mantenha o corpo alinhado",
      "Controle a descida",
      "Respire corretamente"
    ]
  },
  {
    name: "Agachamento",
    description: "Exercício completo para fortalecer pernas e glúteos",
    category: "Pernas", 
    muscleGroups: ["Quadríceps", "Glúteos", "Isquiotibiais"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-squat-front.gif",
    instructions: [
      "Fique em pé com pés na largura dos ombros",
      "Desça como se fosse sentar em uma cadeira",
      "Mantenha o peso nos calcanhares",
      "Desça até coxas paralelas ao chão",
      "Retorne à posição inicial empurrando pelos calcanhares"
    ],
    sets: "3-4 séries",
    reps: "12-20 repetições", 
    calories: 95,
    tips: [
      "Mantenha joelhos alinhados",
      "Não curve as costas",
      "Desça controladamente"
    ]
  },
  {
    name: "Prancha",
    description: "Exercício isométrico para fortalecer o core",
    category: "Core",
    muscleGroups: ["Abdômen", "Core", "Lombar"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-plank-front.gif",
    instructions: [
      "Posicione-se em prancha com antebraços no chão",
      "Mantenha corpo reto da cabeça aos pés",
      "Cotovelos alinhados abaixo dos ombros",
      "Contraia abdômen e glúteos",
      "Mantenha a posição pelo tempo determinado"
    ],
    sets: "3-4 séries",
    duration: "30-60 segundos",
    calories: 60,
    tips: [
      "Não deixe quadril subir",
      "Respire normalmente",
      "Mantenha pescoço neutro"
    ]
  },
  {
    name: "Burpee",
    description: "Exercício completo que trabalha corpo inteiro",
    category: "Cardio",
    muscleGroups: ["Corpo todo", "Cardio", "Core"],
    equipment: ["Peso corporal"],
    difficulty: "Intermediário",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-burpee-front.gif",
    instructions: [
      "Comece em pé",
      "Agache e coloque mãos no chão",
      "Pule pés para trás ficando em prancha",
      "Faça uma flexão (opcional)",
      "Pule pés de volta ao agachamento",
      "Pule para cima com braços estendidos"
    ],
    sets: "3-4 séries",
    reps: "5-10 repetições",
    calories: 150,
    tips: [
      "Movimento fluido",
      "Mantenha forma correta",
      "Adapte intensidade"
    ]
  },
  {
    name: "Supino com Halteres",
    description: "Exercício clássico para desenvolvimento do peitoral",
    category: "Peito",
    muscleGroups: ["Peitoral", "Tríceps", "Deltoides"],
    equipment: ["Halteres", "Banco"],
    difficulty: "Intermediário",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bench-press-front.gif",
    instructions: [
      "Deite no banco com halteres nas mãos",
      "Braços estendidos acima do peito",
      "Desça os halteres controladamente",
      "Pare quando cotovelos ficarem na linha do corpo",
      "Empurre de volta à posição inicial"
    ],
    sets: "3-4 séries",
    reps: "8-12 repetições",
    calories: 120,
    tips: [
      "Controle total do movimento",
      "Não trave cotovelos",
      "Mantenha escápulas retraídas"
    ]
  },
  {
    name: "Rosca Direta",
    description: "Exercício isolado para bíceps",
    category: "Bíceps",
    muscleGroups: ["Bíceps"],
    equipment: ["Halteres"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bicep-curl-front.gif",
    instructions: [
      "Fique em pé com halteres nas mãos",
      "Braços ao lado do corpo",
      "Flexione cotovelos levantando os halteres",
      "Contraia bíceps no topo",
      "Desça controladamente"
    ],
    sets: "3-4 séries", 
    reps: "10-15 repetições",
    calories: 80,
    tips: [
      "Não balance o corpo",
      "Cotovelos fixos",
      "Movimento controlado"
    ]
  },
  {
    name: "Elevação Lateral",
    description: "Exercício para deltoides mediais",
    category: "Ombros",
    muscleGroups: ["Deltoides"],
    equipment: ["Halteres"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lateral-raise-front.gif",
    instructions: [
      "Fique em pé com halteres ao lado",
      "Eleve braços lateralmente",
      "Pare na altura dos ombros",
      "Desça controladamente",
      "Mantenha ligeira flexão nos cotovelos"
    ],
    sets: "3-4 séries",
    reps: "12-15 repetições",
    calories: 70,
    tips: [
      "Não use muito peso",
      "Movimento fluido",
      "Não eleve acima dos ombros"
    ]
  },
  {
    name: "Tríceps Testa",
    description: "Exercício isolado para tríceps",
    category: "Tríceps",
    muscleGroups: ["Tríceps"],
    equipment: ["Halteres", "Banco"],
    difficulty: "Intermediário",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lying-tricep-extension-front.gif",
    instructions: [
      "Deite no banco com halteres",
      "Braços estendidos acima do peito",
      "Flexione apenas cotovelos",
      "Desça halteres em direção à testa",
      "Estenda braços de volta"
    ],
    sets: "3-4 séries",
    reps: "10-12 repetições", 
    calories: 90,
    tips: [
      "Só cotovelos se movem",
      "Cuidado com a testa",
      "Movimento controlado"
    ]
  },
  {
    name: "Remada Curvada",
    description: "Exercício para fortalecer as costas",
    category: "Costas",
    muscleGroups: ["Grande dorsal", "Romboides", "Bíceps"],
    equipment: ["Halteres"],
    difficulty: "Intermediário",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-front.gif",
    instructions: [
      "Curve o tronco para frente",
      "Halteres pendurados",
      "Puxe cotovelos para trás",
      "Aproxime halteres do abdômen",
      "Desça controladamente"
    ],
    sets: "3-4 séries",
    reps: "8-12 repetições",
    calories: 110,
    tips: [
      "Mantenha costas retas",
      "Puxe com cotovelos",
      "Aperte escápulas"
    ]
  },
  {
    name: "Abdominal Crunch",
    description: "Exercício clássico para abdômen",
    category: "Core", 
    muscleGroups: ["Abdômen"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-crunch-front.gif",
    instructions: [
      "Deite com joelhos flexionados",
      "Mãos atrás da cabeça",
      "Eleve tronco contraindo abdômen",
      "Não force o pescoço",
      "Desça controladamente"
    ],
    sets: "3-4 séries",
    reps: "15-25 repetições",
    calories: 65,
    tips: [
      "Não puxe pescoço",
      "Contraia abdômen",
      "Movimento curto"
    ]
  },
  {
    name: "Agachamento Búlgaro",
    description: "Exercício unilateral para pernas",
    category: "Pernas",
    muscleGroups: ["Quadríceps", "Glúteos"],
    equipment: ["Banco", "Peso corporal"],
    difficulty: "Intermediário", 
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-bulgarian-split-squat-front.gif",
    instructions: [
      "Pé traseiro apoiado no banco",
      "Pé da frente bem à frente",
      "Desça flexionando joelho frontal",
      "Mantenha tronco ereto",
      "Empurre pelo calcanhar frontal"
    ],
    sets: "3-4 séries",
    reps: "8-12 por perna",
    calories: 105,
    tips: [
      "Equilíbrio é fundamental",
      "Peso na perna da frente",
      "Não incline para frente"
    ]
  },
  {
    name: "Mountain Climber",
    description: "Exercício dinâmico para cardio e core",
    category: "Cardio",
    muscleGroups: ["Core", "Cardio", "Ombros"],
    equipment: ["Peso corporal"],
    difficulty: "Intermediário",
    imageUrl: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-mountain-climber-front.gif",
    instructions: [
      "Comece em posição de prancha",
      "Traga joelho direito ao peito",
      "Retorne e traga joelho esquerdo",
      "Alterne rapidamente",
      "Mantenha core contraído"
    ],
    sets: "3-4 séries",
    duration: "30-45 segundos",
    calories: 130,
    tips: [
      "Movimento rápido",
      "Core sempre ativo",
      "Respiração ritmada"
    ]
  }
]

export async function POST() {
  try {
    await dbConnect()

    let addedCount = 0

    for (const exerciseData of exercisesWithImages) {
      // Verificar se já existe
      const existingExercise = await Exercise.findOne({ 
        name: { $regex: new RegExp(exerciseData.name, 'i') }
      })

      if (!existingExercise) {
        const newExercise = new Exercise(exerciseData)
        await newExercise.save()
        addedCount++
        console.log(`✅ Exercício adicionado: ${exerciseData.name}`)
      } else {
        console.log(`⚠️ Exercício já existe: ${exerciseData.name}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${addedCount} exercícios com IMAGENS adicionados com sucesso!`,
      data: {
        added: addedCount,
        total: exercisesWithImages.length,
        source: "Musclewiki (Gratuito)"
      }
    })

  } catch (error) {
    console.error('Erro ao popular exercícios com imagens:', error)
    return NextResponse.json({
      error: 'Erro ao adicionar exercícios',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST para popular exercícios com imagens GIF do Musclewiki',
    available: exercisesWithImages.length,
    source: "Musclewiki - Totalmente GRATUITO!"
  })
}