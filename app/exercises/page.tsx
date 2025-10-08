"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/actions/button"

interface Exercise {
  _id: string
  name: string
  description?: string
  bodyPart?: string
  category?: string
  equipment: string | string[]
  gifUrl?: string
  imageUrl?: string
  target?: string
  muscleGroups?: string[]
  secondaryMuscles?: string[]
  instructions: string[]
  difficulty?: string
  tips?: string[]
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Carregar exercícios quando a página carrega
  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const result = await response.json()
        // A API retorna { success: true, data: { exercises: [...] } }
        if (result.success && result.data?.exercises) {
          setExercises(result.data.exercises)
        } else {
          setExercises([])
        }
      }
    } catch (err) {
      console.error('Erro ao carregar exercícios:', err)
    } finally {
      setInitialLoading(false)
    }
  }

  const importFromRapidAPI = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/exercises/import?bodyPart=chest&limit=5', {
        method: 'POST'
      })
      const data = await response.json()
      alert('Importado: ' + data.imported + ' exercícios')
      // Recarregar a lista
      loadExercises()
    } catch (err) {
      alert('Erro: ' + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Exercícios</h1>
      
      <div className="flex gap-4 mb-8">
        <Button 
          onClick={importFromRapidAPI} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Importando...' : '🔥 Importar Exercícios'}
        </Button>
      </div>
      
      {initialLoading ? (
        <div className="text-center py-8">
          <p>Carregando exercícios...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum exercício encontrado.</p>
          <p className="text-sm text-gray-400">Clique no botão acima para importar exercícios da RapidAPI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div key={exercise._id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <div className="relative">
                <img 
                  src={exercise.imageUrl || exercise.gifUrl || '/placeholder.svg?height=300&width=400'}
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=400'
                  }}
                />
                {/* Indicador de tipo de mídia */}
                <div className="absolute top-2 right-2">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {exercise.imageUrl && exercise.imageUrl.includes('exercisedb') ? 'GIF' : 'IMG'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{exercise.name}</h3>
                
                {exercise.description && (
                  <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(exercise.bodyPart || exercise.category) && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {exercise.bodyPart || exercise.category}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : exercise.equipment}
                    </span>
                    {exercise.difficulty && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {exercise.difficulty}
                      </span>
                    )}
                  </div>
                  
                  {exercise.target && (
                    <p><strong>Músculo Principal:</strong> {exercise.target}</p>
                  )}
                  
                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                    <p><strong>Grupos Musculares:</strong> {exercise.muscleGroups.join(', ')}</p>
                  )}
                  
                  {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                    <p><strong>Músculos Secundários:</strong> {exercise.secondaryMuscles.join(', ')}</p>
                  )}
                </div>
                
                <details className="mt-3">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Ver Instruções
                  </summary>
                  <ol className="mt-2 text-sm space-y-1 pl-4">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index} className="list-decimal">{instruction}</li>
                    ))}
                  </ol>
                </details>
                
                {exercise.tips && exercise.tips.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-green-600 hover:text-green-800">
                      Ver Dicas
                    </summary>
                    <ul className="mt-2 text-sm space-y-1 pl-4">
                      {exercise.tips.map((tip, index) => (
                        <li key={index} className="list-disc">{tip}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="mt-4">
          <p>Importando exercícios da RapidAPI...</p>
        </div>
      )}
    </div>
  )
}
