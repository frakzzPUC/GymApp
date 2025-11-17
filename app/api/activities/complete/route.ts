import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RehabilitationProfile from "@/models/RehabilitationProfile";
import SedentaryProfile from "@/models/SedentaryProfile";
import TrainingDietProfile from "@/models/TrainingDietProfile";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Interface para o tipo de exercício
interface Exercise {
  _id: string;
  name: string;
  description: string;
  duration: string;
  completed: boolean;
  date: Date;
  caloriesBurned?: number;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const body = await req.json();
    const { activityId, programType } = body;

    // Validação básica
    if (!activityId || !programType) {
      return NextResponse.json(
        {
          success: false,
          message: "ID da atividade e tipo de programa são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Buscar o usuário para obter o userId
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = user._id;

    let profile;
    let updated = false;

    // Buscar o perfil correto com base no tipo de programa
    switch (programType) {
      case "rehabilitation":
        profile = await RehabilitationProfile.findOne({ userId });
        if (profile) {
          // Encontrar o exercício pelo ID
          const exerciseIndex = profile.exercises.findIndex(
            (ex: Exercise) => ex._id.toString() === activityId
          );
          if (exerciseIndex !== -1) {
            // Marcar como concluído
            profile.exercises[exerciseIndex].completed = true;
            // Atualizar o progresso
            profile.progress.completedExercises += 1;
            await profile.save();
            updated = true;
          }
        }
        break;

      case "sedentary":
        profile = await SedentaryProfile.findOne({ userId });
        if (profile) {
          // Encontrar a atividade pelo ID
          const activityIndex = profile.activities.findIndex(
            (ex: Exercise) => ex._id.toString() === activityId
          );
          if (activityIndex !== -1) {
            // Marcar como concluído
            profile.activities[activityIndex].completed = true;
            // Atualizar o progresso
            profile.progress.weeklyActivity += 1;
            await profile.save();
            updated = true;
          }
        }
        break;

      case "training-diet":
        profile = await TrainingDietProfile.findOne({ userId });
        if (profile) {
          // Encontrar o treino pelo ID
          const workoutIndex = profile.workouts.findIndex(
            (ex: Exercise) => ex._id.toString() === activityId
          );
          if (workoutIndex !== -1) {
            // Marcar como concluído
            profile.workouts[workoutIndex].completed = true;
            // Atualizar o progresso
            profile.progress.caloriesBurned +=
              profile.workouts[workoutIndex].caloriesBurned || 0;
            await profile.save();
            updated = true;
          }
        }
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Tipo de programa inválido" },
          { status: 400 }
        );
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Atividade não encontrada" },
        { status: 404 }
      );
    }

    // Também salvar no sistema de progresso novo
    try {
      let progress = await Progress.findOne({ userId: user._id });
      if (!progress) {
        progress = new Progress({
          userId: user._id,
          streakData: {
            currentStreak: 0,
            longestStreak: 0,
            weeklyGoal: 3,
            monthlyCompletedDays: 0,
          },
        });
      }

      // Determinar o tipo de treino e duração baseado no programa
      let workoutType = "mixed";
      let duration = 30; // duração padrão
      let exerciseCount = 1;

      switch (programType) {
        case "rehabilitation":
          workoutType = "flexibility";
          duration = 15;
          exerciseCount = 3;
          break;
        case "sedentary":
          workoutType = "cardio";
          duration = 20;
          exerciseCount = 2;
          break;
        case "training-diet":
          workoutType = "strength";
          duration = 45;
          exerciseCount = 8;
          break;
      }

      // Adicionar o treino ao sistema de progresso
      progress.addWorkout({
        date: new Date().toISOString(),
        completed: true,
        duration: duration,
        exerciseCount: exerciseCount,
        workoutType: workoutType,
        notes: `Treino completado via dashboard (${programType})`,
      });

      await progress.save();

      console.log(
        `Treino salvo no sistema de progresso: ${workoutType}, ${duration}min`
      );
    } catch (progressError) {
      console.error("Erro ao salvar no sistema de progresso:", progressError);
      // Não falhar a requisição por isso, apenas logar o erro
    }

    return NextResponse.json(
      {
        success: true,
        message: "Atividade marcada como concluída com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao marcar atividade como concluída:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao marcar atividade como concluída" },
      { status: 500 }
    );
  }
}
