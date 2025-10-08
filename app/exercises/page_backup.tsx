"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Dumbbell, Target, Clock, TrendingUp, ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import { Input } from "@/components/ui/form/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import Link from "next/link"

interface Exercise {
  _id: string
  name: string
  description: string
  category: string
  muscleGroups: string[]
  equipment: string[]
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  sets?: string
  reps?: string
  duration?: string
  calories?: number
  tips: string[]
  imageUrl?: string
}

interface ExercisesResponse {
  success: boolean
  data: {
    exercises: Exercise[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Filtros
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [difficulty, setDifficulty] = useState("all")
  const [equipment, setEquipment] = useState("all")
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalExercises, setTotalExercises] = useState(0)

  // Opções para filtros
  const categories = [
    { value: "all", label: "Todas as categorias" },
    { value: "Peito", label: "Peito" },
    { value: "Costas", label: "Costas" },
    { value: "Pernas", label: "Pernas" },
    { value: "Ombros", label: "Ombros" },
    { value: "Bíceps", label: "Bíceps" },
    { value: "Tríceps", label: "Tríceps" },
    { value: "Core", label: "Core" },
    { value: "Cardio", label: "Cardio" },
    { value: "Glúteos", label: "Glúteos" }
  ]

  const difficulties = [
    { value: "all", label: "Todas as dificuldades" },
    { value: "Iniciante", label: "Iniciante" },
    { value: "Intermediário", label: "Intermediário" },
    { value: "Avançado", label: "Avançado" }
  ]

  const equipments = [
    { value: "all", label: "Todos os equipamentos" },
    { value: "Peso corporal", label: "Peso corporal" },
    { value: "Halteres", label: "Halteres" },
    { value: "Barra", label: "Barra" },
    { value: "Máquina de cabo", label: "Máquina de cabo" },
    { value: "Banco", label: "Banco" }
  ]

  // Buscar exercícios
  const fetchExercises = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12"
      })
      
      if (search) params.append('search', search)
      if (category !== 'all') params.append('category', category)
      if (difficulty !== 'all') params.append('difficulty', difficulty)
      if (equipment !== 'all') params.append('equipment', equipment)

      const response = await fetch(`/api/exercises?${params}`)
      const data: ExercisesResponse = await response.json()

      if (data.success) {
        setExercises(data.data.exercises)
        setTotalPages(data.data.pagination.pages)
        setTotalExercises(data.data.pagination.total)
        setError("")
      } else {
        setError("Erro ao carregar exercícios")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Efeito para buscar exercícios quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [search, category, difficulty, equipment])

  useEffect(() => {
    fetchExercises()
  }, [currentPage, search, category, difficulty, equipment])

  // Popular exercícios (primeira vez)
  const populateExercises = async () => {
    try {
      const response = await fetch('/api/exercises/populate', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('Exercícios populados com sucesso!')
        fetchExercises()
      } else {
        alert('Erro ao popular exercícios')
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor')
    }
  }



  // Importar exercícios da RapidAPI ExerciseDB (com imagens)
  const importFromRapidAPI = async () => {
    const bodyParts = ['chest', 'back', 'shoulders', 'upper arms', 'upper legs', 'waist']
    let totalImported = 0
    
    try {
      setLoading(true)
      
      for (const bodyPart of bodyParts) {
        try {
          console.log(`Importando exercícios para: ${bodyPart}`)
          
          const response = await fetch(`/api/exercises/import?bodyPart=${bodyPart}&limit=10`, {
            method: 'POST'
          })
          
          const data = await response.json()
          
          if (data.success) {
            totalImported += data.data.imported
            console.log(`✅ ${bodyPart}: ${data.data.imported} exercícios importados`)
          } else {
            console.log(`❌ ${bodyPart}: ${data.error}`)
            if (data.details?.includes('API Error')) {
              alert('⚠️ Configure sua chave da RapidAPI primeiro!\n\n1. Acesse: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/\n2. Clique em "Subscribe" (plano gratuito)\n3. Copie sua X-RapidAPI-Key\n4. Cole no arquivo .env.local')
              return
            }
          }
          
          // Delay entre requests
          await new Promise(resolve => setTimeout(resolve, 800))
          
        } catch (error) {
          console.error(`Erro ao importar ${bodyPart}:`, error)
        }
      }
      
      alert(`🎉 Importação concluída!\n${totalImported} exercícios com GIFs importados da RapidAPI!`)
      fetchExercises()
      
    } catch (err) {
      alert('Erro durante a importação')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-700 border-green-200'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Avançado': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
            Explore Exercícios
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl">
            Descubra exercícios personalizados para cada grupo muscular e nível de experiência.
          </p>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="space-y-4 mb-8">
        {/* Pesquisa */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquise por exercícios, grupos musculares..."
            className="pl-10 h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={equipment} onValueChange={setEquipment}>
            <SelectTrigger>
              <SelectValue placeholder="Equipamento" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((eq) => (
                <SelectItem key={eq.value} value={eq.value}>
                  {eq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          {totalExercises > 0 ? `${totalExercises} exercícios encontrados` : 'Nenhum exercício encontrado'}
        </p>
        <div className="flex gap-2">
          {exercises.length === 0 && !loading && (
            <>
              <Button onClick={populateExercises} variant="outline">
                📝 Exercícios Básicos
              </Button>
              <Button onClick={importFromRapidAPI} variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                🖼️ Importar com IMAGENS (RapidAPI)
              </Button>
              <Button onClick={importFromAPI} variant="outline">
                🔤 API Básicos
              </Button>
              <Button onClick={importWithImages} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                � API Premium (Imagens)
              </Button>
            </>
          )}
          {exercises.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={importFromRapidAPI} variant="default" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                + Mais exercícios (RapidAPI)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchExercises} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Grid de Exercícios */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exercises.map((exercise) => (
            <Card key={exercise._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                {exercise.imageUrl ? (
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">💪</div>
                      <p className="text-sm">Exercício</p>
                    </div>
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </Badge>
                {exercise.imageUrl && (
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                    🖼️ GIF
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Grupos Musculares */}
                  <div>
                    <p className="text-sm font-medium mb-1">Grupos Musculares:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscleGroups.slice(0, 2).map((muscle) => (
                        <Badge key={muscle} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.muscleGroups.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{exercise.muscleGroups.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(exercise.sets || exercise.reps) && (
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {exercise.sets} {exercise.reps && `• ${exercise.reps}`}
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exercise.duration}
                      </div>
                    )}
                    {exercise.calories && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        ~{exercise.calories} cal
                      </div>
                    )}
                  </div>

                  {/* Equipamentos */}
                  <div>
                    <p className="text-sm font-medium mb-1">Equipamentos:</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Dumbbell className="h-4 w-4" />
                      {exercise.equipment.slice(0, 2).join(", ")}
                      {exercise.equipment.length > 2 && "..."}
                    </div>
                  </div>

                  <Link href={`/exercises/${exercise._id}`}>
                    <Button className="w-full mt-4" variant="outline">
                      Ver Detalhes
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}