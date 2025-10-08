import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"

interface ErrorAlertProps {
  error: string
  className?: string
}

export function ErrorAlert({ error, className = "mb-6" }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}