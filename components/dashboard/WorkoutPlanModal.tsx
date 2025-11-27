'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
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
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Ver Plano Completo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Plano de Treino Completo
            </DialogTitle>
          </div>
        </DialogHeader>
        <WorkoutPlanRenderer workoutText={workoutPlan || aiPlan || ''} />
      </DialogContent>
    </Dialog>
  )
}