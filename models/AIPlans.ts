import mongoose from 'mongoose'

export interface IAIPlans {
  _id?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  workoutPlan: string
  nutritionPlan: string
  createdAt: Date
  updatedAt: Date
  planType: 'ai-generated' | 'static-fallback'
  userProfile: {
    age: number
    gender: string
    weight: number
    height: number
    primaryGoal: string
    activityLevel: string
    experience: string
  }
}

const AIPlansSchema = new mongoose.Schema<IAIPlans>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutPlan: {
    type: String,
    required: true
  },
  nutritionPlan: {
    type: String,
    required: true
  },
  planType: {
    type: String,
    enum: ['ai-generated', 'static-fallback'],
    default: 'ai-generated'
  },
  userProfile: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    primaryGoal: { type: String, required: true },
    activityLevel: { type: String, required: true },
    experience: { type: String, required: true }
  }
}, {
  timestamps: true
})

// Índice composto para buscar planos de um usuário ordenados por data
AIPlansSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.AIPlans || mongoose.model<IAIPlans>('AIPlans', AIPlansSchema)