"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/feedback/badge";
import { Button } from "@/components/ui/actions/button";
import {
  Dumbbell,
  Clock,
  Calendar,
  Zap,
  Target,
  Filter,
  ChevronDown,
  Activity,
  Award,
  BarChart3,
} from "lucide-react";

interface WorkoutRecord {
  date: string;
  completed: boolean;
  duration?: number;
  exerciseCount?: number;
  workoutType?: string;
  calories?: number;
  notes?: string;
}

interface WorkoutHistoryProps {
  workouts: WorkoutRecord[];
  totalWorkouts: number;
  totalMinutes: number;
  averageDuration: number;
}

export function WorkoutHistory({
  workouts,
  totalWorkouts,
  totalMinutes,
  averageDuration,
}: WorkoutHistoryProps) {
  const [filter, setFilter] = useState<
    "all" | "strength" | "cardio" | "flexibility" | "mixed"
  >("all");
  const [showAll, setShowAll] = useState(false);

  // Filtrar treinos
  const filteredWorkouts = workouts.filter((workout) => {
    if (filter === "all") return true;
    return workout.workoutType === filter;
  });

  // Limitar exibição inicial
  const displayedWorkouts = showAll
    ? filteredWorkouts
    : filteredWorkouts.slice(0, 10);

  // Função para obter ícone do tipo de treino
  const getWorkoutIcon = (type?: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="h-4 w-4" />;
      case "cardio":
        return <Zap className="h-4 w-4" />;
      case "flexibility":
        return <Target className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Função para obter cor do tipo de treino
  const getWorkoutColor = (type?: string) => {
    switch (type) {
      case "strength":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cardio":
        return "bg-red-100 text-red-800 border-red-200";
      case "flexibility":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter nome do tipo de treino
  const getWorkoutTypeName = (type?: string) => {
    switch (type) {
      case "strength":
        return "Força";
      case "cardio":
        return "Cardio";
      case "flexibility":
        return "Flexibilidade";
      default:
        return "Misto";
    }
  };

  // Calcular estatísticas dos treinos filtrados
  const filteredStats = {
    count: filteredWorkouts.length,
    totalDuration: filteredWorkouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0
    ),
    averageDuration:
      filteredWorkouts.length > 0
        ? filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) /
          filteredWorkouts.length
        : 0,
    totalCalories: filteredWorkouts.reduce(
      (sum, w) => sum + (w.calories || 0),
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
                <p className="text-xs text-gray-500">Treinos totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(totalMinutes / 60)}h
                </p>
                <p className="text-xs text-gray-500">Tempo total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(averageDuration)}
                </p>
                <p className="text-xs text-gray-500">Min por treino</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredStats.totalCalories}
                </p>
                <p className="text-xs text-gray-500">Calorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de treinos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Treinos
              </CardTitle>
              <CardDescription>Seus treinos mais recentes</CardDescription>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">Todos</option>
                <option value="strength">Força</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
                <option value="mixed">Misto</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {displayedWorkouts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum treino encontrado</p>
              <p className="text-sm mt-1">
                {filter === "all"
                  ? "Comece seu primeiro treino hoje!"
                  : "Nenhum treino deste tipo registrado"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedWorkouts.map((workout, index) => (
                <div
                  key={index}
                  className={`
                    p-4 border rounded-lg transition-all duration-200 hover:shadow-md
                    ${
                      workout.completed
                        ? "bg-white"
                        : "bg-gray-50 border-dashed"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        p-2 rounded-full ${getWorkoutColor(workout.workoutType)}
                      `}
                      >
                        {getWorkoutIcon(workout.workoutType)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {getWorkoutTypeName(workout.workoutType)}
                          </h4>
                          {!workout.completed && (
                            <Badge variant="outline" className="text-xs">
                              Não completado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(workout.date).toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {workout.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {workout.duration}min
                          </div>
                        )}
                        {workout.exerciseCount && (
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" />
                            {workout.exerciseCount} ex.
                          </div>
                        )}
                        {workout.calories && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {workout.calories} cal
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600 italic">
                        "{workout.notes}"
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Botão para mostrar mais */}
              {!showAll && filteredWorkouts.length > 10 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(true)}
                    className="flex items-center gap-2"
                  >
                    Ver mais {filteredWorkouts.length - 10} treinos
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
