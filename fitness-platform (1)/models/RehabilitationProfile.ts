import mongoose from "mongoose"

export interface IExercise {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: string;
  completed: boolean;
  date: Date;
}

const ExerciseSchema = new mongoose.Schema({
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
});

export interface IRehabilitationProgress {
  initialPainLevel: number;
  currentPainLevel: number;
  weeklyExercises: number;
  completedExercises: number;
  progressPercentage: number;
}

const RehabilitationProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  painAreas: {
    type: [String],
    required: true,
  },
  exercises: {
    type: [ExerciseSchema],
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
    progressPercentage: {
      type: Number,
      default: 0,
    }
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