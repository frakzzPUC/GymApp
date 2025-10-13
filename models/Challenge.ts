import mongoose, { Document, Schema } from 'mongoose'

export interface IParticipant {
  userId: string
  nome: string
  fotoPerfil?: string
  pontos: number
  joinedAt: Date
}

export interface ICheckin {
  userId: string
  data: Date
  foto: string
  points: number
}

export interface IChallenge extends Document {
  codigo: string
  nome: string
  descricao?: string
  admin: string
  participantes: IParticipant[]
  checkins: ICheckin[]
  criadoEm: Date
  ativo: boolean
  dataFim?: Date
}

const ParticipantSchema = new Schema<IParticipant>({
  userId: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  fotoPerfil: {
    type: String,
    default: ''
  },
  pontos: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
})

const CheckinSchema = new Schema<ICheckin>({
  userId: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  foto: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
})

const ChallengeSchema = new Schema<IChallenge>({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    default: ''
  },
  admin: {
    type: String,
    required: true
  },
  participantes: [ParticipantSchema],
  checkins: [CheckinSchema],
  criadoEm: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataFim: {
    type: Date
  }
}, {
  timestamps: true
})

// Índices para performance
ChallengeSchema.index({ admin: 1 })
ChallengeSchema.index({ 'participantes.userId': 1 })

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema)