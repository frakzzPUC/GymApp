"use client";

import { useState, useEffect } from "react";

interface ProgressStats {
  totalWorkouts: number;
  totalMinutes: number;
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
  weeklyGoal: number;
  monthlyCompletedDays: number;
}

interface Goals {
  targetWeight?: number;
  targetBodyFat?: number;
  targetMuscle?: number;
  weeklyWorkouts: number;
  deadline?: string;
}

interface MetricPoint {
  date: string;
  value: number;
}

interface WorkoutRecord {
  date: string;
  completed: boolean;
  duration?: number;
  exerciseCount?: number;
  workoutType?: string;
  calories?: number;
  notes?: string;
}

interface BodyMetrics {
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep?: number;
  thigh?: number;
  recordedAt: string;
  notes?: string;
}

interface UserProfileData {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  program?: string;
}

interface ProgressData {
  stats: ProgressStats;
  streakData: StreakData;
  goals?: Goals;
  recentMetrics: BodyMetrics[];
  recentWorkouts: WorkoutRecord[];
  userProfile?: UserProfileData;
  bmi?: number;
  chartData: {
    weight: MetricPoint[];
    bodyFat: MetricPoint[];
    workoutFrequency: Array<{
      date: string;
      workouts: number;
      hasWorkout: boolean;
    }>;
  };
}

export function useProgress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados de progresso
  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/progress");
      const result = await response.json();

      if (result.success) {
        // Calcular BMI e adicionar aos dados
        const dataWithBMI = {
          ...result.data,
          bmi: calculateBMIFromData(result.data),
        };
        setData(dataWithBMI);
      } else {
        setError(result.error || "Erro ao carregar dados de progresso");
      }
    } catch (err) {
      setError("Erro de conexão ao carregar progresso");
      console.error("Erro ao buscar progresso:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar treino
  const addWorkout = async (workoutData: Partial<WorkoutRecord>) => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "workout",
          data: workoutData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recarregar dados após adicionar treino
        await fetchProgress();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Erro ao salvar treino");
      console.error("Erro ao adicionar treino:", err);
      throw err;
    }
  };

  // Adicionar métricas corporais
  const addBodyMetrics = async (metricsData: Partial<BodyMetrics>) => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "metrics",
          data: metricsData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recarregar dados após adicionar métricas
        await fetchProgress();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Erro ao salvar métricas");
      console.error("Erro ao adicionar métricas:", err);
      throw err;
    }
  };

  // Atualizar metas
  const updateGoals = async (goalsData: Partial<Goals>) => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "goal",
          data: goalsData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recarregar dados após atualizar metas
        await fetchProgress();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Erro ao atualizar metas");
      console.error("Erro ao atualizar metas:", err);
      throw err;
    }
  };

  // Marcar treino como completado (atalho para adicionar treino simples)
  const markWorkoutCompleted = async (
    duration?: number,
    exerciseCount?: number,
    workoutType?: string
  ) => {
    return addWorkout({
      date: new Date().toISOString(),
      completed: true,
      duration,
      exerciseCount,
      workoutType: workoutType || "mixed",
    });
  };

  // Calcular estatísticas derivadas
  const getWeeklyProgress = () => {
    if (!data) return 0;
    return Math.min(
      (data.stats.workoutsThisWeek / data.streakData.weeklyGoal) * 100,
      100
    );
  };

  const getMonthlyProgress = () => {
    if (!data) return 0;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();
    const expectedWorkouts = Math.floor(
      (data.streakData.weeklyGoal * daysInMonth) / 7
    );
    return Math.min(
      (data.stats.workoutsThisMonth / expectedWorkouts) * 100,
      100
    );
  };

  const getLatestWeight = () => {
    if (!data || data.chartData.weight.length === 0) return null;
    return data.chartData.weight[data.chartData.weight.length - 1].value;
  };

  const getLatestBodyFat = () => {
    if (!data || data.chartData.bodyFat.length === 0) return null;
    return data.chartData.bodyFat[data.chartData.bodyFat.length - 1].value;
  };

  // Verificar se é hora de registrar novas métricas (sugerir)
  const shouldSuggestMetrics = () => {
    if (!data || data.recentMetrics.length === 0) return true;

    const lastMetrics = data.recentMetrics[0];
    const daysSinceLastMetrics = Math.floor(
      (Date.now() - new Date(lastMetrics.recordedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return daysSinceLastMetrics >= 7; // Sugerir a cada 7 dias
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchProgress();
  }, []);

  // Calcular IMC
  const calculateBMI = () => {
    const weight = getLatestWeight() || data?.userProfile?.weight;
    const height = data?.userProfile?.height;

    if (!weight || !height) return null;

    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  // Função auxiliar para calcular BMI dos dados
  const calculateBMIFromData = (progressData: any) => {
    const weight =
      progressData.chartData?.weight?.length > 0
        ? progressData.chartData.weight[
            progressData.chartData.weight.length - 1
          ].value
        : progressData.userProfile?.weight;
    const height = progressData.userProfile?.height;

    if (!weight || !height) return null;

    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  return {
    // Dados
    data,
    isLoading,
    error,

    // Ações
    fetchProgress,
    addWorkout,
    addBodyMetrics,
    updateGoals,
    markWorkoutCompleted,

    // Calculados
    weeklyProgress: getWeeklyProgress(),
    monthlyProgress: getMonthlyProgress(),
    latestWeight: getLatestWeight(),
    latestBodyFat: getLatestBodyFat(),
    shouldSuggestMetrics: shouldSuggestMetrics(),
    bmi: calculateBMI(),

    // Estado
    hasData: !!data,
    hasWorkouts: data ? data.recentWorkouts.length > 0 : false,
    hasMetrics: data ? data.recentMetrics.length > 0 : false,
    userProfile: data?.userProfile,
  };
}
