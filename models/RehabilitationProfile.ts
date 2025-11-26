import mongoose from "mongoose"

const RehabilitationProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Informações básicas
  painAreas: {
    type: [String],
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  
  // Histórico médico
  injuryType: {
    type: String,
    required: true,
  },
  injuryDuration: {
    type: String,
    required: true,
  },
  painLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  medicalTreatment: {
    type: String,
    required: true,
  },
  medications: {
    type: [String],
    default: [],
  },
  surgeryHistory: {
    type: String,
    default: "none",
  },
  
  // Limitações e atividades
  dailyActivities: {
    type: [String],
    required: true,
  },
  movementLimitations: {
    type: [String],
    required: true,
  },
  previousPhysioTherapy: {
    type: String,
    required: true,
  },
  exerciseExperience: {
    type: String,
    required: true,
  },
  
  // Objetivos e estilo de vida
  rehabGoals: {
    type: [String],
    required: true,
  },
  timeAvailability: {
    type: String,
    required: true,
  },
  homeEnvironment: {
    type: String,
    required: true,
  },
  workType: {
    type: String,
    required: true,
  },
  sleepQuality: {
    type: String,
    required: true,
  },
  stressLevel: {
    type: String,
    required: true,
  },
  
  exercises: {
    type: [
      {
        name: String,
        description: String,
        duration: String,
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
  progress: {
    initialPainLevel: {
      type: Number,
      default: 7,
    },
    currentPainLevel: {
      type: Number,
      default: 7,
    },
    weeklyExercises: {
      type: Number,
      default: 5,
    },
    completedExercises: {
      type: Number,
      default: 0,
    },
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

export default mongoose.models.RehabilitationProfile ||
  mongoose.model("RehabilitationProfile", RehabilitationProfileSchema)
