import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não está definida nas variáveis de ambiente");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Tentando com versão mais básica que deve estar disponível
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

// Interface para dados do usuário
export interface UserProfileData {
  // Dados pessoais
  age: number;
  gender: "male" | "female" | "other";
  weight: number;
  height: number;

  // Atividade e experiência
  activityLevel: string;
  exerciseExperience: string;
  fitnessLevel: string;

  // Condições médicas
  medicalConditions: string[];
  injuries?: string;
  medications?: string;

  // Objetivos
  primaryGoal: string;
  secondaryGoals: string[];

  // Preferências de treino
  daysPerWeek: number;
  timePerDay: number;
  preferredTime: string;
  workoutLocation: string;
  availableEquipment: string[];
  exercisePreferences: string[];
  exerciseDislikes: string[];

  // Dieta
  wantsDiet: boolean;
  dietaryRestrictions: string[];
  allergies?: string;
  currentEatingHabits: string;
  mealsPerDay: number;
  waterIntake: string;
  supplementUsage?: string;
  budgetPreference: string;
  cookingSkill: string;
  mealPrepTime: string;

  // Estilo de vida
  profession: string;
  stressLevel: string;
  sleepHours: number;
  sleepQuality: string;

  // Motivação
  motivation: string;
  obstacles?: string;
  supportSystem?: string;
  previousAttempts?: string;

  // Tipo de dieta (se aplicável)
  dietType?: string;
}

// Função para gerar plano de treino personalizado
export async function generateWorkoutPlan(
  userData: UserProfileData
): Promise<string | null> {
  const prompt = `
Como um educador físico experiente, crie um plano de treino personalizado detalhado para:

DADOS DO USUÁRIO:
- Idade: ${userData.age} anos
- Gênero: ${userData.gender}
- Peso: ${userData.weight}kg
- Altura: ${userData.height}cm
- Nível de atividade: ${userData.activityLevel}
- Experiência: ${userData.exerciseExperience}
- Nível fitness: ${userData.fitnessLevel}
- Objetivo principal: ${userData.primaryGoal}
- Objetivos secundários: ${userData.secondaryGoals.join(", ")}
- Dias por semana: ${userData.daysPerWeek}
- Tempo por dia: ${userData.timePerDay} minutos
- Horário preferido: ${userData.preferredTime}
- Local: ${userData.workoutLocation}
- Equipamentos disponíveis: ${userData.availableEquipment.join(", ")}
- Preferências: ${userData.exercisePreferences.join(", ")}
- Não gosta de: ${userData.exerciseDislikes.join(", ")}
- Condições médicas: ${userData.medicalConditions.join(", ")}
- Lesões: ${userData.injuries || "Nenhuma"}
- Profissão: ${userData.profession}
- Nível de estresse: ${userData.stressLevel}
- Horas de sono: ${userData.sleepHours}h
- Qualidade do sono: ${userData.sleepQuality}

CRIE UM PLANO ESTRUTURADO COM:

1. **ANÁLISE INICIAL**
   - IMC e classificação
   - Avaliação do perfil
   - Considerações especiais

2. **ESTRUTURA DO TREINO**
   - Divisão semanal
   - Periodização
   - Progressão

3. **TREINOS DETALHADOS** (para cada dia da semana)
   - Nome do treino
   - Aquecimento (5-10 min)
   - Exercícios principais com:
     - Nome do exercício
     - Séries x Repetições
     - Tempo de descanso
     - Dicas de execução
   - Alongamento/volta à calma

4. **ORIENTAÇÕES IMPORTANTES**
   - Como progredir
   - Sinais de alerta
   - Adaptações necessárias
   - Frequência de reavaliação

5. **DICAS MOTIVACIONAIS**
   - Estratégias para manter consistência
   - Como superar obstáculos

Seja específico, técnico e motivador. Use linguagem acessível mas profissional.
`;

  try {
    console.log("Gerando plano de treino com Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Plano de treino gerado com sucesso, tamanho:", text.length);
    return text;
  } catch (error) {
    console.error("Erro ao gerar plano de treino:", error);
    return null;
  }
}

