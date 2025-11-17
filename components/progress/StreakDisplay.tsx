"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/feedback/badge";
import { Flame, Target, Calendar, Trophy, TrendingUp } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  workoutsThisWeek: number;
  lastWorkoutDate?: string | Date;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  weeklyGoal,
  workoutsThisWeek,
  lastWorkoutDate,
}: StreakDisplayProps) {
  // Calcular progresso da semana
  const weeklyProgress = Math.min((workoutsThisWeek / weeklyGoal) * 100, 100);
  const weeklyComplete = workoutsThisWeek >= weeklyGoal;

  // Calcular dias desde o último treino
  const daysSinceLastWorkout = lastWorkoutDate
    ? Math.floor(
        (Date.now() - new Date(lastWorkoutDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Definir cor do streak baseado no valor
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600";
    if (streak >= 14) return "text-blue-600";
    if (streak >= 7) return "text-green-600";
    if (streak >= 3) return "text-orange-600";
    return "text-gray-600";
  };

  // Definir mensagem motivacional
  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Comece seu streak hoje! 💪";
    }
    if (currentStreak >= 30) {
      return "Incrível! Você é imparável! 🔥";
    }
    if (currentStreak >= 14) {
      return "Excelente consistência! 🚀";
    }
    if (currentStreak >= 7) {
      return "Uma semana completa! Continue assim! ⭐";
    }
    if (currentStreak >= 3) {
      return "Ótimo ritmo! Mantenha o foco! 👍";
    }
    return "Bom começo! Vamos em frente! 💚";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Card principal do Streak */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Flame className={`h-6 w-6 ${getStreakColor(currentStreak)}`} />
            Streak de Treinos
          </CardTitle>
          <CardDescription>Dias consecutivos de atividade</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-center space-y-4">
            {/* Streak atual */}
            <div>
              <div
                className={`text-4xl font-bold ${getStreakColor(
                  currentStreak
                )}`}
              >
                {currentStreak}
              </div>
              <p className="text-sm text-gray-600">
                {currentStreak === 1 ? "dia consecutivo" : "dias consecutivos"}
              </p>
            </div>

            {/* Mensagem motivacional */}
            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">
                {getMotivationalMessage()}
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {longestStreak}
                </div>
                <div className="text-gray-500">Melhor streak</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {daysSinceLastWorkout !== null ? daysSinceLastWorkout : "—"}
                </div>
                <div className="text-gray-500">Dias desde último</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Meta Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Meta Semanal
          </CardTitle>
          <CardDescription>Progresso da semana atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de progresso */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Treinos realizados</span>
                <span>
                  {workoutsThisWeek}/{weeklyGoal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    weeklyComplete
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </div>

            {/* Status da semana */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge
                variant={weeklyComplete ? "default" : "secondary"}
                className={weeklyComplete ? "bg-green-600" : ""}
              >
                {weeklyComplete ? (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Completado!
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Em progresso
                  </div>
                )}
              </Badge>
            </div>

            {/* Próximo treino */}
            {!weeklyComplete && (
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Calendar className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <p className="text-sm font-medium text-blue-900">
                  Faltam {weeklyGoal - workoutsThisWeek} treino
                  {weeklyGoal - workoutsThisWeek !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  para completar a meta semanal
                </p>
              </div>
            )}

            {weeklyComplete && (
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Trophy className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <p className="text-sm font-medium text-green-900">
                  Meta semanal alcançada!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Parabéns pela dedicação! 🎉
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para exibir heatmap de atividade (últimos 30 dias)
interface ActivityHeatmapProps {
  data: Array<{
    date: string;
    workouts: number;
    hasWorkout: boolean;
  }>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const getActivityColor = (workouts: number) => {
    if (workouts === 0) return "bg-gray-100";
    if (workouts === 1) return "bg-green-200";
    if (workouts === 2) return "bg-green-400";
    return "bg-green-600";
  };

  const getActivityLabel = (workouts: number) => {
    if (workouts === 0) return "Nenhum treino";
    if (workouts === 1) return "1 treino";
    return `${workouts} treinos`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Atividade dos Últimos 30 Dias
        </CardTitle>
        <CardDescription>Visualização da frequência de treinos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Grid de atividades */}
          <div className="grid grid-cols-10 gap-1">
            {data.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm ${getActivityColor(day.workouts)}
                  transition-all duration-200 hover:scale-110 cursor-pointer
                  border border-gray-200
                `}
                title={`${new Date(day.date).toLocaleDateString(
                  "pt-BR"
                )}: ${getActivityLabel(day.workouts)}`}
              />
            ))}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Menos ativo</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm border" />
              <div className="w-3 h-3 bg-green-200 rounded-sm border" />
              <div className="w-3 h-3 bg-green-400 rounded-sm border" />
              <div className="w-3 h-3 bg-green-600 rounded-sm border" />
            </div>
            <span>Mais ativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
