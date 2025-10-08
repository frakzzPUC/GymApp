import mongoose from 'mongoose'

export interface IExercise {
  _id?: mongoose.Types.ObjectId
  name: string
  description: string
  instructions: string[]
  category: string
  muscleGroups: string[]
  equipment: string[]
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  imageUrl?: string
  videoUrl?: string
  tips: string[]
  sets?: string
  reps?: string
  duration?: string
  calories?: number
  createdAt: Date
  updatedAt: Date
}

const ExerciseSchema = new mongoose.Schema<IExercise>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps', 'Core', 'Cardio', 'Glúteos', 'Panturrilha'],
    index: true
  },
  muscleGroups: [{
    type: String,
    required: true
  }],
  equipment: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['Iniciante', 'Intermediário', 'Avançado'],
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    default: '/placeholder.svg?height=300&width=400'
  },
  videoUrl: {
    type: String
  },
  tips: [{
    type: String
  }],
  sets: {
    type: String
  },
  reps: {
    type: String
  },
  duration: {
    type: String
  },
  calories: {
    type: Number
  }
}, {
  timestamps: true
})

// Índices para busca eficiente
ExerciseSchema.index({ name: 'text', description: 'text' })
ExerciseSchema.index({ category: 1, difficulty: 1 })
ExerciseSchema.index({ equipment: 1 })

export default mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema)