"use client";

import React, { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import {
  StreakDisplay,
  ActivityHeatmap,
} from "@/components/progress/StreakDisplay";
import { WeightChart, BodyFatChart } from "@/components/progress/MetricChart";
import { WorkoutHistory } from "@/components/progress/WorkoutHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Button } from "@/components/ui/actions/button";
import { Badge } from "@/components/ui/feedback/badge";
import { LoadingSpinner } from "@/components/ui/feedback/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog";
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Scale,
  Activity,
  Award,
  Settings,
  Zap,
} from "lucide-react";

export default function ProgressPage() {
  const {
    data,
    isLoading,
    error,
    addWorkout,
    addBodyMetrics,
    updateGoals,
    markWorkoutCompleted,
    weeklyProgress,
    monthlyProgress,
    latestWeight,
    latestBodyFat,
    shouldSuggestMetrics,
    hasData,
    hasWorkouts,
    hasMetrics,
  } = useProgress();

  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isAddMetricsOpen, setIsAddMetricsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "metrics" | "workouts" | "goals"
  >("overview");

  // Formulários
  const [workoutForm, setWorkoutForm] = useState({
    duration: "",
    exerciseCount: "",
    workoutType: "mixed" as "strength" | "cardio" | "flexibility" | "mixed",
    calories: "",
    notes: "",
  });

  const [metricsForm, setMetricsForm] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    bicep: "",
    thigh: "",
    height: "",
    notes: "",
  });

  const [goalsForm, setGoalsForm] = useState({
    targetWeight: "",
    targetBodyFat: "",
    weeklyWorkouts: "",
    deadline: "",
  });

  // Handlers
  const handleAddWorkout = async () => {
    try {
      await addWorkout({
        duration: workoutForm.duration
          ? parseInt(workoutForm.duration)
          : undefined,
        exerciseCount: workoutForm.exerciseCount
          ? parseInt(workoutForm.exerciseCount)
          : undefined,
        workoutType: workoutForm.workoutType,
        calories: workoutForm.calories
          ? parseInt(workoutForm.calories)
          : undefined,
        notes: workoutForm.notes || undefined,
      });

      setIsAddWorkoutOpen(false);
      setWorkoutForm({
        duration: "",
        exerciseCount: "",
        workoutType: "mixed",
        calories: "",
        notes: "",
      });
    } catch (err) {
      console.error("Erro ao adicionar treino:", err);
    }
  };

  const handleAddMetrics = async () => {
    try {
      await addBodyMetrics({
        weight: metricsForm.weight ? parseFloat(metricsForm.weight) : undefined,
        bodyFat: metricsForm.bodyFat
          ? parseFloat(metricsForm.bodyFat)
          : undefined,
        height: metricsForm.height ? parseFloat(metricsForm.height) : undefined,
        chest: metricsForm.chest ? parseFloat(metricsForm.chest) : undefined,
        waist: metricsForm.waist ? parseFloat(metricsForm.waist) : undefined,
        hips: metricsForm.hips ? parseFloat(metricsForm.hips) : undefined,
        bicep: metricsForm.bicep ? parseFloat(metricsForm.bicep) : undefined,
        thigh: metricsForm.thigh ? parseFloat(metricsForm.thigh) : undefined,
        notes: metricsForm.notes || undefined,
      });

      setIsAddMetricsOpen(false);
      setMetricsForm({
        weight: "",
        bodyFat: "",
        height: "",
        chest: "",
        waist: "",
        hips: "",
        bicep: "",
        thigh: "",
        notes: "",
      });
    } catch (err) {
      console.error("Erro ao adicionar métricas:", err);
    }
  };

  const handleQuickWorkout = async () => {
    try {
      await markWorkoutCompleted(45, 8, "mixed"); // Valores padrão
    } catch (err) {
      console.error("Erro ao marcar treino:", err);
    }
  };

  // Pré-preencher formulário com dados do perfil
  React.useEffect(() => {
    if (data?.userProfile && isAddMetricsOpen) {
      setMetricsForm((prev) => ({
        ...prev,
        weight: latestWeight
          ? latestWeight.toString()
          : data.userProfile?.weight
          ? data.userProfile.weight.toString()
          : "",
        height: data.userProfile?.height
          ? data.userProfile.height.toString()
          : "",
      }));
    }
  }, [data?.userProfile, isAddMetricsOpen, latestWeight]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasData || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium mb-2">Comece seu acompanhamento</h3>
              <p className="text-gray-500 mb-4">
                Registre seu primeiro treino para começar a visualizar seu
                progresso
              </p>
              <Button onClick={() => setIsAddWorkoutOpen(true)}>
                Adicionar Primeiro Treino
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Progresso</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe sua evolução e conquistas
          </p>

          {/* Informações do Perfil */}
          {data?.userProfile && (
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-700">
              {data.userProfile.age && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{data.userProfile.age} anos</span>
                </div>
              )}

              {data.userProfile.height && (
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>{data.userProfile.height}cm</span>
                </div>
              )}

              {(latestWeight || data.userProfile.weight) && (
                <div className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  <span>{latestWeight || data.userProfile.weight}kg</span>
                </div>
              )}

              {data.bmi && (
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>IMC: {data.bmi}</span>
                  <Badge
                    variant={
                      data.bmi < 18.5
                        ? "secondary"
                        : data.bmi < 25
                        ? "default"
                        : data.bmi < 30
                        ? "destructive"
                        : "destructive"
                    }
                    className="ml-1 text-xs"
                  >
                    {data.bmi < 18.5
                      ? "Baixo peso"
                      : data.bmi < 25
                      ? "Normal"
                      : data.bmi < 30
                      ? "Sobrepeso"
                      : "Obesidade"}
                  </Badge>
                </div>
              )}

              {data.userProfile.program && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>
                    {data.userProfile.program === "training-diet"
                      ? "Treino + Dieta"
                      : data.userProfile.program === "sedentary"
                      ? "Sedentário"
                      : data.userProfile.program === "rehabilitation"
                      ? "Reabilitação"
                      : "Programa"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setIsAddMetricsOpen(true)}
            className="flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Registrar Medidas
          </Button>
          <Button
            onClick={() => setIsAddWorkoutOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Treino
          </Button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        {[
          { id: "overview", label: "Visão Geral", icon: TrendingUp },
          { id: "metrics", label: "Medidas", icon: Scale },
          { id: "workouts", label: "Treinos", icon: Activity },
          { id: "goals", label: "Metas", icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sugestão de métricas */}
      {shouldSuggestMetrics && (
        <Alert className="mb-6">
          <Scale className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>É hora de registrar suas medidas corporais!</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMetricsOpen(true)}
            >
              Registrar agora
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Conteúdo das abas */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Streak e progresso semanal */}
          <StreakDisplay
            currentStreak={data.streakData.currentStreak}
            longestStreak={data.streakData.longestStreak}
            weeklyGoal={data.streakData.weeklyGoal}
            workoutsThisWeek={data.stats.workoutsThisWeek}
            lastWorkoutDate={data.streakData.lastWorkoutDate}
          />

          {/* Heatmap de atividade */}
          <ActivityHeatmap data={data.chartData.workoutFrequency} />

          {/* Cards de estatísticas resumidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {data.stats.totalWorkouts}
                    </p>
                    <p className="text-xs text-gray-500">Treinos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(data.stats.totalMinutes / 60)}h
                    </p>
                    <p className="text-xs text-gray-500">Tempo total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {latestWeight ? `${latestWeight}kg` : "—"}
                    </p>
                    <p className="text-xs text-gray-500">Peso atual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {latestBodyFat ? `${latestBodyFat}%` : "—"}
                    </p>
                    <p className="text-xs text-gray-500">Gordura</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <WeightChart
            data={data.chartData.weight}
            targetWeight={data.goals?.targetWeight}
          />
          <BodyFatChart
            data={data.chartData.bodyFat}
            targetBodyFat={data.goals?.targetBodyFat}
          />
        </div>
      )}

      {activeTab === "workouts" && (
        <WorkoutHistory
          workouts={data.recentWorkouts}
          totalWorkouts={data.stats.totalWorkouts}
          totalMinutes={data.stats.totalMinutes}
          averageDuration={data.stats.averageWorkoutDuration}
        />
      )}

      {activeTab === "goals" && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Minhas Metas
              </CardTitle>
              <CardDescription>
                Defina e acompanhe seus objetivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.goals?.targetWeight && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Meta de peso</span>
                    <Badge>{data.goals.targetWeight}kg</Badge>
                  </div>
                )}

                {data.goals?.targetBodyFat && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Meta de gordura corporal</span>
                    <Badge>{data.goals.targetBodyFat}%</Badge>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Treinos por semana</span>
                  <Badge>{data.streakData.weeklyGoal}</Badge>
                </div>

                <Button onClick={() => setIsGoalsOpen(true)} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Metas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para adicionar treino */}
      <Dialog open={isAddWorkoutOpen} onOpenChange={setIsAddWorkoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Treino</DialogTitle>
            <DialogDescription>
              Adicione detalhes do seu treino realizado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duração (min)</label>
                <input
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) =>
                    setWorkoutForm({ ...workoutForm, duration: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nº Exercícios</label>
                <input
                  type="number"
                  value={workoutForm.exerciseCount}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      exerciseCount: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="8"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Treino</label>
              <select
                value={workoutForm.workoutType}
                onChange={(e) =>
                  setWorkoutForm({
                    ...workoutForm,
                    workoutType: e.target.value as any,
                  })
                }
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="mixed">Misto</option>
                <option value="strength">Força</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Calorias (opcional)</label>
              <input
                type="number"
                value={workoutForm.calories}
                onChange={(e) =>
                  setWorkoutForm({ ...workoutForm, calories: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded"
                placeholder="300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Observações (opcional)
              </label>
              <textarea
                value={workoutForm.notes}
                onChange={(e) =>
                  setWorkoutForm({ ...workoutForm, notes: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded"
                placeholder="Como foi o treino?"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddWorkoutOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddWorkout}>Registrar Treino</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar métricas */}
      <Dialog open={isAddMetricsOpen} onOpenChange={setIsAddMetricsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Medidas</DialogTitle>
            <DialogDescription>
              Acompanhe sua evolução corporal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.weight}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, weight: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Altura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.height}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, height: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gordura (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.bodyFat}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, bodyFat: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="15.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Peito (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.chest}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, chest: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="95"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.waist}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, waist: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="80"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Quadril (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.hips}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, hips: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="90"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bíceps (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.bicep}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, bicep: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="32"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Coxa (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={metricsForm.thigh}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, thigh: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="55"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Observações (opcional)
              </label>
              <textarea
                value={metricsForm.notes}
                onChange={(e) =>
                  setMetricsForm({ ...metricsForm, notes: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded"
                placeholder="Como está se sentindo?"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMetricsOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddMetrics}>Registrar Medidas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
