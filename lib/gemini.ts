import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não está definida nas variáveis de ambiente");
}

// Configuração específica para a API do Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Função para testar se a API key funciona com um prompt simples
async function testApiKey(): Promise<boolean> {
  // Usar a mesma lista de modelos
  const modelsToTest = modelNames;

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testando API key com modelo: ${modelName}`);
      const testModel = genAI.getGenerativeModel({ model: modelName });
      const result = await testModel.generateContent("Diga apenas 'Olá'");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ Teste bem sucedido com ${modelName}:`, text);
      return true;
    } catch (error) {
      console.log(
        `❌ Falha com ${modelName}:`,
        error instanceof Error ? error.message : String(error)
      );
      continue;
    }
  }

  console.error("Nenhum modelo funcionou no teste da API key");
  return false;
}

// Função para tentar gerar conteúdo com diferentes modelos
async function tryGenerateContent(prompt: string): Promise<string | null> {
  console.log(`Tentando gerar conteúdo. API Key presente: ${!!apiKey}`);
  console.log(`API Key: ${apiKey?.substring(0, 10)}...`);

  // Primeiro, testar se a API key funciona
  const apiWorking = await testApiKey();
  if (!apiWorking) {
    console.error("API key não está funcionando");
    return null;
  }

  console.log(`Modelos a tentar: ${modelNames.join(", ")}`);

  for (const modelName of modelNames) {
    try {
      console.log(`\n=== Tentando modelo: ${modelName} ===`);
      const currentModel = createModel(modelName);

      console.log("Enviando prompt para o modelo...");
      const result = await currentModel.generateContent(prompt);

      console.log("Obtendo resposta...");
      const response = await result.response;
      const text = response.text();

      console.log(
        `✅ SUCESSO com modelo ${modelName}! Tamanho: ${text.length} caracteres`
      );
      return text;
    } catch (error) {
      console.log(`❌ Falha com modelo ${modelName}:`);
      if (error instanceof Error) {
        console.log(`   Erro: ${error.message}`);
        console.log(`   Stack: ${error.stack?.substring(0, 200)}...`);
      } else {
        console.log(`   Erro desconhecido: ${String(error)}`);
      }
      continue;
    }
  }

  console.error("❌ TODOS OS MODELOS FALHARAM");
  return null;
}

// Tentando diferentes modelos que podem funcionar com API gratuita
function createModel(modelName: string) {
  console.log(`Criando modelo: ${modelName}`);
  return genAI.getGenerativeModel({
    model: modelName,
  });
}

// Modelos em ordem de preferência (fallback para quando um estiver sobrecarregado)
const modelNames = [
  "gemini-pro-latest",
];

// Testar primeiro se conseguimos criar um modelo básico
const model = createModel(modelNames[0]);

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
   - Exercícios principais (MÍNIMO 5 EXERCÍCIOS POR TREINO) com:
     - Nome do exercício
     - Séries x Repetições
     - Tempo de descanso
     - Dicas de execução
   - Alongamento/volta à calma

IMPORTANTE: Cada sessão de treino DEVE conter NO MÍNIMO 5 exercícios diferentes. Se o treino for de corpo inteiro, inclua pelo menos 5 exercícios variados. Se for divisão por grupos musculares, inclua pelo menos 5 exercícios específicos para os músculos trabalhados naquele dia.

4. **ORIENTAÇÕES IMPORTANTES**
   - Como progredir
   - Sinais de alerta
   - Adaptações necessárias
   - Frequência de reavaliação

5. **DICAS MOTIVACIONAIS**
   - Estratégias para manter consistência
   - Como superar obstáculos

Seja específico, técnico e motivador. Use linguagem acessível mas profissional.

