import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Exercise from "@/models/Exercise"

const exercisesData = [
  {
    name: "Supino Reto",
    description: "Exercício clássico para desenvolvimento do peitoral maior, ombros e tríceps.",
    instructions: [
      "Deite-se no banco com os pés apoiados no chão",
      "Segure a barra com pegada ligeiramente mais larga que os ombros",
      "Retire a barra do suporte e posicione sobre o peito",
      "Abaixe a barra controladamente até tocar o peito",
      "Empurre a barra de volta à posição inicial"
    ],
    category: "Peito",
    muscleGroups: ["Peitoral maior", "Ombros", "Tríceps"],
    equipment: ["Barra", "Banco", "Anilhas"],
    difficulty: "Intermediário",
    tips: [
      "Mantenha os ombros contraídos",
      "Não rebata a barra no peito",
      "Controle a descida"
    ],
    sets: "3-4 séries",
    reps: "8-12 repetições",
    calories: 150
  },
  {
    name: "Agachamento Livre",
    description: "Movimento fundamental para fortalecimento de pernas e glúteos.",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Mantenha o core contraído e peito erguido",
      "Flexione os joelhos e quadris simultaneamente",
      "Desça até as coxas ficarem paralelas ao chão",
      "Retorne à posição inicial empurrando pelos calcanhares"
    ],
    category: "Pernas",
    muscleGroups: ["Quadríceps", "Glúteos", "Isquiotibiais"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    tips: [
      "Mantenha os joelhos alinhados com os pés",
      "Não curve as costas",
      "Distribua o peso nos calcanhares"
    ],
    sets: "3-5 séries",
    reps: "15-20 repetições",
    calories: 120
  },
  {
    name: "Puxada Alta",
    description: "Excelente exercício para desenvolver a largura das costas.",
    instructions: [
      "Sente-se na máquina com os joelhos fixos",
      "Segure a barra com pegada larga",
      "Incline ligeiramente o tronco para trás",
      "Puxe a barra em direção ao peito superior",
      "Retorne controladamente à posição inicial"
    ],
    category: "Costas",
    muscleGroups: ["Grande dorsal", "Romboides", "Bíceps"],
    equipment: ["Máquina de puxada"],
    difficulty: "Intermediário",
    tips: [
      "Use principalmente as costas, não os braços",
      "Contraia as escápulas",
      "Não balance o corpo"
    ],
    sets: "3-4 séries",
    reps: "10-15 repetições",
    calories: 130
  },
  {
    name: "Burpee",
    description: "Exercício completo que trabalha corpo todo e melhora condicionamento.",
    instructions: [
      "Comece em pé",
      "Agache e coloque as mãos no chão",
      "Salte com os pés para trás em posição de prancha",
      "Faça uma flexão (opcional)",
      "Salte com os pés de volta ao agachamento",
      "Salte para cima com os braços estendidos"
    ],
    category: "Cardio",
    muscleGroups: ["Corpo todo"],
    equipment: ["Peso corporal"],
    difficulty: "Avançado",
    tips: [
      "Mantenha o core contraído",
      "Controle a descida",
      "Mantenha ritmo constante"
    ],
    sets: "3-5 séries",
    reps: "10-15 repetições",
    calories: 200
  },
  {
    name: "Desenvolvimento com Halteres",
    description: "Exercício fundamental para desenvolvimento dos deltoides.",
    instructions: [
      "Sente-se com as costas apoiadas",
      "Segure um halter em cada mão na altura dos ombros",
      "Empurre os halteres para cima simultaneamente",
      "Estenda os braços completamente",
      "Retorne controladamente à posição inicial"
    ],
    category: "Ombros",
    muscleGroups: ["Deltoides", "Tríceps"],
    equipment: ["Halteres", "Banco"],
    difficulty: "Intermediário",
    tips: [
      "Não arqueie as costas",
      "Controle o movimento",
      "Não trave os cotovelos"
    ],
    sets: "3-4 séries",
    reps: "10-12 repetições",
    calories: 110
  },
  {
    name: "Prancha",
    description: "Exercício isométrico excelente para fortalecimento do core.",
    instructions: [
      "Deite-se de bruços no chão",
      "Apoie-se nos antebraços e pontas dos pés",
      "Mantenha o corpo em linha reta",
      "Contraia o abdômen e glúteos",
      "Mantenha a posição pelo tempo determinado"
    ],
    category: "Core",
    muscleGroups: ["Abdômen", "Core", "Glúteos"],
    equipment: ["Peso corporal"],
    difficulty: "Iniciante",
    tips: [
      "Não deixe o quadril subir ou descer",
      "Respire normalmente",
      "Mantenha o pescoço neutro"
    ],
    sets: "3-4 séries",
    duration: "30-60 segundos",
    calories: 80
  },
  {
    name: "Rosca Direta",
    description: "Exercício clássico para desenvolvimento dos bíceps.",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure a barra com pegada supinada",
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Flexione os braços levando a barra ao peito",
      "Retorne controladamente à posição inicial"
    ],
    category: "Bíceps",
    muscleGroups: ["Bíceps", "Antebraços"],
    equipment: ["Barra", "Anilhas"],
    difficulty: "Iniciante",
    tips: [
      "Não balance o corpo",
      "Mantenha os cotovelos fixos",
      "Controle a descida"
    ],
    sets: "3-4 séries",
    reps: "10-15 repetições",
    calories: 90
  },
  {
    name: "Tríceps Pulley",
    description: "Exercício eficaz para isolamento dos tríceps.",
    instructions: [
      "Fique em pé de frente para a máquina",
      "Segure a corda ou barra com pegada pronada",
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Estenda os braços empurrando para baixo",
      "Retorne controladamente à posição inicial"
    ],
    category: "Tríceps",
    muscleGroups: ["Tríceps"],
    equipment: ["Máquina de cabo", "Corda ou barra"],
    difficulty: "Iniciante",
    tips: [
      "Mantenha os cotovelos fixos",
      "Contraia os tríceps no final",
      "Não use o corpo para ajudar"
    ],
    sets: "3-4 séries",
    reps: "12-15 repetições",
    calories: 85
  },
  {
    name: "Agachamento Búlgaro",
    description: "Variação unilateral do agachamento que trabalha equilíbrio e força.",
    instructions: [
      "Fique de pé de costas para um banco",
      "Coloque um pé sobre o banco atrás de você",
      "Mantenha o tronco ereto",
      "Flexione a perna da frente descendo o quadril",
      "Retorne à posição inicial"
    ],
    category: "Pernas",
    muscleGroups: ["Quadríceps", "Glúteos", "Isquiotibiais"],
    equipment: ["Banco"],
    difficulty: "Intermediário",
    tips: [
      "A maior parte do peso na perna da frente",
      "Não apoie muito no pé de trás",
      "Mantenha o equilíbrio"
    ],
    sets: "3 séries",
    reps: "10-12 repetições cada perna",
    calories: 140
  },
  {
    name: "Elevação Lateral",
    description: "Exercício de isolamento para os deltoides laterais.",
    instructions: [
      "Fique em pé com um halter em cada mão",
      "Mantenha os braços ligeiramente flexionados",
      "Eleve os braços lateralmente até a altura dos ombros",
      "Pause no topo do movimento",
      "Retorne controladamente à posição inicial"
    ],
    category: "Ombros",
    muscleGroups: ["Deltoides laterais"],
    equipment: ["Halteres"],
    difficulty: "Iniciante",
    tips: [
      "Use peso adequado",
      "Não eleve acima dos ombros",
      "Controle o movimento"
    ],
    sets: "3-4 séries",
    reps: "12-15 repetições",
    calories: 75
  }
]

export async function POST() {
  try {
    await dbConnect()

    // Limpar exercícios existentes (opcional)
    await Exercise.deleteMany({})

    // Inserir novos exercícios
    const createdExercises = await Exercise.insertMany(exercisesData)

    return NextResponse.json({
      success: true,
      message: `${createdExercises.length} exercícios criados com sucesso!`,
      data: createdExercises
    })

  } catch (error) {
    console.error('Erro ao popular exercícios:', error)
    return NextResponse.json({
      error: 'Erro ao popular banco de exercícios'
    }, { status: 500 })
  }
}