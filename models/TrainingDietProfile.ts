import mongoose from "mongoose"

const TrainingDietProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  
  // Dados pessoais básicos
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  
  // Histórico de saúde e atividade física
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active", "very-active"],
    required: true,
  },
  exerciseExperience: {
    type: String,
    enum: ["never", "beginner", "some", "experienced", "veteran"],
    required: true,
  },
  fitnessLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  medicalConditions: [{
    type: String,
  }],
  injuries: {
    type: String,
    default: "",
  },
  medications: {
    type: String,
    default: "",
  },
  
  // Objetivos e preferências de treino
  primaryGoal: {
    type: String,
    enum: ["lose-weight", "gain-muscle", "improve-fitness", "maintain-health", "sports-performance"],
    required: true,
  },
  secondaryGoals: [{
    type: String,
  }],
  daysPerWeek: {
    type: Number,
    required: true,
  },
  timePerDay: {
    type: Number,
    required: true,
  },
  preferredTime: {
    type: String,
    enum: ["early-morning", "morning", "late-morning", "afternoon", "evening", "night", "flexible"],
    required: true,
  },
  workoutLocation: {
    type: String,
    enum: ["home", "gym", "outdoor", "mixed"],
    required: true,
  },
  availableEquipment: [{
    type: String,
  }],
  exercisePreferences: [{
    type: String,
  }],
  exerciseDislikes: [{
    type: String,
  }],
  
  // Informações nutricionais
  wantsDiet: {
    type: Boolean,
    default: false,
  },
  dietaryRestrictions: [{
    type: String,
  }],
  allergies: {
    type: String,
    default: "",
  },
  currentEatingHabits: {
    type: String,
    enum: ["very-poor", "poor", "average", "good", "excellent"],
    required: false,
  },
  mealsPerDay: {
    type: Number,
  },
  waterIntake: {
    type: String,
    enum: ["less-1", "1-1.5", "1.5-2", "2-2.5", "more-2.5"],
  },
  supplementUsage: {
    type: String,
    default: "",
  },
  budgetPreference: {
    type: String,
    enum: ["low", "medium", "high"],
    required: false,
  },
  cookingSkill: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: false,
  },
  mealPrepTime: {
    type: String,
    enum: ["minimal", "moderate", "extensive"],
    required: false,
  },
  
  // Estilo de vida
  profession: {
    type: String,
    enum: ["sedentary", "light-active", "moderate-active", "very-active", "unemployed", "retired"],
    required: true,
  },
  stressLevel: {
    type: String,
    enum: ["low", "moderate", "high", "very-high"],
    required: true,
  },
  sleepHours: {
    type: Number,
    required: true,
  },
  sleepQuality: {
    type: String,
    enum: ["poor", "fair", "good", "excellent"],
    required: true,
  },
  
  // Motivação e apoio
  motivation: {
    type: String,
    enum: ["health", "appearance", "energy", "confidence", "social", "performance", "medical"],
    required: true,
  },
  obstacles: {
    type: String,
    default: "",
  },
  supportSystem: {
    type: String,
    default: "",
  },
  previousAttempts: {
    type: String,
    default: "",
  },

  // Legacy fields (manter compatibilidade)
  goal: {
    type: String,
    enum: ["lose-weight", "gain-muscle"],
  },
  dietType: {
    type: String,
    enum: ["economic", "balanced", "premium"],
    default: "balanced",
  },
  workouts: {
    type: [
      {
        name: String,
        description: String,
        duration: String,
        caloriesBurned: Number,
        completed: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  meals: {
    type: [
      {
        name: String,
        description: String,
        calories: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  progress: {
    caloriesGoal: {
      type: Number,
      default: 1800,
    },
    caloriesConsumed: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    weightChange: {
      type: Number,
      default: 0,
    },
    macros: {
      protein: {
        type: Number,
        default: 35,
      },
      carbs: {
        type: Number,
        default: 40,
      },
      fat: {
        type: Number,
        default: 25,
      },
    },
  },

  // Planos gerados pela IA
  aiWorkoutPlan: {
    type: String,
    default: "",
  },
  aiNutritionPlan: {
    type: String,
    default: "",
  },
  plansGeneratedAt: {
    type: Date,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.TrainingDietProfile || mongoose.model("TrainingDietProfile", TrainingDietProfileSchema)