REGRAS OBRIGATÓRIAS:
- Cada dia de treino DEVE ter NO MÍNIMO 5 EXERCÍCIOS DIFERENTES
- Liste todos os exercícios com nome completo, séries, repetições e tempo de descanso
- Varie os exercícios para trabalhar diferentes músculos e movimentos
- Inclua exercícios compostos e isolados quando apropriado
- Se for treino de corpo inteiro: 5+ exercícios variados (pernas, peito, costas, ombros, braços)
- Se for divisão: 5+ exercícios específicos para o(s) grupo(s) muscular(es) do dia
`;

  console.log("Gerando plano de treino com Gemini...");
  return await tryGenerateContent(prompt);
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
   
   FORMATO OBRIGATÓRIO para cada refeição:
   
   ## DIA 1
   
   ### Café da manhã (400 kcal)
   - 2 fatias de pão integral (120g)
   - 1 ovo mexido (60g)
   - 1 copo de leite desnatado (200ml)
   - 1 banana média (100g)
   
   **Modo de preparo**: Mexer o ovo na frigideira com pouco óleo.
   **Substitutos**: Pão integral pode ser trocado por tapioca.
   
   ### Lanche da manhã (150 kcal)
   - 1 iogurte natural (150g)
   - 1 colher de sopa de granola (15g)
   
   ### Almoço (500 kcal)
   - 150g de peito de frango grelhado
   - 4 colheres de arroz integral (80g)
   - 2 colheres de feijão (60g)
   - Salada verde à vontade
   
   **Modo de preparo**: Temperar o frango com ervas e grelhar.
   
   [Continue assim para TODOS os 7 dias, TODAS as refeições]

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

  console.log("Gerando plano alimentar com Gemini...");
  return await tryGenerateContent(prompt);
}

// Função para gerar plano completo (treino + dieta)
export async function generateCompletePlan(userData: UserProfileData): Promise<{
  workoutPlan: string;
  nutritionPlan: string;
}> {
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

  // Se algum dos planos falhou (retornou null), lança erro
  if (!workoutPlan || !nutritionPlan) {
    const failedPlans = [];
    if (!workoutPlan) failedPlans.push("plano de treino");
    if (!nutritionPlan) failedPlans.push("plano nutricional");

    console.error(
      `Falha na geração dos seguintes planos: ${failedPlans.join(", ")}`
    );
    throw new Error(
      `Não foi possível gerar ${failedPlans.join(
        " e "
      )} via IA. Tente novamente.`
    );
  }

  console.log("Planos gerados com sucesso pela IA!");
  console.log("Tamanho do plano de treino:", workoutPlan.length, "caracteres");
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
}

// Interface para dados de reabilitação
export interface RehabilitationData {
  // Informações básicas
  painAreas: string[]
  age: number
  gender: string
  
  // Histórico médico
  injuryType: string
  injuryDuration: string
  painLevel: number
  medicalTreatment: string
  medications: string[]
  surgeryHistory: string
  
  // Limitações e atividades
  dailyActivities: string[]
  movementLimitations: string[]
  previousPhysioTherapy: string
  exerciseExperience: string
  
  // Objetivos e estilo de vida
  rehabGoals: string[]
  timeAvailability: string
  homeEnvironment: string
  workType: string
  sleepQuality: string
  stressLevel: string
}

// Função para gerar plano de reabilitação personalizado
export async function generateRehabilitationPlan(
  rehabData: RehabilitationData
): Promise<string | null> {
  const prompt = `
Como um fisioterapeuta experiente e especialista em reabilitação, crie um plano de reabilitação personalizado detalhado para:

DADOS DO PACIENTE:
- Idade: ${rehabData.age} anos
- Gênero: ${rehabData.gender}
- Áreas de dor: ${rehabData.painAreas.join(", ")}
- Tipo de lesão: ${rehabData.injuryType}
- Duração da lesão: ${rehabData.injuryDuration}
- Nível de dor (1-10): ${rehabData.painLevel}
- Tratamento médico atual: ${rehabData.medicalTreatment}
- Medicamentos: ${rehabData.medications.join(", ") || "Nenhum"}
- Histórico de cirurgias: ${rehabData.surgeryHistory}
- Atividades diárias afetadas: ${rehabData.dailyActivities.join(", ")}
- Limitações de movimento: ${rehabData.movementLimitations.join(", ")}
- Fisioterapia anterior: ${rehabData.previousPhysioTherapy}
- Experiência com exercícios: ${rehabData.exerciseExperience}
- Objetivos de reabilitação: ${rehabData.rehabGoals.join(", ")}
- Tempo disponível: ${rehabData.timeAvailability}
- Ambiente domiciliar: ${rehabData.homeEnvironment}
- Tipo de trabalho: ${rehabData.workType}
- Qualidade do sono: ${rehabData.sleepQuality}
- Nível de estresse: ${rehabData.stressLevel}

