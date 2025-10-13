"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface Participant {
  userId: string
  nome: string
  fotoPerfil?: string
  pontos: number
  joinedAt: string
}

export interface Challenge {
  _id?: string
  codigo: string
  nome: string
  descricao: string
  admin: string
  participantes: Participant[]
  checkinHoje?: boolean
  criadoEm: string
  isAdmin?: boolean
}

interface CreateChallengeData {
  nome: string
  descricao?: string
}

interface UseChallengesReturn {
  // State
  challenges: Challenge[]
  isLoading: boolean
  isCreating: boolean
  isJoining: boolean
  
  // Actions
  fetchChallenges: () => Promise<void>
  createChallenge: (data: CreateChallengeData) => Promise<{ success: boolean; challenge?: Challenge; error?: string }>
  joinChallenge: (codigo: string) => Promise<{ success: boolean; challenge?: Challenge; error?: string }>
  getChallengeDetails: (codigo: string) => Promise<{ success: boolean; challenge?: Challenge; error?: string }>
  makeCheckin: (codigo: string, fotoBase64: string) => Promise<{ success: boolean; message?: string; error?: string }>
}

export function useChallenges(): UseChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  
  const { toast } = useToast()

  const fetchChallenges = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      
      if (data.success) {
        setChallenges(data.challenges)
      } else {
        toast({
          title: "Erro ao carregar desafios",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar desafios",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createChallenge = useCallback(async (data: CreateChallengeData) => {
    if (!data.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o desafio",
        variant: "destructive"
      })
      return { success: false, error: "Nome obrigatório" }
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Desafio criado! 🎉",
          description: `Código: ${result.challenge.codigo}`,
        })
        
        // Atualizar lista local de desafios
        await fetchChallenges()
        
        return { success: true, challenge: result.challenge }
      } else {
        toast({
          title: "Erro ao criar desafio",
          description: result.error,
          variant: "destructive"
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      })
      return { success: false, error: "Erro interno do servidor" }
    } finally {
      setIsCreating(false)
    }
  }, [toast, fetchChallenges])

  const joinChallenge = useCallback(async (codigo: string) => {
    if (!codigo.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código do desafio",
        variant: "destructive"
      })
      return { success: false, error: "Código obrigatório" }
    }

    setIsJoining(true)
    try {
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigo: codigo.toUpperCase()
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sucesso! 🎉",
          description: result.message,
        })
        
        // Atualizar lista local de desafios
        await fetchChallenges()
        
        return { success: true, challenge: result.challenge }
      } else {
        toast({
          title: "Erro ao entrar no desafio",
          description: result.error,
          variant: "destructive"
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      })
      return { success: false, error: "Erro interno do servidor" }
    } finally {
      setIsJoining(false)
    }
  }, [toast, fetchChallenges])

  const getChallengeDetails = useCallback(async (codigo: string) => {
    try {
      const response = await fetch(`/api/challenges/${codigo}`)
      const result = await response.json()
      
      if (result.success) {
        return { success: true, challenge: result.challenge }
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive"
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error getting challenge details:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do desafio",
        variant: "destructive"
      })
      return { success: false, error: "Erro ao carregar detalhes do desafio" }
    }
  }, [toast])

  const makeCheckin = useCallback(async (codigo: string, fotoBase64: string) => {
    if (!fotoBase64) {
      toast({
        title: "Foto obrigatória",
        description: "Selecione uma foto para fazer o check-in",
        variant: "destructive"
      })
      return { success: false, error: "Foto obrigatória" }
    }

    try {
      const response = await fetch(`/api/challenges/${codigo}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fotoBase64
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Check-in realizado! 🎉",
          description: result.message,
        })
        return { success: true, message: result.message }
      } else {
        toast({
          title: "Erro no check-in",
          description: result.error,
          variant: "destructive"
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error making checkin:', error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      })
      return { success: false, error: "Erro interno do servidor" }
    }
  }, [toast])

  return {
    // State
    challenges,
    isLoading,
    isCreating,
    isJoining,
    
    // Actions
    fetchChallenges,
    createChallenge,
    joinChallenge,
    getChallengeDetails,
    makeCheckin
  }
}

// Hook para compartilhamento de desafios
interface UseShareChallengeReturn {
  copyInviteLink: (codigo: string) => Promise<void>
  generateShareText: (challengeName: string, codigo: string) => string
}

export function useShareChallenge(): UseShareChallengeReturn {
  const { toast } = useToast()

  const copyInviteLink = useCallback(async (codigo: string) => {
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
  }, [toast])

  const generateShareText = useCallback((challengeName: string, codigo: string) => {
    return `🏋️ Vamos treinar juntos! Entrei no desafio "${challengeName}" e convido você para participar também!
    
💪 Use o código: ${codigo}
🔗 Ou acesse: ${window.location.origin}/competitions?join=${codigo}

Vamos nos motivar e conquistar nossos objetivos fitness! 🎯`
  }, [])

  return {
    copyInviteLink,
    generateShareText
  }
}