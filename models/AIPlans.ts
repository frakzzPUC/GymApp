import mongoose from 'mongoose'

export interface IAIPlans {
  _id?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  workoutPlan?: string
  nutritionPlan?: string
  rehabilitationPlan?: string
  planContent?: string
  createdAt: Date
  updatedAt: Date
  planType: 'ai-generated' | 'static-fallback' | 'training-diet' | 'rehabilitation' | 'sedentary'
  userProfile: {
    age?: number
    gender?: string
    weight?: number
    height?: number
    primaryGoal?: string
    activityLevel?: string
    experience?: string
    [key: string]: any
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
    default: ''
  },
  nutritionPlan: {
    type: String,
    default: ''
  },
  rehabilitationPlan: {
    type: String,
    default: ''
  },
  planContent: {
    type: String,
    default: ''
  },
  planType: {
    type: String,
    enum: ['ai-generated', 'static-fallback', 'training-diet', 'rehabilitation', 'sedentary'],
    default: 'ai-generated'
  },
  userProfile: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Índice composto para buscar planos de um usuário ordenados por data
AIPlansSchema.index({ userId: 1, createdAt: -1 })

// Forçar recreação do modelo para aplicar mudanças no schema
if (mongoose.models.AIPlans) {
  delete mongoose.models.AIPlans
}

export default mongoose.model<IAIPlans>('AIPlans', AIPlansSchema)