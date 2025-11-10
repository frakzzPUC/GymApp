export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  targetMuscle: string;
  bodyPart: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
}

interface ExerciseDBExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  target: string;
  equipment: string;
  instructions: string[];
  secondaryMuscles: string[];
}

export class ExerciseDBClient {
  private baseURL = 'https://oss.exercisedb.dev/api/v1';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 30 * 60 * 1000; // 30 minutos

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📋 Cache hit para: ${endpoint}`);
      return cached.data as T;
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`🌐 Fazendo requisição para: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`✅ Dados armazenados no cache para: ${endpoint}`);
      
      return data as T;
    } catch (error) {
      console.error('❌ Error fetching from ExerciseDB API:', error);
      throw error;
    }
  }

  private translateBodyPart(bodyPart: string): string {
    const translations: Record<string, string> = {
      'chest': 'peito',
      'back': 'costas',
      'shoulders': 'ombros',
      'upper legs': 'pernas superiores',
      'lower legs': 'pernas inferiores',
      'upper arms': 'braços superiores',
      'lower arms': 'braços inferiores',
      'waist': 'cintura',
      'cardio': 'cardio',
      'neck': 'pescoço',
      'core': 'core',
      'abs': 'abdômen',
      'legs': 'pernas',
      'arms': 'braços',
      'full body': 'corpo inteiro',
      'unknown': 'desconhecido'
    };
    return translations[bodyPart.toLowerCase()] || bodyPart;
  }

  private translateMuscle(muscle: string): string {
    const translations: Record<string, string> = {
      // Músculos do peito
      'pectorals': 'peitorais',
      'serratus anterior': 'serrátil anterior',
      
      // Músculos das costas
      'lats': 'latíssimos',
      'latissimus dorsi': 'latíssimo do dorso',
      'rhomboids': 'romboides',
      'middle trapezius': 'trapézio médio',
      'upper trapezius': 'trapézio superior',
      'lower trapezius': 'trapézio inferior',
      'trapezius': 'trapézio',
      'erector spinae': 'eretor da espinha',
      'teres major': 'redondo maior',
      'teres minor': 'redondo menor',
      'infraspinatus': 'infraespinal',
      
      // Músculos dos ombros
      'delts': 'deltoides',
      'deltoids': 'deltoides',
      'anterior deltoid': 'deltoide anterior',
      'posterior deltoid': 'deltoide posterior',
      'lateral deltoid': 'deltoide lateral',
      'middle deltoid': 'deltoide médio',
      
      // Músculos dos braços
      'biceps': 'bíceps',
      'triceps': 'tríceps',
      'brachialis': 'braquial',
      'brachioradialis': 'braquiorradial',
      'forearms': 'antebraços',
      
      // Músculos das pernas
      'quadriceps': 'quadríceps',
      'hamstrings': 'isquiotibiais',
      'glutes': 'glúteos',
      'gluteus maximus': 'glúteo máximo',
      'calves': 'panturrilhas',
      'gastrocnemius': 'gastrocnêmio',
      'soleus': 'sóleo',
      'abductors': 'abdutores',
      'adductors': 'adutores',
      'hip flexors': 'flexores do quadril',
      
      // Músculos do core
      'abs': 'abdominais',
      'obliques': 'oblíquos',
      'transverse abdominis': 'transverso do abdômen',
      'rectus abdominis': 'reto abdominal',
      
      // Outros
      'unknown': 'desconhecido',
      'stabilizers': 'estabilizadores',
      'synergists': 'sinergistas'
    };
    return translations[muscle.toLowerCase()] || muscle;
  }

  private translateEquipment(equipment: string): string {
    const translations: Record<string, string> = {
      'barbell': 'barra',
      'dumbbell': 'halter',
      'cable': 'cabo',
      'machine': 'máquina',
      'bodyweight': 'peso corporal',
      'kettlebell': 'kettlebell',
      'resistance band': 'faixa elástica',
      'medicine ball': 'bola medicinal',
      'stability ball': 'bola suíça',
      'foam roller': 'rolo de espuma',
      'bosu ball': 'bola bosu',
      'smith machine': 'máquina smith',
      'assisted': 'assistido',
      'leverage machine': 'máquina de alavanca',
      'skierg machine': 'máquina de esqui',
      'stationary bike': 'bicicleta ergométrica',
      'upper body ergometer': 'ergômetro de braços',
      'elliptical machine': 'elíptico',
      'stepmill machine': 'máquina de degraus'
    };
    return translations[equipment.toLowerCase()] || equipment;
  }

  private translateInstructions(instructions: string[]): string[] {
    const commonTranslations: Record<string, string> = {
      // Verbos de ação
      'set': 'posicione',
      'hold': 'segure',
      'grab': 'pegue',
      'grasp': 'segure',
      'grip': 'segure',
      'place': 'coloque',
      'position': 'posicione',
      'stand': 'fique em pé',
      'sit': 'sente-se',
      'lie': 'deite',
      'lean': 'incline',
      'bend': 'dobre',
      'extend': 'estenda',
      'flex': 'flexione',
      'raise': 'levante',
      'lift': 'levante',
      'lower': 'abaixe',
      'press': 'pressione',
      'push': 'empurre',
      'pull': 'puxe',
      'squeeze': 'contraia',
      'rotate': 'gire',
      'twist': 'torça',
      'return': 'retorne',
      'repeat': 'repita',
      'pause': 'pause',
      'slowly': 'lentamente',
      'straight': 'reto',
      'wide': 'amplo',
      'slightly': 'ligeiramente',
      
      // Partes do corpo específicas
      'bar': 'barra',
      'arms': 'braços',
      'legs': 'pernas',
      'feet': 'pés',
      'hands': 'mãos',
      'fingers': 'dedos',
      'shoulders': 'ombros',
      'shoulder blades': 'omoplatas',
      'chest': 'peito',
      'back': 'costas',
      'core': 'core',
      'hips': 'quadris',
      'knees': 'joelhos',
      'elbows': 'cotovelos',
      'wrists': 'pulsos',
      'heels': 'calcanhares',
      'body': 'corpo',
      'waist': 'cintura',
      'ground': 'chão',
      'floor': 'chão',
      
      // Direções e movimentos
      'up': 'para cima',
      'down': 'para baixo',
      'forward': 'para frente',
      'backward': 'para trás',
      'side': 'lado',
      'overhead': 'acima da cabeça',
      'behind': 'atrás',
      'in front': 'na frente',
      'underneath': 'embaixo',
      'above': 'acima',
      'below': 'abaixo',
      'towards': 'em direção a',
      'away': 'para longe',
      'together': 'juntos',
      'apart': 'separados',
      
      // Posições e descrições
      'starting position': 'posição inicial',
      'top position': 'posição superior',
      'bottom position': 'posição inferior',
      'neutral position': 'posição neutra',
      'overhand': 'pegada pronada',
      'underhand': 'pegada supina',
      'width': 'largura',
      'height': 'altura',
      'desired number': 'número desejado',
      'repetitions': 'repetições',
      'moment': 'momento',
      'then': 'então',
      'with': 'com',
      'and': 'e',
      'the': 'a/o',
      'your': 'seu/sua',
      'at': 'em',
      'on': 'em',
      'for': 'por',
      'by': 'por',
      'so that': 'de modo que',
      'are': 'estão',
      'is': 'está'
    };

    const phraseTranslations: Record<string, string> = {
      'set para cima a barra at cintura altura and deite underneath it': 'posicione a barra na altura da cintura e deite embaixo dela',
      'pegue the barra with an overhand segure': 'pegue a barra com pegada pronada',
      'posicione your corpo so that your calcanhares are em the chão and your corpo is reto': 'posicione seu corpo de modo que seus calcanhares estejam no chão e seu corpo reto',
      'puxe your peito em direção a cima towards the barra by contraiaing your omoplatas juntos': 'puxe seu peito para cima em direção à barra contraindo suas omoplatas',
      'pause por a momento at the superior, então lentamente abaixe your corpo costas para baixo to the inicial posicione': 'pause por um momento no topo, então lentamente abaixe seu corpo de volta à posição inicial',
      'repita por the número desejado of repetições': 'repita pelo número desejado de repetições'
    };

    return instructions.map(instruction => {
      let translated = instruction.toLowerCase();
      
      // Remover "Step:" e numeração das instruções
      translated = translated.replace(/^step\s*\d*\s*:?\s*/i, '');
      translated = translated.replace(/^\d+\.\s*/, ''); // Remove "1. ", "2. ", etc.
      translated = translated.replace(/^\d+\s+/, ''); // Remove "1 ", "2 ", etc.
      
      // Primeiro aplicar traduções de frases completas
      Object.entries(phraseTranslations).forEach(([english, portuguese]) => {
        translated = translated.replace(english, portuguese);
      });
      
      // Depois substituir palavras individuais
      Object.entries(commonTranslations).forEach(([english, portuguese]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translated = translated.replace(regex, portuguese);
      });
      
      // Capitalizar primeira letra e remover espaços extras
      translated = translated.trim();
      return translated.charAt(0).toUpperCase() + translated.slice(1);
    });
  }

  private matchesBodyPart(exercise: Exercise, searchTerm: string): boolean {
    const search = searchTerm.toLowerCase();
    
    // Mapeamento reverso para permitir busca em português
    const reverseTranslations: Record<string, string[]> = {
      'peito': ['chest', 'pectorals'],
      'costas': ['back', 'lats', 'latissimus'],
      'ombros': ['shoulders', 'delts', 'deltoid'],
      'pernas': ['legs', 'quadriceps', 'hamstrings'],
      'braços': ['arms', 'biceps', 'triceps'],
      'abdomen': ['abs', 'core', 'obliques'],
      'glúteos': ['glutes'],
      'panturrilha': ['calves']
    };
    
    // Verificar se encontra o termo diretamente
    const directMatch = (
      exercise.bodyPart.toLowerCase().includes(search) ||
      exercise.targetMuscle.toLowerCase().includes(search) ||
      exercise.secondaryMuscles.some((muscle: string) => 
        muscle && muscle.toLowerCase().includes(search)
      )
    );
    
    if (directMatch) return true;
    
    // Verificar traduções reversas
    for (const [portuguese, englishTerms] of Object.entries(reverseTranslations)) {
      if (search.includes(portuguese) || portuguese.includes(search)) {
        return englishTerms.some(englishTerm => 
          exercise.bodyPart.toLowerCase().includes(englishTerm) ||
          exercise.targetMuscle.toLowerCase().includes(englishTerm) ||
          exercise.secondaryMuscles.some((muscle: string) => 
            muscle && muscle.toLowerCase().includes(englishTerm)
          )
        );
      }
    }
    
    return false;
  }

  private translateExerciseName(name: string): string {
    // Traduções completas de exercícios específicos primeiro
    const completeExerciseTranslations: Record<string, string> = {
      // Flexões e Push-ups
      'close-grip push-up': 'flexão pegada fechada',
      'diamond push-up': 'flexão diamante',
      'wide grip push-up': 'flexão pegada aberta',
      'incline push-up': 'flexão inclinada',
      'decline push-up': 'flexão declinada',
      'pike push-up': 'flexão pike',
      
      // Desenvolvimento e Press
      'smith machine close-grip bench press': 'desenvolvimento banco pegada fechada no smith',
      'barbell bench press': 'supino com barra',
      'dumbbell bench press': 'supino com halteres',
      'incline bench press': 'supino inclinado',
      'decline bench press': 'supino declinado',
      'overhead press': 'desenvolvimento militar',
      'shoulder press': 'desenvolvimento de ombros',
      
      // Tríceps
      'bodyweight kneeling triceps extension': 'extensão de tríceps ajoelhado peso corporal',
      'assisted triceps dip (kneeling)': 'mergulho assistido de tríceps (ajoelhado)',
      'triceps dip (between benches)': 'mergulho de tríceps (entre bancos)',
      'dumbbell triceps extension': 'extensão de tríceps com halter',
      'overhead triceps extension': 'extensão de tríceps acima da cabeça',
      'triceps kickback': 'tríceps coice',
      'triceps pushdown': 'extensão de tríceps no cabo',
      
      // Desenvolvimento variados
      'dumbbell twisting bench press': 'desenvolvimento com halter com rotação',
      'hammer strength chest press': 'desenvolvimento no hammer strength',
      
      // Remadas (expandindo)
      'inverted row bent knees': 'remada invertida com joelhos flexionados',
      'barbell reverse grip incline bench row': 'remada inclinada com barra pegada supina',
      'smith narrow row': 'remada estreita no smith',
      'barbell incline row': 'remada inclinada com barra',
      'lever reverse grip vertical row': 'remada vertical com pegada supina',
      'lever alternating narrow grip seated row': 'remada sentado alternada pegada estreita',
      'dumbbell one arm bent-over row': 'remada curvada unilateral com halter',
      't-bar row': 'remada na barra t',
      'cable row': 'remada no cabo',
      'landmine row': 'remada landmine',
      
      // Bíceps
      'barbell curl': 'rosca direta com barra',
      'dumbbell curl': 'rosca com halteres',
      'hammer curl': 'rosca martelo',
      'preacher curl': 'rosca scott',
      'concentration curl': 'rosca concentrada',
      'cable curl': 'rosca no cabo',
      
      // Pernas
      'barbell squat': 'agachamento com barra',
      'dumbbell squat': 'agachamento com halteres',
      'goblet squat': 'agachamento goblet',
      'front squat': 'agachamento frontal',
      'bulgarian split squat': 'agachamento búlgaro',
      'walking lunge': 'afundo caminhando',
      'reverse lunge': 'afundo reverso',
      'lateral lunge': 'afundo lateral',
      'romanian deadlift': 'levantamento terra romeno',
      'sumo deadlift': 'levantamento terra sumô',
      'stiff leg deadlift': 'levantamento terra pernas rígidas',
      
      // Abdominais
      'bicycle crunch': 'abdominal bicicleta',
      'russian twist': 'abdominal russo',
      'mountain climber': 'escalador',
      'dead bug': 'inseto morto',
      'bird dog': 'cachorro pássaro',
      'hollow hold': 'prancha oca',
      
      // Exercícios específicos problemáticos
      'elevator': 'elevação',
      'bear crawl': 'caminhada do urso',
      'crab walk': 'caminhada do caranguejo'
    };

    // Termos para substituição individual (para casos não cobertos acima)
    const termTranslations: Record<string, string> = {
      // Equipamentos
      'barbell': 'barra',
      'dumbbell': 'halter',
      'kettlebell': 'kettlebell',
      'cable': 'cabo',
      'machine': 'máquina',
      'smith': 'smith',
      'hammer strength': 'hammer strength',
      'bodyweight': 'peso corporal',
      
      // Movimentos
      'press': 'desenvolvimento',
      'push-up': 'flexão',
      'pushup': 'flexão',
      'pull-up': 'barra fixa',
      'pullup': 'barra fixa',
      'pulldown': 'puxada',
      'row': 'remada',
      'curl': 'rosca',
      'extension': 'extensão',
      'raise': 'elevação',
      'fly': 'voador',
      'dip': 'mergulho',
      'squat': 'agachamento',
      'lunge': 'afundo',
      'deadlift': 'levantamento terra',
      'crunch': 'abdominal',
      'plank': 'prancha',
      'twist': 'rotação',
      'twisting': 'com rotação',
      
      // Posições e variações
      'close-grip': 'pegada fechada',
      'wide-grip': 'pegada aberta',
      'narrow': 'estreito',
      'wide': 'amplo',
      'reverse grip': 'pegada supina',
      'overhand': 'pegada pronada',
      'underhand': 'pegada supina',
      'incline': 'inclinado',
      'decline': 'declinado',
      'flat': 'reto',
      'seated': 'sentado',
      'standing': 'em pé',
      'lying': 'deitado',
      'kneeling': 'ajoelhado',
      'bent-over': 'curvado',
      'overhead': 'acima da cabeça',
      'single arm': 'um braço',
      'one arm': 'um braço',
      'alternating': 'alternado',
      'between benches': 'entre bancos',
      'assisted': 'assistido'
    };

    let translatedName = name.toLowerCase();
    
    // Primeiro verificar se há uma tradução completa
    if (completeExerciseTranslations[translatedName]) {
      return completeExerciseTranslations[translatedName];
    }
    
    // Se não houver tradução completa, substituir termos individuais
    Object.entries(termTranslations).forEach(([english, portuguese]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedName = translatedName.replace(regex, portuguese);
    });
    
    // Capitalizar primeira letra
    return translatedName.charAt(0).toUpperCase() + translatedName.slice(1);
  }

  private transformExercise(exercise: ExerciseDBExercise): Exercise {
    // Função para determinar valores padrão baseados no nome do exercício
    const getDefaultBodyPart = (name: string): string => {
      const nameLower = name.toLowerCase();
      if (nameLower.includes('row') || nameLower.includes('pull')) return 'costas';
      if (nameLower.includes('press') || nameLower.includes('bench')) return 'peito';
      if (nameLower.includes('curl')) return 'braços superiores';
      if (nameLower.includes('squat') || nameLower.includes('lunge')) return 'pernas superiores';
      if (nameLower.includes('crunch') || nameLower.includes('plank')) return 'cintura';
      return 'corpo inteiro';
    };

    const getDefaultMuscle = (name: string): string => {
      const nameLower = name.toLowerCase();
      if (nameLower.includes('row') || nameLower.includes('lat')) return 'latíssimos';
      if (nameLower.includes('press') || nameLower.includes('bench')) return 'peitorais';
      if (nameLower.includes('curl') && nameLower.includes('bicep')) return 'bíceps';
      if (nameLower.includes('extension') || nameLower.includes('tricep')) return 'tríceps';
      if (nameLower.includes('squat')) return 'quadríceps';
      if (nameLower.includes('deadlift')) return 'isquiotibiais';
      return 'múltiplos músculos';
    };

    const getDefaultEquipment = (name: string): string => {
      const nameLower = name.toLowerCase();
      if (nameLower.includes('barbell')) return 'barra';
      if (nameLower.includes('dumbbell')) return 'halter';
      if (nameLower.includes('cable')) return 'cabo';
      if (nameLower.includes('machine') || nameLower.includes('lever')) return 'máquina';
      if (nameLower.includes('bodyweight') || nameLower.includes('push')) return 'peso corporal';
      return 'equipamento variado';
    };

    // Processar os valores da API
    const bodyPartRaw = exercise.bodyPart || '';
    const targetRaw = exercise.target || '';
    const equipmentRaw = exercise.equipment || '';
    const exerciseName = exercise.name || 'Exercício sem nome';

    const bodyPart = (bodyPartRaw && bodyPartRaw !== 'unknown') 
      ? this.translateBodyPart(bodyPartRaw)
      : getDefaultBodyPart(exerciseName);

    const targetMuscle = (targetRaw && targetRaw !== 'unknown')
      ? this.translateMuscle(targetRaw) 
      : getDefaultMuscle(exerciseName);

    const equipment = (equipmentRaw && equipmentRaw !== 'unknown')
      ? this.translateEquipment(equipmentRaw)
      : getDefaultEquipment(exerciseName);
    
    return {
      id: exercise.exerciseId || '',
      name: this.translateExerciseName(exerciseName),
      gifUrl: exercise.gifUrl || '',
      bodyPart: bodyPart,
      targetMuscle: targetMuscle,
      equipment: equipment,
      instructions: Array.isArray(exercise.instructions) ? this.translateInstructions(exercise.instructions) : [],
      secondaryMuscles: Array.isArray(exercise.secondaryMuscles) ? 
        exercise.secondaryMuscles
          .filter(m => m && typeof m === 'string' && m !== 'unknown')
          .map(m => this.translateMuscle(m)) : []
    };
  }

  async getAllExercises(limit?: number): Promise<Exercise[]> {
    console.log('🔍 getAllExercises chamado com limit:', limit);
    
    let exercises: ExerciseDBExercise[] = [];
    const targetLimit = limit || 50; // Padrão de 50 exercícios se não especificado
    const apiLimit = 25; // Máximo permitido por requisição pela API
    const maxRequests = 5; // Máximo de 5 requisições para evitar muitas chamadas
    
    try {
      // Fazer múltiplas requisições usando paginação no endpoint principal
      let offset = 0;
      let hasMore = true;
      let requestCount = 0;
      
      while (hasMore && exercises.length < targetLimit && requestCount < maxRequests) {
        const remainingNeeded = targetLimit - exercises.length;
        const currentLimit = Math.min(apiLimit, remainingNeeded);
        
        console.log(`📄 Fazendo requisição ${requestCount + 1}/${maxRequests} com offset: ${offset}, limit: ${currentLimit}`);
        
        const response = await this.fetchWithCache<any>(`/exercises?offset=${offset}&limit=${currentLimit}`);
        
        let pageExercises: ExerciseDBExercise[] = [];
        
        if (Array.isArray(response)) {
          pageExercises = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          pageExercises = response.data;
        } else if (response && response.exercises && Array.isArray(response.exercises)) {
          pageExercises = response.exercises;
        } else {
          console.warn('⚠️ Unexpected API response structure:', response);
          break;
        }
        
        console.log(`📦 Recebidos ${pageExercises.length} exercícios da página (offset: ${offset})`);
        
        // Adicionar exercícios únicos
        for (const exercise of pageExercises) {
          if (!exercises.find(e => e.exerciseId === exercise.exerciseId)) {
            exercises.push(exercise);
          }
        }
        
        requestCount++;
        
        // Se recebeu menos exercícios que o limite solicitado, não há mais páginas
        if (pageExercises.length < currentLimit) {
          hasMore = false;
        } else {
          offset += currentLimit;
        }
        
        // Se atingiu o limite de requisições, parar
        if (requestCount >= maxRequests) {
          console.log(`🛑 Limite de ${maxRequests} requisições atingido`);
          break;
        }
      }
      
    } catch (error) {
      console.error('❌ Erro ao buscar exercícios:', error);
    }
    
    console.log('📦 Total final de exercícios:', exercises.length);
    const transformed = exercises.map(exercise => this.transformExercise(exercise));
    console.log('🔄 Exercícios transformados:', transformed.length);
    
    if (!limit) {
      console.log('📋 Retornando todos os exercícios');
      return transformed;
    }
    
    const result = transformed.slice(0, limit);
    console.log('📋 Retornando', result.length, 'exercícios (de', limit, 'solicitados)');
    return result;
  }

  private getBalancedExercises(exercises: Exercise[], limit: number): Exercise[] {
    console.log('🎯 getBalancedExercises chamado com', exercises.length, 'exercícios, limit:', limit);
    
    // Agrupar exercícios por parte do corpo
    const byBodyPart = exercises.reduce((acc, exercise) => {
      const bodyPart = exercise.bodyPart.toLowerCase();
      if (!acc[bodyPart]) acc[bodyPart] = [];
      acc[bodyPart].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>);

    console.log('📊 Exercícios por parte do corpo:', Object.keys(byBodyPart).map(bp => `${bp}: ${byBodyPart[bp].length}`));

    const bodyParts = Object.keys(byBodyPart);
    const exercisesPerPart = Math.floor(limit / bodyParts.length);
    const remainder = limit % bodyParts.length;

    console.log('⚖️ Distribuição:', exercisesPerPart, 'por parte do corpo, resto:', remainder);

    let result: Exercise[] = [];

    // Distribuir exercícios uniformemente
    bodyParts.forEach((bodyPart, index) => {
      const count = exercisesPerPart + (index < remainder ? 1 : 0);
      const exercises = byBodyPart[bodyPart].slice(0, count);
      result.push(...exercises);
    });

    // Se ainda precisamos de mais exercícios, adicionar aleatoriamente
    const remaining = limit - result.length;
    if (remaining > 0) {
      const usedIds = new Set(result.map(e => e.id));
      const availableExercises = exercises.filter(e => !usedIds.has(e.id));
      const shuffled = availableExercises.sort(() => Math.random() - 0.5);
      result.push(...shuffled.slice(0, remaining));
    }

    console.log('✅ Resultado final:', result.length, 'exercícios');
    return result.slice(0, limit);
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const exercise = await this.fetchWithCache<ExerciseDBExercise>(`/exercises/${id}`);
      return this.transformExercise(exercise);
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      return null;
    }
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    try {
      const exercises = await this.fetchWithCache<ExerciseDBExercise[]>(`/exercises/search?q=${encodeURIComponent(query)}`);
      return exercises.map(exercise => this.transformExercise(exercise));
    } catch (error) {
      console.error(`Error searching exercises:`, error);
      return [];
    }
  }

  async getExercisesByBodyPart(bodyPart: string, minCount: number = 10): Promise<Exercise[]> {
    console.log(`🎯 Buscando exercícios para ${bodyPart}, mínimo: ${minCount} - fazendo 5 requisições novas`);
    
    try {
      let allExercises: ExerciseDBExercise[] = [];
      const apiLimit = 25; // Máximo permitido por requisição pela API
      const maxRequests = 5; // Exatamente 5 requisições para cada filtro
      
      // Fazer exatamente 5 requisições independentes para o filtro
      for (let i = 0; i < maxRequests; i++) {
        const offset = i * apiLimit;
        
        console.log(`📄 Filtro ${bodyPart} - Requisição ${i + 1}/${maxRequests} com offset: ${offset}, limit: ${apiLimit}`);
        
        try {
          const response = await this.fetchWithCache<any>(`/exercises?offset=${offset}&limit=${apiLimit}`);
          
          let pageExercises: ExerciseDBExercise[] = [];
          
          if (Array.isArray(response)) {
            pageExercises = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            pageExercises = response.data;
          } else if (response && response.exercises && Array.isArray(response.exercises)) {
            pageExercises = response.exercises;
          } else {
            console.warn(`⚠️ Unexpected API response for ${bodyPart} at offset ${offset}:`, response);
            continue;
          }
          
          console.log(`📦 Filtro ${bodyPart} - Recebidos ${pageExercises.length} exercícios da página ${i + 1}`);
          
          // Adicionar exercícios únicos
          for (const exercise of pageExercises) {
            if (!allExercises.find(e => e.exerciseId === exercise.exerciseId)) {
              allExercises.push(exercise);
            }
          }
          
          // Se recebeu menos exercícios que o limite, não há mais páginas
          if (pageExercises.length < apiLimit) {
            console.log(`🏁 Fim dos exercícios da API na requisição ${i + 1}`);
            break;
          }
          
        } catch (error) {
          console.error(`❌ Erro na requisição ${i + 1} para ${bodyPart}:`, error);
        }
      }
      
      console.log(`📊 Total coletado para filtragem de ${bodyPart}: ${allExercises.length} exercícios`);
      
      // Transformar exercícios primeiro
      const transformedExercises = allExercises.map(exercise => this.transformExercise(exercise));
      
      // Filtrar por parte do corpo (busca flexível) com verificação de segurança
      const filteredExercises = transformedExercises.filter(exercise => {
        if (!exercise.bodyPart || !exercise.targetMuscle || !exercise.secondaryMuscles) {
          return false; // Pular exercícios com dados incompletos
        }
        
        return this.matchesBodyPart(exercise, bodyPart);
      });
      
      console.log(`✅ Encontrados ${filteredExercises.length} exercícios relacionados a ${bodyPart}`);
      
      return filteredExercises.slice(0, Math.max(minCount, 15)); // Retorna até 15 exercícios
      
    } catch (error) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
      return [];
    }
  }

  async getBodyParts(): Promise<string[]> {
    try {
      return await this.fetchWithCache<string[]>('/bodyparts');
    } catch (error) {
      console.error(`Error fetching body parts:`, error);
      return ['chest', 'back', 'shoulders', 'arms', 'legs', 'abs'];
    }
  }

  async getMuscles(): Promise<string[]> {
    try {
      return await this.fetchWithCache<string[]>('/muscles');
    } catch (error) {
      console.error(`Error fetching muscles:`, error);
      return ['pectorals', 'latissimus dorsi', 'deltoids', 'biceps', 'triceps', 'quadriceps'];
    }
  }

  async getEquipments(): Promise<string[]> {
    try {
      return await this.fetchWithCache<string[]>('/equipments');
    } catch (error) {
      console.error(`Error fetching equipments:`, error);
      return ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'];
    }
  }
}

export const exerciseDBClient = new ExerciseDBClient();