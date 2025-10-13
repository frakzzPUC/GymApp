'use client'

import { useState } from 'react'
import { Eye, X, Download, Share } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/overlay/dialog'
import { WorkoutPlanRenderer } from './WorkoutPlanRenderer'

interface WorkoutPlanModalProps {
  workoutPlan: string
  aiPlan?: string
  userName?: string
}

export const WorkoutPlanModal = ({ workoutPlan, aiPlan, userName }: WorkoutPlanModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver Plano Completo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-green-600 -m-6 mb-0 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-white">
                Plano de Treino Completo
              </DialogTitle>
              {userName && (
                <DialogDescription className="text-blue-100 text-sm">
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
                  console.log('Download plano de treino')
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
                  console.log('Compartilhar plano de treino')
                }}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto py-4">
          <WorkoutPlanRenderer workoutText={workoutPlan || aiPlan || ''} />
        </div>
        
        <DialogFooter className="bg-gray-50 -m-6 mt-0 px-6 py-4">
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Salvar no Meu Perfil
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}