CRIE UM PLANO ESTRUTURADO COM:

1. **AVALIAÇÃO INICIAL**
   - Análise da condição atual
   - Identificação dos principais problemas
   - Fatores que contribuem para a dor
   - Prognóstico esperado

2. **OBJETIVOS DO TRATAMENTO**
   - Objetivos a curto prazo (2-4 semanas)
   - Objetivos a médio prazo (1-3 meses)
   - Objetivos a longo prazo (3-6 meses)

3. **PROGRAMA DE EXERCÍCIOS DOMICILIARES**
   Para cada fase do tratamento, inclua NO MÍNIMO 6-8 EXERCÍCIOS:
   
   FASE 1 - ALÍVIO DA DOR E MOBILIDADE INICIAL (Semanas 1-2):
   - Exercícios de alívio da dor
   - Mobilização suave
   - Técnicas de relaxamento
   - Correção postural básica
   
   FASE 2 - FORTALECIMENTO E FLEXIBILIDADE (Semanas 3-6):
   - Exercícios de fortalecimento progressivo
   - Alongamentos específicos
   - Exercícios de estabilização
   - Melhora da coordenação
   
   FASE 3 - CONDICIONAMENTO E PREVENÇÃO (Semanas 7-12):
   - Exercícios funcionais
   - Fortalecimento avançado
   - Exercícios de propriocepção
   - Retorno às atividades

   Para cada exercício especifique:
   - Nome e descrição detalhada
   - Posição inicial
   - Execução passo a passo
   - Repetições e séries
   - Frequência semanal
   - Progressão
   - Precauções e contraindicações

4. **TÉCNICAS DE ALÍVIO DA DOR**
   - Aplicação de calor/frio
   - Técnicas de respiração
   - Automassagem
   - Posicionamento para alívio
   - Técnicas de relaxamento

5. **EDUCAÇÃO E ORIENTAÇÕES**
   - Ergonomia no trabalho
   - Postura correta nas atividades diárias
   - Modificações no ambiente
   - Sinais de alerta
   - Quando procurar ajuda médica

6. **PREVENÇÃO DE RECIDIVAS**
   - Exercícios de manutenção
   - Hábitos saudáveis
   - Estratégias de enfrentamento
   - Programa de exercícios para a vida

IMPORTANTE: 
- Todos os exercícios devem ser SEGUROS para execução domiciliar
- Use apenas equipamentos básicos (toalha, parede, cadeira, almofadas)
- Inclua variações para diferentes níveis de dor
- Enfatize a progressão gradual e segura
- Forneça orientações claras sobre intensidade da dor aceitável durante exercícios

Use linguagem clara, técnica mas acessível. Seja específico nas instruções e cuidadoso com a segurança.
`;

  console.log("Gerando plano de reabilitação com Gemini...");
  return await tryGenerateContent(prompt);
}

// Interface para dados do programa sedentário
export interface SedentaryData {
  age: number;
  gender: string;
  motivation: string;
  primaryGoal: string;
  currentActivityLevel: string;
  availableTime: string;
  preferredActivities: string[];
}

// Função para gerar programa motivacional "Saindo do Sedentarismo"
export async function generateSedentaryProgram(
  sedentaryData: SedentaryData
): Promise<string | null> {
  const timeMap: { [key: string]: string } = {
    "15-min": "15 minutos",
    "30-min": "30 minutos", 
    "45-min": "45 minutos",
    "60-min": "60 minutos"
  };

  const motivationMap: { [key: string]: string } = {
    "saude": "melhorar sua saúde geral",
    "energia": "ter mais energia no dia a dia",
    "peso": "perder peso e se sentir melhor",
    "autoestima": "aumentar sua autoestima",
    "longevidade": "viver mais e melhor",
    "familia": "ser exemplo para sua família",
    "stress": "reduzir o estresse e ansiedade"
  };

  const goalMap: { [key: string]: string } = {
    "condicionamento": "ganhar condicionamento físico e fôlego",
    "mobilidade": "melhorar flexibilidade e mobilidade",
    "habitos": "criar hábitos saudáveis de exercício",
    "bem-estar": "melhorar bem-estar geral e disposição"
  };

  const prompt = `
