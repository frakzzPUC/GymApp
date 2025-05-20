// Tipos de exercícios para cada programa
export interface Exercise {
    name: string;
    description: string;
    duration: string;
    caloriesBurned?: number;
  }
  
  // Planos de reabilitação por área de dor
  export const rehabilitationExercises: Record<string, Exercise[]> = {
    "lower-back": [
      {
        name: "Alongamento lombar deitado",
        description: "Deite-se de costas e traga os joelhos ao peito, segurando por 30 segundos",
        duration: "5 min"
      },
      {
        name: "Ponte glútea",
        description: "Deite-se de costas, pés apoiados, e levante o quadril, mantendo por 10 segundos",
        duration: "8 min"
      },
      {
        name: "Gato-vaca",
        description: "De quatro, alterne entre arquear e curvar a coluna, respirando profundamente",
        duration: "5 min"
      },
      {
        name: "Rotação da coluna",
        description: "Deitado de costas, gire os joelhos para os lados mantendo os ombros no chão",
        duration: "6 min"
      }
    ],
    "neck": [
      {
        name: "Alongamento cervical",
        description: "Incline a cabeça para os lados e para frente, segurando cada posição por 30 segundos",
        duration: "5 min"
      },
      {
        name: "Fortalecimento isométrico",
        description: "Pressione a mão contra a testa e laterais da cabeça, resistindo ao movimento",
        duration: "6 min"
      },
      {
        name: "Retração do pescoço",
        description: "Puxe o queixo para trás, criando um 'pescoço duplo', mantendo por 10 segundos",
        duration: "4 min"
      },
      {
        name: "Rotação controlada",
        description: "Gire a cabeça lentamente para os lados, mantendo uma boa postura",
        duration: "5 min"
      }
    ],
    "shoulder": [
      {
        name: "Pendular de ombro",
        description: "Incline-se para frente e deixe o braço balançar suavemente em círculos",
        duration: "5 min"
      },
      {
        name: "Alongamento posterior",
        description: "Cruze um braço na frente do corpo e puxe-o em direção ao peito",
        duration: "4 min"
      },
      {
        name: "Fortalecimento com banda",
        description: "Use uma banda elástica para rotação externa e interna do ombro",
        duration: "8 min"
      },
      {
        name: "Elevação controlada",
        description: "Levante os braços lentamente para frente e para os lados, sem peso",
        duration: "6 min"
      }
    ],
    "knee": [
      {
        name: "Extensão sentada",
        description: "Sentado, estenda o joelho completamente e mantenha por 10 segundos",
        duration: "6 min"
      },
      {
        name: "Mini-agachamento",
        description: "Faça um agachamento parcial, descendo apenas 1/4 do movimento completo",
        duration: "7 min"
      },
      {
        name: "Elevação de perna reta",
        description: "Deitado, mantenha o joelho reto e levante a perna 30cm do chão",
        duration: "5 min"
      },
      {
        name: "Fortalecimento de isquiotibiais",
        description: "Deitado de bruços, dobre o joelho lentamente até 90 graus",
        duration: "6 min"
      }
    ],
    "hip": [
      {
        name: "Alongamento do piriforme",
        description: "Sentado, cruze uma perna sobre a outra e puxe o joelho em direção ao peito",
        duration: "5 min"
      },
      {
        name: "Abdução de quadril",
        description: "Deitado de lado, levante a perna lateralmente mantendo-a reta",
        duration: "6 min"
      },
      {
        name: "Ponte de glúteos",
        description: "Deitado de costas, levante o quadril do chão, apertando os glúteos",
        duration: "7 min"
      },
      {
        name: "Rotação externa",
        description: "Sentado com joelhos dobrados, separe os pés mantendo os joelhos juntos",
        duration: "5 min"
      }
    ],
    "wrist": [
      {
        name: "Flexão e extensão",
        description: "Estenda o braço e dobre o pulso para cima e para baixo",
        duration: "4 min"
      },
      {
        name: "Rotação de pulso",
        description: "Faça movimentos circulares com as mãos, em ambas direções",
        duration: "3 min"
      },
      {
        name: "Alongamento do antebraço",
        description: "Estenda o braço e puxe os dedos para trás com a outra mão",
        duration: "5 min"
      },
      {
        name: "Fortalecimento com bola",
        description: "Aperte uma bola de tênis ou antistresse por 10 segundos",
        duration: "6 min"
      }
    ]
  };
  
  // Planos para sedentários baseados em disponibilidade
  export function generateSedentaryPlan(gender: string, daysPerWeek: number, timePerDay: number): Exercise[] {
    const baseActivities: Exercise[] = [
      {
        name: "Caminhada leve",
        description: "Caminhe em ritmo confortável, focando na postura e respiração",
        duration: "15 min",
        caloriesBurned: 70
      },
      {
        name: "Alongamento básico",
        description: "Alongue os principais grupos musculares, mantendo cada posição por 30 segundos",
        duration: "10 min",
        caloriesBurned: 40
      },
      {
        name: "Exercícios de mobilidade",
        description: "Movimentos circulares de articulações, do pescoço aos tornozelos",
        duration: "8 min",
        caloriesBurned: 30
      },
      {
        name: "Respiração e relaxamento",
        description: "Técnicas de respiração profunda e relaxamento muscular progressivo",
        duration: "5 min",
        caloriesBurned: 15
      }
    ];
    
    // Atividades adicionais para quem tem mais tempo
    const extraActivities: Exercise[] = [
      {
        name: "Caminhada moderada",
        description: "Aumente levemente o ritmo da caminhada, mantendo a capacidade de conversar",
        duration: "20 min",
        caloriesBurned: 100
      },
      {
        name: "Exercícios com peso corporal",
        description: "Agachamentos parciais, flexões na parede e elevações de panturrilha",
        duration: "15 min",
        caloriesBurned: 80
      },
      {
        name: "Yoga para iniciantes",
        description: "Posturas básicas de yoga focadas em equilíbrio e flexibilidade",
        duration: "15 min",
        caloriesBurned: 60
      }
    ];
    
    // Ajustar com base no tempo disponível
    let activities: Exercise[] = [...baseActivities];
    
    if (timePerDay >= 45) {
      activities.push(extraActivities[0]);
    }
    
    if (timePerDay >= 60) {
      activities.push(extraActivities[1]);
    }
    
    if (timePerDay >= 90) {
      activities.push(extraActivities[2]);
    }
    
    // Ajustar descrições com base no gênero (personalização)
    if (gender === "female") {
      activities = activities.map(activity => {
        if (activity.name.includes("peso corporal")) {
          return {
            ...activity,
            description: "Versões adaptadas de agachamentos, flexões e elevações focando na postura correta"
          };
        }
        return activity;
      });
    }
    
    return activities;
  }
  
  // Planos de treino baseados em objetivo e nível
  export function generateTrainingPlan(
    gender: string, 
    goal: string, 
    fitnessLevel: string, 
    daysPerWeek: number, 
    timePerDay: number
  ): Exercise[] {
    // Base de exercícios por objetivo
    const exercises: Record<string, Record<string, Exercise[]>> = {
      "lose-weight": {
        "beginner": [
          {
            name: "Caminhada intervalada",
            description: "Alterne 3 minutos de caminhada rápida com 2 minutos de caminhada lenta",
            duration: "20 min",
            caloriesBurned: 120
          },
          {
            name: "Agachamento básico",
            description: "3 séries de 10 repetições, foco na técnica correta",
            duration: "10 min",
            caloriesBurned: 70
          },
          {
            name: "Prancha frontal",
            description: "3 séries de 20 segundos, com 40 segundos de descanso",
            duration: "5 min",
            caloriesBurned: 40
          },
          {
            name: "Elevação de joelhos",
            description: "3 séries de 30 segundos, alternando as pernas",
            duration: "8 min",
            caloriesBurned: 60
          }
        ],
        "intermediate": [
          {
            name: "Corrida intervalada",
            description: "Alterne 2 minutos de corrida com 1 minuto de caminhada",
            duration: "25 min",
            caloriesBurned: 200
          },
          {
            name: "Circuito corporal",
            description: "Agachamentos, flexões, abdominais e afundos, 45 segundos cada, 3 voltas",
            duration: "15 min",
            caloriesBurned: 150
          },
          {
            name: "HIIT básico",
            description: "8 rodadas de 20 segundos intensos, 10 segundos de descanso",
            duration: "12 min",
            caloriesBurned: 130
          },
          {
            name: "Prancha lateral",
            description: "3 séries de 30 segundos de cada lado",
            duration: "8 min",
            caloriesBurned: 60
          }
        ],
        "advanced": [
          {
            name: "HIIT avançado",
            description: "10 rodadas de 30 segundos intensos, 15 segundos de descanso",
            duration: "20 min",
            caloriesBurned: 250
          },
          {
            name: "Circuito metabólico",
            description: "Burpees, mountain climbers, jumping jacks e agachamentos com salto, 4 voltas",
            duration: "20 min",
            caloriesBurned: 220
          },
          {
            name: "Treino tabata",
            description: "8 rodadas de 20 segundos máximos, 10 segundos de descanso",
            duration: "15 min",
            caloriesBurned: 180
          },
          {
            name: "Cardio kickboxing",
            description: "Combinações de socos e chutes em ritmo acelerado",
            duration: "15 min",
            caloriesBurned: 170
          }
        ]
      },
      "gain-muscle": {
        "beginner": [
          {
            name: "Agachamento com peso corporal",
            description: "4 séries de 12 repetições, foco na técnica",
            duration: "12 min",
            caloriesBurned: 80
          },
          {
            name: "Flexão modificada",
            description: "4 séries de 8 repetições, com joelhos apoiados se necessário",
            duration: "10 min",
            caloriesBurned: 60
          },
          {
            name: "Ponte de glúteos",
            description: "3 séries de 15 repetições, apertando os glúteos no topo",
            duration: "8 min",
            caloriesBurned: 50
          },
          {
            name: "Remada com objeto",
            description: "3 séries de 12 repetições, usando uma garrafa de água ou livro",
            duration: "10 min",
            caloriesBurned: 65
          }
        ],
        "intermediate": [
          {
            name: "Agachamento com salto",
            description: "4 séries de 15 repetições, foco na explosão",
            duration: "15 min",
            caloriesBurned: 120
          },
          {
            name: "Flexão completa",
            description: "4 séries de 12 repetições, com amplitude completa de movimento",
            duration: "12 min",
            caloriesBurned: 90
          },
          {
            name: "Afundo alternado",
            description: "3 séries de 10 repetições para cada perna",
            duration: "12 min",
            caloriesBurned: 100
          },
          {
            name: "Elevação lateral",
            description: "3 séries de 15 repetições, usando garrafas de água como peso",
            duration: "10 min",
            caloriesBurned: 70
          }
        ],
        "advanced": [
          {
            name: "Agachamento búlgaro",
            description: "4 séries de 12 repetições para cada perna, com peso adicional se possível",
            duration: "15 min",
            caloriesBurned: 130
          },
          {
            name: "Flexão com elevação",
            description: "4 séries de 15 repetições, alternando a elevação de cada braço no topo",
            duration: "15 min",
            caloriesBurned: 120
          },
          {
            name: "Prancha com rotação",
            description: "3 séries de 10 rotações para cada lado, mantendo a estabilidade",
            duration: "12 min",
            caloriesBurned: 100
          },
          {
            name: "Supino com objeto",
            description: "4 séries de 12 repetições, usando mochilas ou livros como peso",
            duration: "15 min",
            caloriesBurned: 110
          }
        ]
      }
    };
    
    // Selecionar plano base
    let plan = exercises[goal][fitnessLevel];
    
    // Ajustar com base no tempo disponível
    if (timePerDay < 45) {
      // Reduzir duração para tempos menores
      plan = plan.map(exercise => ({
        ...exercise,
        duration: `${Math.max(5, parseInt(exercise.duration) * 0.7)} min`,
caloriesBurned: exercise.caloriesBurned ? Math.floor(exercise.caloriesBurned * 0.7) : 0
      }));
    } else if (timePerDay > 60) {
      // Aumentar duração para tempos maiores
      plan = plan.map(exercise => ({
        ...exercise,
        duration: `${Math.floor(parseInt(exercise.duration) * 1.3)} min`,
caloriesBurned: exercise.caloriesBurned ? Math.floor(exercise.caloriesBurned * 1.3) : 0
      }));
    }
    
    // Ajustar com base no gênero (personalização)
    if (gender === "female") {
      plan = plan.map(exercise => {
        // Ajustar descrições específicas para mulheres
        if (exercise.name.includes("Flexão")) {
          return {
            ...exercise,
            description: exercise.description.replace("repetições", "repetições, ajustando a amplitude conforme necessário")
          };
        }
        return exercise;
      });
    }
    
    return plan;
  }