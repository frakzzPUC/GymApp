"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Button } from "@/components/ui/actions/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog"
import {
  Camera,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  Zap,
  X,
  Image as ImageIcon
} from "lucide-react"

interface CheckinPhoto {
  userId: string
  userName: string
  userPhoto?: string
  foto: string
  data: string
  points: number
}

interface CheckinFeedProps {
  checkins: CheckinPhoto[]
  participantes: Array<{
    userId: string
    nome: string
    fotoPerfil?: string
  }>
}

export function CheckinFeed({ checkins, participantes }: CheckinFeedProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CheckinPhoto | null>(null)

  // Ordenar check-ins por data (mais recente primeiro)
  const sortedCheckins = [...checkins].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  // Mapear dados dos participantes
  const checkinsWithUserData = sortedCheckins.map(checkin => {
    const participant = participantes.find(p => p.userId === checkin.userId)
    return {
      ...checkin,
      userName: participant?.nome || 'Usuário',
      userPhoto: participant?.fotoPerfil
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m atrás`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d atrás`
    }
  }

  if (checkinsWithUserData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
            Feed de Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Ainda não há check-ins no desafio
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Seja o primeiro a fazer check-in!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
              Feed de Check-ins
            </div>
            <Badge variant="secondary">{checkinsWithUserData.length} fotos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {checkinsWithUserData.map((checkin, index) => (
              <div
                key={`${checkin.userId}-${checkin.data}-${index}`}
                className="flex space-x-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                {/* Avatar do usuário */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={checkin.userPhoto} />
                  <AvatarFallback>
                    {checkin.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Conteúdo do check-in */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{checkin.userName}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(checkin.data)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      +{checkin.points}
                    </Badge>
                  </div>

                  {/* Foto do check-in */}
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedPhoto(checkin)}
                  >
                    <img
                      src={checkin.foto}
                      alt="Check-in"
                      className="w-full h-32 object-cover rounded-lg border group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-2">
                          <ImageIcon className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações (futuras - curtir, comentar) */}
                  <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                    <button className="flex items-center space-x-1 text-xs hover:text-foreground transition-colors">
                      <Heart className="h-3 w-3" />
                      <span>Curtir</span>
                    </button>
                    <button className="flex items-center space-x-1 text-xs hover:text-foreground transition-colors">
                      <MessageCircle className="h-3 w-3" />
                      <span>Comentar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal para visualizar foto em tela cheia */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedPhoto?.userPhoto} />
                  <AvatarFallback>
                    {selectedPhoto?.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedPhoto?.userName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedPhoto && new Date(selectedPhoto.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <Badge>
                <Zap className="h-3 w-3 mr-1" />
                +{selectedPhoto?.points} ponto
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.foto}
                alt="Check-in em tela cheia"
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Curtir
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}