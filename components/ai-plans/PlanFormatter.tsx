import React from "react";

interface PlanFormatterProps {
  text: string;
}

export function PlanFormatter({ text }: PlanFormatterProps) {
  const formatPlanText = (text: string) => {
    // Verificar se text é uma string válida
    if (!text || typeof text !== "string") {
      return <p className="text-gray-500 italic">Nenhum conteúdo disponível</p>;
    }

    // Função para processar treinos detalhados
    const parseWorkoutDays = (text: string) => {
      const workoutDays: {
        day: string;
        exercises: string[];
        warmup?: string;
        cooldown?: string;
      }[] = [];
      const lines = text.split("\n");
      let currentDay: any = null;
      let currentSection = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detectar dia de treino (TREINO A, DIA 1, etc.)
        if (line.match(/^(TREINO\s+[A-Z]|DIA\s+\d+)/i)) {
          if (currentDay) {
            workoutDays.push(currentDay);
          }
          currentDay = {
            day: line.replace(/\*\*/g, ""),
            exercises: [],
            warmup: "",
            cooldown: "",
          };
          currentSection = "";
        }
        // Detectar seções dentro do dia
        else if (line.match(/^\d+\.\s*\**(Aquecimento|Exercícios|Volta)/i)) {
          currentSection = line.toLowerCase().includes("aquecimento")
            ? "warmup"
            : line.toLowerCase().includes("volta")
            ? "cooldown"
            : "exercises";
        }
        // Adicionar conteúdo à seção atual
        else if ((currentDay && line.startsWith("-")) || line.startsWith("•")) {
          const cleanLine = line.replace(/^[-•]\s*/, "").replace(/\*\*/g, "");
          if (currentSection === "warmup") {
            currentDay.warmup += cleanLine + "\n";
          } else if (currentSection === "cooldown") {
            currentDay.cooldown += cleanLine + "\n";
          } else if (currentSection === "exercises" || !currentSection) {
            currentDay.exercises.push(cleanLine);
          }
        }
      }

      if (currentDay) {
        workoutDays.push(currentDay);
      }

      return workoutDays;
    };

    const workoutDays = parseWorkoutDays(text);

    return text
      .split("\n")
      .map((line, index) => {
        const cleanLine = line.replace(/\*\*/g, "").trim();

        // Headers principais (# PLANO DE TREINO)
        if (line.startsWith("# ")) {
          const title = cleanLine
            .substring(2)
            .replace(/\*Plano gerado automaticamente.*\*/gi, "") // Remove linha de crédito
            .replace(/Nome:\s*\w+/gi, "") // Remove "Nome: [Nome]"
            .trim();

          if (!title) return null;

          return (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg mb-6"
            >
              <h1 className="text-3xl font-bold text-center">{title}</h1>
            </div>
          );
        }

        // Tópicos numerados principais (### **1. ANÁLISE INICIAL**, etc.)
        if (
          line.match(/^###?\s*\*?\*?\d+\./) ||
          line.match(
            /^\*?\*?\d+\.\s*(ANÁLISE|ESTRUTURA|TREINOS|ORIENTAÇÕES|DICAS)/i
          )
        ) {
          const numberMatch = line.match(/\d+/);
          const topicNumber = numberMatch ? numberMatch[0] : "";
          const sectionTitle = cleanLine
            .replace(/^###?\s*/, "")
            .replace(/^\*\*|\*\*$/, "")
            .replace(/^\d+\.\s*/, "")
            .replace(/\*Plano gerado automaticamente.*\*/gi, "")
            .replace(/Nome:\s*\w+/gi, "")
            .replace(/para\s+\w+/gi, "")
            .trim();

          if (!sectionTitle) return null;

          let bgColor =
            "bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-300";
          let textColor = "text-indigo-900";
          let icon = "📋";

          if (sectionTitle.includes("ANÁLISE")) {
            bgColor =
              "bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300";
            textColor = "text-blue-900";
            icon = "📊";
          } else if (sectionTitle.includes("ESTRUTURA")) {
            bgColor =
              "bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300";
            textColor = "text-purple-900";
            icon = "🏗️";
          } else if (sectionTitle.includes("TREINO")) {
            bgColor =
              "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300";
            textColor = "text-green-900";
            icon = "🏋️‍♂️";
          } else if (sectionTitle.includes("ORIENTAÇÕES")) {
            bgColor =
              "bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300";
            textColor = "text-orange-900";
            icon = "💡";
          } else if (sectionTitle.includes("DICAS")) {
            bgColor =
              "bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300";
            textColor = "text-red-900";
            icon = "🎯";
          }

          return (
            <div
              key={index}
              className={`${bgColor} p-6 rounded-xl mt-8 mb-6 shadow-lg`}
            >
              <h2
                className={`text-2xl font-bold ${textColor} flex items-center gap-3`}
              >
                <span className="bg-white p-2 rounded-full text-2xl shadow-md">
                  {topicNumber}
                </span>
                <span className="text-3xl">{icon}</span>
                <span>{sectionTitle}</span>
              </h2>
            </div>
          );
        }

        // Seções principais sem numeração (## ANÁLISE INICIAL, ## ESTRUTURA DO TREINO)
        if (line.startsWith("## ")) {
          const sectionTitle = cleanLine
            .substring(3)
            .replace(/\*Plano gerado automaticamente.*\*/gi, "")
            .replace(/Nome:\s*\w+/gi, "")
            .replace(/para\s+\w+/gi, "")
            .trim();

          if (!sectionTitle) return null;

          let bgColor = "bg-gray-50";
          let textColor = "text-gray-800";
          let icon = "📋";

          if (sectionTitle.includes("ANÁLISE")) {
            bgColor = "bg-blue-50 border-l-4 border-blue-500";
            textColor = "text-blue-800";
            icon = "📊";
          } else if (sectionTitle.includes("ESTRUTURA")) {
            bgColor = "bg-purple-50 border-l-4 border-purple-500";
            textColor = "text-purple-800";
            icon = "🏗️";
          } else if (sectionTitle.includes("ORIENTAÇÕES")) {
            bgColor = "bg-orange-50 border-l-4 border-orange-500";
            textColor = "text-orange-800";
            icon = "💡";
          } else if (sectionTitle.includes("DICAS")) {
            bgColor = "bg-green-50 border-l-4 border-green-500";
            textColor = "text-green-800";
            icon = "🎯";
          }

          return (
            <div key={index} className={`${bgColor} p-4 rounded-lg mt-6 mb-4`}>
              <h2
                className={`text-xl font-bold ${textColor} flex items-center gap-2`}
              >
                <span>{icon}</span>
                {sectionTitle}
              </h2>
            </div>
          );
        }

        // Dias de treino específicos (DIA 1:, TREINO A:, etc.)
        if (
          line.match(
            /^(DIA\s+\d+:|TREINO\s+[A-Z]:|.*DIA\s+\d+.*SUPERIORES|.*DIA\s+\d+.*INFERIORES)/i
          )
        ) {
          const dayMatch = line.match(/(DIA\s+\d+|TREINO\s+[A-Z])/i);
          const dayNumber = dayMatch ? dayMatch[0] : "";
          const title = cleanLine
            .replace(/\*Plano gerado automaticamente.*\*/gi, "")
            .replace(/Nome:\s*\w+/gi, "")
            .trim();

          if (!title) return null;

          return (
            <div
              key={index}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-xl mt-6 mb-4 shadow-lg border-2 border-emerald-300"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="bg-white text-emerald-600 px-3 py-1 rounded-full font-bold text-sm">
                  {dayNumber}
                </span>
                <span className="text-2xl">🏋️‍♂️</span>
                <span>{title}</span>
              </h3>
            </div>
          );
        }

        // Treinos específicos sem DIA (TREINO A, TREINO B, etc.)
        if (line.match(/^TREINO\s+[A-Z]/i)) {
          const dayNumber = line.match(/[A-Z]/)?.[0] || "";
          const title = cleanLine
            .replace(/\*Plano gerado automaticamente.*\*/gi, "")
            .replace(/Nome:\s*\w+/gi, "")
            .trim();

          if (!title) return null;

          return (
            <div
              key={index}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-5 rounded-lg mt-6 mb-4 shadow-md"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>🏋️‍♂️</span>
                {title} {dayNumber && `- Treino ${dayNumber}`}
              </h3>
            </div>
          );
        }

        // Subseções de treino (1. Aquecimento, 2. Exercícios Principais)
        if (line.match(/^\d+\.\s*\**(Aquecimento|Exercícios|Volta)/i)) {
          let bgColor = "bg-yellow-50";
          let textColor = "text-yellow-800";
          let icon = "⏱️";

          if (cleanLine.includes("Aquecimento")) {
            bgColor = "bg-yellow-50";
            textColor = "text-yellow-800";
            icon = "🔥";
          } else if (cleanLine.includes("Exercícios")) {
            bgColor = "bg-green-50";
            textColor = "text-green-800";
            icon = "💪";
          } else if (cleanLine.includes("Volta")) {
            bgColor = "bg-blue-50";
            textColor = "text-blue-800";
            icon = "🧘‍♀️";
          }

          return (
            <div key={index} className={`${bgColor} p-3 rounded-md mt-4 mb-2`}>
              <h4
                className={`font-semibold ${textColor} flex items-center gap-2`}
              >
                <span>{icon}</span>
                {cleanLine.replace(/^\d+\.\s*/, "")}
              </h4>
            </div>
          );
        }

        // Exercícios com séries e repetições
        if (line.match(/^\s*-\s*.+:\s*\d+x\d+/)) {
          const [exercise, sets] = cleanLine.replace(/^-\s*/, "").split(":");
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2 ml-4"
            >
              <span className="font-medium text-gray-800">
                {exercise.trim()}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {sets.trim()}
              </span>
            </div>
          );
        }

        // Listas com informações (começam com -)
        if (line.startsWith("- ")) {
          const content = cleanLine.substring(2);

          // Se contém ":" é uma informação estruturada
          if (content.includes(":")) {
            const [label, value] = content.split(":");
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2 ml-4 mb-1"
              >
                <span className="font-semibold text-gray-700 min-w-fit">
                  {label.trim()}:
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {value.trim()}
                </span>
              </div>
            );
          }

          return (
            <div key={index} className="flex items-start gap-2 ml-4 mb-1">
              <span className="text-green-600 mt-1">•</span>
              <span className="text-gray-700">{content}</span>
            </div>
          );
        }

        // Texto com formatação negrito
        if (line.includes("**")) {
          const parts = line.split("**");
          return (
            <p key={index} className="mb-2 text-gray-700 leading-relaxed">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="font-semibold text-gray-900">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }

        // Linhas vazias
        if (line.trim() === "") {
          return <div key={index} className="h-2" />;
        }

        // Texto normal (filtrar artifacts)
        if (
          cleanLine &&
          !cleanLine.match(/^\*Plano gerado automaticamente.*\*/i) &&
          !cleanLine.match(/^Nome:\s*\w+$/i) &&
          !cleanLine.match(/^para\s+\w+$/i) &&
          !cleanLine.match(/^---+$/)
        ) {
          return (
            <p key={index} className="mb-2 text-gray-700 leading-relaxed">
              {cleanLine}
            </p>
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  return <div className="max-w-none space-y-1">{formatPlanText(text)}</div>;
}