// Função para gerar plano alimentar personalizado
export async function generateNutritionPlan(
  userData: UserProfileData
): Promise<string | null> {
  if (!userData.wantsDiet) {
    return "Usuário optou por não receber plano alimentar.";
  }

  const prompt = `
Como um nutricionista experiente, crie um plano alimentar personalizado detalhado para:

DADOS DO USUÁRIO:
- Idade: ${userData.age} anos
- Gênero: ${userData.gender}
- Peso: ${userData.weight}kg
- Altura: ${userData.height}cm
- Nível de atividade: ${userData.activityLevel}
- Objetivo principal: ${userData.primaryGoal}
- Restrições alimentares: ${userData.dietaryRestrictions.join(", ")}
- Alergias: ${userData.allergies || "Nenhuma"}
- Hábitos alimentares atuais: ${userData.currentEatingHabits}
- Refeições por dia: ${userData.mealsPerDay}
- Consumo de água: ${userData.waterIntake}L
- Suplementos: ${userData.supplementUsage || "Nenhum"}
- Orçamento: ${userData.budgetPreference}
- Habilidade culinária: ${userData.cookingSkill}
- Tempo para preparo: ${userData.mealPrepTime}
- Tipo de dieta: ${userData.dietType || "Balanceada"}
- Profissão: ${userData.profession}
- Nível de estresse: ${userData.stressLevel}
- Horas de sono: ${userData.sleepHours}h

CRIE UM PLANO ESTRUTURADO COM:

1. **ANÁLISE NUTRICIONAL**
   - Cálculo de TMB (Taxa Metabólica Basal)
   - Necessidades calóricas diárias
   - Distribuição de macronutrientes
   - Necessidades hídricas

2. **CARDÁPIO SEMANAL DETALHADO** (7 dias)
   Para cada dia inclua:
   - Café da manhã
   - Lanche da manhã (se aplicável)
   - Almoço
   - Lanche da tarde (se aplicável)
   - Jantar
   - Ceia (se aplicável)

   Para cada refeição especifique:
   - Ingredientes com quantidades
   - Modo de preparo simples
   - Valor calórico aproximado
   - Substituições possíveis

3. **LISTA DE COMPRAS ORGANIZADA**
   - Proteínas
   - Carboidratos
   - Vegetais e frutas
   - Laticínios
   - Temperos e condimentos
   - Outros itens

4. **ORIENTAÇÕES IMPORTANTES**
   - Horários ideais das refeições
   - Combinações alimentares
   - Alimentos a evitar
   - Dicas de preparo e conservação
   - Como fazer substituições

5. **SUPLEMENTAÇÃO** (se necessária)
   - Suplementos recomendados
   - Dosagens e horários
   - Objetivos de cada suplemento

6. **DICAS PRÁTICAS**
   - Estratégias para meal prep
   - Como manter a dieta em eventos sociais
   - Sinais de que está funcionando

Considere o orçamento, tempo disponível e habilidades culinárias. Seja prático e acessível.
`;

  try {
    console.log("Gerando plano alimentar com Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Plano alimentar gerado com sucesso, tamanho:", text.length);
    return text;
  } catch (error) {
    console.error("Erro ao gerar plano alimentar:", error);
    return null;
  }
}

// Função para gerar plano completo (treino + dieta)
export async function generateCompletePlan(userData: UserProfileData): Promise<{
  workoutPlan: string;
  nutritionPlan: string;
}> {
  try {
    console.log("=== INÍCIO GERAÇÃO GEMINI ===");
    console.log("Dados do usuário recebidos:", {
      age: userData.age,
      gender: userData.gender,
      primaryGoal: userData.primaryGoal,
      wantsDiet: userData.wantsDiet,
    });

    console.log("Iniciando geração paralela de planos...");

    const [workoutPlan, nutritionPlan] = await Promise.all([
      generateWorkoutPlan(userData),
      generateNutritionPlan(userData),
    ]);

    // Se algum dos planos falhou (retornou null), usa fallback
    if (!workoutPlan || !nutritionPlan) {
      console.log("Um ou ambos os planos falharam, usando fallback...");
      return {
        workoutPlan: workoutPlan || generateStaticWorkoutPlan(userData),
        nutritionPlan: nutritionPlan || generateStaticNutritionPlan(userData),
      };
    }

    console.log("Planos gerados com sucesso!");
    console.log(
      "Tamanho do plano de treino:",
      workoutPlan.length,
      "caracteres"
    );
    console.log(
      "Tamanho do plano de nutrição:",
      nutritionPlan.length,
      "caracteres"
    );
    console.log("=== FIM GERAÇÃO GEMINI ===");

    return {
      workoutPlan,
      nutritionPlan,
    };
  } catch (error) {
    console.error("=== ERRO NA GERAÇÃO GEMINI ===");
    console.error("Erro completo:", error);
    if (error instanceof Error) {
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
    }

    console.log("Fallback: Gerando planos estáticos personalizados...");

    // Fallback com planos estáticos personalizados
    return {
      workoutPlan: generateStaticWorkoutPlan(userData),
      nutritionPlan: generateStaticNutritionPlan(userData),
    };
  }
}

