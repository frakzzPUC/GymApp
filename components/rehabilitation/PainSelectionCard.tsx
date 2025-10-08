import React from "react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Label } from "@/components/ui/form/label"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { AlertCircle } from "lucide-react"
import { PAIN_OPTIONS } from "@/hooks/useRehabilitationForm"

interface PainSelectionCardProps {
  selectedPains: string[]
  error: string | null
  isLoading: boolean
  onPainToggle: (painId: string) => void
  onSubmit: () => void
}

export function PainSelectionCard({
  selectedPains,
  error,
  isLoading,
  onPainToggle,
  onSubmit
}: PainSelectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Programa de Reabilitação</CardTitle>
        <CardDescription>
          Selecione as áreas onde você sente dor para recebermos exercícios personalizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {PAIN_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
              <Checkbox
                id={option.id}
                checked={selectedPains.includes(option.id)}
                onCheckedChange={() => onPainToggle(option.id)}
              />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Continuar"}
        </Button>
      </CardFooter>
    </Card>
  )
}