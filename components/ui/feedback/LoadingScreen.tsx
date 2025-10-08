import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  title?: string
  description?: string
}

export function LoadingScreen({ 
  title = "Carregando...", 
  description = "Aguarde um momento" 
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  )
}