import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export type DietType = "economic" | "balanced" | "premium"

interface UseDietOptionsReturn {
  selectedDiet: DietType | null
  setSelectedDiet: (diet: DietType | null) => void
  isLoading: boolean
  isPageLoading: boolean
  error: string | null
  setError: (error: string | null) => void
  handleSubmit: () => Promise<void>
}

export function useDietOptions(): UseDietOptionsReturn {
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { data: session, status, update } = useSession()

  // Verificar se o usuário tem o programa training-diet
  const checkUserProgram = useCallback(async () => {
    try {
      if (status === "authenticated") {
        console.log("Sessão atual:", session)

        // Verificar se o usuário tem o programa training-diet
        if (session?.user?.program !== "training-diet") {
          console.log("Usuário não tem o programa training-diet, verificando no banco de dados")

          try {
            const response = await fetch("/api/user/program")

            if (!response.ok) {
              throw new Error(`Erro ao buscar programa: ${response.status}`)
            }

            const data = await response.json()

            if (data.success && data.program === "training-diet") {
              console.log("Programa training-diet encontrado no banco de dados")
              // Atualizar a sessão com o programa do usuário
              try {
                await update({ program: data.program })
                setIsPageLoading(false)
              } catch (updateError) {
                console.error("Erro ao atualizar sessão:", updateError)
                // Continuar mesmo com erro na atualização da sessão
                setIsPageLoading(false)
              }
            } else {
              console.log("Usuário não tem o programa training-diet, redirecionando para seleção de programa")
              // Se não tem, redirecionar para a seleção de programa
              router.push("/program-selection")
            }
          } catch (fetchError) {
            console.error("Erro ao verificar programa do usuário:", fetchError)
            setError("Erro ao verificar seu programa. Continuando com a seleção de dieta.")
            setIsPageLoading(false)
          }
        } else {
          setIsPageLoading(false)
        }
      } else if (status === "unauthenticated") {
        // Se não estiver autenticado, redirecionar para o login
        router.push("/login")
      }
    } catch (error) {
      console.error("Erro geral na verificação:", error)
      setError("Ocorreu um erro ao verificar seu perfil. Por favor, tente novamente.")
      setIsPageLoading(false)
    }
  }, [status, session, router, update])

  // Salvar a escolha da dieta
  const handleSubmit = async () => {
    if (!selectedDiet) return

    try {
      setIsLoading(true)
      setError(null)
      console.log("Enviando tipo de dieta para a API:", selectedDiet)

      const response = await fetch("/api/training-diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietType: selectedDiet,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (data.success) {
        console.log("Dieta salva com sucesso, redirecionando para o dashboard")
        // Dieta salva com sucesso, redirecionar para o dashboard
        router.push("/dashboard")
      } else {
        // Exibir mensagem de erro
        console.error("Erro ao salvar dieta:", data.message)
        setError(data.message || "Erro ao salvar dieta. Por favor, tente novamente.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Erro ao salvar dieta:", error)
      setError("Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkUserProgram()
  }, [checkUserProgram])

  return {
    selectedDiet,
    setSelectedDiet,
    isLoading,
    isPageLoading,
    error,
    setError,
    handleSubmit
  }
}