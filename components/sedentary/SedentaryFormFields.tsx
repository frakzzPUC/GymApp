import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/form/radio-group";
import { Button } from "@/components/ui/actions/button";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import { AlertCircle } from "lucide-react";
import {
  SedentaryFormData,
  SedentaryFormErrors,
} from "@/hooks/useSedentaryForm";

interface SedentaryFormFieldsProps {
  formData: SedentaryFormData;
  errors: SedentaryFormErrors;
  isLoading: boolean;
  onUpdateField: (field: keyof SedentaryFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SedentaryFormFields({
  formData,
  errors,
  isLoading,
  onUpdateField,
  onSubmit,
}: SedentaryFormFieldsProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-emerald-600">
          🚀 Saindo do Sedentarismo
        </CardTitle>
        <CardDescription className="text-lg">
          Vamos criar seu programa personalizado para uma vida mais ativa e
          saudável!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input
                type="number"
                placeholder="Ex: 30"
                value={formData.age || ""}
                onChange={(e) => onUpdateField("age", e.target.value)}
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gênero</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => onUpdateField("gender", value)}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Motivação */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-emerald-700">
              💪 O que te motiva a sair do sedentarismo?
            </Label>
            <Select
              value={formData.motivation}
              onValueChange={(value) => onUpdateField("motivation", value)}
            >
              <SelectTrigger
                className={errors.motivation ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Escolha sua principal motivação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saude">
                  Melhorar minha saúde geral
                </SelectItem>
                <SelectItem value="energia">
                  Ter mais energia no dia a dia
                </SelectItem>
                <SelectItem value="peso">
                  Perder peso e me sentir melhor
                </SelectItem>
                <SelectItem value="autoestima">
                  Aumentar minha autoestima
                </SelectItem>
                <SelectItem value="longevidade">Viver mais e melhor</SelectItem>
                <SelectItem value="familia">
                  Ser exemplo para minha família
                </SelectItem>
                <SelectItem value="stress">
                  Reduzir o estresse e ansiedade
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.motivation && (
              <p className="text-sm text-red-500">{errors.motivation}</p>
            )}
          </div>

          {/* Objetivo principal */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-emerald-700">
              🎯 Qual seu objetivo principal?
            </Label>
            <RadioGroup
              value={formData.primaryGoal}
              onValueChange={(value) => onUpdateField("primaryGoal", value)}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border-2 p-4 hover:bg-emerald-50">
                <RadioGroupItem value="condicionamento" id="condicionamento" />
                <Label
                  htmlFor="condicionamento"
                  className="flex-1 cursor-pointer"
                >
                  <span className="font-medium">
                    Ganhar condicionamento físico
                  </span>
                  <p className="text-sm text-gray-600">
                    Subir escadas sem cansar, ter mais fôlego
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border-2 p-4 hover:bg-emerald-50">
                <RadioGroupItem value="mobilidade" id="mobilidade" />
                <Label htmlFor="mobilidade" className="flex-1 cursor-pointer">
                  <span className="font-medium">
                    Melhorar flexibilidade e mobilidade
                  </span>
                  <p className="text-sm text-gray-600">
                    Alongar o corpo, reduzir dores nas costas
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border-2 p-4 hover:bg-emerald-50">
                <RadioGroupItem value="habitos" id="habitos" />
                <Label htmlFor="habitos" className="flex-1 cursor-pointer">
                  <span className="font-medium">Criar hábitos saudáveis</span>
                  <p className="text-sm text-gray-600">
                    Estabelecer uma rotina de exercícios
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border-2 p-4 hover:bg-emerald-50">
                <RadioGroupItem value="bem-estar" id="bem-estar" />
                <Label htmlFor="bem-estar" className="flex-1 cursor-pointer">
                  <span className="font-medium">Melhorar bem-estar geral</span>
                  <p className="text-sm text-gray-600">
                    Sentir-me mais disposto e feliz
                  </p>
                </Label>
              </div>
            </RadioGroup>
            {errors.primaryGoal && (
              <p className="text-sm text-red-500">{errors.primaryGoal}</p>
            )}
          </div>

          {/* Nível atual */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-emerald-700">
              📊 Como você se considera atualmente?
            </Label>
            <Select
              value={formData.currentActivityLevel}
              onValueChange={(value) =>
                onUpdateField("currentActivityLevel", value)
              }
            >
              <SelectTrigger
                className={errors.currentActivityLevel ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione seu nível atual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muito-sedentario">
                  Muito sedentário - Quase não me exercito
                </SelectItem>
                <SelectItem value="pouco-ativo">
                  Pouco ativo - Faço alguma atividade ocasionalmente
                </SelectItem>
                <SelectItem value="moderadamente-ativo">
                  Moderadamente ativo - Já pratico algumas atividades
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.currentActivityLevel && (
              <p className="text-sm text-red-500">
                {errors.currentActivityLevel}
              </p>
            )}
          </div>

          {/* Tempo disponível */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-emerald-700">
              ⏰ Quanto tempo você tem disponível por dia?
            </Label>
            <RadioGroup
              value={formData.availableTime}
              onValueChange={(value) => onUpdateField("availableTime", value)}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-emerald-50">
                <RadioGroupItem value="15-min" id="15-min" />
                <Label htmlFor="15-min" className="flex-1 cursor-pointer">
                  15 minutos
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-emerald-50">
                <RadioGroupItem value="30-min" id="30-min" />
                <Label htmlFor="30-min" className="flex-1 cursor-pointer">
                  30 minutos
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-emerald-50">
                <RadioGroupItem value="45-min" id="45-min" />
                <Label htmlFor="45-min" className="flex-1 cursor-pointer">
                  45 minutos
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-emerald-50">
                <RadioGroupItem value="60-min" id="60-min" />
                <Label htmlFor="60-min" className="flex-1 cursor-pointer">
                  60 minutos
                </Label>
              </div>
            </RadioGroup>
            {errors.availableTime && (
              <p className="text-sm text-red-500">{errors.availableTime}</p>
            )}
          </div>

          {/* Atividades preferidas */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-emerald-700">
              🏃‍♂️ Que tipo de atividades te interessam? (Pode escolher várias)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "caminhada", label: "Caminhadas", emoji: "🚶‍♂️" },
                { id: "alongamento", label: "Alongamentos", emoji: "🧘‍♀️" },
                {
                  id: "exercicios-casa",
                  label: "Exercícios em casa",
                  emoji: "🏠",
                },
                { id: "corrida-leve", label: "Corrida leve", emoji: "🏃‍♂️" },
                { id: "danca", label: "Dança", emoji: "💃" },
                { id: "yoga", label: "Yoga", emoji: "🧘" },
              ].map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-emerald-50"
                  onClick={() => {
                    const current = (formData.preferredActivities || "")
                      .split(",")
                      .filter((a) => a.trim());
                    const updated = current.includes(activity.id)
                      ? current.filter((a: string) => a !== activity.id)
                      : [...current, activity.id];
                    onUpdateField("preferredActivities", updated.join(","));
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(formData.preferredActivities || "")
                      .split(",")
                      .includes(activity.id)}
                    readOnly
                    className="rounded"
                  />
                  <Label className="flex-1 cursor-pointer">
                    {activity.emoji} {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de envio */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando seu programa...
                </div>
              ) : (
                "🚀 Vamos começar minha jornada!"
              )}
            </Button>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor, preencha todos os campos obrigatórios.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
