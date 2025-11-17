import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface PlansData {
  hasPlans: boolean;
  workoutPlan: string;
  nutritionPlan: string;
  generatedAt: Date | null;
}

export function useAIPlans() {
  const { data: session, status } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [plansData, setPlansData] = useState<PlansData>({
    hasPlans: false,
    workoutPlan: "",
    nutritionPlan: "",
    generatedAt: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const checkExistingPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ai-plans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.hasPlans) {
          const planData = data.data.latest || data.data;
          setPlansData({
            hasPlans: true,
            workoutPlan: planData.workoutPlan || "",
            nutritionPlan: planData.nutritionPlan || "",
            generatedAt: planData.generatedAt
              ? new Date(planData.generatedAt)
              : null,
          });
        }
      } else {
        setError(data.error || "Erro ao verificar planos existentes");
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const generatePlans = async () => {
    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch("/api/ai-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPlansData({
          hasPlans: true,
          workoutPlan: data.data.workoutPlan || "",
          nutritionPlan: data.data.nutritionPlan || "",
          generatedAt: data.data.generatedAt
            ? new Date(data.data.generatedAt)
            : new Date(),
        });
      } else {
        setError(data.error || "Erro ao gerar planos");
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro de conexão ao gerar planos");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    session,
    status,
    isGenerating,
    plansData,
    error,
    loading,
    checkExistingPlans,
    generatePlans,
    setError,
  };
}
