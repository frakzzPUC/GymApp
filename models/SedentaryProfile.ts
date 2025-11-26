import mongoose from "mongoose"

const SedentaryProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Dados básicos essenciais
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  // Motivação e objetivos
  motivation: {
    type: String,
    required: true,
  },
  primaryGoal: {
    type: String,
    required: true,
  },
  currentActivityLevel: {
    type: String,
    enum: ["muito-sedentario", "pouco-ativo", "moderadamente-ativo"],
    required: true,
  },
  availableTime: {
    type: String,
    enum: ["15-min", "30-min", "45-min", "60-min"],
    required: true,
  },
  preferredActivities: {
    type: [String],
    default: [],
  },
  // Plano gerado pela IA
  sedentaryPlan: {
    type: String,
    default: "",
  },
  activities: {
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
    weeklyGoal: {
      type: Number,
      default: 3,
    },
    completedActivities: {
      type: Number,
      default: 0,
    },
    motivationLevel: {
      type: Number,
      default: 5,
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

// Limpar modelo existente se houver
if (mongoose.models.SedentaryProfile) {
  delete mongoose.models.SedentaryProfile
}

export default mongoose.model("SedentaryProfile", SedentaryProfileSchema)
