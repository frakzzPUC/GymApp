"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Bell, Camera, CheckCircle, Edit, Lock, LogOut, Save, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  // Dados do usuário (simulados)
  const [userData, setUserData] = useState({
    name: "Maria Silva",
    email: "maria.silva@exemplo.com",
    phone: "(11) 98765-4321",
    birthdate: "1990-05-15",
    height: "168",
    weight: "65",
    program: "training-diet",
    programName: "Treino + Dieta",
    goal: "lose-weight",
    goalName: "Emagrecer",
    gender: "female",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  })

  // Estatísticas do usuário (simuladas)
  const stats = {
    daysActive: 45,
    workoutsCompleted: 38,
    streakDays: 12,
    weightLost: 3.5,
    startDate: "15/02/2023",
  }

  useEffect(() => {
    // Função para buscar dados do usuário
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()

        if (data.success) {
          // Atualizar o estado com os dados do usuário
          setUserData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            birthdate: data.user.birthdate ? new Date(data.user.birthdate).toISOString().split("T")[0] : "",
            height: data.user.height?.toString() || "",
            weight: data.user.weight?.toString() || "",
            program: data.user.program || "",
            programName: getProgramName(data.user.program),
            goal: data.user.goal || "",
            goalName: getGoalName(data.user.goal),
            gender: data.user.gender || "",
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
      }
    }

    fetchUserData()
  }, [])

  // Adicione estas funções auxiliares
  const getProgramName = (program: string) => {
    switch (program) {
      case "rehabilitation":
        return "Reabilitação"
      case "sedentary":
        return "Saindo do Sedentarismo"
      case "training-diet":
        return "Treino + Dieta"
      default:
        return ""
    }
  }

  const getGoalName = (goal: string) => {
    switch (goal) {
      case "lose-weight":
        return "Emagrecer"
      case "gain-muscle":
        return "Ganhar Massa Muscular"
      case "maintain":
        return "Manter Forma Física"
      default:
        return ""
    }
  }

  const handleSaveProfile = () => {
    // Em uma aplicação real, aqui seria feita a chamada à API para salvar os dados
    setIsEditing(false)
    setShowSuccessAlert(true)

    // Esconde o alerta após 3 segundos
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)
  }

  const handleLogout = () => {
    // Em uma aplicação real, aqui seria feito o logout
    router.push("/")
  }

  // Verificar o tipo de programa do usuário
  const isProgramTrainingDiet = userData.program === "training-diet"
  const isProgramRehabilitation = userData.program === "rehabilitation"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="font-bold text-xl">
              FitJourney
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {showSuccessAlert && (
            <Alert className="mb-6 bg-emerald-50 text-emerald-800 border-emerald-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>Suas informações foram atualizadas com sucesso.</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/3">
              <Card>
                <CardHeader className="pb-2 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
                        <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-800">
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Alterar foto</span>
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{userData.name}</CardTitle>
                  <CardDescription>{userData.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Programa:</span>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                        {userData.programName}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Objetivo:</span>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                        {userData.goalName}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.daysActive}</p>
                        <p className="text-xs text-muted-foreground">Dias ativos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.workoutsCompleted}</p>
                        <p className="text-xs text-muted-foreground">Treinos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.streakDays}</p>
                        <p className="text-xs text-muted-foreground">Sequência</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stats.weightLost} kg</p>
                        <p className="text-xs text-muted-foreground">Perdidos</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      <p>Membro desde: {stats.startDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">
                    <User className="mr-2 h-4 w-4" />
                    Dados Pessoais
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Lock className="mr-2 h-4 w-4" />
                    Segurança
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notificações
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Informações Pessoais</CardTitle>
                          <CardDescription>Atualize seus dados pessoais</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                          {isEditing ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Salvar
                            </>
                          ) : (
                            <>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                              id="name"
                              value={userData.name}
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userData.email}
                              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              value={userData.phone}
                              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="birthdate">Data de Nascimento</Label>
                            <Input
                              id="birthdate"
                              type="date"
                              value={userData.birthdate}
                              onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          {!isProgramRehabilitation && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="height">Altura (cm)</Label>
                                <Input
                                  id="height"
                                  type="number"
                                  value={userData.height}
                                  onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="weight">Peso Atual (kg)</Label>
                                <Input
                                  id="weight"
                                  type="number"
                                  value={userData.weight}
                                  onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gênero</Label>
                          <Select
                            value={userData.gender}
                            onValueChange={(value) => setUserData({ ...userData, gender: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Selecione seu gênero" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Masculino</SelectItem>
                              <SelectItem value="female">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="program">Programa Atual</Label>
                          <div className="p-2 bg-muted rounded-md">
                            <span className="font-medium">{userData.programName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Para mudar de programa, entre em contato com o suporte.
                          </p>
                        </div>

                        {isProgramTrainingDiet && (
                          <div className="space-y-2">
                            <Label htmlFor="goal">Objetivo</Label>
                            <div className="p-2 bg-muted rounded-md">
                              <span className="font-medium">{userData.goalName}</span>
                            </div>
                          </div>
                        )}
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      {isEditing && (
                        <Button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-700">
                          Salvar Alterações
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Alterar Senha</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha Atual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Atualizar Senha</Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Sessões Ativas</h3>
                        <div className="rounded-md border p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Este dispositivo</p>
                              <p className="text-sm text-muted-foreground">São Paulo, Brasil • Último acesso: Agora</p>
                            </div>
                            <Badge>Atual</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Encerrar Todas as Outras Sessões
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Excluir Conta</h3>
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Atenção</AlertTitle>
                          <AlertDescription>
                            Excluir sua conta é uma ação permanente e não pode ser desfeita. Todos os seus dados serão
                            removidos.
                          </AlertDescription>
                        </Alert>
                        <Button variant="destructive">Excluir Minha Conta</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notificações</CardTitle>
                      <CardDescription>Gerencie como você recebe notificações</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preferências de Notificação</h3>

                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="email-notifications" className="flex-1">
                            <div className="font-medium">Notificações por Email</div>
                            <div className="text-sm text-muted-foreground">
                              Receba lembretes e atualizações por email
                            </div>
                          </Label>
                          <Switch
                            id="email-notifications"
                            checked={userData.notifications.email}
                            onCheckedChange={(checked) =>
                              setUserData({
                                ...userData,
                                notifications: { ...userData.notifications, email: checked },
                              })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="push-notifications" className="flex-1">
                            <div className="font-medium">Notificações Push</div>
                            <div className="text-sm text-muted-foreground">Receba alertas no seu navegador</div>
                          </Label>
                          <Switch
                            id="push-notifications"
                            checked={userData.notifications.push}
                            onCheckedChange={(checked) =>
                              setUserData({
                                ...userData,
                                notifications: { ...userData.notifications, push: checked },
                              })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="sms-notifications" className="flex-1">
                            <div className="font-medium">Notificações por SMS</div>
                            <div className="text-sm text-muted-foreground">Receba lembretes por mensagem de texto</div>
                          </Label>
                          <Switch
                            id="sms-notifications"
                            checked={userData.notifications.sms}
                            onCheckedChange={(checked) =>
                              setUserData({
                                ...userData,
                                notifications: { ...userData.notifications, sms: checked },
                              })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tipos de Notificação</h3>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="workout-reminders"
                              className="rounded border-gray-300"
                              defaultChecked
                            />
                            <Label htmlFor="workout-reminders">Lembretes de treino</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="progress-updates"
                              className="rounded border-gray-300"
                              defaultChecked
                            />
                            <Label htmlFor="progress-updates">Atualizações de progresso</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="new-features"
                              className="rounded border-gray-300"
                              defaultChecked
                            />
                            <Label htmlFor="new-features">Novos recursos e atualizações</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="tips" className="rounded border-gray-300" defaultChecked />
                            <Label htmlFor="tips">Dicas e conteúdo educacional</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700">Salvar Preferências</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FitJourney. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
