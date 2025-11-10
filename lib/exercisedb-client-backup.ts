// ExerciseDB V1 API Client - Free Version
// Documentation: https://oss.exercisedb.dev/api/v1

export interface ExerciseDBExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

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

class ExerciseDBClient {
  private baseURL = 'https://oss.exercisedb.dev/api/v1';
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const now = Date.now();
    
    // Check if cached data is still valid
    if (this.cache.has(endpoint) && this.cacheExpiry.has(endpoint)) {
      const expiry = this.cacheExpiry.get(endpoint)!;
      if (now < expiry) {
        return this.cache.get(endpoint);
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(endpoint, data);
      this.cacheExpiry.set(endpoint, now + this.CACHE_DURATION);
      
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ExerciseDB API:`, error);
      throw error;
    }
  }

  private transformExercise(exercise: ExerciseDBExercise): Exercise {
    return {
      id: exercise.exerciseId,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      targetMuscle: exercise.targetMuscles[0] || 'Unknown',
      bodyPart: exercise.bodyParts[0] || 'Unknown',
      equipment: exercise.equipments[0] || 'bodyweight',
      secondaryMuscles: exercise.secondaryMuscles,
      instructions: exercise.instructions
    };
  }

  async getAllExercises(limit?: number): Promise<Exercise[]> {
    console.log('🔍 getAllExercises chamado com limit:', limit);
    
    let exercises: ExerciseDBExercise[] = [];
    const targetLimit = limit || 50;
    
    try {
      // Lista de partes do corpo principais para garantir variedade
      const bodyParts = ['chest', 'back', 'shoulders', 'upper legs', 'lower legs', 'upper arms', 'lower arms', 'waist', 'cardio'];
      const exercisesPerBodyPart = Math.ceil(targetLimit / bodyParts.length); // Distribuir uniformemente
      
      console.log(`🎯 Buscando ${exercisesPerBodyPart} exercícios por parte do corpo para total de ${targetLimit}`);
      
      for (const bodyPart of bodyParts) {
        if (exercises.length >= targetLimit) break;
        
        try {
          console.log(`🔍 Buscando exercícios de: ${bodyPart}`);
          
          // Usar o endpoint principal com paginação
          const response = await this.fetchWithCache<any>(`/exercises?limit=15&offset=${bodyParts.indexOf(bodyPart) * 15}`);
          
          let bodyPartExercises: ExerciseDBExercise[] = [];
          
          if (Array.isArray(response)) {
            bodyPartExercises = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            bodyPartExercises = response.data;
          } else {
            console.warn(`⚠️ Unexpected API response for ${bodyPart}:`, response);
            continue;
          }
          
          console.log(`📦 Encontrados ${bodyPartExercises.length} exercícios de ${bodyPart}`);
          
          // Adicionar exercícios únicos
          for (const exercise of bodyPartExercises) {
            if (!exercises.find(e => e.exerciseId === exercise.exerciseId) && exercises.length < targetLimit) {
              exercises.push(exercise);
            }
          }
          
        } catch (error) {
          console.log(`⚠️ Erro ao buscar exercícios de ${bodyPart}:`, error);
        }
      }
      
      console.log(`✅ Total coletado: ${exercises.length} exercícios de ${bodyParts.length} partes do corpo`);
      
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
    
    // Comentando temporariamente a distribuição equilibrada
    // return this.getBalancedExercises(transformed, limit);
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

    // Calcular quantos exercícios por parte do corpo
    const bodyParts = Object.keys(byBodyPart);
    const minPerBodyPart = Math.min(10, Math.floor(limit / bodyParts.length));
    console.log('📏 Mínimo por parte do corpo:', minPerBodyPart);
    
    const result: Exercise[] = [];

    // Adicionar pelo menos minPerBodyPart de cada parte do corpo
    bodyParts.forEach(bodyPart => {
      const exercisesForPart = byBodyPart[bodyPart].slice(0, minPerBodyPart);
      console.log(`➕ Adicionando ${exercisesForPart.length} exercícios de ${bodyPart}`);
      result.push(...exercisesForPart);
    });

    // Preencher o restante com exercícios aleatórios
    const remaining = limit - result.length;
    console.log('🔢 Exercícios restantes para preencher:', remaining);
    
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
    console.log(`🎯 Buscando exercícios para ${bodyPart}, mínimo: ${minCount}`);
    
    try {
      // Buscar de todos os exercícios e filtrar por parte do corpo
      const allExercises = await this.getAllExercises(100); // Buscar mais exercícios para ter variedade
      
      // Filtrar por parte do corpo (busca flexível)
      const filteredExercises = allExercises.filter(exercise => 
        exercise.bodyPart.toLowerCase().includes(bodyPart.toLowerCase()) ||
        exercise.targetMuscle.toLowerCase().includes(bodyPart.toLowerCase()) ||
        exercise.secondaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(bodyPart.toLowerCase())
        )
      );
      
      console.log(`� Encontrados ${filteredExercises.length} exercícios relacionados a ${bodyPart}`);
      
      return filteredExercises.slice(0, Math.max(minCount, 15)); // Retorna até 15 exercícios
        
        let pageExercises: ExerciseDBExercise[] = [];
        
        if (Array.isArray(response)) {
          pageExercises = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          pageExercises = response.data;
        } else {
          console.warn(`⚠️ Unexpected API response for ${bodyPart}:`, response);
          break;
        }
        
        console.log(`📦 Recebidos ${pageExercises.length} exercícios de ${bodyPart} (offset: ${offset})`);
        
        // Adicionar exercícios únicos
        for (const exercise of pageExercises) {
          if (!exercises.find(e => e.exerciseId === exercise.exerciseId)) {
            exercises.push(exercise);
          }
        }
        
        // Se recebeu menos exercícios que o limite solicitado, não há mais páginas
        if (pageExercises.length < currentLimit) {
          hasMore = false;
        } else {
          offset += currentLimit;
        }
        
        // Limite de segurança
        if (offset > 500) {
          console.log(`🛑 Limite de segurança atingido para ${bodyPart} (offset > 500)`);
          break;
        }
      }
      
      const transformed = exercises.map(exercise => this.transformExercise(exercise));
      console.log(`✅ Total de exercícios encontrados para ${bodyPart}: ${transformed.length}`);
      
      return transformed.slice(0, Math.max(minCount, 15)); // Retorna até 15 exercícios
      
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
      return ['bodyweight', 'dumbbell', 'barbell', 'cable', 'machine'];
    }
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const exerciseDBClient = new ExerciseDBClient();
export default exerciseDBClient;