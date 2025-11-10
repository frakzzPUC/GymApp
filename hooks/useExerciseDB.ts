import { useState, useEffect } from 'react';
import { exerciseDBClient, type Exercise } from '@/lib/exercisedb-client';

interface UseExerciseDBReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  searchExercises: (query: string) => Promise<Exercise[]>;
  getExercisesByBodyPart: (bodyPart: string) => Promise<Exercise[]>;
  getAllExercises: (limit?: number) => Promise<Exercise[]>;
  categories: string[];
  loadCategories: () => Promise<void>;
  getExerciseById: (id: string) => Promise<Exercise | null>;
}

export function useExerciseDB(): UseExerciseDBReturn {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['chest', 'back', 'shoulders', 'arms', 'legs', 'abs']);

  const getAllExercises = async (limit?: number): Promise<Exercise[]> => {
    console.log('🎬 useExerciseDB.getAllExercises chamado com limit:', limit);
    setLoading(true);
    setError(null);
    
    try {
      const result = await exerciseDBClient.getAllExercises(limit);
      console.log('✅ useExerciseDB recebeu:', result.length, 'exercícios');
      setExercises(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar exercícios';
      console.error('❌ Erro em getAllExercises:', errorMessage, err);
      setError(errorMessage);
      setExercises([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchExercises = async (query: string): Promise<Exercise[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await exerciseDBClient.searchExercises(query);
      // Se a busca retornou poucos resultados, tenta uma busca mais ampla
      if (result.length < 10) {
        const allExercises = await exerciseDBClient.getAllExercises();
        const broadSearch = allExercises.filter(exercise => 
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.targetMuscle.toLowerCase().includes(query.toLowerCase()) ||
          exercise.bodyPart.toLowerCase().includes(query.toLowerCase()) ||
          exercise.equipment.toLowerCase().includes(query.toLowerCase())
        );
        setExercises(broadSearch.slice(0, 20)); // Máximo 20 resultados
        return broadSearch.slice(0, 20);
      }
      setExercises(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar exercícios';
      setError(errorMessage);
      setExercises([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar mais exercícios para garantir pelo menos 10 por parte do corpo
      const result = await exerciseDBClient.getExercisesByBodyPart(bodyPart, 15);
      setExercises(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar exercícios por parte do corpo';
      setError(errorMessage);
      setExercises([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getExerciseById = async (id: string): Promise<Exercise | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await exerciseDBClient.getExerciseById(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar exercício';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (): Promise<void> => {
    try {
      const bodyParts = await exerciseDBClient.getBodyParts();
      setCategories(bodyParts);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      // Fallback categories if API fails
      setCategories(['chest', 'back', 'shoulders', 'arms', 'legs', 'abs']);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    exercises,
    loading,
    error,
    searchExercises,
    getExercisesByBodyPart,
    getAllExercises,
    categories,
    loadCategories,
    getExerciseById,
  };
}