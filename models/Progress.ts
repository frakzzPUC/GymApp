import mongoose from "mongoose";

// Interface para métricas corporais
export interface BodyMetrics {
  weight?: number; // kg
  bodyFat?: number; // %
  muscleMass?: number; // kg
  height?: number; // cm
  chest?: number; // cm - peitoral
  waist?: number; // cm - cintura
  hips?: number; // cm - quadril
  bicep?: number; // cm - bíceps
  thigh?: number; // cm - coxa
  recordedAt: Date;
  notes?: string;
}

// Interface para registro de treino
export interface WorkoutRecord {
  date: Date;
  completed: boolean;
  duration?: number; // minutos
  exerciseCount?: number;
  workoutType?: string; // 'strength' | 'cardio' | 'flexibility' | 'mixed'
  calories?: number;
  notes?: string;
}

// Interface para streak de dias consecutivos
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: Date;
  weeklyGoal: number; // dias por semana
  monthlyCompletedDays: number;
}

// Schema principal do progresso
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Métricas corporais (histórico)
    bodyMetrics: [
      {
        weight: Number,
        bodyFat: Number,
        muscleMass: Number,
        height: Number,
        chest: Number,
        waist: Number,
        hips: Number,
        bicep: Number,
        thigh: Number,
        recordedAt: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],

    // Histórico de treinos
    workoutHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        completed: {
          type: Boolean,
          default: true,
        },
        duration: Number,
        exerciseCount: Number,
        workoutType: {
          type: String,
          enum: ["strength", "cardio", "flexibility", "mixed"],
          default: "mixed",
        },
        calories: Number,
        notes: String,
      },
    ],

    // Dados de streak
    streakData: {
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastWorkoutDate: Date,
      weeklyGoal: {
        type: Number,
        default: 3,
      },
      monthlyCompletedDays: {
        type: Number,
        default: 0,
      },
    },

    // Metas pessoais
    goals: {
      targetWeight: Number,
      targetBodyFat: Number,
      targetMuscle: Number,
      weeklyWorkouts: {
        type: Number,
        default: 3,
      },
      deadline: Date,
    },

    // Estatísticas computadas
    stats: {
      totalWorkouts: {
        type: Number,
        default: 0,
      },
      totalMinutes: {
        type: Number,
        default: 0,
      },
      averageWorkoutDuration: Number,
      workoutsThisWeek: {
        type: Number,
        default: 0,
      },
      workoutsThisMonth: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    collection: "progress",
  }
);

// Indexes para performance
progressSchema.index({ userId: 1, "workoutHistory.date": -1 });
progressSchema.index({ userId: 1, "bodyMetrics.recordedAt": -1 });

// Métodos para calcular estatísticas
progressSchema.methods.calculateStats = function () {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calcular treinos da semana
  this.stats.workoutsThisWeek = this.workoutHistory.filter(
    (workout: WorkoutRecord) => workout.date >= startOfWeek && workout.completed
  ).length;

  // Calcular treinos do mês
  this.stats.workoutsThisMonth = this.workoutHistory.filter(
    (workout: WorkoutRecord) =>
      workout.date >= startOfMonth && workout.completed
  ).length;

  // Calcular total de treinos
  this.stats.totalWorkouts = this.workoutHistory.filter(
    (workout: WorkoutRecord) => workout.completed
  ).length;

  // Calcular minutos totais
  this.stats.totalMinutes = this.workoutHistory
    .filter((workout: WorkoutRecord) => workout.completed && workout.duration)
    .reduce(
      (total: number, workout: WorkoutRecord) =>
        total + (workout.duration || 0),
      0
    );

  // Calcular duração média
  const completedWorkouts = this.workoutHistory.filter(
    (workout: WorkoutRecord) => workout.completed && workout.duration
  );
  if (completedWorkouts.length > 0) {
    this.stats.averageWorkoutDuration =
      this.stats.totalMinutes / completedWorkouts.length;
  }

  this.stats.lastUpdated = new Date();
  return this.stats;
};

// Método para calcular streak atual
progressSchema.methods.updateStreak = function () {
  const sortedWorkouts = this.workoutHistory
    .filter((workout: WorkoutRecord) => workout.completed)
    .sort(
      (a: WorkoutRecord, b: WorkoutRecord) =>
        b.date.getTime() - a.date.getTime()
    );

  if (sortedWorkouts.length === 0) {
    this.streakData.currentStreak = 0;
    return this.streakData;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let checkDate = new Date(today);

  // Verificar quantos dias consecutivos (permitindo 1 dia de intervalo para flexibilidade)
  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workoutDate = new Date(sortedWorkouts[i].date);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      currentStreak++;
      checkDate = new Date(workoutDate.getTime() - 1000 * 60 * 60 * 24);
    } else if (daysDiff <= 2) {
      // Permitir 1 dia de folga
      checkDate = new Date(workoutDate.getTime() - 1000 * 60 * 60 * 24);
    } else {
      break;
    }
  }

  this.streakData.currentStreak = currentStreak;
  this.streakData.lastWorkoutDate = sortedWorkouts[0]?.date;

  // Atualizar o longest streak se necessário
  if (currentStreak > this.streakData.longestStreak) {
    this.streakData.longestStreak = currentStreak;
  }

  return this.streakData;
};

// Método para adicionar treino
progressSchema.methods.addWorkout = function (
  workoutData: Partial<WorkoutRecord>
) {
  const workout: WorkoutRecord = {
    date: workoutData.date || new Date(),
    completed: workoutData.completed ?? true,
    duration: workoutData.duration,
    exerciseCount: workoutData.exerciseCount,
    workoutType: workoutData.workoutType || "mixed",
    calories: workoutData.calories,
    notes: workoutData.notes,
  };

  this.workoutHistory.push(workout);
  this.calculateStats();
  this.updateStreak();

  return workout;
};

// Método para adicionar métrica corporal
progressSchema.methods.addBodyMetrics = function (
  metricsData: Partial<BodyMetrics>
) {
  const metrics: BodyMetrics = {
    weight: metricsData.weight,
    bodyFat: metricsData.bodyFat,
    muscleMass: metricsData.muscleMass,
    height: metricsData.height,
    chest: metricsData.chest,
    waist: metricsData.waist,
    hips: metricsData.hips,
    bicep: metricsData.bicep,
    thigh: metricsData.thigh,
    recordedAt: metricsData.recordedAt || new Date(),
    notes: metricsData.notes,
  };

  this.bodyMetrics.push(metrics);
  return metrics;
};

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
