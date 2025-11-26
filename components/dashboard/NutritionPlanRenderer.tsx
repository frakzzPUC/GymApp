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
  // Validar se há texto para processar
  if (
    !nutritionText ||
    nutritionText.trim() === "" ||
    nutritionText.includes("Nenhum plano nutricional disponível")
  ) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">
              Nenhum Plano Nutricional Disponível
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para visualizar seu plano nutricional personalizado, primeiro gere
              seus planos de IA.
            </p>
            <p className="text-xs text-muted-foreground">
              Vá para: Menu → Planos de IA → Gerar Novo Plano
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

    // Detectar qualquer tópico numerado (muito mais simples e robusto)
    if (line.match(/^(\*{0,2}|#{1,6})\s*\d+\./)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const numberMatch = line.match(/\d+/);
      const topicNumber = numberMatch ? numberMatch[0] : "";

      // Limpeza mais agressiva e simples
      let title = line
        .replace(/^#{1,6}\s*/, "") // Remove qualquer quantidade de #
        .replace(/^\*{1,4}/, "") // Remove qualquer quantidade de *
        .replace(/\*{1,4}$/, "") // Remove * no final
        .replace(/^\d+\.\s*/, "") // Remove numeração
        .replace(/^\*{1,4}/, "") // Remove * após numeração
        .replace(/\*{1,4}$/, "") // Remove * finais
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

      // Detecção por palavras-chave (mais específica)
      if (
        titleLower.includes("análise") ||
        titleLower.includes("nutricional") ||
        titleLower.includes("inicial")
      ) {
        sectionType = "analysis";
      } else if (
        titleLower.includes("cardápio") ||
        titleLower.includes("semanal") ||
        titleLower.includes("menu")
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
        titleLower.includes("suplementação") ||
        titleLower.includes("suplementos") ||
        titleLower.includes("supplement")
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
    // Detectar seções principais sem numeração
    else if (line.match(/^##\s+/)) {
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
    // Detectar dias da semana (*Segunda-feira, *Terça-feira, etc.)
    else if (
      line.match(
        /^\*{0,2}(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)-?feira?/i
      )
    ) {
      if (currentSection && currentSection.type !== "weekly-menu") {
        sections.push(currentSection);
        currentSection = {
          title: line.replace(/^\*{0,2}/, "").trim(),
          content: [],
          type: "day",
        };
      } else if (currentSection && currentSection.type === "weekly-menu") {
        // Se estivermos dentro de uma seção weekly-menu, adicione como conteúdo
        currentSection.content.push(line);
      } else {
        currentSection = {
          title: line.replace(/^\*{0,2}/, "").trim(),
          content: [],
          type: "day",
        };
      }
    }
    // Detectar refeições específicas (Café da Manhã, Almoço, etc.)
    else if (line.match(/^(Café\s+da\s+Manhã|Almoço|Lanche|Jantar).*:/i)) {
      if (
        currentSection &&
        currentSection.type !== "weekly-menu" &&
        currentSection.type !== "shopping"
      ) {
        sections.push(currentSection);
        currentSection = {
          title: line.replace(/:$/, "").trim(),
          content: [],
          type: "meal",
        };
      } else if (currentSection) {
        // Se estivermos dentro de uma seção weekly-menu ou shopping, adicione como conteúdo
        currentSection.content.push(line);
      }
    }
    // Adicionar conteúdo à seção atual
    else if (currentSection && line.length > 0) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Debug das seções detectadas
  console.log("=== SEÇÕES NUTRICIONAIS DETECTADAS ===");
  sections.forEach((section, index) => {
    console.log(
      `${index + 1}. "${section.title}" (tipo: ${section.type}, número: ${
        section.number
      })`
    );
  });
  console.log(`Total: ${sections.length} seções`);

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "analysis":
        return <Target className="h-4 w-4 text-blue-600" />;
      case "meal":
        return <Utensils className="h-4 w-4 text-green-600" />;
      case "weekly-menu":
        return <Utensils className="h-5 w-5 text-teal-600" />;
      case "shopping":
        return <ShoppingCart className="h-4 w-4 text-purple-600" />;
      case "guidance":
        return <Trophy className="h-4 w-4 text-orange-600" />;
      case "supplement":
        return <Clock className="h-4 w-4 text-red-600" />;
      case "topic":
        return <Target className="h-5 w-5 text-indigo-600" />;
      case "day":
        return <Utensils className="h-5 w-5 text-emerald-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case "analysis":
        return "border-l-blue-500 bg-blue-50";
      case "meal":
        return "border-l-green-500 bg-green-50";
      case "weekly-menu":
        return "border-l-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50";
      case "shopping":
        return "border-l-purple-500 bg-purple-50";
      case "guidance":
        return "border-l-orange-500 bg-orange-50";
      case "supplement":
        return "border-l-red-500 bg-red-50";
      case "topic":
        return "border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50";
      case "day":
        return "border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Seu Plano Nutricional Personalizado
            </h3>
            <p className="text-muted-foreground">
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
                  <span
                    className={`${
                      isTopicSection
                        ? "bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold"
                        : isDaySection
                        ? "bg-emerald-600 text-white px-2 py-1 rounded text-sm font-semibold"
                        : "bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    }`}
                  >
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
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
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
                              className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2 border-b border-blue-100 last:border-b-0"
                            >
                              <span className="font-semibold text-sm text-blue-900">
                                {cleanLabel}
                              </span>
                              <div className="md:col-span-2">
                                <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                                  {cleanValue}
                                </Badge>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <p
                            key={itemIndex}
                            className="text-sm text-blue-900 leading-relaxed"
                          >
                            {cleanItem}
                          </p>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "weekly-menu" ? (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200">
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-teal-800 mb-2">
                        📅 Cardápio da Semana
                      </h4>
                      <p className="text-sm text-teal-700">
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
                              className="bg-gradient-to-r from-teal-100 to-cyan-100 p-4 rounded-lg border-2 border-teal-300 shadow-md"
                            >
                              <h4 className="font-bold text-teal-900 flex items-center gap-2 text-lg">
                                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
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
                              className="bg-white p-4 rounded-lg border-2 border-teal-200 shadow-sm ml-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-teal-800 flex items-center gap-2">
                                  <span className="text-xl">{mealIcon}</span>
                                  {mealName}
                                </h5>
                                {mealTime && (
                                  <Badge className="bg-teal-600 text-white hover:bg-teal-600">
                                    🕔 {mealTime}
                                  </Badge>
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
                              className="bg-teal-50 p-3 rounded-lg ml-8 border border-teal-200"
                            >
                              <h6 className="font-semibold text-teal-800 flex items-center gap-2">
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
                              <span className="text-teal-600 mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm text-teal-800">
                                {cleanItem}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={itemIndex}
                            className="bg-gray-50 p-2 rounded ml-8 border-l-2 border-teal-300"
                          >
                            <span className="text-sm leading-relaxed text-gray-700">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "shopping" ? (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-purple-800 mb-2">
                        🛍️ Lista de Compras Organizada
                      </h4>
                      <p className="text-sm text-purple-700">
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
                              className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg border-2 border-purple-300 shadow-sm"
                            >
                              <h4 className="font-bold text-purple-900 flex items-center gap-3 text-base">
                                <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">
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
                              className="flex items-center gap-3 p-2 ml-4 bg-white rounded border border-purple-200 hover:bg-purple-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span className="text-sm text-purple-800 flex-1">
                                {cleanItem}
                              </span>
                              <span className="text-xs text-purple-600">
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
                            className="bg-white p-2 rounded border border-purple-200 ml-2"
                          >
                            <span className="text-sm text-purple-900 leading-relaxed">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "guidance" ? (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-orange-800 mb-2">
                        💡 Orientações Importantes
                      </h4>
                      <p className="text-sm text-orange-700">
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
                              className="bg-orange-100 p-4 rounded-lg border border-orange-300"
                            >
                              <h5 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                ⚡ {topic}:
                              </h5>
                              {content && (
                                <p className="text-sm text-orange-800 leading-relaxed ml-4">
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
                              className="bg-yellow-50 p-3 rounded-lg ml-4 border-l-4 border-yellow-400"
                            >
                              <h6 className="font-semibold text-yellow-800 text-sm">
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
                              className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-yellow-600">💡</span>
                                <div>
                                  <span className="font-semibold text-yellow-800 text-sm">
                                    {topic}:
                                  </span>
                                  {content && (
                                    <span className="text-sm text-yellow-700 ml-1">
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
                              <span className="text-orange-600 mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm text-orange-800">
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
                            className="bg-gray-50 p-2 rounded ml-4 border-l-2 border-orange-300"
                          >
                            <span className="text-sm leading-relaxed text-gray-700">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : section.type === "supplement" ? (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-xl border-2 border-red-200">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-red-800 mb-2">
                        📊 Suplementação
                      </h4>
                      <p className="text-sm text-red-700">
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
                              className="bg-red-100 p-4 rounded-lg border-2 border-red-300"
                            >
                              <h5 className="font-bold text-red-900 flex items-center gap-2">
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
                              className="bg-white p-3 rounded border border-red-200 ml-4"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">{icon}</span>
                                <div>
                                  <span className="font-semibold text-red-800 text-sm">
                                    {label}:
                                  </span>
                                  <span className="text-sm text-red-700 ml-1">
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
                            className="bg-white p-3 rounded border border-red-200 ml-2"
                          >
                            <span className="text-sm text-red-800 leading-relaxed">
                              {cleanItem}
                            </span>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>
              ) : isDaySection ? (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-200">
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
                              className="bg-green-100 p-4 rounded-lg border-2 border-green-300"
                            >
                              <h4 className="font-bold text-green-800 flex items-center gap-2 text-base">
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
                              className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                            >
                              <h5 className="font-semibold text-blue-800 text-sm">
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
                              className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                            >
                              <h5 className="font-semibold text-yellow-800 text-sm">
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
                              className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
                            >
                              <span className="text-sm font-medium text-red-800">
                                Valor Energético:
                              </span>
                              <Badge className="bg-red-600 text-white hover:bg-red-600 font-bold">
                                {cleanItem.replace(/.*?(~?\d+\s*kcal)/i, "$1")}
                              </Badge>
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
                              className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">
                                  🔄
                                </span>
                                <span className="text-sm text-purple-800 leading-relaxed font-medium">
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
                              <span className="text-emerald-600 mt-1 text-sm font-bold">
                                •
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed">
                                {cleanItem}
                              </span>
                            </div>
                          );
                        }

                        // Texto normal
                        return cleanItem ? (
                          <div
                            key={itemIndex}
                            className="bg-gray-50 p-2 rounded ml-2 border-l-2 border-gray-300"
                          >
                            <span className="text-sm leading-relaxed text-gray-700">
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
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-xl border-2 border-gray-200">
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
                              className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg border-2 border-indigo-300 shadow-sm"
                            >
                              <h4 className="font-bold text-indigo-900 flex items-center gap-3 text-base">
                                <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
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
                              className="flex items-center gap-3 p-2 ml-4 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 rounded"
                              />
                              <span className="text-sm text-gray-800 flex-1">
                                {cleanItem}
                              </span>
                              <span className="text-xs text-gray-600">📋</span>
                            </div>
                          );
                        }

                        // Títulos com dois pontos
                        if (cleanItem.includes(":") && cleanItem.length < 100) {
                          const [label, value] = cleanItem.split(":");
                          return (
                            <div
                              key={itemIndex}
                              className="bg-blue-50 p-3 rounded border-l-4 border-blue-400"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">💡</span>
                                <div>
                                  <span className="font-semibold text-blue-800 text-sm">
                                    {label.trim()}:
                                  </span>
                                  {value && (
                                    <span className="text-sm text-blue-700 ml-1">
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
                            className="bg-white p-3 rounded border border-gray-200"
                          >
                            <span className="text-sm leading-relaxed text-gray-700">
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
