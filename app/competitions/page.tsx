"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Badge } from "@/components/ui/feedback/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlay/dialog"
import {
  Trophy,
  Users,
  Plus,
  ArrowRight,
  Target,
  Calendar,
  Sparkles,
  Crown,
  Gamepad2,
  Zap
} from "lucide-react"

interface Challenge {
  _id: string
  codigo: string
  nome: string
  descricao: string
  admin: string
  participantes: Array<{
    userId: string
    nome: string
    fotoPerfil?: string
    pontos: number
  }>
  criadoEm: string
}

export default function CompetitionsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [challengeName, setChallengeName] = useState("")
  const [challengeDescription, setChallengeDescription] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (session) {
      fetchMyChallenges()
    }
  }, [session])

  const fetchMyChallenges = async () => {
    try {
      const response = await fetch("/api/challenges")
      const data = await response.json()
      
      if (data.success) {
        setMyChallenges(data.challenges)
      }
    } catch (error) {
      console.error("Erro ao buscar desafios:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChallenge = async () => {
    if (!challengeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o desafio",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: challengeName,
          descricao: challengeDescription
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Desafio criado! 🎉",
          description: `Código: ${data.challenge.codigo}`,
        })
        
        setCreateDialogOpen(false)
        setChallengeName("")
        setChallengeDescription("")
        
        // Redirecionar para o desafio criado
        router.push(`/competitions/${data.challenge.codigo}`)
      } else {
        toast({
          title: "Erro ao criar desafio",
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
      setIsCreating(false)
    }
  }

  const handleJoinChallenge = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código do desafio",
        variant: "destructive"
      })
      return
    }

    setIsJoining(true)

    try {
      const response = await fetch("/api/challenges/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          codigo: joinCode.toUpperCase()
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso! 🎉",
          description: data.message,
        })
        
        setJoinDialogOpen(false)
        setJoinCode("")
        
        // Redirecionar para o desafio
        router.push(`/competitions/${joinCode.toUpperCase()}`)
      } else {
        toast({
          title: "Erro ao entrar no desafio",
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
      setIsJoining(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-muted-foreground mt-2">Faça login para acessar as competições</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mr-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Competições
            </h1>
            <p className="text-xl text-muted-foreground">Desafie seus amigos e conquiste seus objetivos</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1" />
            Check-ins diários
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Ranking em tempo real
          </div>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            Motivação em grupo
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="mr-2 h-5 w-5" />
              Criar Desafio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                Criar Novo Desafio
              </DialogTitle>
              <DialogDescription>
                Crie um desafio fitness e convide seus amigos para participar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="challenge-name">Nome do Desafio</Label>
                <Input
                  id="challenge-name"
                  placeholder="Ex: Desafio 30 Dias"
                  value={challengeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChallengeName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="challenge-description">Descrição (opcional)</Label>
                <Input
                  id="challenge-description"
                  placeholder="Ex: Treinar todos os dias por 30 dias"
                  value={challengeDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChallengeDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateChallenge}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Criar Desafio
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Users className="mr-2 h-5 w-5" />
              Entrar em Desafio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-500" />
                Entrar em Desafio
              </DialogTitle>
              <DialogDescription>
                Digite o código do desafio para se juntar aos seus amigos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="join-code">Código do Desafio</Label>
                <Input
                  id="join-code"
                  placeholder="Ex: ABC123"
                  value={joinCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-wider"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleJoinChallenge}
                disabled={isJoining}
                className="w-full"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Entrar no Desafio
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-8" />

      {/* My Challenges */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-orange-500" />
          Meus Desafios
          {myChallenges.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {myChallenges.length}
            </Badge>
          )}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : myChallenges.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum desafio encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro desafio ou entre em um desafio de amigos
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Desafio
                </Button>
                <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Entrar em Desafio
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChallenges.map((challenge) => (
              <Card key={challenge._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{challenge.nome}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Criado em {new Date(challenge.criadoEm).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {challenge.codigo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {challenge.descricao && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {challenge.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {challenge.participantes.length} participantes
                    </div>
                    {challenge.admin === session?.user?.id && (
                      <Badge variant="secondary">
                        <Crown className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => router.push(`/competitions/${challenge.codigo}`)}
                  >
                    Ver Desafio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}