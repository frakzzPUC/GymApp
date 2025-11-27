import React from "react";
import {
  Utensils,
  Target,
  ShoppingCart,
  Trophy,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/actions/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/feedback/badge";

interface NutritionPlanRendererProps {
  nutritionText: string;
}

export function NutritionPlanRenderer({
  nutritionText,
}: NutritionPlanRendererProps) {
  // Validação do conteúdo
  const textLength = nutritionText?.length || 0;

  // Validar se há texto para processar e se é realmente um plano nutricional
  const isValidNutritionPlan = nutritionText && 
    (nutritionText.toLowerCase().includes("cardápio") ||
     nutritionText.toLowerCase().includes("café da manhã") ||
     nutritionText.toLowerCase().includes("refeição") ||
     nutritionText.toLowerCase().includes("almoço") ||
     nutritionText.toLowerCase().includes("jantar") ||
     nutritionText.toLowerCase().includes("kcal") ||
     nutritionText.toLowerCase().includes("análise nutricional") ||
     nutritionText.toLowerCase().includes("como nutricionista") ||
     nutritionText.toLowerCase().includes("plano alimentar") ||
     nutritionText.toLowerCase().includes("macronutrientes") ||
     nutritionText.toLowerCase().includes("lista de compras"));

  if (
    !nutritionText ||
    nutritionText.trim() === "" ||
    nutritionText.includes("Nenhum plano nutricional disponível") ||
    !isValidNutritionPlan
  ) {
    console.log("⚠️  ERRO: Conteúdo inválido detectado para plano nutricional");
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">
              {!nutritionText ? "Nenhum Plano Nutricional Disponível" : "Plano Nutricional Inválido"}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {!nutritionText ? 
                "Para visualizar seu plano nutricional personalizado, primeiro gere seus planos de IA." :
                "O conteúdo recebido não parece ser um plano nutricional válido. Tente gerar um novo plano."
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {!nutritionText ? 
                "Vá para: Menu → Planos de IA → Gerar Novo Plano" :
                "Conteúdo atual parece ser sobre treinos, não nutrição."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lines = nutritionText.split("\n");
  let sections: Array<{
    title: string;
    content: string[];
    type:
      | "analysis"
      | "meal"
      | "shopping"
      | "guidance"
      | "supplement"
      | "topic"
      | "day"
      | "weekly-menu"
      | "other";
    number?: string;
  }> = [];

  let currentSection: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detectar títulos principais com ### (seções numeradas no formato ### **1. ANÁLISE NUTRICIONAL**)
    if (line.match(/^#{1,4}\s*\*{0,4}\s*\d+\.\s*.*\*{0,4}$/)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const numberMatch = line.match(/\d+/);
      const topicNumber = numberMatch ? numberMatch[0] : "";

      // Limpeza do título
      let title = line
        .replace(/^#{1,6}\s*/, "") // Remove #
        .replace(/^\*{0,4}/, "") // Remove *
        .replace(/\*{0,4}$/, "") // Remove * finais
        .replace(/^\d+\.\s*/, "") // Remove numeração
        .trim();

      let sectionType:
        | "analysis"
        | "meal"
        | "shopping"
        | "guidance"
        | "supplement"
        | "topic"
        | "weekly-menu" = "topic";

      const titleLower = title.toLowerCase();

      // Detecção por palavras-chave específicas do plano nutricional
      if (
        titleLower.includes("análise") ||
        titleLower.includes("nutricional")
      ) {
        sectionType = "analysis";
      } else if (
        titleLower.includes("cardápio") ||
        titleLower.includes("semanal") ||
        titleLower.includes("detalhado")
      ) {
        sectionType = "weekly-menu";
      } else if (
        titleLower.includes("lista") ||
        titleLower.includes("compras") ||
        titleLower.includes("organizada")
      ) {
        sectionType = "shopping";
      } else if (
        titleLower.includes("orientações") ||
        titleLower.includes("importantes") ||
        titleLower.includes("dicas") ||
        titleLower.includes("práticas")
      ) {
        sectionType = "guidance";
      } else if (
        titleLower.includes("suplementação")
      ) {
        sectionType = "supplement";
      }

      currentSection = {
        title: title,
        content: [],
        type: sectionType,
        number: topicNumber,
      };
    }
    // Detectar dias da semana com #### **Segunda-feira**
    else if (line.match(/^#{4}\s*\*{0,4}\s*(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)/i)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const dayName = line
        .replace(/^#{4}\s*/, "")
        .replace(/\*{0,4}/g, "")
        .trim();

      currentSection = {
        title: dayName,
        content: [],
        type: "day",
      };
    }
    // Detectar refeições (com * antes do horário)
    else if (line.match(/^\*\s*(Café da Manhã|Almoço|Lanche da Tarde|Jantar|Ceia)/i)) {
      if (currentSection && currentSection.type === "day") {
        currentSection.content.push(line);
      } else {
        // Se não estamos em um dia, criar nova seção de refeição
        if (currentSection) {
          sections.push(currentSection);
        }
        
        const mealName = line.replace(/^\*\s*/, "").replace(/\s*\([^)]*\).*/, "").trim();
        
        currentSection = {
          title: mealName,
          content: [line],
          type: "meal",
        };
      }
    }
    // Detectar seções principais sem numeração (formato ## TÍTULO)
    else if (line.match(/^#{2}\s+/)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const title = line.replace(/^##\s+/, "");
      let sectionType:
        | "analysis"
        | "meal"
        | "shopping"
        | "guidance"
        | "supplement"
        | "weekly-menu"
        | "other" = "other";

      if (
        title.toLowerCase().includes("análise") ||
        title.toLowerCase().includes("nutricional")
      ) {
        sectionType = "analysis";
      } else if (
        title.toLowerCase().includes("cardápio") &&
        title.toLowerCase().includes("semanal")
      ) {
        sectionType = "weekly-menu";
      } else if (
        title.toLowerCase().includes("compras") ||
        title.toLowerCase().includes("lista")
      ) {
        sectionType = "shopping";
      } else if (
        title.toLowerCase().includes("orientações") ||
        title.toLowerCase().includes("dicas")
      ) {
        sectionType = "guidance";
      } else if (title.toLowerCase().includes("suplementação")) {
        sectionType = "supplement";
      } else if (
        title.toLowerCase().includes("cardápio") ||
        title.toLowerCase().includes("refeição")
      ) {
        sectionType = "meal";
      }

      currentSection = {
        title: title,
        content: [],
        type: sectionType,
      };
    }
    // Adicionar conteúdo à seção atual
    else if (currentSection && line.length > 0) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Debug simplificado
  console.log("NutritionPlanRenderer: Processando", sections.length, "seções do plano nutricional");

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "analysis":
        return <Target className="h-4 w-4 text-gray-600" />;
      case "meal":
        return <Utensils className="h-4 w-4 text-gray-600" />;
      case "weekly-menu":
        return <Utensils className="h-5 w-5 text-gray-600" />;
      case "shopping":
        return <ShoppingCart className="h-4 w-4 text-gray-600" />;
      case "guidance":
        return <Trophy className="h-4 w-4 text-gray-600" />;
      case "supplement":
        return <Clock className="h-4 w-4 text-gray-600" />;
      case "topic":
        return <Target className="h-5 w-5 text-gray-600" />;
      case "day":
        return <Utensils className="h-5 w-5 text-gray-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case "analysis":
        return "border-l-slate-400 bg-slate-50";
      case "meal":
        return "border-l-slate-400 bg-slate-50";
      case "weekly-menu":
        return "border-l-slate-400 bg-slate-50";
      case "shopping":
        return "border-l-slate-400 bg-slate-50";
      case "guidance":
        return "border-l-slate-400 bg-slate-50";
      case "supplement":
        return "border-l-slate-400 bg-slate-50";
      case "topic":
        return "border-l-slate-400 bg-slate-50";
      case "day":
        return "border-l-slate-400 bg-slate-50";
      default:
        return "border-l-gray-400 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card className="bg-slate-50 border border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">
              Plano Nutricional Personalizado
            </h3>
            <p className="text-slate-600">
              Plano completo baseado no seu perfil e objetivos
            </p>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, sectionIndex) => {
        const isTopicSection = [
          "topic",
          "analysis",
          "shopping",
          "guidance",
          "supplement",
          "weekly-menu",
        ].includes(section.type);
        const isDaySection = ["day", "meal"].includes(section.type);
        const isWeeklyMenu = section.type === "weekly-menu";
        const isShoppingList = section.type === "shopping";

        return (
          <Card
            key={sectionIndex}
            className={`border-l-4 ${getSectionColor(section.type)} ${
              isTopicSection
                ? "shadow-lg"
                : isDaySection
                ? "shadow-md border-2"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle
                className={`${
                  isTopicSection
                    ? "text-xl"
                    : isDaySection
                    ? "text-lg"
                    : "text-lg"
                } flex items-center gap-3`}
              >
                {section.number && (
                  <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {section.number}
                  </span>
                )}
                {getSectionIcon(section.type)}
                <span
                  className={
                    isTopicSection
                      ? "font-bold"
                      : isDaySection
                      ? "font-semibold"
                      : "font-medium"
                  }
                >
                  {section.title
                    .replace(/\*\*(.*?)\*\*/g, "$1")
                    .replace(/^\*\*|\*\*$/g, "")
                    .replace(/\*\*/g, "")
                    .replace(/^\d+\.\s*/, "")
                    .trim()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.type === "analysis" ? (
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="space-y-3">
                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Informações nutricionais estruturadas
                        if (cleanItem.includes(":")) {
                          const [label, value] = cleanItem.split(":");
                          const cleanLabel = label.trim();
                          const cleanValue = value.trim();

                          if (!cleanLabel || !cleanValue) return null;

                          return (
                            <div
                              key={itemIndex}
                              className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-slate-100 last:border-b-0"
                            >
                              <span className="font-semibold text-sm text-slate-700">
                                {cleanLabel}
                              </span>
                              <div className="md:col-span-2">
                                <span className="font-medium text-slate-700">
                                  {cleanValue}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <p
                            key={itemIndex}
                            className="text-sm text-slate-700 leading-relaxed"
                          >
                            {cleanItem}
                          </p>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "weekly-menu" ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        📅 Cardápio da Semana
                      </h4>
                      <p className="text-sm text-slate-600">
                        Planejamento completo das refeições diárias
                      </p>
                    </div>

                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Dias da semana
                        if (
                          cleanItem.match(
                            /^\*?(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)/i
                          )
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm">
                                  {cleanItem.match(/\w+/)?.[0]}
                                </span>
                                📆 {cleanItem.replace(/^\*/, "")}
                              </h4>
                            </div>
                          );
                        }

                        // Refeições (Café da Manhã, Almoço, etc.)
                        if (
                          cleanItem.match(/^(Café|Almoço|Lanche|Jantar).*:/i)
                        ) {
                          const mealTime =
                            cleanItem.match(/\((\d{2}:\d{2})\)/)?.[1] || "";
                          const mealName = cleanItem
                            .replace(/\s*\([^)]*\)/, "")
                            .replace(/:$/, "");

                          let mealIcon = "🍳";
                          if (mealName.toLowerCase().includes("café"))
                            mealIcon = "☕";
                          else if (mealName.toLowerCase().includes("almoço"))
                            mealIcon = "🍽️";
                          else if (mealName.toLowerCase().includes("lanche"))
                            mealIcon = "🍎";
                          else if (mealName.toLowerCase().includes("jantar"))
                            mealIcon = "🍴";

                          return (
                            <div
                              key={itemIndex}
                              className="bg-white p-4 rounded-lg border border-slate-200 ml-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                                  <span className="text-xl">{mealIcon}</span>
                                  {mealName}
                                </h5>
                                {mealTime && (
                                  <span className="text-sm text-slate-600">
                                    🕔 {mealTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // Pratos específicos (Mingau Proteico, Frango Grelhado, etc.)
                        if (cleanItem.match(/^[A-Z][a-zà-ÿ]+.*[A-Z][a-zà-ÿ]/)) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg ml-8 border border-slate-200"
                            >
                              <h6 className="font-semibold text-slate-700 flex items-center gap-2">
                                🍽️ <span>{cleanItem}</span>
                              </h6>
                            </div>
                          );
                        }

                        // Lista de ingredientes ou instruções
                        if (item.startsWith("-") || item.startsWith("•")) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-start gap-2 ml-12"
                            >
                              <span className="text-slate-600 mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm text-slate-700">
                                {cleanItem}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-slate-50 p-2 rounded ml-8 border-l-2 border-slate-300"
                          >
                            <span className="text-sm leading-relaxed text-slate-700">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "shopping" ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        🛍️ Lista de Compras Organizada
                      </h4>
                      <p className="text-sm text-slate-600">
                        Ingredientes organizados por categoria
                      </p>
                    </div>

                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Categorias de alimentos (*Proteínas, *Carboidratos, etc.)
                        if (
                          item.match(/^\*[A-ZÀ-Ÿ]/) ||
                          cleanItem.match(
                            /^(Proteínas|Carboidratos|Vegetais|Frutas|Laticínios|Gorduras|Temperos|Derivados|Sementes|Condimentos)/i
                          )
                        ) {
                          let categoryIcon = "🥩";
                          const category = cleanItem
                            .replace(/^\*{0,2}/, "")
                            .trim();

                          if (category.toLowerCase().includes("proteína"))
                            categoryIcon = "🍖";
                          else if (
                            category.toLowerCase().includes("carboidrato")
                          )
                            categoryIcon = "🍞";
                          else if (category.toLowerCase().includes("vegeta"))
                            categoryIcon = "🥦";
                          else if (category.toLowerCase().includes("fruta"))
                            categoryIcon = "🍎";
                          else if (
                            category.toLowerCase().includes("laticínio") ||
                            category.toLowerCase().includes("derivados")
                          )
                            categoryIcon = "🥛";
                          else if (
                            category.toLowerCase().includes("gordura") ||
                            category.toLowerCase().includes("sementes")
                          )
                            categoryIcon = "🥑";
                          else if (
                            category.toLowerCase().includes("tempero") ||
                            category.toLowerCase().includes("condimento")
                          )
                            categoryIcon = "🌶️";

                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h4 className="font-bold text-slate-800 flex items-center gap-3 text-base">
                                <span className="bg-slate-600 text-white px-2 py-1 rounded-full text-sm">
                                  {categoryIcon}
                                </span>
                                <ShoppingCart className="h-4 w-4" />
                                {category}
                              </h4>
                            </div>
                          );
                        }

                        // Itens da lista de compras
                        if (item.startsWith("-") || item.startsWith("•")) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 p-2 ml-4 bg-white rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-slate-600 rounded"
                              />
                              <span className="text-sm text-slate-800 flex-1">
                                {cleanItem}
                              </span>
                              <span className="text-xs text-slate-600">
                                🛍️
                              </span>
                            </div>
                          );
                        }

                        // Filtrar linhas muito curtas, emojis isolados ou separadores
                        if (
                          ["💡", "📝", "📋", "•", "--", "🔄", "🛍️"].includes(
                            cleanItem
                          ) ||
                          cleanItem.length < 3
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-white p-2 rounded border border-slate-200 ml-2"
                          >
                            <span className="text-sm text-slate-700 leading-relaxed">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "guidance" ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        💡 Orientações Importantes
                      </h4>
                      <p className="text-sm text-slate-600">
                        Dicas essenciais para o sucesso do seu plano
                      </p>
                    </div>

                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Tópicos principais (Horários:, Combinações:, etc.)
                        if (cleanItem.match(/^[A-Z][a-zà-ÿ\s]+:/)) {
                          const [topic, content] = cleanItem.split(":");
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                ⚡ {topic}:
                              </h5>
                              {content && (
                                <p className="text-sm text-slate-700 leading-relaxed ml-4">
                                  {content.trim()}
                                </p>
                              )}
                            </div>
                          );
                        }

                        // Subtópicos (Meal Prep:, Congelamento:, etc.)
                        if (
                          cleanItem.match(/^[A-Z][a-zA-Z\sÀ-Ÿ]+:/) ||
                          cleanItem.includes("Meal Prep:") ||
                          cleanItem.includes("Congelamento:") ||
                          cleanItem.includes("Como Fazer")
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg ml-4 border-l-4 border-slate-400"
                            >
                              <h6 className="font-semibold text-slate-700 text-sm">
                                📝 {cleanItem}
                              </h6>
                            </div>
                          );
                        }

                        // Dicas com emojis ou com dois pontos
                        if (
                          cleanItem.match(/^[A-Z][a-zÀ-Ÿ\s]+:/) ||
                          item.match(/^💡/) ||
                          cleanItem.includes(": ")
                        ) {
                          const [topic, ...rest] = cleanItem.split(":");
                          const content = rest.join(":").trim();
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg border-l-4 border-slate-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-slate-600">💡</span>
                                <div>
                                  <span className="font-semibold text-slate-700 text-sm">
                                    {topic}:
                                  </span>
                                  {content && (
                                    <span className="text-sm text-slate-600 ml-1">
                                      {content}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Lista de dicas
                        if (item.startsWith("-") || item.startsWith("•")) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-start gap-2 ml-6"
                            >
                              <span className="text-slate-600 mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm text-slate-700">
                                {cleanItem}
                              </span>
                            </div>
                          );
                        }

                        // Linhas com emojis isolados (não renderizar)
                        if (
                          [
                            "💡",
                            "📝",
                            "📋",
                            "•",
                            "--",
                            "🔄",
                            "📊",
                            "🎯",
                            "⚖️",
                            "⏰",
                          ].includes(cleanItem) ||
                          cleanItem.length <= 2
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-slate-50 p-2 rounded ml-4 border-l-2 border-slate-300"
                          >
                            <span className="text-sm leading-relaxed text-slate-700">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "supplement" ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        📊 Suplementação
                      </h4>
                      <p className="text-sm text-slate-600">
                        Suplementos recomendados para otimizar resultados
                      </p>
                    </div>

                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Suplementos numerados (1. Whey Protein, 2. Creatina) ou nomes de suplementos
                        if (
                          cleanItem.match(/^\d+\.\s+[A-Z]/) ||
                          cleanItem.match(/^(Whey|Creatina|Protein)/i) ||
                          cleanItem.match(/^\d+$/)
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h5 className="font-bold text-slate-800 flex items-center gap-2">
                                📊 {cleanItem}
                              </h5>
                            </div>
                          );
                        }

                        // Propriedades (Objetivo:, Dosagem:, Horário:) - mais flexível
                        if (
                          cleanItem.match(/^(Objetivo|Dosagem|Horário):/i) ||
                          (item.match(/^💡/) && cleanItem.includes(":"))
                        ) {
                          const [label, value] = cleanItem.split(":");
                          let icon = "📝";
                          if (label.toLowerCase().includes("objetivo"))
                            icon = "🎯";
                          else if (label.toLowerCase().includes("dosagem"))
                            icon = "⚖️";
                          else if (label.toLowerCase().includes("horário"))
                            icon = "⏰";

                          return (
                            <div
                              key={itemIndex}
                              className="bg-white p-3 rounded border border-slate-200 ml-4"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">{icon}</span>
                                <div>
                                  <span className="font-semibold text-slate-700 text-sm">
                                    {label}:
                                  </span>
                                  <span className="text-sm text-slate-600 ml-1">
                                    {value.trim()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Filtrar emojis isolados e números isolados
                        if (
                          [
                            "💡",
                            "📝",
                            "📋",
                            "•",
                            "--",
                            "🔄",
                            "📊",
                            "🎯",
                            "⚖️",
                            "⏰",
                            "1",
                            "2",
                          ].includes(cleanItem) ||
                          cleanItem.match(/^\d+$/) ||
                          cleanItem.length < 3
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-white p-3 rounded border border-slate-200 ml-2"
                          >
                            <span className="text-sm text-slate-700 leading-relaxed">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : isDaySection ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Refeições específicas (Café da Manhã:, Almoço:, etc.)
                        if (
                          cleanItem.match(/^(Café|Almoço|Lanche|Jantar).*:/i)
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <Utensils className="h-4 w-4" />
                                {cleanItem.replace(/:$/, "")}
                              </h4>
                            </div>
                          );
                        }

                        // Ingredientes
                        if (cleanItem.toLowerCase().includes("ingredientes:")) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg border border-slate-200"
                            >
                              <h5 className="font-semibold text-slate-700 text-sm">
                                🧑‍🍳 {cleanItem}
                              </h5>
                            </div>
                          );
                        }

                        // Preparo
                        if (cleanItem.toLowerCase().includes("preparo:")) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg border border-slate-200"
                            >
                              <h5 className="font-semibold text-slate-700 text-sm">
                                🔥 {cleanItem}
                              </h5>
                            </div>
                          );
                        }

                        // Calorias
                        if (
                          cleanItem.toLowerCase().includes("calorias:") ||
                          cleanItem.match(/~?\d+\s*kcal/i)
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                            >
                              <span className="text-sm font-medium text-slate-700">
                                Valor Energético:
                              </span>
                              <span className="font-bold text-slate-700">
                                {cleanItem.replace(/.*?(~?\d+\s*kcal)/i, "$1")}
                              </span>
                            </div>
                          );
                        }

                        // Substituições
                        if (
                          cleanItem.toLowerCase().includes("substituições:")
                        ) {
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded-lg border-l-4 border-slate-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-slate-600 mt-0.5">
                                  🔄
                                </span>
                                <span className="text-sm text-slate-700 leading-relaxed font-medium">
                                  {cleanItem}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        // Lista de ingredientes ou instruções
                        if (item.startsWith("-") || item.startsWith("•")) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-start gap-3 py-1 ml-2"
                            >
                              <span className="text-slate-600 mt-1 text-sm font-bold">
                                •
                              </span>
                              <span className="text-sm text-slate-700 leading-relaxed">
                                {cleanItem}
                              </span>
                            </div>
                          );
                        }

                        // Texto normal
                        return cleanItem ? (
                          <div
                            key={itemIndex}
                            className="bg-slate-50 p-2 rounded ml-2 border-l-2 border-slate-300"
                          >
                            <span className="text-sm leading-relaxed text-slate-700">
                              {cleanItem}
                            </span>
                          </div>
                        ) : null;
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : (
                // Renderização padrão para seções topic
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    {section.content
                      .map((item, itemIndex) => {
                        const cleanItem = item
                          .replace(/^[-•*]\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/^\*\*|\*\*$/g, "")
                          .replace(/\*\*/g, "")
                          .trim();

                        if (!cleanItem) return null;

                        // Categorias com asterisco (*Proteínas, etc.)
                        if (item.match(/^\*[A-ZÀ-Ÿ]/)) {
                          const category = cleanItem.replace(/^\*/, "").trim();
                          let categoryIcon = "📋";

                          if (category.toLowerCase().includes("proteína"))
                            categoryIcon = "🥩";
                          else if (
                            category.toLowerCase().includes("carboidrato")
                          )
                            categoryIcon = "🍞";
                          else if (
                            category.toLowerCase().includes("vegeta") ||
                            category.toLowerCase().includes("fruta")
                          )
                            categoryIcon = "🥗";
                          else if (
                            category.toLowerCase().includes("laticínio") ||
                            category.toLowerCase().includes("derivados")
                          )
                            categoryIcon = "🥛";
                          else if (
                            category.toLowerCase().includes("gordura") ||
                            category.toLowerCase().includes("sementes")
                          )
                            categoryIcon = "🥑";
                          else if (
                            category.toLowerCase().includes("tempero") ||
                            category.toLowerCase().includes("condimento")
                          )
                            categoryIcon = "🌶️";

                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-100 p-4 rounded-lg border border-slate-300"
                            >
                              <h4 className="font-bold text-slate-800 flex items-center gap-3 text-base">
                                <span className="bg-slate-600 text-white px-2 py-1 rounded-full text-sm">
                                  {categoryIcon}
                                </span>
                                <ShoppingCart className="h-4 w-4" />
                                {category}
                              </h4>
                            </div>
                          );
                        }

                        // Lista de items
                        if (item.startsWith("-") || item.startsWith("•")) {
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 p-2 ml-4 bg-white rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-slate-600 rounded"
                              />
                              <span className="text-sm text-slate-800 flex-1">
                                {cleanItem}
                              </span>
                              <span className="text-xs text-slate-600">📋</span>
                            </div>
                          );
                        }

                        // Títulos com dois pontos
                        if (cleanItem.includes(":") && cleanItem.length < 100) {
                          const [label, value] = cleanItem.split(":");
                          return (
                            <div
                              key={itemIndex}
                              className="bg-slate-50 p-3 rounded border-l-4 border-slate-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-slate-600 mt-0.5">💡</span>
                                <div>
                                  <span className="font-semibold text-slate-700 text-sm">
                                    {label.trim()}:
                                  </span>
                                  {value && (
                                    <span className="text-sm text-slate-600 ml-1">
                                      {value.trim()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-white p-3 rounded border border-slate-200"
                          >
                            <span className="text-sm leading-relaxed text-slate-700">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
