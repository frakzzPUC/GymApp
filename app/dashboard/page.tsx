"use client";

import { useDashboard } from "@/hooks/useDashboard";
import AuthGuard from "@/components/auth-guard";
import { LoadingSpinner } from "@/components/ui/feedback/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import { RehabilitationDashboard } from "@/components/dashboard/RehabilitationDashboard";
import { SedentaryDashboard as OldSedentaryDashboard } from "@/components/dashboard/SedentaryDashboard";
import SedentaryDashboard from "@/components/sedentary/SedentaryDashboard";
import { TrainingDietDashboard } from "@/components/dashboard/TrainingDietDashboard";

export default function DashboardPage() {
  const {
    userProfile,
    programType,
    isLoading,
    error,
    markActivityAsCompleted,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
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

  if (!userProfile && programType !== "sedentary") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Nenhum perfil encontrado. Complete seu cadastro em uma das opções de
            programa.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Determinar qual dashboard exibir baseado no tipo de programa
  const renderDashboard = () => {
    // Usar o programType determinado pelo hook
    switch (programType) {
      case "rehabilitation":
        return userProfile ? (
          <RehabilitationDashboard
            userProfile={userProfile}
            onMarkComplete={markActivityAsCompleted}
          />
        ) : null;

      case "sedentary":
        return <SedentaryDashboard />;

      case "training-diet":
        return userProfile ? (
          <TrainingDietDashboard
            userProfile={userProfile}
            onMarkComplete={markActivityAsCompleted}
          />
        ) : null;

      default:
        // Fallback para detecção baseada no perfil (compatibilidade)
        if (userProfile?.painAreas && userProfile.painAreas.length > 0) {
          return (
            <RehabilitationDashboard
              userProfile={userProfile}
              onMarkComplete={markActivityAsCompleted}
            />
          );
        }

        if (
          userProfile &&
          (userProfile.daysPerWeek <= 2 ||
            userProfile.goal === "reduce-sedentary")
        ) {
          return (
            <OldSedentaryDashboard
              userProfile={userProfile}
              onMarkComplete={markActivityAsCompleted}
            />
          );
        }

        return userProfile ? (
          <TrainingDietDashboard
            userProfile={userProfile}
            onMarkComplete={markActivityAsCompleted}
          />
        ) : null;
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">{renderDashboard()}</div>
    </AuthGuard>
  );
}
