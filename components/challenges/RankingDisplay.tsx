"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar"
import { Badge } from "@/components/ui/feedback/badge"
import { Crown, Medal, Award, Star, TrendingUp, Zap, Users } from "lucide-react"

interface Participant {
  userId: string
  nome: string
  fotoPerfil?: string
  pontos: number
  joinedAt: string
}

interface RankingDisplayProps {
  participants: Participant[]
  currentUserId?: string
}

export function RankingDisplay({ participants, currentUserId }: RankingDisplayProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.pontos - a.pontos)

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getRankingBg = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
    }
    
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
      default:
        return 'bg-muted/30'
    }
  }

  return (
    <div className="space-y-3">
      {sortedParticipants.map((participant, index) => {
        const isCurrentUser = participant.userId === currentUserId
        
        return (
          <div
            key={participant.userId}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              getRankingBg(index, isCurrentUser)
            } ${isCurrentUser ? 'ring-2 ring-blue-200' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankingIcon(index + 1)}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.fotoPerfil} />
                <AvatarFallback>
                  {participant.nome.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{participant.nome}</p>
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">
                      Você
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  #{index + 1} posição
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <p className="font-bold text-lg">{participant.pontos}</p>
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground">pontos</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface RankingStatsProps {
  participants: Participant[]
  currentUserId?: string
}

export function RankingStats({ participants, currentUserId }: RankingStatsProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.pontos - a.pontos)
  const currentUser = participants.find(p => p.userId === currentUserId)
  const currentUserPosition = currentUser 
    ? sortedParticipants.findIndex(p => p.userId === currentUserId) + 1
    : 0

  const leader = sortedParticipants[0]
  const totalPoints = participants.reduce((sum, p) => sum + p.pontos, 0)
  const averagePoints = participants.length > 0 ? Math.round(totalPoints / participants.length) : 0

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-blue-700">{currentUserPosition}</p>
        <p className="text-sm text-blue-600">Sua posição</p>
      </div>
      
      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-green-700">{currentUser?.pontos || 0}</p>
        <p className="text-sm text-green-600">Seus pontos</p>
      </div>
      
      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
        <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-yellow-700 truncate">{leader?.nome || 'Nenhum'}</p>
        <p className="text-sm text-yellow-600">Líder ({leader?.pontos || 0} pts)</p>
      </div>
      
      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-purple-700">{averagePoints}</p>
        <p className="text-sm text-purple-600">Média geral</p>
      </div>
    </div>
  )
}