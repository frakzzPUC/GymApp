"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlay/dialog"
import {
  Camera,
  CheckCircle,
  Target,
  Zap,
  Calendar,
  Upload,
  X
} from "lucide-react"

interface CheckinCardProps {
  hasCheckedInToday: boolean
  onCheckin: (photoBase64: string) => Promise<void>
  isLoading?: boolean
}

export function CheckinCard({ hasCheckedInToday, onCheckin, isLoading = false }: CheckinCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Verificar tamanho do arquivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A foto deve ter no máximo 5MB",
        variant: "destructive"
      })
      return
    }

    // Verificar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Apenas imagens são aceitas",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedPhoto(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCheckin = async () => {
    if (!selectedPhoto) {
      toast({
        title: "Foto obrigatória",
        description: "Selecione uma foto para fazer o check-in",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      await onCheckin(selectedPhoto)
      setDialogOpen(false)
      setSelectedPhoto(null)
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setSelectedPhoto(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Check-in Diário
        </CardTitle>
        <CardDescription>
          {hasCheckedInToday 
            ? "Parabéns! Você já fez seu check-in hoje"
            : "Faça seu check-in hoje e ganhe 1 ponto"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasCheckedInToday ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-green-700">Check-in realizado!</h3>
            <p className="text-muted-foreground mb-4">
              Você já fez seu check-in hoje. Volte amanhã para mais pontos!
            </p>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              +1 ponto conquistado
            </Badge>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Próximo check-in disponível amanhã
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Faça seu check-in</h3>
            <p className="text-muted-foreground mb-4">
              Tire uma foto do seu treino, corrida ou qualquer atividade física
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={isLoading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Fazer Check-in
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Check-in Diário
                  </DialogTitle>
                  <DialogDescription>
                    Selecione uma foto para registrar sua atividade física
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {selectedPhoto ? (
                      <div className="relative w-full">
                        <img
                          src={selectedPhoto}
                          alt="Preview do check-in"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                          onClick={() => setSelectedPhoto(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors hover:bg-muted/10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground font-medium">Clique para selecionar uma foto</p>
                        <p className="text-xs text-muted-foreground mt-1">Máximo 5MB</p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                    
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedPhoto ? "Trocar Foto" : "Galeria"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.setAttribute('capture', 'environment')
                            fileInputRef.current.click()
                          }
                        }}
                        className="flex-1"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Câmera
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center text-sm text-blue-700">
                      <Zap className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="font-medium">+1 ponto</span>
                      <span className="ml-1">será adicionado ao seu ranking</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckin}
                    disabled={!selectedPhoto || isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Enviando check-in...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Check-in
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center text-sm text-blue-700">
                <Zap className="h-4 w-4 mr-1 text-blue-500" />
                <span>Ganhe <span className="font-semibold">1 ponto</span> por check-in diário</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}