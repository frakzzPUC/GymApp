import { X, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/actions/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog"
import { NutritionPlanRenderer } from "./NutritionPlanRenderer"

interface NutritionPlanModalProps {
  isOpen: boolean
  onClose: () => void
  nutritionPlan: string
  userName?: string
}

export function NutritionPlanModal({ isOpen, onClose, nutritionPlan, userName }: NutritionPlanModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 -m-6 mb-0 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-white">
                Plano Nutricional Completo
              </DialogTitle>
              {userName && (
                <DialogDescription className="text-green-100 text-sm">
                  Personalizado para {userName}
                </DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // TODO: Implementar funcionalidade de download
                  console.log('Download plano nutricional')
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // TODO: Implementar funcionalidade de compartilhamento
                  console.log('Compartilhar plano nutricional')
                }}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto py-4">
          <NutritionPlanRenderer nutritionText={nutritionPlan} />
        </div>
        
        <DialogFooter className="bg-gray-50 -m-6 mt-0 px-6 py-4">
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Salvar no Meu Perfil
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}