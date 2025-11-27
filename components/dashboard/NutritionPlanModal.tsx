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
        <DialogHeader className="-m-6 mb-0 px-6 py-4 bg-slate-50 border-b border-slate-200">
          <DialogTitle className="text-lg font-semibold text-slate-800">
            Plano Nutricional Completo
          </DialogTitle>
          {userName && (
            <DialogDescription className="text-slate-600 text-sm">
              Personalizado para {userName}
            </DialogDescription>
          )}
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