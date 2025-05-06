import mongoose from "mongoose"

const TrainingDietProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
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
      required: true,
      enum: ["lose-weight", "gain-muscle"],
    },
    fitnessLevel: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
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
    progress: {
      caloriesGoal: {
        type: Number,
        default: 0,
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
          default: 30,
        },
        carbs: {
          type: Number,
          default: 40,
        },
        fat: {
          type: Number,
          default: 30,
        },
      },
    },
    workouts: [
      {
        name: {
          type: String,
        },
        description: {
          type: String,
        },
        duration: {
          type: String,
        },
        caloriesBurned: {
          type: Number,
          default: 0,
        },
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
    meals: [
      {
        name: {
          type: String,
        },
        description: {
          type: String,
        },
        calories: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.TrainingDietProfile || mongoose.model("TrainingDietProfile", TrainingDietProfileSchema)