Como um personal trainer motivacional especialista em sedentarismo, crie um programa INSPIRADOR e PRÁTICO para alguém que quer sair do sedentarismo:

PERFIL DO CLIENTE:
- Idade: ${sedentaryData.age} anos
- Gênero: ${sedentaryData.gender}
- Motivação principal: ${motivationMap[sedentaryData.motivation] || sedentaryData.motivation}
- Objetivo: ${goalMap[sedentaryData.primaryGoal] || sedentaryData.primaryGoal}
- Nível atual: ${sedentaryData.currentActivityLevel}
- Tempo disponível: ${timeMap[sedentaryData.availableTime] || sedentaryData.availableTime} por dia
- Atividades preferidas: ${sedentaryData.preferredActivities ? sedentaryData.preferredActivities.join(", ") : 'Nenhuma'}

CRIE UM PROGRAMA MOTIVACIONAL COM:

## 🎯 **MENSAGEM MOTIVACIONAL PERSONALIZADA**
Uma mensagem inspiradora específica para este perfil, destacando:
- Como vai se sentir melhor
- Os benefícios que vai conquistar
- Por que vale a pena começar HOJE

## 📅 **PROGRAMA SEMANAL PROGRESSIVO**

### **SEMANA 1-2: DESPERTAR DO CORPO**
- Exercícios suaves para reativar o corpo
- Caminhadas curtas e alongamentos básicos
- Foco em criar o hábito (consistência > intensidade)

### **SEMANA 3-4: GANHANDO RITMO** 
- Aumentar gradualmente intensidade
- Incluir exercícios de peso corporal básicos
- Estabelecer rotina sólida

### **SEMANA 5-8: CONSTRUINDO FORÇA**
- Exercícios mais desafiadores
- Combinar cardio + fortalecimento
- Sentir os primeiros resultados

### **SEMANA 9-12: NOVO ESTILO DE VIDA**
- Programa completo e variado
- Exercícios funcionais
- Manutenção dos hábitos conquistados

Para cada semana, inclua:
- **EXERCÍCIOS ESPECÍFICOS** (nome, descrição, tempo/repetições)
- **DICAS MOTIVACIONAIS** semanais
- **MARCOS DE PROGRESSO** para celebrar

## 🏃‍♂️ **EXERCÍCIOS DETALHADOS**
Liste NO MÍNIMO 20 EXERCÍCIOS variados:
- Caminhadas (diferentes intensidades)
- Alongamentos e mobilidade
- Exercícios de peso corporal (flexões adaptadas, agachamentos, etc.)
- Exercícios funcionais para o dia a dia
- Atividades lúdicas e prazerosas

Para cada exercício:
- Nome motivador
- Execução simples e clara  
- Adaptações para iniciantes
- Benefícios específicos
- Como progredir

## ⚡ **DICAS DE OURO**
- Como manter a motivação
- Estratégias para dias difíceis
- Como celebrar pequenas vitórias
- Sinais de progresso para observar

## 🎉 **MENSAGENS DE ENCORAJAMENTO**
Frases motivacionais para diferentes momentos:
- Para começar o exercício
- Quando estiver desanimado
- Para celebrar conquistas
- Para manter consistência

IMPORTANTE:
- Use linguagem MOTIVACIONAL e POSITIVA
- Foque nos benefícios e na transformação
- Seja prático e realista
- Adapte tudo para o tempo disponível (${timeMap[sedentaryData.availableTime] || sedentaryData.availableTime})
- Torne tudo SIMPLES e PRAZEROSO
- Não mencione academia - apenas exercícios em casa e ao ar livre

Transforme este programa em uma JORNADA DE CONQUISTA PESSOAL! 🚀
`;

  console.log("Gerando programa motivacional Saindo do Sedentarismo...");
  return await tryGenerateContent(prompt);
}

export default genAI;
