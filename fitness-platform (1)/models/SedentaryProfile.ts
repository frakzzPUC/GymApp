import mongoose from "mongoose"

export interface IActivity {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: string;
  completed: boolean;
  date: Date;
}

const ActivitySchema = new mongoose.Schema({
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

export interface ISedentaryProgress {
  stepsGoal: number;
  stepsToday: number;
  weeklyActivity: number;
  weeklyGoal: number;
  completedActivities: number;
  progressPercentage: number;
  heartRate: {
    resting: number;
    initial: number;
  };
}

const SedentaryProfileSchema = new mongoose.Schema({
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
  daysPerWeek: {
    type: Number,
    required: true,
  },
  timePerDay: {
    type: Number,
    required: true,
  },
  activities: {
    type: [ActivitySchema],
    default: [],
  },
  progress: {
    stepsGoal: {
      type: Number,
      default: 5000,
    },
    stepsToday: {
      type: Number,
      default: 0,
    },
    weeklyActivity: {
      type: Number,
      default: 0,
    },
    weeklyGoal: {
      type: Number,
      default: 5,
    },
    completedActivities: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    heartRate: {
      resting: {
        type: Number,
        default: 78,
      },
      initial: {
        type: Number,
        default: 78,
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

export default mongoose.models.SedentaryProfile || mongoose.model("SedentaryProfile", SedentaryProfileSchema)