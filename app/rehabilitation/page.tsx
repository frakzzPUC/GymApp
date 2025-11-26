"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

// Hooks
import { useRehabilitationForm } from "@/hooks/useRehabilitationForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

// Components
import { AppHeader } from "@/components/sedentary/AppHeader";
import { RehabilitationForm } from "@/components/rehabilitation/RehabilitationForm";

export default function RehabilitationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPageLoading = useAuthRedirect();

  const {
    formData,
    currentStep,
    error,
    isLoading,
    updateFormData,
    handleArrayToggle,
    nextStep,
    prevStep,
    submitForm,
    setError,
  } = useRehabilitationForm();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (status === "authenticated") {
      // Verificar se o usuário já tem um programa de reabilitação
      if (session?.user?.program === "rehabilitation") {
        // Se já tem, redirecionar para o dashboard
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      // Se não estiver autenticado, redirecionar para o login
      router.push("/login");
    }
  }, [status, session, router]);

  const handleSubmit = async () => {
    const result = await submitForm();

    if (result.success) {
      console.log("Redirecionando para o dashboard");
      router.push("/dashboard");
    }
    // Erros já são tratados dentro do hook
  };

  if (status === "loading" || isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Verificando seu perfil...</h2>
          <p className="text-muted-foreground mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <RehabilitationForm
            formData={formData}
            currentStep={currentStep}
            error={error}
            isLoading={isLoading}
            updateFormData={
              updateFormData as (field: string, value: any) => void
            }
            handleArrayToggle={
              handleArrayToggle as (field: string, itemId: string) => void
            }
            nextStep={nextStep}
            prevStep={prevStep}
            submitForm={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}