// Função de fallback para plano de treino estático
function generateStaticWorkoutPlan(userData: UserProfileData): string {
  const goalText =
    userData.primaryGoal === "gain-muscle"
      ? "ganho de massa muscular"
      : userData.primaryGoal === "lose-weight"
      ? "perda de peso"
      : "manutenção";

  return `# PLANO DE TREINO PERSONALIZADO

## ANÁLISE INICIAL
- **Idade:** ${userData.age} anos
- **Objetivo:** ${goalText}
- **Experiência:** ${userData.exerciseExperience}
- **Dias por semana:** ${userData.daysPerWeek}
- **Tempo por treino:** ${userData.timePerDay} minutos

## ESTRUTURA DO TREINO
**Divisão:** ${userData.daysPerWeek} dias por semana
**Foco:** ${
    userData.primaryGoal === "gain-muscle"
      ? "Hipertrofia muscular"
      : "Condicionamento geral"
  }

## TREINO A - PEITO, OMBROS E TRÍCEPS
1. **Aquecimento (10 min)**
   - Esteira caminhada: 5 minutos
   - Alongamento dinâmico: 5 minutos

2. **Exercícios Principais**
   - Supino reto: 3x8-12
   - Supino inclinado: 3x8-12
   - Desenvolvimento: 3x8-12
   - Elevação lateral: 3x12-15
   - Tríceps pulley: 3x10-15
   - Tríceps francês: 3x10-15

3. **Volta à calma (10 min)**
   - Alongamento estático

## TREINO B - COSTAS E BÍCEPS
1. **Aquecimento (10 min)**
   - Elíptico: 5 minutos
   - Mobilidade: 5 minutos

2. **Exercícios Principais**
   - Puxada alta: 3x8-12
   - Remada baixa: 3x8-12
   - Remada curvada: 3x8-12
   - Rosca direta: 3x10-15
   - Rosca martelo: 3x10-15

3. **Volta à calma (10 min)**
   - Alongamento

## TREINO C - PERNAS E CORE
1. **Aquecimento (10 min)**
   - Bike: 5 minutos
   - Ativação glúteos: 5 minutos

2. **Exercícios Principais**
   - Agachamento: 3x8-12
   - Leg press: 3x10-15
   - Extensora: 3x12-15
   - Flexora: 3x12-15
   - Panturrilha: 3x15-20
   - Prancha: 3x30-60seg

## ORIENTAÇÕES IMPORTANTES
- Descanso entre séries: 60-90 segundos
- Progressão: Aumente carga quando conseguir fazer todas as repetições
- Hidratação: Beba água durante todo o treino
- Frequência: ${
    userData.daysPerWeek
  }x por semana com 1 dia de descanso entre treinos

## DICAS MOTIVACIONAIS
- Seja consistente, resultados levam tempo
- Foque na execução correta dos exercícios
- Celebrate pequenas vitórias
- Mantenha um diário de treinos

*Plano gerado automaticamente baseado no seu perfil*`;
}

// Função de fallback para plano nutricional estático
function generateStaticNutritionPlan(userData: UserProfileData): string {
  if (!userData.wantsDiet) {
    return "Usuário optou por não receber plano alimentar.";
  }

  const calorias =
    userData.primaryGoal === "gain-muscle"
      ? 2500
      : userData.primaryGoal === "lose-weight"
      ? 1800
      : 2200;

  return `# PLANO ALIMENTAR PERSONALIZADO

## ANÁLISE NUTRICIONAL
- **Objetivo:** ${
    userData.primaryGoal === "gain-muscle" ? "Ganho de massa" : "Manutenção"
  }
- **Calorias diárias:** ${calorias} kcal
- **Refeições:** ${userData.mealsPerDay} por dia
- **Proteínas:** ${Math.round((calorias * 0.3) / 4)}g
- **Carboidratos:** ${Math.round((calorias * 0.4) / 4)}g
- **Gorduras:** ${Math.round((calorias * 0.3) / 9)}g

## CARDÁPIO SEMANAL

### CAFÉ DA MANHÃ (400 kcal)
- 2 ovos mexidos
- 2 fatias de pão integral
- 1 banana
- 1 copo de leite desnatado

### LANCHE DA MANHÃ (200 kcal)
- 1 iogurte grego
- 1 colher de granola

### ALMOÇO (600 kcal)
- 150g de frango grelhado
- 1 xícara de arroz integral
- Salada verde à vontade
- 1 colher de azeite

### LANCHE DA TARDE (300 kcal)
- 1 shake de whey protein
- 1 banana
- 1 punhado de castanhas

### JANTAR (500 kcal)
- 150g de peixe assado
- Legumes refogados
- 1 batata doce média

## LISTA DE COMPRAS
**Proteínas:**
- Ovos
- Frango
- Peixe
- Whey protein

**Carboidratos:**
- Arroz integral
- Batata doce
- Pão integral
- Aveia

**Vegetais:**
- Alface
- Tomate
- Cenoura
- Brócolis

**Frutas:**
- Banana
- Maçã

## ORIENTAÇÕES
- Beba pelo menos 2L de água por dia
- Faça as refeições em horários regulares
- Mastigue bem os alimentos
- Evite frituras e doces em excesso

## SUPLEMENTAÇÃO
- Whey protein: 1 dose pós-treino
- Multivitamínico: 1 cápsula pela manhã

*Plano gerado automaticamente baseado no seu perfil*`;
}

export default genAI;
