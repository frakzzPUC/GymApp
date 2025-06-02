"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Loader2 } from "lucide-react"

export default function ProgramSelectionPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserProgram = async () => {
      try {
        if (status === "authenticated") {
          console.log("Sessão atual:", session)

          // Verificar se o usuário já tem um programa selecionado
          if (session?.user?.program) {
            console.log("Usuário já tem programa:", session.user.program)
            // Se já tem um programa, redirecionar para o dashboard
            router.push("/dashboard")
          } else {
            // Verificar no banco de dados se o usuário tem um programa
            const response = await fetch("/api/user/program")
            const data = await response.json()

            if (data.success && data.program) {
              console.log("Programa encontrado no banco de dados:", data.program)
              // Atualizar a sessão com o programa do usuário
              await update({ program: data.program })
              // Redirecionar para o dashboard
              router.push("/dashboard")
            } else {
              console.log("Usuário não tem programa, mostrando opções")
              setIsLoading(false)
            }
          }
        } else if (status === "unauthenticated") {
          console.log("Usuário não autenticado, redirecionando para login")
          // Se não estiver autenticado, redirecionar para o login
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro ao verificar programa do usuário:", error)
        setIsLoading(false)
      }
    }

    checkUserProgram()
  }, [status, session, router, update])

  const handleSelectProgram = (program: string) => {
    // Em uma aplicação real, você salvaria a escolha do usuário
    if (program === "rehabilitation") {
      router.push("/rehabilitation")
    } else if (program === "sedentary") {
      router.push("/sedentary")
    } else if (program === "training-diet") {
      router.push("/training-diet")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Verificando seu perfil...</h2>
          <p className="text-muted-foreground mt-2">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">FitJourney</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Escolha seu Programa</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Selecione o programa que melhor atende às suas necessidades atuais
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Reabilitação</CardTitle>
                <CardDescription>Exercícios específicos para aliviar dores musculares e articulares</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Tratamento para dores na lombar
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Exercícios para dores no pescoço
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Alívio para dores articulares
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Metas diárias personalizadas
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSelectProgram("rehabilitation")}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Saindo do Sedentarismo</CardTitle>
                <CardDescription>Programa gradual para quem está começando a se exercitar</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Exercícios de baixo impacto
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Acompanhamento semanal do IMC
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Adaptado à sua disponibilidade
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Progresso gradual e sustentável
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSelectProgram("sedentary")}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Treino + Dieta</CardTitle>
                <CardDescription>Programa completo com treinos e opções de dieta</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Treinos para todos os níveis
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Opções de dieta personalizadas
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Foco em emagrecimento ou ganho muscular
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-emerald-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Acompanhamento completo de progresso
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSelectProgram("training-diet")}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
