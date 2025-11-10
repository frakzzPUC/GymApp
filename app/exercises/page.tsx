"use client"

import ExploreExercisesSection from '@/components/home/ExploreExercisesSectionNew'

export default function ExercisesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Explorar Exercícios</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra uma ampla variedade de exercícios com instruções detalhadas e animações visuais
        </p>
      </div>
      
      <ExploreExercisesSection />
    </div>
  )
}
