"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar"
import { Badge } from "@/components/ui/feedback/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlay/dialog"
import {
  Trophy,
  Users,
  Camera,
  Copy,
  CheckCircle,
  Medal,
  Target,
  Calendar,
  Share2,
  Crown,
  Star,
  Zap,
  TrendingUp,
  Award
} from "lucide-react"
import { CheckinFeed } from "@/components/challenges/CheckinFeed"

interface Participant {
  userId: string
  nome: string
  fotoPerfil?: string
  pontos: number
  joinedAt: string
}

interface CheckinPhoto {
  userId: string
  userName: string
  userPhoto?: string
  foto: string
  data: string
  points: number
}

interface Challenge {
  codigo: string
  nome: string
  descricao: string
  admin: string
  participantes: Participant[]
  checkins: CheckinPhoto[]
  checkinHoje: boolean
  criadoEm: string
  isAdmin: boolean
}

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const codigo = Array.isArray(params.codigo) ? params.codigo[0] : params.codigo

  useEffect(() => {
    if (session && codigo) {
      fetchChallengeDetails()
    }
  }, [session, codigo])

  const fetchChallengeDetails = async () => {
    try {
      const response = await fetch(`/api/challenges/${codigo}`)
      const data = await response.json()
      
      if (data.success) {
        setChallenge(data.challenge)
      } else {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive"
        })
        router.push("/competitions")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar desafio",
        variant: "destructive"
      })
      router.push("/competitions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/competitions?join=${codigo}`
    
    try {
      await navigator.clipboard.writeText(shareLink)
      toast({
        title: "Link copiado! 📋",
        description: "Compartilhe com seus amigos",
      })
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = shareLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      
      toast({
        title: "Link copiado! 📋",
        description: "Compartilhe com seus amigos",
      })
    }
  }

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Verificar tamanho do arquivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A foto deve ter no máximo 5MB",
        variant: "destructive"
      })
      return
    }

    // Verificar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Apenas imagens são aceitas",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedPhoto(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCheckin = async () => {
    if (!selectedPhoto) {
      toast({
        title: "Foto obrigatória",
        description: "Selecione uma foto para fazer o check-in",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch(`/api/challenges/${codigo}/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fotoBase64: selectedPhoto
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Check-in realizado! 🎉",
          description: data.message,
        })
        
        setCheckinDialogOpen(false)
        setSelectedPhoto(null)
        
        // Recarregar dados do desafio
        await fetchChallengeDetails()
      } else {
        toast({
          title: "Erro no check-in",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getRankingPosition = (pontos: number, participantes: Participant[]) => {
    const sorted = [...participantes].sort((a, b) => b.pontos - a.pontos)
    return sorted.findIndex(p => p.pontos === pontos) + 1
  }

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

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-muted-foreground mt-2">Faça login para acessar este desafio</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Desafio não encontrado</h1>
          <Button className="mt-4" onClick={() => router.push("/competitions")}>
            Voltar para Competições
          </Button>
        </div>
      </div>
    )
  }

  const sortedParticipants = [...challenge.participantes].sort((a, b) => b.pontos - a.pontos)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Trophy className="h-8 w-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold">{challenge.nome}</h1>
            {challenge.isAdmin && (
              <Badge variant="secondary" className="ml-3">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
          {challenge.descricao && (
            <p className="text-muted-foreground">{challenge.descricao}</p>
          )}
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            Criado em {new Date(challenge.criadoEm).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleCopyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Código: {challenge.codigo}
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Ranking e Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Ranking
                <Badge variant="secondary" className="ml-2">
                  {challenge.participantes.length} participantes
                </Badge>
              </CardTitle>
              <CardDescription>
                Pontuação baseada em check-ins diários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedParticipants.map((participant, index) => (
                  <div
                    key={participant.userId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                      index === 2 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
                      'bg-muted/30'
                    }`}
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
                        <p className="font-medium">{participant.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          #{index + 1} posição
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{participant.pontos}</p>
                      <p className="text-xs text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feed de Check-ins */}
          <CheckinFeed 
            checkins={challenge.checkins || []} 
            participantes={challenge.participantes}
          />
        </div>

        {/* Sidebar - Check-in e Stats */}
        <div className="space-y-6">
          {/* Check-in Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Check-in Diário
              </CardTitle>
              <CardDescription>
                Faça seu check-in hoje e ganhe 1 ponto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {challenge.checkinHoje ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Check-in realizado!</h3>
                  <p className="text-muted-foreground mb-4">
                    Você já fez seu check-in hoje. Volte amanhã!
                  </p>
                  <Badge variant="secondary">
                    <Zap className="h-3 w-3 mr-1" />
                    +1 ponto
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Faça seu check-in</h3>
                  <p className="text-muted-foreground mb-4">
                    Tire uma foto do seu treino ou atividade física
                  </p>
                  
                  <Dialog open={checkinDialogOpen} onOpenChange={setCheckinDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Fazer Check-in
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Check-in Diário</DialogTitle>
                        <DialogDescription>
                          Selecione uma foto para registrar sua atividade
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                          {selectedPhoto ? (
                            <div className="relative">
                              <img
                                src={selectedPhoto}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setSelectedPhoto(null)}
                              >
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Clique para selecionar uma foto</p>
                            </div>
                          )}
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handlePhotoSelect}
                          />
                          
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                          >
                            {selectedPhoto ? "Trocar Foto" : "Selecionar Foto"}
                          </Button>
                        </div>

                        <Button
                          onClick={handleCheckin}
                          disabled={!selectedPhoto || isUploading}
                          className="w-full"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar Check-in
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de participantes</span>
                <span className="font-semibold">{challenge.participantes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sua posição</span>
                <span className="font-semibold">
                  #{getRankingPosition(
                    challenge.participantes.find(p => p.userId === session?.user?.id)?.pontos || 0,
                    challenge.participantes
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seus pontos</span>
                <span className="font-semibold">
                  {challenge.participantes.find(p => p.userId === session?.user?.id)?.pontos || 0}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Líder atual</span>
                <span className="font-semibold">
                  {sortedParticipants[0]?.nome} ({sortedParticipants[0]?.pontos} pts)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}