import React from "react"

interface FormHeaderProps {
  currentStep: number
}

export function FormHeader({ currentStep }: FormHeaderProps) {
  const getStepInfo = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Informações Pessoais",
          description: "Vamos começar conhecendo você melhor"
        }
      case 2:
        return {
          title: "Histórico de Saúde",
          description: "Informações importantes para sua segurança"
        }
      case 3:
        return {
          title: "Objetivos de Treino",
          description: "Definindo seus objetivos e preferências"
        }
      case 4:
        return {
          title: "Informações Nutricionais",
          description: "Planejando sua alimentação (opcional)"
        }
      case 5:
        return {
          title: "Estilo de Vida",
          description: "Últimos detalhes para personalizar seu programa"
        }
      default:
        return {
          title: "Formulário de Avaliação",
          description: "Complete as informações para seu programa personalizado"
        }
    }
  }

  const stepInfo = getStepInfo(currentStep)

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Plano Treino + Dieta
      </h1>
      <h2 className="text-xl font-semibold text-emerald-600 mb-2">
        {stepInfo.title}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {stepInfo.description}
      </p>
    </div>
  )
}