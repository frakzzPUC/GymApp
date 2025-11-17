"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/actions/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/feedback/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog";
import {
  Search,
  TrendingUp,
  Clock,
  Target,
  Dumbbell,
  ChevronRight,
  Filter,
  Loader2,
  Play,
  Info,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useExerciseDB } from "@/hooks/useExerciseDB";
import { Exercise } from "@/lib/exercisedb-client";
import SimpleExerciseImage from "@/components/ui/simple-exercise-image";

// Ícones para partes do corpo
const BODY_PART_ICONS: { [key: string]: string } = {
  back: "🔙",
  cardio: "❤️",
  chest: "💪",
  arms: "💪",
  legs: "🦵",
  core: "🎯",
  shoulders: "⚡",
};

// Traduções simples para português
const BODY_PARTS_TRANSLATION: { [key: string]: string } = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  arms: "Braços",
  legs: "Pernas",
  core: "Core/Abdômen",
};

export default function ExploreExercisesSection() {
  const {
    exercises,
    loading,
    error,
    getAllExercises,
    getExercisesByBodyPart,
    searchExercises,
    categories,
    loadCategories,
  } = useExerciseDB();

  // Debug: monitorar mudanças nos exercícios
  React.useEffect(() => {
    console.log(
      "🎭 Componente: exercises mudou para:",
      exercises?.length || 0,
      "exercícios"
    );
    if (exercises?.length > 0) {
      console.log("🎭 Primeiro exercício:", exercises[0]);
    }
  }, [exercises]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Carregar categorias e alguns exercícios iniciais
    const loadInitialData = async () => {
      try {
        await loadCategories();
        await getAllExercises(30); // Carregar 30 exercícios iniciais para melhor variedade
      } catch (error) {
        console.error("❌ Erro ao carregar dados iniciais:", error);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchExercises(searchTerm);
    } else {
      await getAllExercises(16);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBodyPartFilter = async (bodyPart: string) => {
    if (selectedBodyPart === bodyPart) {
      setSelectedBodyPart("");
      await getAllExercises(16);
    } else {
      setSelectedBodyPart(bodyPart);
      await getExercisesByBodyPart(bodyPart);
    }
    setSearchTerm("");
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  // Criar categorias com contadores baseados nos body parts disponíveis
  const safeCategories = Array.isArray(categories)
    ? categories
    : ["chest", "back", "shoulders", "arms", "legs", "abs"];

  // Contadores fixos para evitar problemas de hidratação (baseados na API real)
  const bodyPartCounts: { [key: string]: number } = {
    chest: 67,
    back: 123,
    shoulders: 89,
    arms: 42,
    legs: 184,
    abs: 45,
    core: 45,
    cardio: 78,
    "upper arms": 42,
    "lower arms": 23,
    "upper legs": 98,
    "lower legs": 86,
    waist: 45,
    neck: 12,
  };

  const categoryItems = safeCategories.map((bodyPart: string) => {
    const translatedName = BODY_PARTS_TRANSLATION[bodyPart] || bodyPart;
    return {
      name: translatedName,
      nameEn: bodyPart,
      value: bodyPart,
      count: bodyPartCounts[bodyPart] || 30, // Usar contadores fixos
      icon: BODY_PART_ICONS[bodyPart] || "💪",
    };
  });

  const displayedCategories = showAllCategories
    ? categoryItems
    : categoryItems.slice(0, 8);

  return (
    <section
      id="exercises"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Explore Exercícios
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Descubra exercícios profissionais da ExerciseDB com mais de 1300+
              opções, GIFs animados e instruções detalhadas.
            </p>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Pesquise por exercícios específicos..."
              className="w-full pl-10 pr-20 h-12 text-base border rounded-lg bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-1" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Categorias Populares */}
        {categoryItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Partes do Corpo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "Mostrar menos" : "Ver todas"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedCategories.map((category: any) => (
                <Badge
                  key={category.value}
                  variant={
                    selectedBodyPart === category.value
                      ? "default"
                      : "secondary"
                  }
                  className={`px-3 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
                    selectedBodyPart === category.value
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                  onClick={() => handleBodyPartFilter(category.value)}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status de busca */}
        {searchTerm && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Resultados para: <strong>"{searchTerm}"</strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setSearchTerm("");
                  await getAllExercises(30);
                }}
              >
                Limpar busca
              </Button>
            </div>
          </div>
        )}

        {selectedBodyPart && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Exercícios para:{" "}
                  <strong>
                    {BODY_PARTS_TRANSLATION[selectedBodyPart] ||
                      selectedBodyPart}
                  </strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setSelectedBodyPart("");
                  await getAllExercises(30);
                }}
              >
                Remover filtro
              </Button>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300">
                <strong>Erro:</strong> {error}
              </span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
              <p className="text-muted-foreground">
                Carregando exercícios da ExerciseDB API...
              </p>
              <p className="text-xs text-gray-500">
                Verifique o console do navegador para logs de debug
              </p>
            </div>
          </div>
        )}

        {/* Lista de Exercícios */}
        {!loading && Array.isArray(exercises) && exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {exercises.map((exercise: Exercise, index: number) => (
              <Card
                key={exercise.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-muted overflow-hidden"
                onClick={() => handleExerciseClick(exercise)}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
                  <SimpleExerciseImage
                    exercise={exercise}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                      <Play className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {exercise.bodyPart || "Exercício"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {exercise.targetMuscle && (
                      <Badge variant="secondary" className="text-xs">
                        {exercise.targetMuscle}
                      </Badge>
                    )}
                    {exercise.equipment && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Principal
                    </span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          (!Array.isArray(exercises) || exercises.length === 0) &&
          !error && (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">
                  Nenhum exercício carregado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  A API da ExerciseDB não retornou exercícios. Verifique o
                  console do navegador para mais detalhes.
                </p>
                <div className="space-x-2">
                  <Button onClick={() => getAllExercises(30)}>
                    🔄 Tentar Novamente
                  </Button>
                  <Button onClick={() => getAllExercises(50)} variant="outline">
                    🚀 Carregar Mais Exercícios
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estado atual: exercises=
                  {Array.isArray(exercises)
                    ? `Array[${exercises.length}]`
                    : typeof exercises}
                  , loading={loading.toString()}, error={error || "null"}
                </p>
              </div>
            </div>
          )}

        {/* CTA para mais exercícios */}
        {Array.isArray(exercises) &&
          exercises.length > 0 &&
          exercises.length >= 20 && (
            <div className="text-center mt-8">
              <Button
                onClick={async () =>
                  await getAllExercises(
                    (Array.isArray(exercises) ? exercises.length : 0) + 20
                  )
                }
                disabled={loading}
                variant="outline"
                className="bg-background hover:bg-emerald-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    Carregar mais exercícios
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
      </div>

      {/* Modal de Detalhes do Exercício */}
      {selectedExercise && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedExercise.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Imagem do exercício */}
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
                <SimpleExerciseImage
                  exercise={selectedExercise}
                  className="w-full h-full"
                />
              </div>

              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedExercise.targetMuscle && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="font-semibold">Músculo Alvo</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedExercise.targetMuscle}
                    </div>
                  </div>
                )}
                {selectedExercise.equipment && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Dumbbell className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold">Equipamento</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedExercise.equipment}
                    </div>
                  </div>
                )}
                {selectedExercise.bodyPart && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold">Parte do Corpo</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedExercise.bodyPart}
                    </div>
                  </div>
                )}
                {/* Informações do ID sempre disponíveis */}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">ID do Exercício</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedExercise.id}
                  </div>
                </div>
              </div>

              {/* Instruções */}
              {selectedExercise.instructions &&
                selectedExercise.instructions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Instruções</h4>
                    <div className="space-y-3">
                      {selectedExercise.instructions.map(
                        (instruction, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <p className="text-sm leading-relaxed">
                              {instruction}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
