import { useState } from "react"
import { useSession } from "next-auth/react"

export const PAIN_OPTIONS = [
  { id: "lower-back", label: "Dor na lombar" },
  { id: "neck", label: "Dor no pescoço" },
  { id: "shoulder", label: "Dor nos ombros" },
  { id: "knee", label: "Dor nos joelhos" },
  { id: "hip", label: "Dor no quadril" },
  { id: "wrist", label: "Dor nos pulsos" },
]

export function useRehabilitationForm() {
  const { update } = useSession()
  const [selectedPains, setSelectedPains] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePainToggle = (painId: string) => {
    setSelectedPains((prev) => {
      if (prev.includes(painId)) {
        return prev.filter((id) => id !== painId)
      } else {
        return [...prev, painId]
      }
    })

    // Limpar erro quando o usuário seleciona uma opção
    if (error) {
      setError(null)
    }
  }

  const submitForm = async (): Promise<{ success: boolean; message?: string }> => {
    if (selectedPains.length === 0) {
      setError("Por favor, selecione pelo menos uma área de dor")
      return { success: false, message: "Por favor, selecione pelo menos uma área de dor" }
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Enviando áreas de dor para a API:", selectedPains)

      const response = await fetch("/api/rehabilitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          painAreas: selectedPains,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (data.success) {
        console.log("Perfil salvo com sucesso, atualizando sessão")

        // Atualizar a sessão com o novo programa
        try {
          await update({ program: "rehabilitation" })
          console.log("Sessão atualizada com sucesso")
        } catch (updateError) {
          console.error("Erro ao atualizar sessão:", updateError)
          // Continuar mesmo com erro na atualização da sessão
        }

        return { success: true }
      } else {
        console.error("Erro retornado pela API:", data.message)
        const errorMessage = data.message || "Erro ao salvar perfil de reabilitação"
        setError(errorMessage)
        return { success: false, message: errorMessage }
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      const errorMessage = "Erro ao conectar com o servidor. Tente novamente mais tarde."
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectedPains,
    error,
    isLoading,
    handlePainToggle,
    submitForm,
    setError
  }
}