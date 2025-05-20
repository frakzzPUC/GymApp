import mongoose from "mongoose"

const TrainingDietProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
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
  goal: {
    type: String,
    enum: ["lose-weight", "gain-muscle"],
    required: true,
  },
  fitnessLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  daysPerWeek: {
    type: Number,
    required: true,
  },
  timePerDay: {
    type: Number,
    required: true,
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
